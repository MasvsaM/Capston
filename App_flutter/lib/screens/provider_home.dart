import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../models/service_blocks.dart';
import '../models/provider_service_config.dart';

import 'provider_settings.dart';
import 'provider_bookings_screen.dart';
import 'provider_catalog_screen.dart';
import 'provider_schedule_screen.dart';
import 'provider_home_visits_screen.dart';
import 'provider_wallet_screen.dart';

Future<void> _signOutProvider(BuildContext context) async {
  await FirebaseAuth.instance.signOut();
  Navigator.of(context).pushNamedAndRemoveUntil(
    '/login',
    (route) => false,
  );
}

class ProviderHomeScreen extends StatefulWidget {
  const ProviderHomeScreen({super.key});

  @override
  State<ProviderHomeScreen> createState() => _ProviderHomeScreenState();
}

class _ProviderHomeScreenState extends State<ProviderHomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    const titles = [
      'Panel de proveedor',
      'Wallet',
      'Configuración',
    ];

    final pages = const [
      ProviderDashboardTab(),
      ProviderWalletScreen(),
      ProviderConfigTab(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(titles[_currentIndex]),
        actions: [
          IconButton(
            tooltip: 'Cerrar sesión',
            icon: const Icon(Icons.logout),
            onPressed: () => _signOutProvider(context),
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'Servicios',
          ),
          NavigationDestination(
            icon: Icon(Icons.account_balance_wallet_outlined),
            selectedIcon: Icon(Icons.account_balance_wallet),
            label: 'Wallet',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings),
            label: 'Config.',
          ),
        ],
      ),
    );
  }
}

/// --------- TAB 1: DASHBOARD ---------
class ProviderDashboardTab extends StatefulWidget {
  const ProviderDashboardTab({super.key});

  @override
  State<ProviderDashboardTab> createState() => _ProviderDashboardTabState();
}

class _ProviderDashboardTabState extends State<ProviderDashboardTab> {
  bool _loading = true;
  String _businessName = 'Mi negocio';
  String _businessDescription = '';
  String _logoUrl = '';
  String _openTime = '';
  String _closeTime = '';
  List<ProviderServiceConfig> _configs = [];

  // KPIs simples
  int _totalProducts = 0;
  int _totalBookings = 0;
  bool _loadingStats = true;

  @override
  void initState() {
    super.initState();
    _loadProviderData();
    _loadStats();
  }

  Future<void> _loadProviderData() async {
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

      final data = doc.data() ?? {};
      final rawConfigs = data['servicesConfig'] as List<dynamic>?;

      final Map<String, ProviderServiceConfig> configsMap = {};

      if (rawConfigs != null && rawConfigs.isNotEmpty) {
        for (final item in rawConfigs) {
          Map<String, dynamic> map;
          if (item is Map<String, dynamic>) {
            map = item;
          } else if (item is Map) {
            map = Map<String, dynamic>.from(item as Map);
          } else {
            continue;
          }

          final config = ProviderServiceConfig.fromMap(map);
          if (config.serviceId.isNotEmpty) {
            configsMap[config.serviceId] = config;
          }
        }
      } else {
        // compatibilidad con versión antigua: lista simple de ids en `services`
        final rawServices = (data['services'] ?? []) as List<dynamic>;
        final serviceIds = rawServices.cast<String>();
        for (final block in kServiceBlocks) {
          final enabled = serviceIds.contains(block.id);
          configsMap[block.id] = ProviderServiceConfig.fromServiceBlock(
            block,
            enabled: enabled,
          );
        }
      }

      // Aseguramos que todos los bloques existan aunque estén desactivados
      for (final block in kServiceBlocks) {
        configsMap.putIfAbsent(
          block.id,
          () => ProviderServiceConfig.fromServiceBlock(block, enabled: false),
        );
      }

      final businessName = (data['businessName'] as String?) ?? '';
      final businessDescription =
          (data['businessDescription'] as String?) ?? '';

      if (!mounted) return;
      setState(() {
        _businessName =
            businessName.trim().isEmpty ? 'Mi negocio' : businessName.trim();
        _businessDescription = businessDescription.trim();
        _logoUrl = (data['logoUrl'] as String?) ?? '';
        _openTime = (data['openTime'] as String?) ?? '';
        _closeTime = (data['closeTime'] as String?) ?? '';
        _configs = configsMap.values.toList();
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error cargando datos de proveedor: $e')),
      );
    }
  }

