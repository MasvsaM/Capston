import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'login_screen.dart';
import 'home_screen.dart';
import 'provider_home.dart';


class RoleRouter extends StatelessWidget {
  const RoleRouter({super.key});

  @override
  Widget build(BuildContext context) {
    // 1) Escucha el estado de autenticación
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, userSnap) {
        // Cargando auth
        if (userSnap.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        // No logueado → Login
        final user = userSnap.data;
        if (user == null) {
          return LoginScreen();
        }

        // 2) Ya logueado → escucha el documento de /users/{uid}
        return StreamBuilder<DocumentSnapshot<Map<String, dynamic>>>(
          stream: FirebaseFirestore.instance
              .collection('users')
              .doc(user.uid)
              .snapshots(),
          builder: (context, docSnap) {
            if (docSnap.connectionState == ConnectionState.waiting) {
              return const Scaffold(
                body: Center(child: CircularProgressIndicator()),
              );
            }

            if (docSnap.hasError) {
              return Scaffold(
                body: Center(
                  child: Text('Error cargando perfil: ${docSnap.error}'),
                ),
              );
            }

            if (!docSnap.hasData || !docSnap.data!.exists) {
              // Sin doc de usuario → por ahora mandamos al Home genérico
              return HomeScreen(); // SIN const
            }

            final data = docSnap.data!.data() ?? {};

            final role =
                (data['role'] as String? ?? 'client').toLowerCase().trim();
            final approvalStatus =
                (data['approvalStatus'] as String? ?? 'approved')
                    .toLowerCase()
                    .trim();

            // 2.a) Casos especiales para proveedores
            if (role == 'provider') {
              if (approvalStatus == 'pending') {
                return Scaffold(
                  appBar: AppBar(title: const Text('Revisión de perfil')),
                  body: const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24.0),
                      child: Text(
                        'Tu perfil de proveedor está en revisión.\n'
                        'Te avisaremos cuando sea aprobado.',
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                );
              }

              if (approvalStatus == 'rejected') {
                return Scaffold(
                  appBar: AppBar(title: const Text('Perfil rechazado')),
                  body: const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24.0),
                      child: Text(
                        'Tu perfil de proveedor fue rechazado.\n'
                        'Revisa la información ingresada o contáctanos '
                        'para más detalles.',
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                );
              }

              // approved → panel de proveedor (con navbar y todo)
              return ProviderHomeScreen(); 
            }

            // 2.b) Admin y client → usan el Home actual
            return HomeScreen(); 
          },
        );
      },
    );
  }
}
