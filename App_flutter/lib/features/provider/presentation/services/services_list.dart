import 'package:flutter/material.dart';
import 'add_service.dart';
import 'service_detail.dart';

class ServicesListScreen extends StatelessWidget {
  const ServicesListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Servicios', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                IconButton(
                  icon: const Icon(Icons.add_business),
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const AddServiceScreen()),
                  ),
                ),
              ],
            ),
            ListTile(
              title: const Text('Baño y corte'),
              subtitle: const Text('Duración 1 hora'),
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ServiceDetailScreen()),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
