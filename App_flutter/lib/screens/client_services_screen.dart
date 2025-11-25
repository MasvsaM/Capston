import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class ClientServicesScreen extends StatelessWidget {
  const ClientServicesScreen({super.key});

  String get _uid => FirebaseAuth.instance.currentUser!.uid;

  Stream<QuerySnapshot<Map<String, dynamic>>> _servicesStream() {
    return FirebaseFirestore.instance
        .collection('services')
        .where('isActive', isEqualTo: true)
        .orderBy('createdAt', descending: false)
        .snapshots();
  }

  Future<void> _requestService(
    BuildContext context,
    QueryDocumentSnapshot<Map<String, dynamic>> service,
  ) async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;

    // Traer mascotas del cliente
    final petsSnap = await FirebaseFirestore.instance
        .collection('pets')
        .where('ownerId', isEqualTo: _uid)
        .orderBy('createdAt', descending: false)
        .get();

    if (petsSnap.docs.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Primero registra una mascota para poder solicitar 😊'),
        ),
      );
      return;
    }

    String selectedPetId = petsSnap.docs.first.id;
    final notesCtrl = TextEditingController();

    await showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text('Solicitar servicio'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    DropdownButtonFormField<String>(
                      initialValue: selectedPetId,
                      decoration: const InputDecoration(
                        labelText: 'Mascota',
                        border: OutlineInputBorder(),
                      ),
                      items: petsSnap.docs.map((doc) {
                        final data = doc.data();
                        return DropdownMenuItem(
                          value: doc.id,
                          child: Text(data['name'] ?? 'Sin nombre'),
                        );
                      }).toList(),
                      onChanged: (value) {
                        if (value != null) {
                          setState(() => selectedPetId = value);
                        }
                      },
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: notesCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Notas para el proveedor (opcional)',
                        border: OutlineInputBorder(),
                      ),
                      maxLines: 3,
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancelar'),
                ),
                ElevatedButton(
                  onPressed: () async {
                    final petDoc = petsSnap.docs
                        .firstWhere((doc) => doc.id == selectedPetId);
                    final petData = petDoc.data();
                    final serviceData = service.data();

                    await FirebaseFirestore.instance
                        .collection('requests')
                        .add({
                      'clientId': _uid,
                      'clientEmail': user.email,
                      'providerId': serviceData['providerId'],
                      'serviceId': service.id,
                      'serviceTitle': serviceData['title'],
                      'serviceType': serviceData['type'],
                      'petId': petDoc.id,
                      'petName': petData['name'],
                      'status': 'pendiente',
                      'notes': notesCtrl.text.trim(),
                      'createdAt': FieldValue.serverTimestamp(),
                      'updatedAt': FieldValue.serverTimestamp(),
                    });

                    if (context.mounted) Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Solicitud enviada al proveedor ✅'),
                      ),
                    );
                  },
                  child: const Text('Enviar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Servicios disponibles'),
      ),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: _servicesStream(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final docs = snapshot.data?.docs ?? [];

          if (docs.isEmpty) {
            return const Center(
              child: Text('No hay servicios publicados aún 💈'),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final service = docs[index];
              final data = service.data();

              final title = (data['title'] ?? '').toString();
              final type = (data['type'] ?? '').toString();
              final description = (data['description'] ?? '').toString();
              final price = data['price'];

              final subtitleParts = <String>[];
              if (type.isNotEmpty) subtitleParts.add('Tipo: $type');
              if (price != null) subtitleParts.add('Precio: \$$price');
              if (description.isNotEmpty) subtitleParts.add(description);

              return Card(
                child: ListTile(
                  title: Text(title),
                  subtitle: Text(subtitleParts.join(' • ')),
                  trailing: TextButton(
                    onPressed: () => _requestService(context, service),
                    child: const Text('Solicitar'),
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
