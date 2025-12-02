import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';



class ClientServicesScreen extends StatefulWidget {
  const ClientServicesScreen({super.key});

  @override
  State<ClientServicesScreen> createState() => _ClientServicesScreenState();
}

class _ClientServicesScreenState extends State<ClientServicesScreen> {
  final TextEditingController _searchController = TextEditingController();

  String _searchText = '';
  String _selectedType = 'todos';
  String _selectedSort = 'mejor'; // mejor / precioAsc / precioDesc
  bool _onlyPremium = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final servicesStream = FirebaseFirestore.instance
        .collection('services')
        .where('isActive', isEqualTo: true)
        .snapshots();

    return Scaffold(
      appBar: AppBar(title: const Text('Servicios para tu mascota')),
      body: Column(
        children: [
          _buildFilterArea(context),
          Expanded(
            child: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
              stream: servicesStream,
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Center(
                    child: Text('Error al cargar servicios: ${snapshot.error}'),
                  );
                }
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                final docs = snapshot.data?.docs ?? [];

                // Filtro + búsqueda en memoria
                final filtered = docs.where((doc) {
                  final data = doc.data();

                  // 👇 1) Leemos si el servicio es Premium
                  final isPremiumService =
                      (data['isPremium'] as bool?) ?? false;

                  // 👇 2) Si el usuario activó "solo Premium" y este servicio no lo es, lo sacamos
                  if (_onlyPremium && !isPremiumService) {
                    return false;
                  }

                  // 👇 3) Resto de filtros que ya tenías
                  final name = (data['name'] as String?)?.toLowerCase() ?? '';
                  final providerName =
                      (data['providerName'] as String?)?.toLowerCase() ?? '';
                  final city = (data['city'] as String?)?.toLowerCase() ?? '';
                  final type = (data['type'] as String?)?.toLowerCase() ?? '';

                  // Filtro por tipo
                  if (_selectedType != 'todos' &&
                      type != _selectedType.toLowerCase()) {
                    return false;
                  }

                  // Búsqueda por texto
                  final term = _searchText.trim().toLowerCase();
                  if (term.isNotEmpty) {
                    final match =
                        name.contains(term) ||
                        providerName.contains(term) ||
                        city.contains(term);
                    if (!match) return false;
                  }

                  return true;
                }).toList();

                // Ordenamiento
                filtered.sort((a, b) {
                  final da = a.data();
                  final db = b.data();

                  final ratingA = (da['rating'] is num)
                      ? (da['rating'] as num).toDouble()
                      : 0.0;
                  final ratingB = (db['rating'] is num)
                      ? (db['rating'] as num).toDouble()
                      : 0.0;

                  final priceA = (da['basePrice'] is num)
                      ? (da['basePrice'] as num).toDouble()
                      : 0.0;
                  final priceB = (db['basePrice'] is num)
                      ? (db['basePrice'] as num).toDouble()
                      : 0.0;

                  switch (_selectedSort) {
                    case 'precioAsc':
                      return priceA.compareTo(priceB);
                    case 'precioDesc':
                      return priceB.compareTo(priceA);
                    case 'mejor':
                    default:
                      return ratingB.compareTo(ratingA);
                  }
                });

                if (filtered.isEmpty) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: Text(
                        'Aún no hay servicios disponibles con estos filtros.\n'
                        'Prueba cambiando el tipo o la búsqueda.',
                        textAlign: TextAlign.center,
                      ),
                    ),
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: filtered.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final doc = filtered[index];
                    return _ServiceCard(doc: doc);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterArea(BuildContext context) {
    final primary = Theme.of(context).colorScheme.primary;

    return Material(
      elevation: 1,
      color: Theme.of(context).colorScheme.surface,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Buscador
            TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Buscar por servicio, proveedor o ciudad...',
                prefixIcon: const Icon(Icons.search),
                isDense: true,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                suffixIcon: _searchText.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          setState(() {
                            _searchText = '';
                            _searchController.clear();
                          });
                        },
                      )
                    : null,
              ),
              onChanged: (value) {
                setState(() {
                  _searchText = value;
                });
              },
            ),
            const SizedBox(height: 8),

