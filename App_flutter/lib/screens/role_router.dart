import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import 'client_home.dart';
import 'provider_home.dart';
import 'admin_home.dart';

class RoleRouter extends StatelessWidget {
  const RoleRouter({super.key});

  Future<String?> _getRole() async {
    final uid = FirebaseAuth.instance.currentUser!.uid;
    final doc =
        await FirebaseFirestore.instance.collection('users').doc(uid).get();
    return doc.data()?['role'] as String?;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String?>(
      future: _getRole(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final role = snapshot.data;
        if (role == 'cliente') return const ClientHome();
        if (role == 'proveedor') return const ProviderHome();
        // Si en Firestore le pones role = 'admin' a alguien, vendrá acá:
        return const AdminHome();
      },
    );
  }
}
