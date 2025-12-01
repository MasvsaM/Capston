import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../models/service_blocks.dart';

class ProviderBookingsScreen extends StatefulWidget {
  const ProviderBookingsScreen({super.key});

  @override
  State<ProviderBookingsScreen> createState() =>
      _ProviderBookingsScreenState();
}

class _ProviderBookingsScreenState extends State<ProviderBookingsScreen> {
  final _auth = FirebaseAuth.instance;
  final _firestore = FirebaseFirestore.instance;

  /// Mapa rápido id → nombre del servicio (baño, paseo, hotel, etc.)
  final Map<String, String> _serviceNames = {
    for (final block in kServiceBlocks) block.id: block.name,
  };

  /// Filtro de estado: all, available, booked, completed, cancelled
  String _statusFilter = 'all';

  /// Filtro de rango de fecha: upcoming (solo futuros), today, all
  String _rangeFilter = 'upcoming';

  Stream<QuerySnapshot<Map<String, dynamic>>> _bookingsStream(
      String providerId) {
    // Importante: para esto creaste el índice compuesto con providerId + start
    return _firestore
        .collection('bookings')
        .where('providerId', isEqualTo: providerId)
        .orderBy('start')
        .snapshots();
  }

  String _formatDateTime(DateTime dt) {
    final d = dt.day.toString().padLeft(2, '0');
    final m = dt.month.toString().padLeft(2, '0');
    final y = dt.year;
    final h = dt.hour.toString().padLeft(2, '0');
    final min = dt.minute.toString().padLeft(2, '0');
    return '$d/$m/$y · $h:$min';
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'available':
        return Colors.green.shade600;
      case 'booked':
        return Colors.blue.shade600;
      case 'completed':
        return Colors.purple.shade600;
      case 'cancelled':
        return Colors.red.shade600;
      default:
        return Colors.grey.shade700;
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'booked':
        return 'Reservado';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }

