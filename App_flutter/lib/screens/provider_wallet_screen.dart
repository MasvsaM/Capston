import 'package:flutter/material.dart';

class ProviderWalletScreen extends StatelessWidget {
  const ProviderWalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: ListTile(
            leading: const Icon(Icons.account_balance_wallet),
            title: const Text('Saldo estimado'),
            subtitle: const Text(
              'Más adelante podrás ver tus ingresos reales, retiros y comisiones.',
            ),
            trailing: Text(
              '\$0',
              style: Theme.of(context).textTheme.titleLarge,
            ),
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Resumen rápido',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Card(
          child: ListTile(
            leading: const Icon(Icons.trending_up),
            title: const Text('Ingresos del mes'),
            subtitle: const Text(
              'Cuando conectemos pagos, aquí verás el total del mes.',
            ),
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.receipt_long),
            title: const Text('Historial de movimientos'),
            subtitle: const Text(
              'Pagos recibidos, reembolsos y retiros aparecerán aquí.',
            ),
          ),
        ),
      ],
    );
  }
}
