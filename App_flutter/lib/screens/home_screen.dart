import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../models/service_blocks.dart';
import 'provider_home.dart'; // ProviderHomeScreen

Future<void> _signOut(BuildContext context) async {
  await FirebaseAuth.instance.signOut();
  Navigator.of(context).pushNamedAndRemoveUntil(
    '/login',
    (route) => false,
  );
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _loading = true;
  Map<String, dynamic>? _userData;
  User? _user;

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      setState(() {
        _loading = false;
        _userData = null;
      });
      return;
    }

    try {
      final doc = await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .get();

      if (!mounted) return;

      setState(() {
        _user = user;
        _userData = doc.data() ?? {};
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _user = user;
        _userData = {};
        _loading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('No se pudo cargar tu perfil: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final user = _user;
    final data = _userData ?? {};
    final role = (data['role'] as String?) ?? 'client';

    final displayName = user?.displayName ??
        (data['name'] as String?) ??
        user?.email ??
        'Usuario';

    if (role == 'provider') {
      return ProviderOverviewHome(
        userName: displayName,
        userData: data,
      );
    }

    if (role == 'admin') {
      return AdminOverviewHome(userName: displayName);
    }

    // Vista simple de cliente (se puede mejorar después)
    return ClientOverviewHome(userName: displayName);
  }
}

/// ---------- INICIO PARA PROVEEDOR ----------
class ProviderOverviewHome extends StatelessWidget {
  final String userName;
  final Map<String, dynamic> userData;

  const ProviderOverviewHome({
    super.key,
    required this.userName,
    required this.userData,
  });

  @override
  Widget build(BuildContext context) {
    final businessName = (userData['businessName'] as String?) ?? '';
    final approvalStatus = (userData['approvalStatus'] as String?) ?? 'pending';
    final openTime = (userData['openTime'] as String?) ?? '';
    final closeTime = (userData['closeTime'] as String?) ?? '';

    // Servicios configurados (servicesConfig)
    final rawConfigs = userData['servicesConfig'] as List<dynamic>? ?? [];
    final enabledServiceIds = <String>{};

    for (final item in rawConfigs) {
      if (item is Map) {
        final map = Map<String, dynamic>.from(item as Map);
        final enabled = map['enabled'] as bool? ?? false;
        final id = map['serviceId'] as String? ?? '';
        if (enabled && id.isNotEmpty) {
          enabledServiceIds.add(id);
        }
      }
    }

    final enabledBlocks = kServiceBlocks
        .where((b) => enabledServiceIds.contains(b.id))
        .toList();

    final isApproved = approvalStatus == 'approved';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inicio'),
        actions: [
          IconButton(
            tooltip: 'Cerrar sesión',
            icon: const Icon(Icons.logout),
            onPressed: () => _signOut(context),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // Aquí podríamos recargar desde Firestore si queremos
          await Future<void>.delayed(const Duration(milliseconds: 400));
        },
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              'Hola, $userName',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              isApproved
                  ? 'Tu perfil de proveedor está aprobado.'
                  : 'Tu perfil de proveedor está en revisión.',
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),

            // Resumen negocio
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    const CircleAvatar(
                      radius: 24,
                      child: Icon(Icons.storefront),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            businessName.isEmpty
                                ? 'Negocio sin nombre'
                                : businessName,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          if (openTime.isNotEmpty || closeTime.isNotEmpty)
                            Text(
                              'Horario: '
                              '${openTime.isNotEmpty ? openTime : '--:--'}'
                              ' – '
                              '${closeTime.isNotEmpty ? closeTime : '--:--'}',
                              style: const TextStyle(color: Colors.black54),
                            ),
                          Text(
                            'Servicios activos: ${enabledBlocks.length}',
                            style: const TextStyle(color: Colors.black54),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            const Text(
              'Servicios que ofreces',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            if (enabledBlocks.isEmpty)
              const Text(
                'Aún no tienes servicios configurados.\n'
                'Puedes configurarlos desde tu panel de proveedor.',
              )
            else
              ...enabledBlocks.map(
                (block) => ListTile(
                  leading: const Icon(Icons.pets),
                  title: Text(block.name),
                  subtitle: Text(block.description),
                ),
              ),

            const SizedBox(height: 24),

            Center(
              child: FilledButton.icon(
                onPressed: () {
                  // AHORA: navegación directa al panel con navbar
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const ProviderHomeScreen(),
                    ),
                  );
                },
                icon: const Icon(Icons.dashboard),
                label: const Text('Ir a mi panel de proveedor'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ---------- INICIO PARA ADMIN ----------
class AdminOverviewHome extends StatelessWidget {
  final String userName;

  const AdminOverviewHome({super.key, required this.userName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Inicio admin'),
        actions: [
          IconButton(
            tooltip: 'Cerrar sesión',
            icon: const Icon(Icons.logout),
            onPressed: () => _signOut(context),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Hola, $userName',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Aquí podrás revisar solicitudes de proveedores, aprobar cuentas, '
              'y ver estadísticas generales (pendiente de implementar).',
            ),
          ],
        ),
      ),
    );
  }
}

/// ---------- INICIO PARA CLIENTE ----------
class ClientOverviewHome extends StatelessWidget {
  final String userName;

  const ClientOverviewHome({super.key, required this.userName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Inicio'),
        actions: [
          IconButton(
            tooltip: 'Cerrar sesión',
            icon: const Icon(Icons.logout),
            onPressed: () => _signOut(context),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Hola, $userName',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Pronto verás aquí recomendaciones de servicios para tus mascotas, '
              'tu actividad reciente y accesos rápidos a tus favoritos.',
            ),
          ],
        ),
      ),
    );
  }
}
