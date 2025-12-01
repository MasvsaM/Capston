import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  User? get _currentUser => FirebaseAuth.instance.currentUser;

  bool _loading = true;
  bool _isAdmin = false;
  bool _isProvider = false;
  bool _providerApproved = false;
  bool _isPremiumClient = false;
  String _email = '';
  String _name = '';

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final user = _currentUser;
    if (user == null) {
      setState(() {
        _loading = false;
      });
      return;
    }

    try {
      final doc = await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .get();

      final data = doc.data() ?? {};

      if (!mounted) return;

      final role = (data['role'] ?? 'client') as String;
      final approvalStatus =
          (data['approvalStatus'] ?? 'pending') as String;
      final isPremium = (data['isPremium'] ?? false) == true;

      setState(() {
        _email = user.email ?? '';
        _name = (data['name'] ?? '') as String;
        _isAdmin = role == 'admin';
        _isProvider = role == 'provider';
        _providerApproved = approvalStatus == 'approved';
        _isPremiumClient = isPremium;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error cargando datos: $e')),
      );
    }
  }

  Future<void> _logout() async {
    await FirebaseAuth.instance.signOut();

    if (!mounted) return;

    // Limpiamos el stack y volvemos al login
    Navigator.pushNamedAndRemoveUntil(
      context,
      '/login',
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final saludo = _name.isNotEmpty ? 'Hola, $_name' : 'Hola, $_email';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inicio'),
        actions: [
          if (_isAdmin)
            IconButton(
              tooltip: 'Panel administrador',
              icon: const Icon(Icons.admin_panel_settings),
              onPressed: () {
                Navigator.pushNamed(context, '/admin');
              },
            ),
          IconButton(
            tooltip: 'Cerrar sesión',
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: Center(
        child: _loading
            ? const CircularProgressIndicator()
            : Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    saludo,
                    style: const TextStyle(fontSize: 18),
                  ),
                  const SizedBox(height: 16),

                  // ───── ADMIN ─────
                  if (_isAdmin) ...[
                    const Text(
                      'Tienes rol de administrador.\n'
                      'Usa el ícono de escudo arriba para ir al Panel Admin.',
                      textAlign: TextAlign.center,
                    ),

                  // ───── PROVEEDOR ─────
                  ] else if (_isProvider) ...[
                    if (_providerApproved) ...[
                      const Text(
                        'Tu perfil de proveedor está aprobado.',
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton.icon(
                        onPressed: () {
                          Navigator.pushNamed(context, '/provider');
                        },
                        icon: const Icon(Icons.storefront),
                        label: const Text('Ir a mi panel de proveedor'),
                      ),
                    ] else ...[
                      const Text(
                        'Tu perfil de proveedor está en revisión.\n'
                        'Te avisaremos cuando sea aprobado.',
                        textAlign: TextAlign.center,
                      ),
                    ],

                  // ───── CLIENTE ─────
                  ] else ...[
                    Text(
                      _isPremiumClient
                          ? 'Eres cliente premium. Pronto tendrás foros,\n'
                            'recomendaciones personalizadas y mapa de servicios.'
                          : 'Eres cliente. Aquí podrás explorar servicios\n'
                            'para tus mascotas y crear perfiles.',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      onPressed: () {
                        // TODO: pantalla de exploración de servicios
                      },
                      icon: const Icon(Icons.search),
                      label: const Text('Explorar servicios'),
                    ),
                    const SizedBox(height: 8),
                    ElevatedButton.icon(
                      onPressed: () {
                        // TODO: pantalla "Mis mascotas"
                      },
                      icon: const Icon(Icons.pets),
                      label: const Text('Mis mascotas'),
                    ),
                  ],
                ],
              ),
      ),
    );
  }
}
