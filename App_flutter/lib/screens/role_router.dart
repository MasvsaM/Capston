import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

// Ajusta estos imports si tus rutas son con 'package:app_flutter/...'
import 'login_screen.dart';
import 'admin_home.dart';
import 'provider_home.dart';
import 'client_home.dart';

/// Decide a qué home mandar según el rol:
/// admin / provider / client
class RoleRouter extends StatelessWidget {
  RoleRouter({super.key});

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: _auth.authStateChanges(),
      builder: (context, authSnap) {
        if (authSnap.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final user = authSnap.data;

        // Sin sesión => login
        if (user == null) {
          return LoginScreen();
        }

        final uid = user.uid;

        // Leer doc en users/{uid}
        return StreamBuilder<DocumentSnapshot<Map<String, dynamic>>>(
          stream: _db.collection('users').doc(uid).snapshots(),
          builder: (context, userSnap) {
            if (userSnap.hasError) {
              return Scaffold(
                body: Center(
                  child: Text(
                    'Error cargando perfil: ${userSnap.error}',
                  ),
                ),
              );
            }

            if (!userSnap.hasData || userSnap.data!.data() == null) {
              // Todavía no se ha creado el documento
              return const Scaffold(
                body: Center(
                  child: Text(
                    'Estamos configurando tu perfil...\n'
                    'Intenta nuevamente en unos instantes.',
                    textAlign: TextAlign.center,
                  ),
                ),
              );
            }

            final data = userSnap.data!.data()!;
            final role = (data['role'] as String?) ?? 'client';
            final approvalStatus =
                (data['approvalStatus'] as String?) ?? 'pending';

            // ---- ADMIN ----
            if (role == 'admin') {
              // Ojo: aquí asumimos que en admin_home.dart tienes
              // class AdminHomeScreen extends StatelessWidget ...
              return AdminHomeScreen();
            }

            // ---- PROVEEDOR ----
            if (role == 'provider') {
              if (approvalStatus != 'approved') {
                return Scaffold(
                  appBar: AppBar(
                    title: const Text('Perfil proveedor'),
                  ),
                  body: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Tu perfil de proveedor aún no está aprobado.',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text('Estado actual: $approvalStatus'),
                        const SizedBox(height: 8),
                        const Text(
                          'Cuando sea aprobado podrás acceder al panel '
                          'para gestionar tus servicios.',
                        ),
                        const Spacer(),
                        Center(
                          child: ElevatedButton.icon(
                            onPressed: () async {
                              await _auth.signOut();
                              if (!context.mounted) return;
                              Navigator.of(context)
                                  .pushNamedAndRemoveUntil(
                                '/login',
                                (route) => false,
                              );
                            },
                            icon: const Icon(Icons.logout),
                            label: const Text('Cerrar sesión'),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }

              // Proveedor aprobado
              // En provider_home.dart debe existir:
              // class ProviderHomeScreen extends StatefulWidget ...
              return ProviderHomeScreen();
            }

            // ---- CLIENTE (default) ----
            // En client_home.dart debe existir:
            // class ClientHomeScreen extends StatefulWidget ...
            return ClientHomeScreen();
          },
        );
      },
    );
  }
}
