import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'firebase_options.dart';

// Pantallas de auth
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';

// Home general (cliente / proveedor)
import 'screens/home_screen.dart' show HomeScreen;

// Homes específicos (si quieres navegarlos por rutas)
import 'screens/admin_home.dart' show AdminHome;
import 'screens/client_home.dart' show ClientHome;
import 'screens/provider_home.dart' show ProviderHomeScreen;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'App Producción',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.teal,
      ),
      // Decide login / home según estado de Firebase Auth
      home: const AuthGate(),
      routes: {
        '/login': (_) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),
        '/home': (_) => const HomeScreen(),

        // Estas rutas son opcionales, pero las dejo por si las usas en otro lado:
        '/client': (_) => const ClientHome(),
        '/admin': (_) => const AdminHome(),
        '/provider': (_) => const ProviderHomeScreen(),
      },
    );
  }
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        // Cargando estado inicial
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        // Sin usuario -> login
        if (!snapshot.hasData) {
          return const LoginScreen();
        }

        // Con usuario -> nuevo HomeScreen (que ya sabe si es cliente / proveedor)
        return const HomeScreen();
      },
    );
  }
}
