import 'package:flutter/material.dart';
import '../../../../core/widgets/custom_input.dart';
import '../../../../core/widgets/custom_button.dart';

class AddPetScreen extends StatelessWidget {
  const AddPetScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final nameController = TextEditingController();
    final typeController = TextEditingController();

    return Scaffold(
      appBar: AppBar(title: const Text('Agregar mascota')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            CustomInput(controller: nameController, label: 'Nombre'),
            const SizedBox(height: 12),
            CustomInput(controller: typeController, label: 'Tipo'),
            const SizedBox(height: 16),
            CustomButton(
              label: 'Guardar',
              onPressed: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
    );
  }
}
