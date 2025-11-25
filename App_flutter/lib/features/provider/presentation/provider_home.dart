import 'package:flutter/material.dart';
import 'services/services_list.dart';

class ProviderHomeScreen extends StatelessWidget {
  const ProviderHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Panel del proveedor')),
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: ServicesListScreen(),
      ),
    );
  }
}
