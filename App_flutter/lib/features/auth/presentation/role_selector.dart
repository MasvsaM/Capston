import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../../client/presentation/client_home.dart';
import '../../provider/presentation/provider_home.dart';
import '../../admin/presentation/admin_dashboard.dart';

class RoleSelector extends StatelessWidget {
  const RoleSelector({super.key});

  @override
  Widget build(BuildContext context) {
    final role = FirebaseAuth.instance.currentUser?.displayName ?? 'client';

    switch (role) {
      case 'admin':
        return const AdminDashboard();
      case 'provider':
        return const ProviderHomeScreen();
      default:
        return const ClientHomeScreen();
    }
  }
}
