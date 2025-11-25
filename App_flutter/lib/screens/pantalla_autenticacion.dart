import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class PantallaAutenticacion extends StatefulWidget {
  const PantallaAutenticacion({super.key});

  @override
  State<PantallaAutenticacion> createState() => _PantallaAutenticacionState();
}

class _PantallaAutenticacionState extends State<PantallaAutenticacion> {
  final controlCorreo = TextEditingController();
  final controlContrasena = TextEditingController();
  final controlServicioPrincipal = TextEditingController();
  final controlDetalleServicios = TextEditingController();
  final controlCobertura = TextEditingController();
  bool modoLogin = true; // true = login, false = registro
  String rolSeleccionado = 'cliente';
  bool cargando = false;

  Future<void> _enviarFormulario() async {
    setState(() => cargando = true);
    try {
      if (modoLogin) {
        // INICIAR SESIÓN
        await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: controlCorreo.text.trim(),
          password: controlContrasena.text.trim(),
        );
      } else {
        // REGISTRAR USUARIO
        final cred = await FirebaseAuth.instance
            .createUserWithEmailAndPassword(
          email: controlCorreo.text.trim(),
          password: controlContrasena.text.trim(),
        );

        await FirebaseFirestore.instance
            .collection('users')
            .doc(cred.user!.uid)
            .set({
              'uid': cred.user!.uid,
              'email': controlCorreo.text.trim(),
              'rol': rolSeleccionado, // 'cliente' o 'proveedor'
              'esPremium': false,
              'creadoEn': FieldValue.serverTimestamp(),
            });

        if (rolSeleccionado == 'proveedor') {
          await FirebaseFirestore.instance
              .collection('proveedores')
              .doc(cred.user!.uid)
              .set({
                'servicioPrincipal': controlServicioPrincipal.text.trim(),
                'detalleServicios': controlDetalleServicios.text.trim(),
                'zonaCobertura': controlCobertura.text.trim(),
                'microservicios': [],
                'ingresosAcumulados': 0,
                'suscripcionActiva': true,
                'creadoEn': FieldValue.serverTimestamp(),
              });
        }
      }
    } on FirebaseAuthException catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message ?? 'Error de autenticación')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      if (mounted) setState(() => cargando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 400),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'MarketPet',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  modoLogin
                      ? 'Inicia sesión para continuar'
                      : 'Crea tu cuenta',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: controlCorreo,
                  decoration: const InputDecoration(
                    labelText: 'Correo electrónico',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: controlContrasena,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Contraseña',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                if (!modoLogin) ...[
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text('Rol'),
                  ),
                  const SizedBox(height: 4),
                  DropdownButtonFormField<String>(
                    value: rolSeleccionado,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                    ),
                    items: const [
                      DropdownMenuItem(
                        value: 'cliente',
                        child: Text('Cliente'),
                      ),
                      DropdownMenuItem(
                        value: 'proveedor',
                        child: Text('Proveedor'),
                      ),
                    ],
                    onChanged: (valor) =>
                        setState(() => rolSeleccionado = valor!),
                  ),
                  const SizedBox(height: 12),
                  if (rolSeleccionado == 'proveedor') ...[
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text('Detalle del servicio principal'),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: controlServicioPrincipal,
                      decoration: const InputDecoration(
                        labelText: 'Servicio principal (ej. peluquería canina)',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: controlDetalleServicios,
                      decoration: const InputDecoration(
                        labelText: 'Microservicios o especialidades',
                        helperText: 'Describe paquetes, precios sugeridos o diferenciadores',
                        border: OutlineInputBorder(),
                      ),
                      maxLines: 2,
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: controlCobertura,
                      decoration: const InputDecoration(
                        labelText: 'Zona de cobertura (barrios, comuna o radio)',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                  ]
                ],
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: cargando ? null : _enviarFormulario,
                    child: cargando
                        ? const SizedBox(
                            height: 18,
                            width: 18,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : Text(modoLogin ? 'Iniciar sesión' : 'Registrarme'),
                  ),
                ),
                TextButton(
                  onPressed: () =>
                      setState(() => modoLogin = !modoLogin),
                  child: Text(
                    modoLogin
                        ? 'Crear una cuenta nueva'
                        : 'Ya tengo cuenta, iniciar sesión',
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
