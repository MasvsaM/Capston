import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'firebase_options.dart';
import 'screens/pantalla_autenticacion.dart';
import 'screens/enrutador_roles.dart';
import 'screens/home_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Inicializa Firebase con las opciones de tu proyecto
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const AplicacionMarketPet());
}

class AplicacionMarketPet extends StatelessWidget {
  const AplicacionMarketPet({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'App Producción',
      debugShowCheckedModeBanner: false,
      locale: const Locale('es'),
      supportedLocales: const [
        Locale('es'),
        Locale('en'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.teal,
      ),
      home: const PortalAutenticacion(),
      // Opcional: rutas con nombre por si las usas en otros lados
      routes: {
        '/home': (_) => const HomeScreen(),
        '/login': (_) => const PantallaAutenticacion(),
      },
    );
  }
}

class PortalAutenticacion extends StatelessWidget {
  const PortalAutenticacion({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        // Cargando estado inicial de auth
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        // Si no hay usuario -> login
        if (!snapshot.hasData) {
          return const PantallaAutenticacion();
        }

        // Si hay usuario → según rol
        return const EnrutadorRoles();
      },
    );
  }
}
