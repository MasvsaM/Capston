import 'package:flutter/material.dart';

class PaginaTiendaWebPay extends StatelessWidget {
  const PaginaTiendaWebPay({super.key});

  @override
  Widget build(BuildContext context) {
    final productos = [
      ('Alimento premium 10kg', 'Envio en 48h', 29990),
      ('Arnés reflectante', 'Ideal para paseos nocturnos', 15990),
      ('Juguete interactivo', 'Refuerza obediencia y reduce ansiedad', 8990),
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Tienda con WebPay y envío coordinado',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 6),
        const Text(
            'Selecciona productos, paga con WebPay y sigue el estado del despacho en el panel web.'),
        const SizedBox(height: 12),
        ...productos.map(
          (producto) => Card(
            child: ListTile(
              title: Text(producto.$1),
              subtitle: Text(producto.$2),
              trailing: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('CLP ${producto.$3}'),
                  const SizedBox(height: 4),
                  ElevatedButton(
                    onPressed: () => _mostrarPago(context, producto.$1),
                    child: const Text('Pagar WebPay'),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 12),
        Card(
          child: ListTile(
            leading: const Icon(Icons.local_shipping),
            title: const Text('Estado de envío web'),
            subtitle: const Text('Después de pagar verás un panel web con el tracking del pedido y soporte en línea.'),
            trailing: TextButton(
              onPressed: () {},
              child: const Text('Ver panel web'),
            ),
          ),
        ),
      ],
    );
  }

  void _mostrarPago(BuildContext context, String producto) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Simulación WebPay'),
        content: Text(
            'Aquí abriríamos WebPay para pagar "${producto}". Una vez aprobado, se emitirá boleta y se activará el seguimiento de envío.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cerrar'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Aceptar y continuar'),
          ),
        ],
      ),
    );
  }
}
