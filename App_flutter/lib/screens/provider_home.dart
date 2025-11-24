import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'provider_requests_screen.dart';

class ProviderHome extends StatefulWidget {
  const ProviderHome({super.key});

  @override
  State<ProviderHome> createState() => _ProviderHomeState();
}

class _ProviderHomeState extends State<ProviderHome> {
  String get uid => FirebaseAuth.instance.currentUser!.uid;

  Stream<QuerySnapshot<Map<String, dynamic>>> _servicesStream() {
    return FirebaseFirestore.instance
        .collection('services')
        .where('providerId', isEqualTo: uid)
        .orderBy('createdAt', descending: false)
        .snapshots();
  }

  Future<void> _openServiceDialog({
    DocumentSnapshot<Map<String, dynamic>>? service,
  }) async {
    final titleCtrl = TextEditingController(
      text: service?.data()?['title'] ?? '',
    );
    final descCtrl = TextEditingController(
      text: service?.data()?['description'] ?? '',
    );
    final typeCtrl = TextEditingController(
      text: service?.data()?['type'] ?? '',
    );
    final priceCtrl = TextEditingController(
      text: service?.data()?['price']?.toString() ?? '',
    );

    final isEdit = service != null;

    await showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(isEdit ? 'Editar servicio' : 'Nuevo servicio'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: titleCtrl,
                  decoration: const InputDecoration(labelText: 'Título'),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: descCtrl,
                  decoration: const InputDecoration(labelText: 'Descripción'),
                  maxLines: 3,
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: typeCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Tipo (peluquería, paseo, veterinaria, etc.)',
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: priceCtrl,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Precio (CLP)'),
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
                final title = titleCtrl.text.trim();
                if (title.isEmpty) return;

                final price = int.tryParse(priceCtrl.text.trim());

                final data = <String, dynamic>{
                  'providerId': uid,
                  'title': title,
                  'description': descCtrl.text.trim(),
                  'type': typeCtrl.text.trim(),
                  'price': price,
                  'isActive': true,
                  'updatedAt': FieldValue.serverTimestamp(),
                };

                final servicesRef = FirebaseFirestore.instance.collection(
                  'services',
                );

                if (isEdit) {
                  await servicesRef.doc(service!.id).update(data);
                } else {
                  await servicesRef.add({
                    ...data,
                    'createdAt': FieldValue.serverTimestamp(),
                  });
                }

                if (context.mounted) Navigator.pop(context);
              },
              child: Text(isEdit ? 'Guardar' : 'Crear'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _deleteService(String id) async {
    await FirebaseFirestore.instance.collection('services').doc(id).delete();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('MarketPet - Mis servicios'),
        actions: [
          IconButton(
            tooltip: 'Solicitudes',
            icon: const Icon(Icons.mail_outline),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const ProviderRequestsScreen(),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => FirebaseAuth.instance.signOut(),
          ),
        ],
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
              child: Text('Aún no tienes servicios publicados 💈'),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final service = docs[index];
              final data = service.data();

              return Card(
                child: ListTile(
                  title: Text(data['title'] ?? ''),
                  subtitle: Text(
                    [
                      if ((data['type'] ?? '').toString().isNotEmpty)
                        'Tipo: ${data['type']}',
                      if (data['price'] != null) 'Precio: \$${data['price']}',
                    ].join(' • '),
                  ),
                  onTap: () => _openServiceDialog(service: service),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete, color: Colors.redAccent),
                    onPressed: () => _deleteService(service.id),
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _openServiceDialog(),
        child: const Icon(Icons.add),
      ),
    );
  }
}
