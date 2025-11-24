import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class ProviderRequestsScreen extends StatelessWidget {
  const ProviderRequestsScreen({super.key});

  String get _uid => FirebaseAuth.instance.currentUser!.uid;

  Stream<QuerySnapshot<Map<String, dynamic>>> _requestsStream() {
    return FirebaseFirestore.instance
        .collection('requests')
        .where('providerId', isEqualTo: _uid)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  Future<void> _updateStatus(
    BuildContext context,
    String requestId,
    String newStatus,
  ) async {
    await FirebaseFirestore.instance
        .collection('requests')
        .doc(requestId)
        .update({
      'status': newStatus,
      'updatedAt': FieldValue.serverTimestamp(),
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Solicitud $newStatus')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Solicitudes de servicios'),
      ),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: _requestsStream(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final docs = snapshot.data?.docs ?? [];

          if (docs.isEmpty) {
            return const Center(
              child: Text('No tienes solicitudes por ahora 🙂'),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final req = docs[index];
              final data = req.data();

              final serviceTitle = (data['serviceTitle'] ?? '').toString();
              final petName = (data['petName'] ?? '').toString();
              final clientEmail = (data['clientEmail'] ?? '').toString();
              final status = (data['status'] ?? '').toString();
              final notes = (data['notes'] ?? '').toString();

              return Card(
                child: ListTile(
                  title: Text('$serviceTitle - $petName'),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (clientEmail.isNotEmpty)
                        Text('Cliente: $clientEmail'),
                      Text('Estado: $status'),
                      if (notes.isNotEmpty) Text('Notas: $notes'),
                    ],
                  ),
                  isThreeLine: notes.isNotEmpty,
                  trailing: status == 'pendiente'
                      ? Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              tooltip: 'Aceptar',
                              icon: const Icon(Icons.check, color: Colors.green),
                              onPressed: () => _updateStatus(
                                  context, req.id, 'aceptada'),
                            ),
                            IconButton(
                              tooltip: 'Rechazar',
                              icon:
                                  const Icon(Icons.close, color: Colors.redAccent),
                              onPressed: () => _updateStatus(
                                  context, req.id, 'rechazada'),
                            ),
                          ],
                        )
                      : null,
                ),
              );
            },
          );
        },
      ),
    );
  }
}
