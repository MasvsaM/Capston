import 'package:flutter/material.dart';

import '../models/service_blocks.dart';

class ServiceBlocksSelector extends StatelessWidget {
  final Map<String, bool> selectedServices;
  final ValueChanged<Map<String, bool>> onChanged;

  const ServiceBlocksSelector({
    super.key,
    required this.selectedServices,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Servicios que ofreces',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: kServiceBlocks.map((block) {
            final isSelected = selectedServices[block.id] ?? false;
            return FilterChip(
              label: Text(block.name),
              selected: isSelected,
              onSelected: (value) {
                final updated = Map<String, bool>.from(selectedServices);
                if (value) {
                  updated[block.id] = true;
                } else {
                  updated.remove(block.id);
                }
                onChanged(updated);
              },
            );
          }).toList(),
        ),
        const SizedBox(height: 8),
        const Text(
          'Estos servicios se usarán para construir tu panel de proveedor en bloques '
          '(reservas, agenda, catálogo, etc.).',
          style: TextStyle(fontSize: 12, color: Colors.black54),
        ),
      ],
    );
  }
}
