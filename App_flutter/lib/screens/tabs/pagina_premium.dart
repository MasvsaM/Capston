import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class PaginaPremium extends StatelessWidget {
  const PaginaPremium({super.key});

  String get idUsuario => FirebaseAuth.instance.currentUser!.uid;

  Stream<DocumentSnapshot<Map<String, dynamic>>> _usuarioStream() {
    return FirebaseFirestore.instance
        .collection('users')
        .doc(idUsuario)
        .snapshots();
  }

  Future<void> _actualizarEstado(bool activar) async {
    await FirebaseFirestore.instance
        .collection('users')
        .doc(idUsuario)
        .set(
      {
        'esPremium': activar,
        'actualizadoEn': FieldValue.serverTimestamp(),
      },
      SetOptions(merge: true),
    );
  }

  @override
  Widget build(BuildContext context) {
    final beneficios = [
      'Descuentos en tiendas aliadas y servicios WebPay',
      'Acceso a foros privados y eventos de la comunidad',
      'Alertas prioritarias de citas y urgencias',
      'Mapa destacado con rutas y parques premium',
    ];

    return StreamBuilder<DocumentSnapshot<Map<String, dynamic>>>(
      stream: _usuarioStream(),
      builder: (context, snapshot) {
        // Estado de carga inicial
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        // Error en la lectura de Firestore
        if (snapshot.hasError) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'Ocurrió un problema al cargar tu información de usuario.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Theme.of(context).colorScheme.error,
                ),
              ),
            ),
          );
        }

        final esPremium = snapshot.data?.data()?['esPremium'] == true;

        return ListView(
          padding: const EdgeInsets.all(16),
          children: [
            ListTile(
              leading: Icon(
                esPremium
                    ? Icons.workspace_premium
                    : Icons.workspace_premium_outlined,
                color: Theme.of(context).colorScheme.primary,
              ),
              title: Text(
                esPremium ? 'Eres cliente Premium' : 'Plan gratuito',
              ),
              subtitle: Text(
                esPremium
                    ? 'Disfruta tus beneficios y comparte feedback en foros.'
                    : 'Sube a premium para descuentos y contenido exclusivo.',
              ),
              trailing: ElevatedButton(
                onPressed: () => _actualizarEstado(!esPremium),
                child: Text(esPremium ? 'Cancelar' : 'Activar Premium'),
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Beneficios destacados',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            ...beneficios.map(
              (beneficio) => ListTile(
                leading: const Icon(
                  Icons.check_circle,
                  color: Colors.teal,
                ),
                title: Text(beneficio),
              ),
            ),
            const SizedBox(height: 12),
            Card(
              child: ListTile(
                title: const Text('Pagos con WebPay'),
                subtitle: const Text(
                  'Al activar Premium puedes pagar servicios, foros VIP y compras de tienda con WebPay y recibir seguimiento del envío.',
                ),
                trailing: const Icon(Icons.payment),
              ),
            ),
          ],
        );
      },
    );
  }
}
