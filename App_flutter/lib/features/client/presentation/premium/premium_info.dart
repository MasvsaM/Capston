import 'package:flutter/material.dart';
import 'premium_pay.dart';

class PremiumInfoScreen extends StatelessWidget {
  const PremiumInfoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Beneficios premium', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Accede a servicios exclusivos y soporte prioritario'),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const PremiumPayScreen()),
              ),
              child: const Text('Actualizar'),
            ),
          ],
        ),
      ),
    );
  }
}
