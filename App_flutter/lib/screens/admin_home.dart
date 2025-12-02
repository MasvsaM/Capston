import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AdminHomeScreen extends StatelessWidget {
  const AdminHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    final email = user?.email ?? 'Admin';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Panel administrador'),
        actions: [
          IconButton(
            tooltip: 'Cerrar sesión',
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await FirebaseAuth.instance.signOut();
              if (context.mounted) {
                Navigator.of(context)
                    .pushNamedAndRemoveUntil('/login', (route) => false);
              }
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Hola, $email',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Este es un panel simple de administrador.\n'
              'Más adelante puedes agregar aquí KPIs, métricas,\n'
              'resumen de proveedores, reservas, etc.',
            ),
          ],
        ),
      ),
    );
  }
}
