import 'package:flutter/material.dart';
import '../../../../core/widgets/custom_input.dart';
import '../../../../core/widgets/custom_button.dart';

class AddServiceScreen extends StatelessWidget {
  const AddServiceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final nameController = TextEditingController();
    final descriptionController = TextEditingController();

    return Scaffold(
      appBar: AppBar(title: const Text('Agregar servicio')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            CustomInput(controller: nameController, label: 'Nombre del servicio'),
            const SizedBox(height: 12),
            CustomInput(controller: descriptionController, label: 'Descripción'),
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
