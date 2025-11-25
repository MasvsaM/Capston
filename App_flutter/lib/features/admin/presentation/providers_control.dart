import 'package:flutter/material.dart';

class ProvidersControlScreen extends StatelessWidget {
  const ProvidersControlScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Proveedores', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('Gestión básica de proveedores pendiente de implementación'),
          ],
        ),
      ),
    );
  }
}