  Future<void> _updateStatus(
    DocumentReference<Map<String, dynamic>> ref,
    String newStatus,
  ) async {
    try {
      await ref.update({
        'status': newStatus,
        'updatedAt': FieldValue.serverTimestamp(),
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Estado actualizado a ${_statusLabel(newStatus)}')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('No se pudo actualizar el estado: $e')),
      );
    }
  }

  Future<void> _deleteBooking(
      DocumentReference<Map<String, dynamic>> ref) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: const Text('Eliminar bloque'),
          content: const Text(
            '¿Seguro que quieres eliminar este bloque de agenda?\n'
            'Si está reservado, perderás el registro de la reserva.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(false),
              child: const Text('Cancelar'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.of(dialogContext).pop(true),
              child: const Text('Eliminar'),
            ),
          ],
        );
      },
    );

    if (confirm != true) return;

    try {
      await ref.delete();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Bloque eliminado')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('No se pudo eliminar: $e')),
      );
    }
  }

  Widget _buildFilters() {
    return Column(
      children: [
        // Filtro por estado
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: Row(
            children: [
              ChoiceChip(
                label: const Text('Todos'),
                selected: _statusFilter == 'all',
                onSelected: (_) {
                  setState(() => _statusFilter = 'all');
                },
              ),
              const SizedBox(width: 8),
              ChoiceChip(
                label: const Text('Disponibles'),
                selected: _statusFilter == 'available',
                onSelected: (_) {
                  setState(() => _statusFilter = 'available');
                },
              ),
              const SizedBox(width: 8),
              ChoiceChip(
                label: const Text('Reservados'),
                selected: _statusFilter == 'booked',
                onSelected: (_) {
                  setState(() => _statusFilter = 'booked');
                },
              ),
              const SizedBox(width: 8),
              ChoiceChip(
                label: const Text('Completados'),
                selected: _statusFilter == 'completed',
                onSelected: (_) {
                  setState(() => _statusFilter = 'completed');
                },
              ),
              const SizedBox(width: 8),
              ChoiceChip(
                label: const Text('Cancelados'),
                selected: _statusFilter == 'cancelled',
                onSelected: (_) {
                  setState(() => _statusFilter = 'cancelled');
                },
              ),
            ],
          ),
        ),
        // Filtro por rango de fechas
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: Row(
            children: [
              ChoiceChip(
                label: const Text('Próximos'),
                selected: _rangeFilter == 'upcoming',
                onSelected: (_) {
                  setState(() => _rangeFilter = 'upcoming');
                },
              ),
              const SizedBox(width: 8),
              ChoiceChip(
                label: const Text('Solo hoy'),
                selected: _rangeFilter == 'today',
                onSelected: (_) {
                  setState(() => _rangeFilter = 'today');
                },
              ),
              const SizedBox(width: 8),
              ChoiceChip(
                label: const Text('Todos'),
                selected: _rangeFilter == 'all',
                onSelected: (_) {
                  setState(() => _rangeFilter = 'all');
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = _auth.currentUser;
    if (user == null) {
      return const Scaffold(
        body: Center(child: Text('Debes iniciar sesión.')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Agenda y reservas'),
      ),
      body: Column(
        children: [
          _buildFilters(),
          const Divider(height: 0),
          Expanded(
            child: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
              stream: _bookingsStream(user.uid),
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Center(
                    child: Text(
                      'Error al cargar reservas:\n${snapshot.error}',
                      textAlign: TextAlign.center,
                    ),
                  );
                }
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                var docs = snapshot.data?.docs.toList() ?? [];

                if (docs.isEmpty) {
                  return const Center(
                    child: Text(
                      'Aún no tienes bloques de agenda.\n'
                      'Configura tus horarios en "Agenda y horarios".',
                      textAlign: TextAlign.center,
                    ),
                  );
                }

                final now = DateTime.now();

                // Filtrado en memoria (estado + rango de fechas)
                docs = docs.where((doc) {
                  final data = doc.data();
                  final status =
                      (data['status'] as String? ?? 'available').toLowerCase();

                  if (_statusFilter != 'all' &&
                      status != _statusFilter.toLowerCase()) {
                    return false;
                  }

                  final ts = data['start'] as Timestamp?;
                  final start = ts?.toDate();
                  if (start == null) return false;

                  if (_rangeFilter == 'today') {
                    final sameDay =
                        start.year == now.year &&
                        start.month == now.month &&
                        start.day == now.day;
                    if (!sameDay) return false;
                  } else if (_rangeFilter == 'upcoming') {
                    if (start.isBefore(now)) return false;
                  }

                  return true;
                }).toList();

                // Ordenar por fecha/hora
                docs.sort((a, b) {
                  final ta = a.data()['start'] as Timestamp?;
                  final tb = b.data()['start'] as Timestamp?;
                  final da = ta?.toDate() ?? DateTime.fromMillisecondsSinceEpoch(0);
                  final db = tb?.toDate() ?? DateTime.fromMillisecondsSinceEpoch(0);
                  return da.compareTo(db);
                });

                if (docs.isEmpty) {
                  return const Center(
                    child: Text(
                      'No hay bloques que coincidan con el filtro actual.',
                      textAlign: TextAlign.center,
                    ),
                  );
                }

                // Pequeño resumen
                final total = docs.length;
                final bookedCount = docs.where((d) {
                  final s =
                      (d.data()['status'] as String? ?? '').toLowerCase();
                  return s == 'booked';
                }).length;

                return Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
                      child: Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Bloques encontrados: $total · Reservados: $bookedCount',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.black54,
                          ),
                        ),
                      ),
                    ),
                    const Divider(height: 0),
                    Expanded(
                      child: ListView.separated(
                        padding: const EdgeInsets.all(12),
                        itemCount: docs.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 8),
                        itemBuilder: (context, index) {
                          final doc = docs[index];
                          final data = doc.data();

                          final status =
                              (data['status'] as String? ?? 'available')
                                  .toLowerCase();
                          final serviceId =
                              (data['serviceId'] as String?) ?? '';
                          final serviceName = _serviceNames[serviceId] ??
                              (serviceId.isEmpty ? 'Servicio' : serviceId);

                          final ts = data['start'] as Timestamp?;
                          final start =
                              ts?.toDate() ?? DateTime.fromMillisecondsSinceEpoch(0);
                          final duration =
                              (data['durationMinutes'] as num?)?.toInt() ?? 60;
                          final end = start.add(
                            Duration(minutes: duration),
                          );

                          final clientName =
                              (data['clientName'] as String?) ?? '';
                          final petName = (data['petName'] as String?) ?? '';
                          final notes = (data['notes'] as String?) ?? '';

                          final timeLabel =
                              '${_formatDateTime(start)} → ${_formatDateTime(end)}';

                          return Card(
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor:
                                    _statusColor(status).withOpacity(0.15),
                                child: Icon(
                                  Icons.event_available,
                                  color: _statusColor(status),
                                ),
                              ),
                              title: Text(serviceName),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    timeLabel,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  if (clientName.isNotEmpty || petName.isNotEmpty)
                                    Text(
                                      [
                                        if (clientName.isNotEmpty)
                                          'Cliente: $clientName',
                                        if (petName.isNotEmpty) 'Mascota: $petName',
                                      ].join(' · '),
                                      style: const TextStyle(fontSize: 13),
                                    ),
                                  if (notes.isNotEmpty)
                                    Text(
                                      notes,
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: Colors.black54,
                                      ),
                                    ),
                                  const SizedBox(height: 4),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                      vertical: 2,
                                    ),
                                    decoration: BoxDecoration(
                                      color:
                                          _statusColor(status).withOpacity(0.12),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      _statusLabel(status),
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                        color: _statusColor(status),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              trailing: PopupMenuButton<String>(
                                onSelected: (value) {
                                  if (value == 'complete') {
                                    _updateStatus(doc.reference, 'completed');
                                  } else if (value == 'cancel') {
                                    _updateStatus(doc.reference, 'cancelled');
                                  } else if (value == 'delete') {
                                    _deleteBooking(doc.reference);
                                  }
                                },
                                itemBuilder: (context) {
                                  final items = <PopupMenuEntry<String>>[];

                                  if (status == 'booked') {
                                    items.add(
                                      const PopupMenuItem(
                                        value: 'complete',
                                        child: Text('Marcar como completada'),
                                      ),
                                    );
                                    items.add(
                                      const PopupMenuItem(
                                        value: 'cancel',
                                        child: Text('Cancelar reserva'),
                                      ),
                                    );
                                  } else if (status == 'available') {
                                    items.add(
                                      const PopupMenuItem(
                                        value: 'delete',
                                        child: Text('Eliminar bloque'),
                                      ),
                                    );
                                  } else {
                                    // completed / cancelled / otros
                                    items.add(
                                      const PopupMenuItem(
                                        value: 'delete',
                                        child: Text('Eliminar registro'),
                                      ),
                                    );
                                  }

                                  return items;
                                },
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
