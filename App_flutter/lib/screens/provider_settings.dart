import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../models/service_blocks.dart';
import '../models/provider_service_config.dart';

class ProviderSettingsScreen extends StatefulWidget {
  const ProviderSettingsScreen({super.key});

  @override
  State<ProviderSettingsScreen> createState() =>
      _ProviderSettingsScreenState();
}

class _ProviderSettingsScreenState extends State<ProviderSettingsScreen> {
  final _formKey = GlobalKey<FormState>();

  final _businessNameController = TextEditingController();
  final _businessDescriptionController = TextEditingController();
  final _addressController = TextEditingController();
  final _logoUrlController = TextEditingController();
  final _imagesNoteController = TextEditingController();

  bool _loading = true;
  bool _saving = false;

  // Horario general de atención
  TimeOfDay? _openTime;
  TimeOfDay? _closeTime;

  // serviceId -> config
  final Map<String, ProviderServiceConfig> _configs = {};

  @override
  void initState() {
    super.initState();
    _loadProviderConfig();
  }

  @override
  void dispose() {
    _businessNameController.dispose();
    _businessDescriptionController.dispose();
    _addressController.dispose();
    _logoUrlController.dispose();
    _imagesNoteController.dispose();
    super.dispose();
  }

  String _formatTime(TimeOfDay? t) {
    if (t == null) return 'No definido';
    final h = t.hour.toString().padLeft(2, '0');
    final m = t.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  TimeOfDay? _parseTime(String? value) {
    if (value == null || value.isEmpty) return null;
    final parts = value.split(':');
    if (parts.length != 2) return null;
    final h = int.tryParse(parts[0]) ?? 0;
    final m = int.tryParse(parts[1]) ?? 0;
    return TimeOfDay(hour: h, minute: m);
  }

  String? _timeToString(TimeOfDay? t) {
    if (t == null) return null;
    final h = t.hour.toString().padLeft(2, '0');
    final m = t.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  Future<void> _pickTime({required bool isOpen}) async {
    final initial = isOpen
        ? (_openTime ?? const TimeOfDay(hour: 9, minute: 0))
        : (_closeTime ?? const TimeOfDay(hour: 18, minute: 0));

    final selected = await showTimePicker(
      context: context,
      initialTime: initial,
    );

    if (selected == null || !mounted) return;

    setState(() {
      if (isOpen) {
        _openTime = selected;
      } else {
        _closeTime = selected;
      }
    });
  }

  Future<void> _loadProviderConfig() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      setState(() => _loading = false);
      return;
    }

    try {
      final doc = await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .get();

      final data = doc.data() ?? {};

      // Datos básicos del negocio
      _businessNameController.text =
          (data['businessName'] as String?) ?? '';
      _businessDescriptionController.text =
          (data['businessDescription'] as String?) ?? '';
      _addressController.text = (data['address'] as String?) ?? '';

      _logoUrlController.text = (data['logoUrl'] as String?) ?? '';
      _imagesNoteController.text =
          (data['imagesNote'] as String?) ?? '';

      _openTime = _parseTime(data['openTime'] as String?);
      _closeTime = _parseTime(data['closeTime'] as String?);

      // Configuración detallada de servicios
      final rawConfigs = data['servicesConfig'] as List<dynamic>?;

      if (rawConfigs != null && rawConfigs.isNotEmpty) {
        for (final item in rawConfigs) {
          Map<String, dynamic> map;

          if (item is Map<String, dynamic>) {
            map = item;
          } else if (item is Map) {
            map = Map<String, dynamic>.from(item);
          } else {
            continue;
          }

          final config = ProviderServiceConfig.fromMap(map);
          if (config.serviceId.isNotEmpty) {
            _configs[config.serviceId] = config;
          }
        }
      } else {
        // Fallback: usar lista simple de servicios
        final rawServices = (data['services'] ?? []) as List<dynamic>;
        final serviceIds = rawServices.cast<String>();

        for (final block in kServiceBlocks) {
          final enabled = serviceIds.contains(block.id);
          _configs[block.id] =
              ProviderServiceConfig.fromServiceBlock(block, enabled: enabled);
        }
      }

      // Asegurar que todos los bloques tengan config
      for (final block in kServiceBlocks) {
        _configs.putIfAbsent(
          block.id,
          () => ProviderServiceConfig.fromServiceBlock(
            block,
            enabled: false,
          ),
        );
      }

      if (!mounted) return;
      setState(() => _loading = false);
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error cargando configuración: $e')),
      );
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _saving = true);

    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) {
        setState(() => _saving = false);
        return;
      }

      final configsList = _configs.values.map((c) => c.toMap()).toList();
      final enabledServiceIds = _configs.values
          .where((c) => c.enabled)
          .map((c) => c.serviceId)
          .toList();

      await FirebaseFirestore.instance.collection('users').doc(user.uid).update({
        'businessName': _businessNameController.text.trim(),
        'businessDescription': _businessDescriptionController.text.trim(),
        'address': _addressController.text.trim(),
        'logoUrl': _logoUrlController.text.trim(),
        'imagesNote': _imagesNoteController.text.trim(),
        'openTime': _timeToString(_openTime),
        'closeTime': _timeToString(_closeTime),
        'services': enabledServiceIds,
        'servicesConfig': configsList,
      });

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Configuración guardada correctamente'),
        ),
      );

      Navigator.pop(context); // volver al panel proveedor
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al guardar configuración: $e')),
      );
    } finally {
      if (mounted) {
        setState(() => _saving = false);
      }
    }
  }

  Widget _buildServiceConfigCard(ServiceBlock block) {
    final config = _configs[block.id]!;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SwitchListTile(
              title: Text(block.name),
              subtitle: Text(block.description),
              value: config.enabled,
              onChanged: (value) {
                setState(() {
                  config.enabled = value;
                  if (value) {
                    // al habilitar, defaults
                    config.useBookings = block.enableBookings;
                    config.useHomeVisits = block.enableHomeVisits;
                    config.useCatalog = block.enableCatalog;
                  }
                });
              },
            ),
            if (config.enabled) ...[
              if (block.enableBookings)
                CheckboxListTile(
                  title: const Text('Necesita agenda / reservas'),
                  value: config.useBookings,
                  onChanged: (value) {
                    setState(() {
                      config.useBookings = value ?? false;
                    });
                  },
                ),
              if (block.enableHomeVisits)
                CheckboxListTile(
                  title: const Text('Incluye servicios a domicilio'),
                  value: config.useHomeVisits,
                  onChanged: (value) {
                    setState(() {
                      config.useHomeVisits = value ?? false;
                    });
                  },
                ),
              if (block.enableCatalog)
                CheckboxListTile(
                  title: const Text('Usar catálogo / productos'),
                  value: config.useCatalog,
                  onChanged: (value) {
                    setState(() {
                      config.useCatalog = value ?? false;
                    });
                  },
                ),

              const SizedBox(height: 8),
              TextFormField(
                initialValue:
                    config.basePrice != null ? config.basePrice!.toString() : '',
                decoration: const InputDecoration(
                  labelText: 'Precio base (CLP)',
                  prefixIcon: Icon(Icons.attach_money),
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                onChanged: (value) {
                  final v = value.replaceAll(',', '.');
                  config.basePrice = double.tryParse(v);
                },
              ),
              const SizedBox(height: 8),
              TextFormField(
                initialValue: config.discountPercent != null
                    ? config.discountPercent!.toString()
                    : '',
                decoration: const InputDecoration(
                  labelText: 'Descuento %',
                  prefixIcon: Icon(Icons.percent),
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                onChanged: (value) {
                  final v = value.replaceAll(',', '.');
                  final d = double.tryParse(v);
                  if (d == null) {
                    config.discountPercent = null;
                  } else {
                    // limitar entre 0 y 100
                    final clamped = d.clamp(0, 100);
                    config.discountPercent = clamped.toDouble();
                  }
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Configuración de proveedor'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Form(
              key: _formKey,
              child: ListView(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                children: [
                  const Text(
                    'Datos del negocio',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _businessNameController,
                    decoration: const InputDecoration(
                      labelText: 'Nombre del negocio',
                      prefixIcon: Icon(Icons.storefront),
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Ingresa el nombre del negocio';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _businessDescriptionController,
                    decoration: const InputDecoration(
                      labelText: 'Descripción del negocio',
                      prefixIcon: Icon(Icons.description_outlined),
                      border: OutlineInputBorder(),
                    ),
                    maxLines: 2,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _addressController,
                    decoration: const InputDecoration(
                      labelText: 'Dirección / ciudad',
                      prefixIcon: Icon(Icons.location_on_outlined),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Imagen y horario',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _logoUrlController,
                    decoration: const InputDecoration(
                      labelText: 'URL del logo (opcional)',
                      prefixIcon: Icon(Icons.image),
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _imagesNoteController,
                    decoration: const InputDecoration(
                      labelText:
                          'Notas de imágenes / galería (opcional, por ahora texto)',
                      border: OutlineInputBorder(),
                    ),
                    maxLines: 2,
                  ),
                  const SizedBox(height: 8),
                  ListTile(
                    leading: const Icon(Icons.schedule),
                    title: const Text('Hora de apertura'),
                    subtitle: Text(_formatTime(_openTime)),
                    onTap: () => _pickTime(isOpen: true),
                  ),
                  ListTile(
                    leading: const Icon(Icons.schedule),
                    title: const Text('Hora de cierre'),
                    subtitle: Text(_formatTime(_closeTime)),
                    onTap: () => _pickTime(isOpen: false),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Configuración de servicios',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  ...kServiceBlocks.map(_buildServiceConfigCard).toList(),
                  const SizedBox(height: 20),
                  SizedBox(
                    height: 48,
                    child: ElevatedButton.icon(
                      onPressed: _saving ? null : _save,
                      icon: _saving
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.save),
                      label: const Text('Guardar configuración'),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
