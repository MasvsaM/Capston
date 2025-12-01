class ServiceBlock {
  final String id;
  final String name;
  final String description;
  final bool enableBookings;
  final bool enableCatalog;
  final bool enableHomeVisits;

  const ServiceBlock({
    required this.id,
    required this.name,
    required this.description,
    this.enableBookings = false,
    this.enableCatalog = false,
    this.enableHomeVisits = false,
  });
}

const List<ServiceBlock> kServiceBlocks = [
  ServiceBlock(
    id: 'walking',
    name: 'Paseo de mascotas',
    description: 'Salidas programadas, paseo diario, dog walker.',
    enableBookings: true,
    enableHomeVisits: true,
  ),
  ServiceBlock(
    id: 'pet_sitting',
    name: 'Cuidado a domicilio',
    description: 'Cuidado en casa del cliente, visitas programadas.',
    enableBookings: true,
    enableHomeVisits: true,
  ),
  ServiceBlock(
    id: 'grooming',
    name: 'Baño y peluquería',
    description: 'Baño, corte, spa de mascotas.',
    enableBookings: true,
  ),
  ServiceBlock(
    id: 'boarding',
    name: 'Hospedaje / guardería',
    description: 'Pernocta o estadía por día en el local o casa.',
    enableBookings: true,
  ),
  ServiceBlock(
    id: 'training',
    name: 'Adiestramiento',
    description: 'Clases de obediencia, conducta, entrenamiento.',
    enableBookings: true,
  ),
  ServiceBlock(
    id: 'shop',
    name: 'Venta de productos',
    description: 'Alimentos, accesorios, juguetes, etc.',
    enableCatalog: true,
  ),
];
