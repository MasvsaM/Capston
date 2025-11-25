import 'package:flutter/material.dart';

class ServiceDetailScreen extends StatelessWidget {
  const ServiceDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Detalle del servicio')),
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: Text('Descripción del servicio seleccionado'),
      ),
    );
  }
}
