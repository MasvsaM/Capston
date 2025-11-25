import 'package:flutter/material.dart';

import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/register_screen.dart';
import '../features/auth/presentation/role_selector.dart';
import '../features/client/presentation/client_home.dart';
import '../features/provider/presentation/provider_home.dart';
import '../features/admin/presentation/admin_dashboard.dart';

class AppRoutes {
  static final Map<String, WidgetBuilder> routes = {
    '/login': (_) => const LoginScreen(),
    '/register': (_) => const RegisterScreen(),
    '/roles': (_) => const RoleSelector(),
    '/homeClient': (_) => const ClientHomeScreen(),
    '/homeProvider': (_) => const ProviderHomeScreen(),
    '/homeAdmin': (_) => const AdminDashboard(),
  };
}
