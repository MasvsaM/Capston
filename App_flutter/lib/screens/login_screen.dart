import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter_facebook_auth/flutter_facebook_auth.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isLoading = false;
  bool _passwordVisible = false;

  FirebaseAuth get _auth => FirebaseAuth.instance;

  void _showMessage(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg)),
    );
  }

  // 🔐 Login con email/contraseña
  Future<void> _loginWithEmail() async {
    setState(() => _isLoading = true);

    try {
      await _auth.signInWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );

      if (!mounted) return;
      // AuthGate se encarga de mandarte a Home, pero esto asegura la navegación
      Navigator.pushReplacementNamed(context, '/home');
    } on FirebaseAuthException catch (e) {
      if (!mounted) return;
      String msg = 'Error al iniciar sesión';

      switch (e.code) {
        case 'user-not-found':
          msg = 'Usuario no encontrado';
          break;
        case 'wrong-password':
          msg = 'Contraseña incorrecta';
          break;
        case 'invalid-email':
          msg = 'Correo inválido';
          break;
        case 'user-disabled':
          msg = 'Esta cuenta está deshabilitada';
          break;
      }

      _showMessage(msg);
    } catch (e) {
      if (!mounted) return;
      _showMessage('Error inesperado: $e');
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  // 🔐 Login con Google
  Future<void> _loginWithGoogle() async {
    setState(() => _isLoading = true);

    try {
      final googleUser = await GoogleSignIn().signIn();

      // El usuario canceló el flujo
      if (googleUser == null) {
        if (!mounted) return;
        _showMessage('Inicio de sesión con Google cancelado');
        return;
      }

      final googleAuth = await googleUser.authentication;

      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      await _auth.signInWithCredential(credential);

      if (!mounted) return;
      Navigator.pushReplacementNamed(context, '/home');
    } on FirebaseAuthException catch (e) {
      if (!mounted) return;
      _showMessage('Error con Google: ${e.message}');
    } catch (e) {
      if (!mounted) return;
      _showMessage('Error inesperado con Google: $e');
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  // 🔐 Login con Facebook
  Future<void> _loginWithFacebook() async {
    setState(() => _isLoading = true);

    try {
      final result = await FacebookAuth.instance.login(
        permissions: ['email'],
      );

      if (result.status == LoginStatus.cancelled) {
        if (!mounted) return;
        _showMessage('Inicio de sesión con Facebook cancelado');
        return;
      }

      if (result.status == LoginStatus.failed) {
        if (!mounted) return;
        _showMessage('Error con Facebook: ${result.message}');
        return;
      }

      final accessToken = result.accessToken;
      if (accessToken == null) {
        if (!mounted) return;
        _showMessage('No se recibió el token de Facebook');
        return;
      }

      final credential =
          FacebookAuthProvider.credential(accessToken.tokenString);

      await _auth.signInWithCredential(credential);

      if (!mounted) return;
      Navigator.pushReplacementNamed(context, '/home');
    } on FirebaseAuthException catch (e) {
      if (!mounted) return;
      _showMessage('Error con Facebook: ${e.message}');
    } catch (e) {
      if (!mounted) return;
      _showMessage('Error inesperado con Facebook: $e');
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  // 🔁 Recuperar contraseña (reset por correo)
  Future<void> _resetPasswordDialog() async {
    final controller = TextEditingController(text: _emailController.text);

    await showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Recuperar contraseña'),
          content: TextField(
            controller: controller,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              labelText: 'Correo electrónico',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(),
              child: const Text('Cancelar'),
            ),
            TextButton(
              onPressed: () async {
                final email = controller.text.trim();
                if (email.isEmpty) {
                  _showMessage('Ingresa un correo válido');
                  return;
                }

                try {
                  await _auth.sendPasswordResetEmail(email: email);
                  if (!mounted) return;
                  Navigator.of(ctx).pop();
                  _showMessage(
                    'Te enviamos un correo para restablecer tu contraseña',
                  );
                } on FirebaseAuthException catch (e) {
                  _showMessage('Error al enviar correo: ${e.message}');
                } catch (e) {
                  _showMessage('Error inesperado: $e');
                }
              },
              child: const Text('Enviar'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isBusy = _isLoading;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 40),
              const Text(
                'Iniciar sesión',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 32),

              // 📧 Email
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                  labelText: 'Correo electrónico',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),

              // 🔑 Contraseña con icono de ver/ocultar
              TextField(
                controller: _passwordController,
                obscureText: !_passwordVisible,
                decoration: InputDecoration(
                  labelText: 'Contraseña',
                  border: const OutlineInputBorder(),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _passwordVisible
                          ? Icons.visibility_off
                          : Icons.visibility,
                    ),
                    onPressed: () {
                      setState(() {
                        _passwordVisible = !_passwordVisible;
                      });
                    },
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // ¿Olvidaste tu contraseña?
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: isBusy ? null : _resetPasswordDialog,
                  child: const Text('¿Olvidaste tu contraseña?'),
                ),
              ),
              const SizedBox(height: 16),

              // Botón principal de login
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isBusy ? null : _loginWithEmail,
                  child: isBusy
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Entrar'),
                ),
              ),
              const SizedBox(height: 24),

              // Separador
              Row(
                children: const [
                  Expanded(child: Divider()),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8.0),
                    child: Text('o continúa con'),
                  ),
                  Expanded(child: Divider()),
                ],
              ),
              const SizedBox(height: 16),

              // Botones Google & Facebook
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: isBusy ? null : _loginWithGoogle,
                      icon: const Icon(Icons.g_mobiledata),
                      label: const Text('Google'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: isBusy ? null : _loginWithFacebook,
                      icon: const Icon(Icons.facebook),
                      label: const Text('Facebook'),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
