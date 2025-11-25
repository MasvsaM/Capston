import 'package:flutter/material.dart';
import 'users_control.dart';
import 'providers_control.dart';

class AdminDashboard extends StatelessWidget {
  const AdminDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Panel de administración')),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: const [
          UsersControlScreen(),
          SizedBox(height: 12),
          ProvidersControlScreen(),
        ],
      ),
    );
  }
}
