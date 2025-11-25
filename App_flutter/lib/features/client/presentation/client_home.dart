import 'package:flutter/material.dart';
import 'pets/pets_list.dart';
import 'premium/premium_info.dart';

class ClientHomeScreen extends StatelessWidget {
  const ClientHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Inicio cliente')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          PetsListScreen(),
          SizedBox(height: 16),
          PremiumInfoScreen(),
        ],
      ),
    );
  }
}
