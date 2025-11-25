import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inicio'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await FirebaseAuth.instance.signOut();
            },
            tooltip: 'Cerrar sesión',
          ),
        ],
      ),
      body: Center(
        child: Text(
          user == null
              ? 'Sin usuario'
              : 'Hola, ${user.email ?? user.displayName ?? 'usuario'}',
          style: const TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}
