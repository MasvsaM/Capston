import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class PaginaForos extends StatefulWidget {
  const PaginaForos({super.key});

  @override
  State<PaginaForos> createState() => _PaginaForosState();
}

class _PaginaForosState extends State<PaginaForos> {
  final controladorTituloForo = TextEditingController();
  final controladorDescripcionForo = TextEditingController();

  String get idUsuario => FirebaseAuth.instance.currentUser!.uid;

  Stream<QuerySnapshot<Map<String, dynamic>>> _foros() {
    return FirebaseFirestore.instance
        .collection('foros')
        .orderBy('creadoEn', descending: true)
        .snapshots();
  }

  Future<void> _crearForo() async {
    if (controladorTituloForo.text.trim().isEmpty) return;
    await FirebaseFirestore.instance.collection('foros').add({
      'titulo': controladorTituloForo.text.trim(),
      'descripcion': controladorDescripcionForo.text.trim(),
      'creadorId': idUsuario,
      'miembros': [idUsuario],
      'creadoEn': FieldValue.serverTimestamp(),
    });
    controladorTituloForo.clear();
    controladorDescripcionForo.clear();
  }

  Future<void> _unirmeAForo(String idForo) async {
    await FirebaseFirestore.instance.collection('foros').doc(idForo).update({
      'miembros': FieldValue.arrayUnion([idUsuario]),
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Foros de comunidad',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              const Text(
                'Crea foros temáticos para razas, ciudades o problemas específicos. Los clientes premium pueden crear y moderar foros privados.',
              ),
              const SizedBox(height: 12),
              TextField(
                controller: controladorTituloForo,
                decoration: const InputDecoration(
                  labelText: 'Título del foro',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: controladorDescripcionForo,
                decoration: const InputDecoration(
                  labelText: 'Descripción',
                  border: OutlineInputBorder(),
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 8),
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton.icon(
                  onPressed: _crearForo,
                  icon: const Icon(Icons.forum),
                  label: const Text('Crear foro'),
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: StreamBuilder<QuerySnapshot<Map<String, dynamic}}>(
            stream: _foros(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }

              final foros = snapshot.data?.docs ?? [];
              if (foros.isEmpty) {
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Text('Sé el primero en crear un foro para tu comunidad 🐾'),
                  ),
                );
              }

              return ListView.builder(
                itemCount: foros.length,
                itemBuilder: (context, index) {
                  final foro = foros[index];
                  final miembros = List<String>.from(foro['miembros'] ?? []);
                  final yaSoyMiembro = miembros.contains(idUsuario);

                  return Card(
                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: ListTile(
                      title: Text(foro['titulo'] ?? ''),
                      subtitle: Text('${foro['descripcion'] ?? ''}\nMiembros: ${miembros.length}'),
                      isThreeLine: true,
                      trailing: yaSoyMiembro
                          ? const Chip(label: Text('Miembro'))
                          : ElevatedButton(
                              onPressed: () => _unirmeAForo(foro.id),
                              child: const Text('Unirme'),
                            ),
                    ),
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }
}
