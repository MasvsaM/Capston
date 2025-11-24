import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class ProviderHome extends StatelessWidget {
  const ProviderHome({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('MarketPet - Proveedor'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => FirebaseAuth.instance.signOut(),
          ),
        ],
      ),
      body: const Center(
        child: Text('Home Proveedor (más adelante: servicios, solicitudes, etc.)'),
      ),
    );
  }
}
