import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../models/service_blocks.dart';

class AdminHomeScreen extends StatefulWidget {
  const AdminHomeScreen({super.key});

  @override
  State<AdminHomeScreen> createState() => _AdminHomeScreenState();
}

class _AdminHomeScreenState extends State<AdminHomeScreen> {
  bool _showOnlyPending = true;

  // Mapa rápido id -> ServiceBlock, para traducir ids a nombres
  late final Map<String, ServiceBlock> _serviceBlockById;

  @override
  void initState() {
    super.initState();
    _serviceBlockById = {
      for (final block in kServiceBlocks) block.id: block,
    };
  }

  Future<void> _approveProvider(String uid) async {
    try {
      await FirebaseFirestore.instance
          .collection('users')
          .doc(uid)
          .update({'approvalStatus': 'approved'});

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Proveedor aprobado correctamente.')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al aprobar proveedor: $e')),
      );
    }
  }

  String _buildServiceNames(List<dynamic>? ids) {
    if (ids == null || ids.isEmpty) return 'Sin servicios configurados';

    final names = ids
        .map((id) => _serviceBlockById[id]?.name)
        .whereType<String>()
        .toList();

    if (names.isEmpty) return 'Sin servicios configurados';
    return names.join(', ');
  }

  @override
  Widget build(BuildContext context) {
    Query<Map<String, dynamic>> query = FirebaseFirestore.instance
        .collection('users')
        .where('role', isEqualTo: 'provider');

    if (_showOnlyPending) {
      query = query.where('approvalStatus', isEqualTo: 'pending');
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Panel administrador'),
        actions: [
          TextButton.icon(
            onPressed: () {
              setState(() {
                _showOnlyPending = !_showOnlyPending;
              });
            },
            icon: Icon(
              _showOnlyPending ? Icons.filter_alt : Icons.filter_alt_off,
              color: Colors.white,
            ),
            label: Text(
              _showOnlyPending ? 'Solo pendientes' : 'Todos',
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: query.snapshots(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(
              child: Text('Error al cargar proveedores: ${snapshot.error}'),
            );
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final docs = snapshot.data?.docs ?? [];

          if (docs.isEmpty) {
            return Center(
              child: Text(
                _showOnlyPending
                    ? 'No hay proveedores pendientes de aprobación.'
                    : 'No hay proveedores registrados.',
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: docs.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final data = docs[index].data();
              final uid = docs[index].id;

              final name = (data['name'] ?? '') as String;
              final email = (data['email'] ?? '') as String;
              final phone = (data['phone'] ?? '') as String;
              final businessName = (data['businessName'] ?? '') as String;
              final businessDescription =
                  (data['businessDescription'] ?? '') as String;
              final address = (data['address'] ?? '') as String;
              final approvalStatus =
                  (data['approvalStatus'] ?? 'pending') as String;
              final services = (data['services'] ?? []) as List<dynamic>;

              final servicesText = _buildServiceNames(services);
              final isPending = approvalStatus == 'pending';

              return Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        businessName.isNotEmpty ? businessName : '(Sin nombre)',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      if (name.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text('Contacto: $name'),
                      ],
                      const SizedBox(height: 4),
                      Text('Email: $email'),
                      if (phone.isNotEmpty) Text('Teléfono: $phone'),
                      if (address.isNotEmpty) Text('Dirección: $address'),
                      if (businessDescription.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          businessDescription,
                          style: const TextStyle(color: Colors.black54),
                        ),
                      ],
                      const SizedBox(height: 4),
                      Text(
                        'Servicios: $servicesText',
                        style: const TextStyle(color: Colors.black87),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Chip(
                            label: Text(
                              isPending ? 'Pendiente' : 'Aprobado',
                              style: const TextStyle(color: Colors.white),
                            ),
                            backgroundColor:
                                isPending ? Colors.orange : Colors.green,
                          ),
                          if (isPending)
                            ElevatedButton(
                              onPressed: () => _approveProvider(uid),
                              child: const Text('Aprobar'),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
