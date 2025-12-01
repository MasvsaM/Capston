import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ProviderHomeVisitsScreen extends StatefulWidget {
  const ProviderHomeVisitsScreen({super.key});

  @override
  State<ProviderHomeVisitsScreen> createState() =>
      _ProviderHomeVisitsScreenState();
}

class _ProviderHomeVisitsScreenState extends State<ProviderHomeVisitsScreen> {
  final _firestore = FirebaseFirestore.instance;
  final _auth = FirebaseAuth.instance;

  final _zoneController = TextEditingController();
  final _extraFeeController = TextEditingController();
  bool _enabled = true;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadConfig();
  }

  Future<void> _loadConfig() async {
    final user = _auth.currentUser;
    if (user == null) {
      setState(() => _loading = false);
      return;
    }

    try {
      final doc =
          await _firestore.collection('providerConfigs').doc(user.uid).get();

      final data = doc.data() ?? {};
      _zoneController.text = data['homeVisitsZone'] as String? ?? '';
      _extraFeeController.text =
          (data['homeVisitsExtraFee'] as num?)?.toString() ?? '';
      _enabled = data['homeVisitsEnabled'] as bool? ?? true;
    } catch (_) {
      // ignoramos error, solo no hay config previa
    }

    if (!mounted) return;
    setState(() => _loading = false);
  }

  Future<void> _save() async {
    final user = _auth.currentUser;
    if (user == null) return;

    try {
      await _firestore.collection('providerConfigs').doc(user.uid).set(
        {
          'homeVisitsEnabled': _enabled,
          'homeVisitsZone': _zoneController.text.trim(),
          'homeVisitsExtraFee':
              double.tryParse(_extraFeeController.text.trim()) ?? 0,
          'updatedAt': FieldValue.serverTimestamp(),
        },
        SetOptions(merge: true),
      );

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Configuración guardada')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('No se pudo guardar: $e')),
      );
    }
  }

  @override
  void dispose() {
    _zoneController.dispose();
    _extraFeeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Servicios a domicilio'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          SwitchListTile(
            title: const Text('Ofrezco servicios a domicilio'),
            value: _enabled,
            onChanged: (v) => setState(() => _enabled = v),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _zoneController,
            decoration: const InputDecoration(
              labelText: 'Zona de cobertura (comunas / sectores)',
              border: OutlineInputBorder(),
            ),
            maxLines: 2,
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _extraFeeController,
            decoration: const InputDecoration(
              labelText: 'Recargo promedio por visita (CLP, opcional)',
              border: OutlineInputBorder(),
            ),
            keyboardType: TextInputType.number,
          ),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: _save,
            icon: const Icon(Icons.save),
            label: const Text('Guardar'),
          ),
        ],
      ),
    );
  }
}