  Future<void> _loadStats() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      setState(() => _loadingStats = false);
      return;
    }

    try {
      final firestore = FirebaseFirestore.instance;

      final productsSnap = await firestore
          .collection('products')
          .where('providerId', isEqualTo: user.uid)
          .get();

      final bookingsSnap = await firestore
          .collection('bookings')
          .where('providerId', isEqualTo: user.uid)
          .get();

      if (!mounted) return;
      setState(() {
        _totalProducts = productsSnap.docs.length;
        _totalBookings = bookingsSnap.docs.length;
        _loadingStats = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loadingStats = false);
      // si falla, solo no mostramos stats, no rompemos la pantalla
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    final activeConfigs = _configs.where((c) => c.enabled).toList();

    final showBookings = activeConfigs.any((c) => c.useBookings);
    final showCatalog = activeConfigs.any((c) => c.useCatalog);
    final showHomeVisits = activeConfigs.any((c) => c.useHomeVisits);

    return RefreshIndicator(
      onRefresh: () async {
        await _loadProviderData();
        await _loadStats();
      },
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            children: [
              if (_logoUrl.isNotEmpty)
                CircleAvatar(
                  radius: 28,
                  backgroundImage: NetworkImage(_logoUrl),
                  onBackgroundImageError: (_, __) {},
                )
              else
                const CircleAvatar(
                  radius: 28,
                  child: Icon(Icons.storefront),
                ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _businessName,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (_businessDescription.isNotEmpty)
                      Text(
                        _businessDescription,
                        style: const TextStyle(color: Colors.black54),
                      ),
                    if (_openTime.isNotEmpty || _closeTime.isNotEmpty)
                      Text(
                        'Horario: ${_openTime.isNotEmpty ? _openTime : '--:--'}'
                        ' – ${_closeTime.isNotEmpty ? _closeTime : '--:--'}',
                        style: const TextStyle(color: Colors.black87),
                      ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),
          const Text(
            'Resumen rápido',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),

          if (_loadingStats)
            const LinearProgressIndicator()
          else
            Row(
              children: [
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Reservas totales',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.black54,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '$_totalBookings',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Productos en catálogo',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.black54,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '$_totalProducts',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

          const SizedBox(height: 16),
          const Text(
            'Gestión rápida',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),

          if (showBookings)
            Card(
              child: ListTile(
                leading: const Icon(Icons.event_available),
                title: const Text('Agenda y reservas'),
                subtitle:
                    const Text('Ver bloques disponibles, reservados y completados.'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const ProviderBookingsScreen(),
                    ),
                  );
                },
              ),
            ),

          Card(
            child: ListTile(
              leading: const Icon(Icons.schedule),
              title: const Text('Agenda y horarios'),
              subtitle: const Text(
                'Configura tus horarios y la duración de cada bloque.',
              ),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const ProviderScheduleScreen(),
                  ),
                );
              },
            ),
          ),

          if (showHomeVisits)
            Card(
              child: ListTile(
                leading: const Icon(Icons.directions_walk),
                title: const Text('Servicios a domicilio'),
                subtitle: const Text(
                  'Define zona de cobertura, tarifas y tiempos de traslado.',
                ),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const ProviderHomeVisitsScreen(),
                    ),
                  );
                },
              ),
            ),

          if (showCatalog)
            Card(
              child: ListTile(
                leading: const Icon(Icons.inventory_2),
                title: const Text('Catálogo de productos/servicios'),
                subtitle: const Text(
                  'Administra productos, stock, precios y etiquetas.',
                ),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const ProviderCatalogScreen(),
                    ),
                  );
                },
              ),
            ),

          const SizedBox(height: 16),
          const Text(
            'Servicios configurados',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),

          if (activeConfigs.isEmpty)
            const Text(
              'Aún no tienes bloques activos.\n'
              'Ve a Configuración para definir qué servicios ofreces.',
            )
          else
            ...activeConfigs.map((c) {
              final block = kServiceBlocks.firstWhere(
                (b) => b.id == c.serviceId,
                orElse: () => kServiceBlocks.first,
              );
              final price = c.basePrice;
              final discount = c.discountPercent;

              return ListTile(
                leading: const Icon(Icons.pets),
                title: Text(block.name),
                subtitle: Text(block.description),
                trailing: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    if (price != null)
                      Text(
                        '\$${price.toStringAsFixed(0)}',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    if (discount != null)
                      Text(
                        '-${discount.toStringAsFixed(0)}%',
                        style: const TextStyle(color: Colors.green),
                      ),
                  ],
                ),
              );
            }).toList(),
        ],
      ),
    );
  }
}

/// --------- TAB 3: CONFIGURACIÓN ---------
class ProviderConfigTab extends StatelessWidget {
  const ProviderConfigTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Configuración del negocio',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Card(
          child: ListTile(
            leading: const Icon(Icons.store),
            title: const Text('Datos del negocio y servicios'),
            subtitle: const Text(
              'Nombre, descripción, servicios ofrecidos, precios base, etc.',
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const ProviderSettingsScreen(),
                ),
              );
            },
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.schedule),
            title: const Text('Agenda y horarios'),
            subtitle: const Text(
              'Define tus horarios de trabajo y bloques de atención.',
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const ProviderScheduleScreen(),
                ),
              );
            },
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.directions_walk),
            title: const Text('Servicios a domicilio'),
            subtitle: const Text(
              'Cobertura, tarifas de desplazamiento y capacidad diaria.',
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const ProviderHomeVisitsScreen(),
                ),
              );
            },
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.inventory_2),
            title: const Text('Catálogo de productos/servicios'),
            subtitle: const Text(
              'Administra tu catálogo, stock y precios.',
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const ProviderCatalogScreen(),
                ),
              );
            },
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.event),
            title: const Text('Agenda y reservas'),
            subtitle: const Text(
              'Revisa y gestiona tus reservas.',
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const ProviderBookingsScreen(),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
