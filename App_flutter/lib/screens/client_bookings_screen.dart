import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ClientBookingsScreen extends StatefulWidget {
  const ClientBookingsScreen({super.key});

  @override
  State<ClientBookingsScreen> createState() => _ClientBookingsScreenState();
}

class _ClientBookingsScreenState extends State<ClientBookingsScreen> {
  final _auth = FirebaseAuth.instance;
  final _firestore = FirebaseFirestore.instance;

  // filtro: próximas / pasadas / todas
  String _filter = 'upcoming'; // upcoming / past / all

  String _statusLabel(String raw) {
    final s = raw.toLowerCase();
    if (s == 'pending') return 'Pendiente';
    if (s == 'requested') return 'Pendiente';
    if (s == 'accepted' || s == 'confirmed') return 'Confirmada';
    if (s == 'completed' || s == 'done') return 'Completada';
    if (s == 'cancelled' || s == 'canceled') return 'Cancelada';
    if (s == 'rejected') return 'Rechazada';
    return raw;
  }

  Color _statusColor(String raw) {
    final s = raw.toLowerCase();
    if (s == 'pending' || s == 'requested') return Colors.orange;
    if (s == 'accepted' || s == 'confirmed') return Colors.green;
    if (s == 'completed' || s == 'done') return Colors.blueGrey;
    if (s == 'cancelled' || s == 'canceled' || s == 'rejected') {
      return Colors.redAccent;
    }
    return Colors.grey;
  }

  String _formatDateTime(Timestamp? ts) {
    if (ts == null) return '';
    final d = ts.toDate();
    final day = d.day.toString().padLeft(2, '0');
    final month = d.month.toString().padLeft(2, '0');
    final year = d.year.toString();
    final hour = d.hour.toString().padLeft(2, '0');
    final minute = d.minute.toString().padLeft(2, '0');
    return '$day/$month/$year • $hour:$minute';
  }

  Future<void> _cancelBooking(
    DocumentReference<Map<String, dynamic>> ref,
  ) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Cancelar reserva'),
        content: const Text(
          '¿Seguro quieres cancelar esta reserva?\n'
          'El proveedor será notificado.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('No'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Sí, cancelar'),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    await ref.update({
      'status': 'cancelled',
      'cancelledBy': 'client',
      'cancelledAt': FieldValue.serverTimestamp(),
    });

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Reserva cancelada')),
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

