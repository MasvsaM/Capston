import 'package:flutter/material.dart';

class PaginaExplorar extends StatelessWidget {
  const PaginaExplorar({super.key});

  @override
  Widget build(BuildContext context) {
    final tiendas = [
      ('Tienda Pet Lovers', 'Descuentos en accesorios y snacks saludables'),
      ('Vet Express', 'Medicamentos a domicilio en 24h'),
    ];
    final parques = [
      ('Parque Central', 'Zona pet friendly, bebederos y sombra'),
      ('Plaza Verde', 'Circuito de agility y área de descanso'),
    ];
    final servicios = [
      ('Groomers 24/7', 'Baño, corte, deslanado y spa'),
      ('Paseadores seguros', 'Rutas geolocalizadas y reporte en tiempo real'),
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Explora tiendas, parques y servicios cercanos',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 8),
        const Text(
          'Activa la ubicación en tu dispositivo para ordenar por proximidad. Los clientes premium verán descuentos exclusivos y rutas destacadas.',
        ),
        const SizedBox(height: 16),
        _SeccionLista(
          titulo: 'Tiendas aliadas',
          icono: Icons.storefront,
          elementos: tiendas,
          accion: 'Ver catálogo',
        ),
        _SeccionLista(
          titulo: 'Parques y plazas',
          icono: Icons.park,
          elementos: parques,
          accion: 'Ver cómo llegar',
        ),
        _SeccionLista(
          titulo: 'Servicios cercanos',
          icono: Icons.medical_services,
          elementos: servicios,
          accion: 'Solicitar turno',
        ),
        const SizedBox(height: 16),
        Card(
          child: ListTile(
            leading: const Icon(Icons.location_searching),
            title: const Text('Solicita un servicio puntual'),
            subtitle: const Text(
                'Comparte tu ubicación y la necesidad (ej. “baño express” o “consulta de urgencia”). El proveedor recibirá tu pedido con WebPay listo para pagar.'),
            trailing: ElevatedButton(
              onPressed: () {},
              child: const Text('Enviar requerimiento'),
            ),
          ),
        ),
      ],
    );
  }
}

class _SeccionLista extends StatelessWidget {
  const _SeccionLista({
    required this.titulo,
    required this.icono,
    required this.elementos,
    required this.accion,
  });

  final String titulo;
  final IconData icono;
  final List<(String, String)> elementos;
  final String accion;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 6),
          child: Row(
            children: [
              Icon(icono, color: Theme.of(context).colorScheme.primary),
              const SizedBox(width: 6),
              Text(
                titulo,
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
            ],
          ),
        ),
        ...elementos.map(
          (item) => Card(
            child: ListTile(
              title: Text(item.$1),
              subtitle: Text(item.$2),
              trailing: TextButton(
                onPressed: () {},
                child: Text(accion),
              ),
            ),
          ),
        ),
        const SizedBox(height: 10),
      ],
    );
  }
}
