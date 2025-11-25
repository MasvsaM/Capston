import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class InicioAdmin extends StatefulWidget {
  const InicioAdmin({super.key});

  @override
  State<InicioAdmin> createState() => _InicioAdminState();
}

class _InicioAdminState extends State<InicioAdmin> {
  final controlPrecioPremium = TextEditingController(text: '6990');
  final controlPrecioProveedor = TextEditingController(text: '24990');
  final controlCorreoGestion = TextEditingController();
  String rolSeleccionado = 'cliente';

  Future<void> _guardarPrecios() async {
    await FirebaseFirestore.instance.collection('config').doc('precios').set({
      'premiumMensual': num.tryParse(controlPrecioPremium.text) ?? 0,
      'cuotaProveedor': num.tryParse(controlPrecioProveedor.text) ?? 0,
      'actualizadoEn': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Precios de suscripciones actualizados')),
      );
    }
  }

  Future<void> _actualizarRolUsuario() async {
    final correo = controlCorreoGestion.text.trim();
    if (correo.isEmpty) return;

    final usuarios = await FirebaseFirestore.instance
        .collection('users')
        .where('email', isEqualTo: correo)
        .limit(1)
        .get();

    if (usuarios.docs.isEmpty) return;
    final doc = usuarios.docs.first;
    await doc.reference.update({'rol': rolSeleccionado});

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Rol actualizado a "$rolSeleccionado"')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Panel de administración'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => FirebaseAuth.instance.signOut(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: const [
                _TarjetaMetrica(
                  titulo: 'Ganancias totales',
                  valor: 'CLP 1.2M',
                  icono: Icons.show_chart,
                ),
                _TarjetaMetrica(
                  titulo: 'Visitas últimas 24h',
                  valor: '4.3k',
                  icono: Icons.trending_up,
                ),
                _TarjetaMetrica(
                  titulo: 'Proveedores activos',
                  valor: '48',
                  icono: Icons.store_mall_directory,
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text('Control de precios y suscripciones',
                style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            TextField(
              controller: controlPrecioPremium,
              decoration: const InputDecoration(
                labelText: 'Precio Premium mensual (CLP)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 8),
            TextField(
              controller: controlPrecioProveedor,
              decoration: const InputDecoration(
                labelText: 'Cobro mensual a proveedores (CLP)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton.icon(
                onPressed: _guardarPrecios,
                icon: const Icon(Icons.save),
                label: const Text('Guardar precios'),
              ),
            ),
            const Divider(height: 32),
            Text('Gestión rápida de usuarios', style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            TextField(
              controller: controlCorreoGestion,
              decoration: const InputDecoration(
                labelText: 'Correo del usuario',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: rolSeleccionado,
              decoration: const InputDecoration(border: OutlineInputBorder()),
              items: const [
                DropdownMenuItem(value: 'cliente', child: Text('Cliente')),
                DropdownMenuItem(value: 'proveedor', child: Text('Proveedor')),
                DropdownMenuItem(value: 'admin', child: Text('Admin')),
              ],
              onChanged: (valor) => setState(() => rolSeleccionado = valor ?? 'cliente'),
            ),
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton.icon(
                onPressed: _actualizarRolUsuario,
                icon: const Icon(Icons.manage_accounts),
                label: const Text('Actualizar rol'),
              ),
            ),
            const Divider(height: 32),
            Card(
              child: ListTile(
                leading: const Icon(Icons.bar_chart),
                title: const Text('Gráficas de ganancias y visitas'),
                subtitle: const Text('Integra tus dashboards (BigQuery/Looker) aquí para vistas en tiempo real.'),
                trailing: TextButton(
                  onPressed: () {},
                  child: const Text('Conectar'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TarjetaMetrica extends StatelessWidget {
  const _TarjetaMetrica({
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
      width: 190,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceVariant,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: theme.colorScheme.primaryContainer,
            child: Icon(icono, color: theme.colorScheme.onPrimaryContainer),
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
