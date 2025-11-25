import 'package:flutter/material.dart';

class PetDetailScreen extends StatelessWidget {
  const PetDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Detalle de mascota')),
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: Text('Detalle de la mascota seleccionado'),
      ),
    );
  }
}
