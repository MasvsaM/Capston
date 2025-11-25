import 'package:flutter/material.dart';
import 'add_pet.dart';
import 'pet_detail.dart';

class PetsListScreen extends StatelessWidget {
  const PetsListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Mascotas', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                IconButton(
                  icon: const Icon(Icons.add),
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const AddPetScreen()),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ListTile(
              title: const Text('Firulais'),
              subtitle: const Text('Perro'),
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const PetDetailScreen()),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
