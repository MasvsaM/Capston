import 'package:flutter/material.dart';
import '../../../core/constants/app_strings.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_input.dart';
import '../../../core/utils/validators.dart';
import '../../../services/firebase_auth_service.dart';
import '../../../services/firebase_user_service.dart';
import '../../../models/user_model.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = FirebaseAuthService();
  final _userService = FirebaseUserService();
  String? _error;

  Future<void> _register() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (!Validators.isEmailValid(email)) {
      setState(() => _error = 'Correo inválido');
      return;
    }
    if (!Validators.isPasswordValid(password)) {
      setState(() => _error = 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setState(() => _error = null);
    final credential = await _authService.register(email, password);
    final user = UserModel(id: credential.user!.uid, email: email, role: 'client');
    await _userService.saveUserProfile(user.toMap());
    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.registerTitle)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            CustomInput(controller: _emailController, label: 'Correo'),
            const SizedBox(height: 12),
            CustomInput(
              controller: _passwordController,
              label: 'Contraseña',
              obscureText: true,
            ),
            if (_error != null) ...[
              const SizedBox(height: 12),
              Text(_error!, style: const TextStyle(color: Colors.red)),
            ],
            const SizedBox(height: 16),
            CustomButton(label: 'Registrar', onPressed: _register),
          ],
        ),
      ),
    );
  }
}
