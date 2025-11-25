import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class InicioProveedores extends StatefulWidget {
  const InicioProveedores({super.key});

  @override
  State<InicioProveedores> createState() => _InicioProveedoresState();
}

class _InicioProveedoresState extends State<InicioProveedores> {
  final controladorServicioPrincipal = TextEditingController();
  final controladorDetalleServicios = TextEditingController();
  final controladorZona = TextEditingController();
  final controladorCostos = TextEditingController();
  bool suscripcionActiva = true;

  String get idProveedor => FirebaseAuth.instance.currentUser!.uid;

  Future<DocumentSnapshot<Map<String, dynamic>>> _cargarPerfil() {
    return FirebaseFirestore.instance
        .collection('proveedores')
        .doc(idProveedor)
        .get();
  }

  Stream<QuerySnapshot<Map<String, dynamic>>> _microservicios() {
    return FirebaseFirestore.instance
        .collection('proveedores')
        .doc(idProveedor)
        .collection('microservicios')
        .orderBy('creadoEn', descending: false)
        .snapshots();
  }

  double _calcularMargen(num ingresos, num costos) {
    if (ingresos <= 0) return 0;
    final margen = (ingresos - costos) / ingresos * 100;
    return margen.isNaN ? 0 : margen;
  }

  Future<void> _guardarPerfilBasico() async {
    await FirebaseFirestore.instance
        .collection('proveedores')
        .doc(idProveedor)
        .set(
      {
        'servicioPrincipal': controladorServicioPrincipal.text.trim(),
        'detalleServicios': controladorDetalleServicios.text.trim(),
        'zonaCobertura': controladorZona.text.trim(),
        'costosOperativos':
            num.tryParse(controladorCostos.text.trim()) ?? 0,
        'suscripcionActiva': suscripcionActiva,
        'actualizadoEn': FieldValue.serverTimestamp(),
      },
      SetOptions(merge: true),
    );

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Perfil de proveedor actualizado')),
      );
    }
  }

  Future<void> _abrirDialogoMicroservicio({
    DocumentSnapshot<Map<String, dynamic>>? microservicio,
  }) async {
    final controladorTitulo = TextEditingController(
      text: microservicio?.data()?['nombre'] ?? '',
    );
    final controladorPrecio = TextEditingController(
      text: microservicio?.data()?['precio']?.toString() ?? '',
    );
    final controladorDescripcion = TextEditingController(
      text: microservicio?.data()?['descripcion'] ?? '',
    );

    final esEdicion = microservicio != null;

    await showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(esEdicion ? 'Editar microservicio' : 'Nuevo microservicio'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: controladorTitulo,
                  decoration: const InputDecoration(
                    labelText: 'Nombre',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: controladorPrecio,
                  decoration: const InputDecoration(
                    labelText: 'Precio CLP',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: controladorDescripcion,
                  decoration: const InputDecoration(
                    labelText: 'Descripción breve',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 2,
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancelar'),
            ),
            ElevatedButton(
              onPressed: () async {
                if (controladorTitulo.text.trim().isEmpty) return;

                final referencia = FirebaseFirestore.instance
                    .collection('proveedores')
                    .doc(idProveedor)
                    .collection('microservicios');

                final datos = {
                  'nombre': controladorTitulo.text.trim(),
                  'precio':
                      num.tryParse(controladorPrecio.text.trim()) ?? 0,
                  'descripcion': controladorDescripcion.text.trim(),
                  'creadoEn': FieldValue.serverTimestamp(),
                };

                if (esEdicion) {
                  await referencia
                      .doc(microservicio!.id)
                      .set(datos, SetOptions(merge: true));
                } else {
                  await referencia.add(datos);
                }

                if (context.mounted) Navigator.pop(context);
              },
              child: Text(esEdicion ? 'Guardar' : 'Crear'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _eliminarMicroservicio(String id) async {
    await FirebaseFirestore.instance
        .collection('proveedores')
        .doc(idProveedor)
        .collection('microservicios')
        .doc(id)
        .delete();
  }

  @override
  void dispose() {
    controladorServicioPrincipal.dispose();
    controladorDetalleServicios.dispose();
    controladorZona.dispose();
    controladorCostos.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Panel del proveedor'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => FirebaseAuth.instance.signOut(),
            tooltip: 'Cerrar sesión',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        icon: const Icon(Icons.add_circle_outline),
        label: const Text('Microservicio'),
        onPressed: () => _abrirDialogoMicroservicio(),
      ),
      body: FutureBuilder<DocumentSnapshot<Map<String, dynamic>>>(
        future: _cargarPerfil(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final datos = snapshot.data?.data() ?? {};

          controladorServicioPrincipal.text =
              controladorServicioPrincipal.text.isNotEmpty
                  ? controladorServicioPrincipal.text
                  : (datos['servicioPrincipal'] ?? '');

          controladorDetalleServicios.text =
              controladorDetalleServicios.text.isNotEmpty
                  ? controladorDetalleServicios.text
                  : (datos['detalleServicios'] ?? '');

          controladorZona.text = controladorZona.text.isNotEmpty
              ? controladorZona.text
              : (datos['zonaCobertura'] ?? '');

          controladorCostos.text = controladorCostos.text.isNotEmpty
              ? controladorCostos.text
              : (datos['costosOperativos']?.toString() ?? '');

          suscripcionActiva = datos['suscripcionActiva'] ?? true;

          final ingresos = datos['ingresosAcumulados'] ?? 0;
          final costos = datos['costosOperativos'] ?? 0;
          final microserviciosIniciales =
              (datos['microservicios'] as List?) ?? const [];
          final margen = _calcularMargen(ingresos, costos);

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Configura tu servicio principal',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: controladorServicioPrincipal,
                  decoration: const InputDecoration(
                    labelText: 'Servicio principal',
                    hintText: 'Ejemplo: Veterinaria integral',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: controladorDetalleServicios,
                  decoration: const InputDecoration(
                    labelText: 'Especialidades y microservicios',
                    hintText: 'Urgencias, vacunas, baño, hotel, paseos…',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 2,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: controladorZona,
                  decoration: const InputDecoration(
                    labelText: 'Zona de cobertura',
                    hintText: 'Parques, comunas, radio en km',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: controladorCostos,
                  decoration: const InputDecoration(
                    labelText: 'Costos operativos mensuales (CLP)',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 8),
                SwitchListTile.adaptive(
                  title: const Text('Suscripción activa'),
                  subtitle: const Text(
                      'Controla la visibilidad de tus servicios'),
                  value: suscripcionActiva,
                  onChanged: (valor) =>
                      setState(() => suscripcionActiva = valor),
                ),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _guardarPerfilBasico,
                    icon: const Icon(Icons.save),
                    label: const Text('Guardar perfil y precios base'),
                  ),
                ),
                const SizedBox(height: 20),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: [
                    _TarjetaIndicador(
                      titulo: 'Ingresos acumulados',
                      valor: 'CLP $ingresos',
                      icono: Icons.payments,
                    ),
                    _TarjetaIndicador(
                      titulo: 'Margen estimado',
                      valor: '${margen.toStringAsFixed(1)}%',
                      icono: Icons.trending_up,
                    ),
                    _TarjetaIndicador(
                      titulo: 'Microservicios publicados',
                      valor: microserviciosIniciales.length.toString(),
                      icono: Icons.design_services,
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Microservicios personalizados',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
                  stream: _microservicios(),
                  builder: (context, microSnapshot) {
                    if (microSnapshot.connectionState ==
                        ConnectionState.waiting) {
                      return const Center(
                        child: Padding(
                          padding: EdgeInsets.all(12),
                          child: CircularProgressIndicator(),
                        ),
                      );
                    }

                    final docs = microSnapshot.data?.docs ?? [];
                    if (docs.isEmpty) {
                      return const Text(
                        'Aún no tienes microservicios. Crea uno con el botón flotante.',
                      );
                    }

                    return Column(
                      children: docs
                          .map(
                            (doc) => Card(
                              child: ListTile(
                                title: Text(doc['nombre'] ?? ''),
                                subtitle: Text(
                                  '${doc['descripcion'] ?? ''}\nCLP ${doc['precio'] ?? 0}',
                                ),
                                isThreeLine: true,
                                trailing: Wrap(
                                  spacing: 6,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.edit),
                                      onPressed: () =>
                                          _abrirDialogoMicroservicio(
                                              microservicio: doc),
                                    ),
                                    IconButton(
                                      icon: const Icon(
                                        Icons.delete,
                                        color: Colors.redAccent,
                                      ),
                                      onPressed: () =>
                                          _eliminarMicroservicio(doc.id),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          )
                          .toList(),
                    );
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _TarjetaIndicador extends StatelessWidget {
  const _TarjetaIndicador({
    required this.titulo,
    required this.valor,
    required this.icono,
  });

  final String titulo;
  final String valor;
  final IconData icono;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      width: 200,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceVariant,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: theme.colorScheme.primaryContainer,
            child: Icon(
              icono,
              color: theme.colorScheme.onPrimaryContainer,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(titulo, style: theme.textTheme.labelMedium),
                Text(
                  valor,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
