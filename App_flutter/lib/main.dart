import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

// Screens
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/home_screen.dart';
import 'screens/client_home.dart';
import 'screens/client_services_screen.dart';
import 'screens/client_bookings_screen.dart';

import 'screens/provider_home.dart';
import 'screens/provider_schedule_screen.dart';
import 'screens/provider_bookings_screen.dart';
import 'screens/provider_catalog_screen.dart';
import 'screens/provider_wallet_screen.dart';
import 'screens/provider_settings.dart';
import 'screens/provider_home_visits_screen.dart';
import 'screens/provider_requests_screen.dart';

import 'screens/admin_home.dart';
import 'screens/role_router.dart';

import 'screens/client_premium_screen.dart';
import 'screens/client_forum_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MarketPet',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF00695C),
      ),

      // Toda la lógica de a dónde mandar al usuario está en RoleRouter
      initialRoute: '/',
      routes: {
        // Router principal por rol
        '/': (context) => RoleRouter(),

        // Auth
        '/login': (context) => LoginScreen(),
        '/register': (context) => RegisterScreen(),

        // Compatibilidad con código viejo
        '/home': (context) => HomeScreen(),

        // Cliente
        '/clientHome': (context) => ClientHomeScreen(),
        '/clientServices': (context) => ClientServicesScreen(),
        '/clientBookings': (context) => const ClientBookingsScreen(),
        '/clientPremium': (context) => const ClientPremiumScreen(),
        '/clientForum': (context) => const ClientForumScreen(),

        // Proveedor
        '/provider': (context) => ProviderHomeScreen(),
        '/providerSchedule': (context) => ProviderScheduleScreen(),
        '/providerBookings': (context) => ProviderBookingsScreen(),
        '/providerCatalog': (context) => ProviderCatalogScreen(),
        '/providerWallet': (context) => ProviderWalletScreen(),
        '/providerSettings': (context) => ProviderSettingsScreen(),
        '/providerHomeVisits': (context) => ProviderHomeVisitsScreen(),
        '/providerRequests': (context) => ProviderRequestsScreen(),

        // Admin
        '/admin': (context) => AdminHomeScreen(),
      },
    );
  }
}
