import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class ClientHome extends StatefulWidget {
  const ClientHome({super.key});

  @override
  State<ClientHome> createState() => _ClientHomeState();
}

class _ClientHomeState extends State<ClientHome> {
  String get uid => FirebaseAuth.instance.currentUser!.uid;

  Stream<QuerySnapshot<Map<String, dynamic>>> _petsStream() {
    return FirebaseFirestore.instance
        .collection('pets')
        .where('ownerId', isEqualTo: uid)
        .orderBy('createdAt', descending: false)
        .snapshots();
  }

  Future<void> _openPetDialog({DocumentSnapshot<Map<String, dynamic>>? pet}) async {
    final nameCtrl = TextEditingController(text: pet?.data()?['name'] ?? '');
    final speciesCtrl = TextEditingController(text: pet?.data()?['species'] ?? '');
    final breedCtrl = TextEditingController(text: pet?.data()?['breed'] ?? '');
    final ageCtrl = TextEditingController(
      text: pet?.data()?['age']?.toString() ?? '',
    );
    final notesCtrl = TextEditingController(text: pet?.data()?['notes'] ?? '');

    final isEdit = pet != null;

    await showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(isEdit ? 'Editar mascota' : 'Nueva mascota'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameCtrl,
                  decoration: const InputDecoration(labelText: 'Nombre'),
                ),
                TextField(
                  controller: speciesCtrl,
                  decoration: const InputDecoration(labelText: 'Especie (perro, gato, etc.)'),
                ),
                TextField(
                  controller: breedCtrl,
                  decoration: const InputDecoration(labelText: 'Raza'),
                ),
                TextField(
                  controller: ageCtrl,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Edad (años)'),
                ),
                TextField(
                  controller: notesCtrl,
                  decoration: const InputDecoration(labelText: 'Notas'),
                  maxLines: 2,
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
                final name = nameCtrl.text.trim();
                if (name.isEmpty) return;

                final age = int.tryParse(ageCtrl.text.trim());

                final data = <String, dynamic>{
                  'ownerId': uid,
                  'name': name,
                  'species': speciesCtrl.text.trim(),
                  'breed': breedCtrl.text.trim(),
                  'age': age,
                  'notes': notesCtrl.text.trim(),
                  'updatedAt': FieldValue.serverTimestamp(),
                };

                final petsRef =
                    FirebaseFirestore.instance.collection('pets');

                if (isEdit) {
                  await petsRef.doc(pet!.id).update(data);
                } else {
                  await petsRef.add({
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

  Future<void> _deletePet(String id) async {
    await FirebaseFirestore.instance.collection('pets').doc(id).delete();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('MarketPet - Mis mascotas'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => FirebaseAuth.instance.signOut(),
          ),
        ],
      ),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: _petsStream(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final docs = snapshot.data?.docs ?? [];

          if (docs.isEmpty) {
            return const Center(
              child: Text('Aún no tienes mascotas registradas 🐾'),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final pet = docs[index];
              final data = pet.data();

              return Card(
                child: ListTile(
                  title: Text(data['name'] ?? ''),
                  subtitle: Text(
                    [
                      if (data['species'] != null && data['species'] != '')
                        'Especie: ${data['species']}',
                      if (data['breed'] != null && data['breed'] != '')
                        'Raza: ${data['breed']}',
                      if (data['age'] != null) 'Edad: ${data['age']} años',
                    ].where((e) => e.isNotEmpty).join(' • '),
                  ),
                  onTap: () => _openPetDialog(pet: pet),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete, color: Colors.redAccent),
                    onPressed: () => _deletePet(pet.id),
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _openPetDialog(),
        child: const Icon(Icons.add),
      ),
    );
  }
}

