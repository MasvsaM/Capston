import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class PaginaMascotas extends StatefulWidget {
  const PaginaMascotas({super.key});

  @override
  PaginaMascotasState createState() => PaginaMascotasState();
}

class PaginaMascotasState extends State<PaginaMascotas> {
  String get idUsuario => FirebaseAuth.instance.currentUser!.uid;

  Stream<QuerySnapshot<Map<String, dynamic>>> _flujoMascotas() {
    return FirebaseFirestore.instance
        .collection('mascotas')
        .where('idDueno', isEqualTo: idUsuario)
        .orderBy('creadoEn', descending: false)
        .snapshots();
  }

  Future<void> abrirDialogoCreacion() => _abrirDialogoMascota();

  Future<void> _abrirDialogoMascota(
      {DocumentSnapshot<Map<String, dynamic>>? mascota}) async {
    final controlNombre =
        TextEditingController(text: mascota?.data()?['nombre'] ?? '');
    final controlEspecie =
        TextEditingController(text: mascota?.data()?['especie'] ?? '');
    final controlRaza = TextEditingController(text: mascota?.data()?['raza'] ?? '');
    final controlEdad = TextEditingController(
      text: mascota?.data()?['edad']?.toString() ?? '',
    );
    final controlNotas =
        TextEditingController(text: mascota?.data()?['notas'] ?? '');

    final esEdicion = mascota != null;

    await showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(esEdicion ? 'Editar mascota' : 'Nueva mascota'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: controlNombre,
                  decoration: const InputDecoration(labelText: 'Nombre'),
                ),
                TextField(
                  controller: controlEspecie,
                  decoration: const InputDecoration(labelText: 'Especie (perro, gato, etc.)'),
                ),
                TextField(
                  controller: controlRaza,
                  decoration: const InputDecoration(labelText: 'Raza'),
                ),
                TextField(
                  controller: controlEdad,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Edad (años)'),
                ),
                TextField(
                  controller: controlNotas,
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
                final nombre = controlNombre.text.trim();
                if (nombre.isEmpty) return;

                final edad = int.tryParse(controlEdad.text.trim());

                final datosMascota = <String, dynamic>{
                  'idDueno': idUsuario,
                  'nombre': nombre,
                  'especie': controlEspecie.text.trim(),
                  'raza': controlRaza.text.trim(),
                  'edad': edad,
                  'notas': controlNotas.text.trim(),
                  'actualizadoEn': FieldValue.serverTimestamp(),
                };

                final referenciaMascotas =
                    FirebaseFirestore.instance.collection('mascotas');

                if (esEdicion) {
                  await referenciaMascotas.doc(mascota!.id).update(datosMascota);
                } else {
                  await referenciaMascotas.add({
                    ...datosMascota,
                    'creadoEn': FieldValue.serverTimestamp(),
                  });
                }

                if (context.mounted) Navigator.pop(context);
              },
              child: Text(esEdicion ? 'Guardar' : 'Crear'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _eliminarMascota(String id) async {
    await FirebaseFirestore.instance.collection('mascotas').doc(id).delete();
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
      stream: _flujoMascotas(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        final documentos = snapshot.data?.docs ?? [];

        if (documentos.isEmpty) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 24),
              child: Text(
                'Aún no tienes mascotas registradas 🐾\nAgrega tu primera mascota para comenzar a usar MarketPet.',
                textAlign: TextAlign.center,
              ),
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(8),
          itemCount: documentos.length,
          itemBuilder: (context, index) {
            final mascota = documentos[index];
            final data = mascota.data();

            return Card(
              child: ListTile(
                title: Text(data['nombre'] ?? ''),
                subtitle: Text(
                  [
                    if (data['especie'] != null && data['especie'] != '')
                      'Especie: ${data['especie']}',
                    if (data['raza'] != null && data['raza'] != '')
                      'Raza: ${data['raza']}',
                    if (data['edad'] != null) 'Edad: ${data['edad']} años',
                  ].where((e) => e.isNotEmpty).join(' • '),
                ),
                onTap: () => _abrirDialogoMascota(mascota: mascota),
                trailing: IconButton(
                  icon: const Icon(Icons.delete, color: Colors.redAccent),
                  onPressed: () => _eliminarMascota(mascota.id),
                ),
              ),
            );
          },
        );
      },
    );
  }
}
