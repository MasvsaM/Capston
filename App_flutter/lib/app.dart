import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'firebase_options.dart';
import 'routes/app_routes.dart';
import 'features/auth/presentation/login_screen.dart';
import 'features/auth/presentation/role_selector.dart';

/// Widget raíz de la aplicación MarketPet.
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
        useMaterial3: true,
        colorSchemeSeed: Colors.teal,
        scaffoldBackgroundColor: Colors.white,
      ),
      routes: AppRoutes.routes,
      home: const PortalAutenticacion(),
    );
  }
}

/// Escucha el estado de FirebaseAuth y enruta a login/rol según corresponda.
class PortalAutenticacion extends StatelessWidget {
  const PortalAutenticacion({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (snapshot.hasError) {
          return const Scaffold(
            body: Center(child: Text('Error al conectar con autenticación')),
          );
        }

        if (!snapshot.hasData) {
          return const LoginScreen();
        }

        return const RoleSelector();
      },
    );
  }
}
