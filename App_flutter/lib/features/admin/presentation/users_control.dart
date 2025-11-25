import 'package:flutter/material.dart';

class UsersControlScreen extends StatelessWidget {
  const UsersControlScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Usuarios', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('Gestión básica de usuarios pendiente de implementación'),
          ],
        ),
      ),
    );
  }
}
