import 'package:flutter/material.dart';
import 'package:app_flutter/screens/role_router.dart';

/// Pantalla de inicio genérica.
/// Solo delega en RoleRouter, que decide a qué Home ir
/// según el rol del usuario (client / provider / admin).
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // RoleRouter ya se encarga de:
    // - leer el documento de /users/{uid}
    // - revisar role (client / provider / admin)
    // - revisar approvalStatus
    // - enviar a la pantalla correcta
    return const RoleRouter();
  }
}