            // Tipo de servicio
            const Text(
              'Tipo de servicio',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 4),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _TypeChip(
                    label: 'Todos',
                    value: 'todos',
                    groupValue: _selectedType,
                    onSelected: (val) {
                      setState(() => _selectedType = val);
                    },
                  ),
                  _TypeChip(
                    label: 'Paseos',
                    value: 'paseos',
                    groupValue: _selectedType,
                    onSelected: (val) {
                      setState(() => _selectedType = val);
                    },
                  ),
                  _TypeChip(
                    label: 'Peluquería',
                    value: 'peluquería',
                    groupValue: _selectedType,
                    onSelected: (val) {
                      setState(() => _selectedType = val);
                    },
                  ),
                  _TypeChip(
                    label: 'Veterinaria',
                    value: 'veterinaria',
                    groupValue: _selectedType,
                    onSelected: (val) {
                      setState(() => _selectedType = val);
                    },
                  ),
                  _TypeChip(
                    label: 'Hospedaje',
                    value: 'hospedaje',
                    groupValue: _selectedType,
                    onSelected: (val) {
                      setState(() => _selectedType = val);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),

            // Sólo servicios Premium
            Row(
              children: [
                Switch(
                  value: _onlyPremium,
                  onChanged: (value) {
                    setState(() => _onlyPremium = value);
                  },
                ),
                const Expanded(
                  child: Text(
                    'Mostrar sólo servicios Premium',
                    style: TextStyle(fontSize: 12),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),

            // Ordenar por (con Wrap para evitar overflow)
            Wrap(
              crossAxisAlignment: WrapCrossAlignment.center,
              spacing: 8,
              runSpacing: 4,
              children: [
                const Text(
                  'Ordenar por:',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                ),
                ChoiceChip(
                  label: const Text('Mejor evaluados'),
                  selected: _selectedSort == 'mejor',
                  onSelected: (_) {
                    setState(() => _selectedSort = 'mejor');
                  },
                  selectedColor: primary.withOpacity(0.15),
                ),
                ChoiceChip(
                  label: const Text('Precio ↑'),
                  selected: _selectedSort == 'precioAsc',
                  onSelected: (_) {
                    setState(() => _selectedSort = 'precioAsc');
                  },
                  selectedColor: primary.withOpacity(0.15),
                ),
                ChoiceChip(
                  label: const Text('Precio ↓'),
                  selected: _selectedSort == 'precioDesc',
                  onSelected: (_) {
                    setState(() => _selectedSort = 'precioDesc');
                  },
                  selectedColor: primary.withOpacity(0.15),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _TypeChip extends StatelessWidget {
  final String label;
  final String value;
  final String groupValue;
  final ValueChanged<String> onSelected;

  const _TypeChip({
    required this.label,
    required this.value,
    required this.groupValue,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    final selected = value == groupValue;
    final primary = Theme.of(context).colorScheme.primary;

    return Padding(
      padding: const EdgeInsets.only(right: 6),
      child: ChoiceChip(
        label: Text(label),
        selected: selected,
        onSelected: (_) => onSelected(value),
        selectedColor: primary.withOpacity(0.15),
      ),
    );
  }
}

/// Card de cada servicio
class _ServiceCard extends StatelessWidget {
  final QueryDocumentSnapshot<Map<String, dynamic>> doc;

  const _ServiceCard({required this.doc});

  @override
  Widget build(BuildContext context) {
    final data = doc.data();

    final name = (data['name'] as String?) ?? 'Servicio';
    final providerName = (data['providerName'] as String?) ?? 'Proveedor';
    final city = (data['city'] as String?) ?? 'Sin ciudad';
    final description =
        (data['shortDescription'] as String?) ??
        (data['description'] as String?) ??
        '';
    final type = (data['type'] as String?) ?? '';
    final isPremium = (data['isPremium'] as bool?) ?? false;

    final rating = (data['rating'] is num)
        ? (data['rating'] as num).toDouble()
        : 0.0;
    final ratingCount = (data['ratingCount'] as int?) ?? 0;

    final price = (data['basePrice'] is num)
        ? (data['basePrice'] as num).toDouble()
        : 0.0;

    return InkWell(
      onTap: () {
        Navigator.of(
          context,
        ).push(MaterialPageRoute(builder: (_) => _ServiceDetailPage(doc: doc)));
      },
      borderRadius: BorderRadius.circular(12),
      child: Card(
        elevation: 1,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icono / tipo
              CircleAvatar(radius: 26, child: Icon(_iconForType(type))),
              const SizedBox(width: 12),

              // Info principal
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            name,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                        ),
                        if (isPremium)
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: const [
                              Icon(
                                Icons.workspace_premium,
                                size: 18,
                                color: Colors.amber,
                              ),
                            ],
                          ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      providerName,
                      style: const TextStyle(
                        fontSize: 13,
                        color: Colors.black54,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.location_on_outlined, size: 14),
                        const SizedBox(width: 4),
                        Text(
                          city,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.black54,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    if (description.isNotEmpty)
                      Text(
                        description,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 12),
                      ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(
                          Icons.star_rounded,
                          color: rating > 0 ? Colors.amber : Colors.grey,
                          size: 18,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          rating > 0 ? rating.toStringAsFixed(1) : 'Sin rating',
                          style: const TextStyle(fontSize: 12),
                        ),
                        if (ratingCount > 0) ...[
                          const SizedBox(width: 4),
                          Text(
                            '($ratingCount)',
                            style: const TextStyle(
                              fontSize: 11,
                              color: Colors.black54,
                            ),
                          ),
                        ],
                        const Spacer(),
                        Text(
                          price > 0
                              ? 'Desde \$${price.toStringAsFixed(0)}'
                              : 'Precio a consultar',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _iconForType(String type) {
    final t = type.toLowerCase();
    if (t.contains('pase')) return Icons.directions_walk;
    if (t.contains('pelu')) return Icons.content_cut;
    if (t.contains('vet')) return Icons.medical_services_outlined;
    if (t.contains('hosp')) return Icons.hotel;
    return Icons.pets;
  }
}

/// Pantalla de detalle del servicio
class _ServiceDetailPage extends StatelessWidget {
  final QueryDocumentSnapshot<Map<String, dynamic>> doc;

  const _ServiceDetailPage({required this.doc});

  @override
  Widget build(BuildContext context) {
    final data = doc.data();

    final name = (data['name'] as String?) ?? 'Servicio';
    final providerName = (data['providerName'] as String?) ?? 'Proveedor';
    final city = (data['city'] as String?) ?? 'Sin ciudad';
    final type = (data['type'] as String?) ?? '';
    final description =
        (data['description'] as String?) ??
        'El proveedor aún no agregó descripción.';
    final isPremium = (data['isPremium'] as bool?) ?? false;

    final rating = (data['rating'] is num)
        ? (data['rating'] as num).toDouble()
        : 0.0;
    final ratingCount = (data['ratingCount'] as int?) ?? 0;

    final price = (data['basePrice'] is num)
        ? (data['basePrice'] as num).toDouble()
        : 0.0;

    return Scaffold(
      appBar: AppBar(title: Text(name)),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ListView(
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 30,
                    child: Icon(_iconForType(type), size: 28),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          providerName,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Colors.black54,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.location_on_outlined, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              city,
                              style: const TextStyle(
                                fontSize: 13,
                                color: Colors.black54,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  if (isPremium)
                    Column(
                      children: const [
                        Icon(
                          Icons.workspace_premium,
                          color: Colors.amber,
                          size: 26,
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Premium',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                ],
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  Icon(
                    Icons.star_rounded,
                    color: rating > 0 ? Colors.amber : Colors.grey,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    rating > 0 ? rating.toStringAsFixed(1) : 'Sin rating',
                    style: const TextStyle(fontSize: 14),
                  ),
                  if (ratingCount > 0) ...[
                    const SizedBox(width: 6),
                    Text(
                      '($ratingCount opiniones)',
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.black54,
                      ),
                    ),
                  ],
                  const Spacer(),
                  Text(
                    price > 0
                        ? 'Desde \$${price.toStringAsFixed(0)} CLP'
                        : 'Precio a consultar',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),
              const Text(
                'Descripción',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),
              Text(description, style: const TextStyle(fontSize: 14)),

              const SizedBox(height: 24),
              const Text(
                'Qué incluye el servicio',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),
              const Text(
                'El detalle completo se coordina directamente con el proveedor. '
                'Te recomendamos indicar alergias, medicamentos y necesidades '
                'especiales de tu mascota antes de confirmar la reserva.',
                style: TextStyle(fontSize: 14),
              ),

              const SizedBox(height: 32),
              // 👉 Botón actualizado: abre el bottom sheet para crear reserva
              ElevatedButton.icon(
                onPressed: () {
                  showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    shape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(20),
                      ),
                    ),
                    builder: (_) => _CreateBookingSheet(serviceDoc: doc),
                  );
                },
                icon: const Icon(Icons.calendar_today_outlined),
                label: const Text('Solicitar reserva'),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _iconForType(String type) {
    final t = type.toLowerCase();
    if (t.contains('pase')) return Icons.directions_walk;
    if (t.contains('pelu')) return Icons.content_cut;
    if (t.contains('vet')) return Icons.medical_services_outlined;
    if (t.contains('hosp')) return Icons.hotel;
    return Icons.pets;
  }
}

/// =======================
///  SHEET: CREAR RESERVA
/// =======================
class _CreateBookingSheet extends StatefulWidget {
  final QueryDocumentSnapshot<Map<String, dynamic>> serviceDoc;

  const _CreateBookingSheet({required this.serviceDoc});

  @override
  State<_CreateBookingSheet> createState() => _CreateBookingSheetState();
}

class _CreateBookingSheetState extends State<_CreateBookingSheet> {
  final TextEditingController _notesController = TextEditingController();

  QueryDocumentSnapshot<Map<String, dynamic>>? _selectedPetDoc;
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final initial = _selectedDate ?? now;
    final picked = await showDatePicker(
      context: context,
      firstDate: now,
      lastDate: now.add(const Duration(days: 365)),
      initialDate: initial,
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  Future<void> _pickTime() async {
    final initial = _selectedTime ?? const TimeOfDay(hour: 10, minute: 0);
    final picked = await showTimePicker(
      context: context,
      initialTime: initial,
    );
    if (picked != null) {
      setState(() => _selectedTime = picked);
    }
  }

  Future<void> _submit() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Debes iniciar sesión para reservar.')),
      );
      return;
    }

    if (_selectedPetDoc == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selecciona una mascota.')),
      );
      return;
    }
    if (_selectedDate == null || _selectedTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selecciona fecha y hora.')),
      );
      return;
    }

    final scheduledAt = DateTime(
      _selectedDate!.year,
      _selectedDate!.month,
      _selectedDate!.day,
      _selectedTime!.hour,
      _selectedTime!.minute,
    );

    setState(() => _isSubmitting = true);

    final serviceData = widget.serviceDoc.data();
    final petData = _selectedPetDoc!.data();

    final clientName = user.displayName ?? user.email ?? '';
    final petName = (petData['name'] as String?) ?? '';
    final serviceName = (serviceData['name'] as String?) ?? 'Servicio';
    final providerName =
        (serviceData['providerName'] as String?) ?? 'Proveedor';
    final providerId = serviceData['providerId']; // si existe
    final city = (serviceData['city'] as String?) ?? '';

    try {
      await FirebaseFirestore.instance.collection('bookings').add({
        // Relación básica
        'clientId': user.uid,
        'clientName': clientName,
        'clientEmail': user.email,
        'petId': _selectedPetDoc!.id,
        'petName': petName,
        'serviceId': widget.serviceDoc.id,
        'serviceName': serviceName,
        'providerId': providerId,
        'providerName': providerName,
        'city': city,

        // Estado y fechas
        'status': 'requested', // pendiente, el proveedor decide
        'requestedAt': FieldValue.serverTimestamp(),
        'scheduledAt': Timestamp.fromDate(scheduledAt),

        // Otros datos
        'notesClient': _notesController.text.trim(),
      });

      if (!mounted) return;
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Solicitud enviada al proveedor 🐾'),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al crear reserva: $e')),
      );
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      return const Padding(
        padding: EdgeInsets.all(24),
        child: Text('Debes iniciar sesión.'),
      );
    }

    final petsStream = FirebaseFirestore.instance
        .collection('pets')
        .where('ownerId', isEqualTo: user.uid)
        .snapshots();

    final bottomPadding = MediaQuery.of(context).viewInsets.bottom;

    return SafeArea(
      child: Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 12,
          bottom: bottomPadding + 16,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(999),
              ),
            ),
            const Text(
              'Solicitar reserva',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // Mascota
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Mascota',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[700],
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const SizedBox(height: 4),
            StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
              stream: petsStream,
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return const Text('Error al cargar mascotas');
                }
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const LinearProgressIndicator();
                }

                final petsDocs = (snapshot.data?.docs ?? []).toList();
                // ordenamos por nombre en memoria
                petsDocs.sort((a, b) {
                  final na = (a.data()['name'] as String?) ?? '';
                  final nb = (b.data()['name'] as String?) ?? '';
                  return na.toLowerCase().compareTo(nb.toLowerCase());
                });

                if (petsDocs.isEmpty) {
                  return const Text(
                    'Aún no tienes mascotas registradas.\n'
                    'Primero crea una ficha de mascota.',
                    textAlign: TextAlign.center,
                  );
                }

                return DropdownButtonFormField<
                    QueryDocumentSnapshot<Map<String, dynamic>>>(
                  value: _selectedPetDoc,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Selecciona una mascota',
                  ),
                  items: petsDocs.map((petDoc) {
                    final name =
                        (petDoc.data()['name'] as String?) ?? 'Mascota';
                    final species =
                        (petDoc.data()['species'] as String?) ?? '';
                    return DropdownMenuItem(
                      value: petDoc,
                      child: Text(
                        species.isNotEmpty ? '$name ($species)' : name,
                      ),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() => _selectedPetDoc = value);
                  },
                );
              },
            ),
            const SizedBox(height: 12),

            // Fecha y hora
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: _pickDate,
                    child: InputDecorator(
                      decoration: const InputDecoration(
                        labelText: 'Fecha',
                        border: OutlineInputBorder(),
                      ),
                      child: Row(
                        children: [
                          Text(
                            _selectedDate == null
                                ? 'Seleccionar'
                                : '${_selectedDate!.day.toString().padLeft(2, '0')}/${_selectedDate!.month.toString().padLeft(2, '0')}/${_selectedDate!.year}',
                          ),
                          const Spacer(),
                          const Icon(Icons.calendar_today, size: 16),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: InkWell(
                    onTap: _pickTime,
                    child: InputDecorator(
                      decoration: const InputDecoration(
                        labelText: 'Hora',
                        border: OutlineInputBorder(),
                      ),
                      child: Row(
                        children: [
                          Text(
                            _selectedTime == null
                                ? 'Seleccionar'
                                : '${_selectedTime!.hour.toString().padLeft(2, '0')}:${_selectedTime!.minute.toString().padLeft(2, '0')}',
                          ),
                          const Spacer(),
                          const Icon(Icons.schedule, size: 16),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Notas
            TextField(
              controller: _notesController,
              decoration: const InputDecoration(
                labelText:
                    'Notas para el proveedor (alergias, indicaciones, dirección...)',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 16),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _isSubmitting ? null : _submit,
                icon: _isSubmitting
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.send_outlined),
                label: Text(_isSubmitting ? 'Enviando...' : 'Enviar solicitud'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
