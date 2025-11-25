import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import 'inicio_clientes.dart';
import 'inicio_proveedores.dart';
import 'inicio_admin.dart';

class EnrutadorRoles extends StatelessWidget {
  const EnrutadorRoles({super.key});

  Future<String?> _obtenerRol() async {
    final uid = FirebaseAuth.instance.currentUser!.uid;
    final doc =
        await FirebaseFirestore.instance.collection('users').doc(uid).get();
    return doc.data()?['rol'] as String?;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String?>(
      future: _obtenerRol(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final rol = snapshot.data;
        if (rol == 'cliente') return const InicioClientes();
        if (rol == 'proveedor') return const InicioProveedores();
        // Si en Firestore le pones rol = 'admin' a alguien, vendrá acá:
        return const InicioAdmin();
      },
    );
  }
}
