import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../models/service_blocks.dart';
import 'provider_home.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _loading = true;
  DocumentSnapshot<Map<String, dynamic>>? _userDoc;

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      setState(() => _loading = false);
      return;
    }

    try {
      final doc = await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .get();

      if (!mounted) return;
      setState(() {
        _userDoc = doc;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
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

    final user = FirebaseAuth.instance.currentUser;
    final data = _userDoc?.data() ?? {};
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

    // Inicio genérico para clientes / otros roles
    return Scaffold(
      appBar: AppBar(
        title: const Text('Inicio'),
      ),
      body: Center(
        child: Text(
          'Hola, $displayName',
          style: const TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}

/// ---------- INICIO ESPECIAL PARA PROVEEDOR ----------
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
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // el HomeScreen se recarga solo al reconstruirse,
          // aquí solo hacemos una pequeña pausa para el efecto
          await Future<void>.delayed(const Duration(milliseconds: 400));
        },
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          children: [
            // Saludo principal
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

            // Resumen del negocio
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

            // Lista de servicios principales
            const Text(
              'Servicios que ofreces',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            if (enabledBlocks.isEmpty)
              const Text(
                'Aún no tienes servicios configurados.\n'
                'Puedes configurarlos desde el panel de proveedor.',
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

            // Botón para ir al panel completo (con navbar)
            Center(
              child: FilledButton.icon(
                onPressed: () {
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
