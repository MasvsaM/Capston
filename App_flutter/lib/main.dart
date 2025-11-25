import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'firebase_options.dart';
import 'screens/pantalla_autenticacion.dart';
import 'screens/enrutador_roles.dart';

/// Punto de entrada de la aplicación MarketPet.
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Inicializa Firebase usando la configuración generada por flutterfire.
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const AplicacionMarketPet());
}

/// Widget raíz de la app.
class AplicacionMarketPet extends StatelessWidget {
  const AplicacionMarketPet({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MarketPet',
      debugShowCheckedModeBanner: false, // Sin cinta de debug en producción
      locale: const Locale('es'),
      supportedLocales: const [
        Locale('es'), // Español
        Locale('en'), // Inglés (por si acaso)
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.teal,
        scaffoldBackgroundColor: Colors.white,
      ),
      // PortalAutenticacion decide si mostrar login o ir al home según usuario/rol
      home: const PortalAutenticacion(),
      // Si usas rutas con nombre, las agregas aquí:
      routes: {
        '/login': (_) => const PantallaAutenticacion(),
        // '/homeCliente': (_) => const ClientHomeScreen(),
        // '/homeProveedor': (_) => const ProviderHomeScreen(),
        // '/homeAdmin': (_) => const AdminHomeScreen(),
      },
    );
  }
}

/// Escucha el estado de FirebaseAuth y enruta a:
/// - PantallaAutenticacion() si no hay usuario
/// - EnrutadorRoles() si hay usuario autenticado
class PortalAutenticacion extends StatelessWidget {
  const PortalAutenticacion({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        // 1) Cargando estado inicial de autenticación
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        // 2) Error al obtener el estado de auth
        if (snapshot.hasError) {
          return Scaffold(
            body: Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.error_outline, color: Colors.red, size: 48),
                    const SizedBox(height: 16),
                    const Text(
                      'Ocurrió un problema al conectar con el servicio de autenticación.',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        // Fuerza un rebuild de la app
                        Navigator.of(context).pushAndRemoveUntil(
                          MaterialPageRoute(
                            builder: (_) => const PortalAutenticacion(),
                          ),
                          (route) => false,
                        );
                      },
                      child: const Text('Reintentar'),
                    ),
                  ],
                ),
              ),
            ),
          );
        }

        // 3) Sin usuario autenticado → mostrar login/registro
        if (!snapshot.hasData) {
          return const PantallaAutenticacion();
        }

        // 4) Hay usuario autenticado → enrutador por rol (cliente / proveedor / admin)
        return const EnrutadorRoles();
      },
    );
  }
}
