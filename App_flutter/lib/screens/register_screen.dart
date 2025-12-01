import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../widgets/service_blocks_selector.dart';

enum UserRole { client, provider }

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  // ─────────── Datos básicos de la cuenta ───────────
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  // ─────────── Datos de proveedor ───────────
  final _businessNameController = TextEditingController();
  final _businessDescriptionController = TextEditingController();
  final _addressController = TextEditingController();

  // Tipo de perfil
  UserRole _selectedRole = UserRole.client;

  // Servicios seleccionados (id -> true)
  final Map<String, bool> _selectedServices = {};

  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _businessNameController.dispose();
    _businessDescriptionController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;

    // Validaciones extra si es proveedor
    if (_selectedRole == UserRole.provider) {
      final hasAtLeastOneService =
          _selectedServices.values.any((isSelected) => isSelected);

      if (_businessNameController.text.trim().isEmpty ||
          _businessDescriptionController.text.trim().isEmpty ||
          _addressController.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Completa los datos del negocio (nombre, descripción y dirección).',
            ),
          ),
        );
        return;
      }

      if (!hasAtLeastOneService) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Selecciona al menos un servicio que ofreces.'),
          ),
        );
        return;
      }
    }

    setState(() => _isLoading = true);

    try {
      // 1. Crear usuario en Auth
      final credential =
          await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );

      final user = credential.user;
      if (user == null) {
        throw Exception('No se pudo crear el usuario.');
      }

      final isProvider = _selectedRole == UserRole.provider;

      // IDs de servicios seleccionados
      final selectedServiceIds = _selectedServices.entries
          .where((e) => e.value)
          .map((e) => e.key)
          .toList();

      // Validación humana: proveedores quedan "pending"
      final approvalStatus = isProvider ? 'pending' : 'approved';

      // 2. Guardar documento en "users"
      await FirebaseFirestore.instance.collection('users').doc(user.uid).set({
        'uid': user.uid,
        'email': _emailController.text.trim(),
        'name': _nameController.text.trim(),
        'phone': _phoneController.text.trim(),
        'role': isProvider ? 'provider' : 'client',
        'createdAt': FieldValue.serverTimestamp(),

        // Datos de negocio solo si es proveedor
        'businessName':
            isProvider ? _businessNameController.text.trim() : null,
        'businessDescription':
            isProvider ? _businessDescriptionController.text.trim() : null,
        'address': isProvider ? _addressController.text.trim() : null,
        'services': isProvider ? selectedServiceIds : [],
        'approvalStatus': approvalStatus,
      });

      if (!mounted) return;

      if (isProvider) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Tu perfil de proveedor fue creado y está en revisión. '
              'Te avisaremos cuando sea aprobado.',
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Cuenta de cliente creada correctamente.'),
          ),
        );
      }

      // Ir al home (AuthGate ya detecta si hay usuario logueado)
      Navigator.pushReplacementNamed(context, '/home');
    } on FirebaseAuthException catch (e) {
      String message = 'No se pudo crear la cuenta';

      if (e.code == 'email-already-in-use') {
        message = 'Este correo ya está registrado';
      } else if (e.code == 'weak-password') {
        message = 'La contraseña es demasiado débil';
      } else if (e.code == 'invalid-email') {
        message = 'Correo inválido';
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(message)),
        );
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Error inesperado, inténtalo nuevamente'),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  // ─────────── BLOQUES DE UI ───────────

  Widget _buildRoleSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Tipo de perfil',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: RadioListTile<UserRole>(
                title: const Text('Cliente'),
                value: UserRole.client,
                groupValue: _selectedRole,
                onChanged: (value) {
                  if (value != null) {
                    setState(() => _selectedRole = value);
                  }
                },
              ),
            ),
            Expanded(
              child: RadioListTile<UserRole>(
                title: const Text('Proveedor'),
                value: UserRole.provider,
                groupValue: _selectedRole,
                onChanged: (value) {
                  if (value != null) {
                    setState(() => _selectedRole = value);
                  }
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildBasicFields() {
    return Column(
      children: [
        TextFormField(
          controller: _nameController,
          decoration: const InputDecoration(
            labelText: 'Nombre completo',
            prefixIcon: Icon(Icons.person_outline),
            border: OutlineInputBorder(),
          ),
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return 'Ingresa tu nombre';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Correo electrónico',
            prefixIcon: Icon(Icons.email_outlined),
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.emailAddress,
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return 'Ingresa tu correo';
            }
            if (!value.contains('@')) {
              return 'Correo no válido';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _phoneController,
          decoration: const InputDecoration(
            labelText: 'Teléfono',
            prefixIcon: Icon(Icons.phone),
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.phone,
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _passwordController,
          decoration: const InputDecoration(
            labelText: 'Contraseña',
            prefixIcon: Icon(Icons.lock_outline),
            border: OutlineInputBorder(),
          ),
          obscureText: true,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Ingresa una contraseña';
            }
            if (value.length < 6) {
              return 'Mínimo 6 caracteres';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _confirmPasswordController,
          decoration: const InputDecoration(
            labelText: 'Repite la contraseña',
            prefixIcon: Icon(Icons.lock_outline),
            border: OutlineInputBorder(),
          ),
          obscureText: true,
          validator: (value) {
            if (value != _passwordController.text) {
              return 'Las contraseñas no coinciden';
            }
            return null;
          },
        ),
      ],
    );
  }

  Widget _buildProviderFields() {
    if (_selectedRole != UserRole.provider) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 24),
        const Text(
          'Datos del negocio (proveedor)',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: _businessNameController,
          decoration: const InputDecoration(
            labelText: 'Nombre del negocio',
            prefixIcon: Icon(Icons.storefront),
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _businessDescriptionController,
          decoration: const InputDecoration(
            labelText: 'Descripción del negocio',
            prefixIcon: Icon(Icons.description_outlined),
            border: OutlineInputBorder(),
          ),
          maxLines: 2,
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _addressController,
          decoration: const InputDecoration(
            labelText: 'Dirección / ciudad',
            prefixIcon: Icon(Icons.location_on_outlined),
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 24),
        ServiceBlocksSelector(
          selectedServices: _selectedServices,
          onChanged: (updated) {
            setState(() {
              _selectedServices
                ..clear()
                ..addAll(updated);
            });
          },
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Crear cuenta')),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildRoleSelector(),
                const SizedBox(height: 16),
                _buildBasicFields(),
                _buildProviderFields(),
                const SizedBox(height: 24),
                SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _register,
                    child: _isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Crear cuenta'),
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
