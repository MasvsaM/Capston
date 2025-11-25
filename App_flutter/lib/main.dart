import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'firebase_options.dart';
import 'screens/pantalla_autenticacion.dart';
import 'screens/enrutador_roles.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
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
      title: 'MarketPet',
      debugShowCheckedModeBanner: false,
      locale: const Locale('es'),
      supportedLocales: const [Locale('es'), Locale('en')],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
        useMaterial3: true,
      ),
      home: const PortalAutenticacion(),
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
        // Cargando estado de autenticación
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        // Si NO hay usuario → Login
        if (!snapshot.hasData) {
          return const PantallaAutenticacion();
        }

        // Si hay usuario → según rol
        return const EnrutadorRoles();
      },
    );
  }
}