    // Query simple: todas las reservas del cliente.
    // No usamos orderBy en Firestore para no necesitar índices compuestos;
    // ordenamos en memoria.
    final bookingsStream = _firestore
        .collection('bookings')
        .where('clientId', isEqualTo: user.uid)
        .snapshots();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis reservas'),
      ),
      body: Column(
        children: [
          // Filtros
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: Row(
              children: [
                Expanded(
                  child: ChoiceChip(
                    label: const Text('Próximas'),
                    selected: _filter == 'upcoming',
                    onSelected: (_) {
                      setState(() => _filter = 'upcoming');
                    },
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ChoiceChip(
                    label: const Text('Historial'),
                    selected: _filter == 'past',
                    onSelected: (_) {
                      setState(() => _filter = 'past');
                    },
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ChoiceChip(
                    label: const Text('Todas'),
                    selected: _filter == 'all',
                    onSelected: (_) {
                      setState(() => _filter = 'all');
                    },
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 4),
          Expanded(
            child: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
              stream: bookingsStream,
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        'Error al cargar reservas: ${snapshot.error}',
                        textAlign: TextAlign.center,
                      ),
                    ),
                  );
                }
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                // Ordenamos en memoria por fecha (más reciente primero)
                final docs = (snapshot.data?.docs ?? []).toList();
                docs.sort((a, b) {
                  final da = a.data();
                  final db = b.data();
                  final ta =
                      da['scheduledAt'] ?? da['date'] ?? da['start'] ?? da['startTime'];
                  final tb =
                      db['scheduledAt'] ?? db['date'] ?? db['start'] ?? db['startTime'];

                  DateTime? daDate;
                  DateTime? dbDate;

                  if (ta is Timestamp) daDate = ta.toDate();
                  if (tb is Timestamp) dbDate = tb.toDate();

                  if (daDate == null && dbDate == null) return 0;
                  if (daDate == null) return 1;
                  if (dbDate == null) return -1;
                  return dbDate.compareTo(daDate);
                });

                final now = DateTime.now();

                final filtered = docs.where((doc) {
                  final data = doc.data();
                  final status = (data['status'] as String?) ?? 'pending';

                  final ts = data['scheduledAt'] ??
                      data['date'] ??
                      data['start'] ??
                      data['startTime'];

                  DateTime? date;
                  if (ts is Timestamp) date = ts.toDate();

                  final isCancelled =
                      status.toLowerCase() == 'cancelled' ||
                          status.toLowerCase() == 'canceled';

                  if (_filter == 'all') {
                    return true;
                  } else if (_filter == 'upcoming') {
                    if (isCancelled) return false;
                    if (date == null) return false;
                    return !date.isBefore(now);
                  } else if (_filter == 'past') {
                    if (date == null) return true;
                    return date.isBefore(now);
                  }
                  return true;
                }).toList();

                if (filtered.isEmpty) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: Text(
                        'Por ahora no tienes reservas en esta sección.\n'
                        'Cuando solicites servicios aparecerán aquí.',
                        textAlign: TextAlign.center,
                      ),
                    ),
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: filtered.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final doc = filtered[index];
                    final data = doc.data();

                    final rawStatus =
                        (data['status'] as String?) ?? 'pending';
                    final statusLabel = _statusLabel(rawStatus);
                    final statusColor = _statusColor(rawStatus);

                    final serviceName =
                        (data['serviceName'] as String?) ??
                            (data['serviceTitle'] as String?) ??
                            'Servicio';
                    final providerName =
                        (data['providerName'] as String?) ??
                            (data['provider'] as String?) ??
                            'Proveedor';
                    final petName =
                        (data['petName'] as String?) ??
                            (data['pet'] as String?) ??
                            '';
                    final city =
                        (data['city'] as String?) ?? '';
                    final price = (data['price'] is num)
                        ? (data['price'] as num).toDouble()
                        : (data['total'] is num)
                            ? (data['total'] as num).toDouble()
                            : null;

                    final ts = data['scheduledAt'] ??
                        data['date'] ??
                        data['start'] ??
                        data['startTime'];
                    final tsTyped = ts is Timestamp ? ts : null;
                    final dateText = _formatDateTime(tsTyped);

                    final canCancel = () {
                      if (tsTyped == null) return false;
                      final when = tsTyped.toDate();
                      if (when.isBefore(now)) return false;
                      final s = rawStatus.toLowerCase();
                      if (s == 'cancelled' ||
                          s == 'canceled' ||
                          s == 'completed' ||
                          s == 'done' ||
                          s == 'rejected') {
                        return false;
                      }
                      return true;
                    }();

                    final subtitleLines = <String>[];
                    if (petName.isNotEmpty) {
                      subtitleLines.add('Mascota: $petName');
                    }
                    if (providerName.isNotEmpty) {
                      subtitleLines.add('Proveedor: $providerName');
                    }
                    if (city.isNotEmpty) {
                      subtitleLines.add('Ciudad: $city');
                    }

                    return Card(
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Título + estado
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(
                                  child: Text(
                                    serviceName,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: statusColor.withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    statusLabel,
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w500,
                                      color: statusColor,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            if (subtitleLines.isNotEmpty)
                              Text(
                                subtitleLines.join(' • '),
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.black54,
                                ),
                              ),
                            const SizedBox(height: 4),
                            if (dateText.isNotEmpty)
                              Row(
                                children: [
                                  const Icon(
                                    Icons.event,
                                    size: 14,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    dateText,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ],
                              ),
                            if (price != null) ...[
                              const SizedBox(height: 4),
                              Text(
                                'Total estimado: \$${price.toStringAsFixed(0)}',
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                            if (canCancel) ...[
                              const SizedBox(height: 8),
                              Align(
                                alignment: Alignment.centerRight,
                                child: TextButton.icon(
                                  onPressed: () =>
                                      _cancelBooking(doc.reference),
                                  icon: const Icon(
                                    Icons.cancel_outlined,
                                    size: 18,
                                  ),
                                  label: const Text('Cancelar reserva'),
                                  style: TextButton.styleFrom(
                                    foregroundColor: Colors.redAccent,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
