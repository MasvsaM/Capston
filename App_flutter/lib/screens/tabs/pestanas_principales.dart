import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import 'pagina_mascotas.dart';
import 'pagina_explorar.dart';
import 'pagina_foros.dart';
import 'pagina_premium.dart';
import 'pagina_tienda_webpay.dart';

class PestanasPrincipales extends StatefulWidget {
  const PestanasPrincipales({super.key});

  @override
  State<PestanasPrincipales> createState() => _PestanasPrincipalesState();
}

class _PestanasPrincipalesState extends State<PestanasPrincipales> {
  final claveMascotas = GlobalKey<PaginaMascotasState>();
  int indiceSeleccionado = 0;

  late final paginas = <Widget>[
    PaginaMascotas(key: claveMascotas),
    const PaginaExplorar(),
    const PaginaForos(),
    const PaginaPremium(),
    const PaginaTiendaWebPay(),
  ];

  final titulosPestanas = const [
    'Mascotas',
    'Explorar',
    'Foros',
    'Premium',
    'Tienda',
  ];

  @override
  Widget build(BuildContext context) {
    final mostrarBoton = indiceSeleccionado == 0;

    return Scaffold(
      appBar: AppBar(
        title: Text(titulosPestanas[indiceSeleccionado]),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Cerrar sesión',
            onPressed: () => FirebaseAuth.instance.signOut(),
          ),
        ],
      ),
      body: IndexedStack(
        index: indiceSeleccionado,
        children: paginas,
      ),
      floatingActionButton: mostrarBoton
          ? FloatingActionButton(
              onPressed: () =>
                  claveMascotas.currentState?.abrirDialogoCreacion(),
              child: const Icon(Icons.add),
            )
          : null,
      bottomNavigationBar: NavigationBar(
        selectedIndex: indiceSeleccionado,
        onDestinationSelected: (valor) =>
            setState(() => indiceSeleccionado = valor),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.pets_outlined),
            selectedIcon: Icon(Icons.pets),
            label: 'Mascotas',
          ),
          NavigationDestination(
            icon: Icon(Icons.location_on_outlined),
            selectedIcon: Icon(Icons.location_on),
            label: 'Explorar',
          ),
          NavigationDestination(
            icon: Icon(Icons.forum_outlined),
            selectedIcon: Icon(Icons.forum),
            label: 'Foros',
          ),
          NavigationDestination(
            icon: Icon(Icons.workspace_premium_outlined),
            selectedIcon: Icon(Icons.workspace_premium),
            label: 'Premium',
          ),
          NavigationDestination(
            icon: Icon(Icons.shopping_bag_outlined),
            selectedIcon: Icon(Icons.shopping_bag),
            label: 'Tienda',
          ),
        ],
      ),
    );
  }
}
