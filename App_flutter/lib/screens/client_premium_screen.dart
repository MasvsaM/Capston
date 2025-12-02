import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:url_launcher/url_launcher.dart';

class ClientPremiumScreen extends StatefulWidget {
  const ClientPremiumScreen({super.key});

  @override
  State<ClientPremiumScreen> createState() => _ClientPremiumScreenState();
}

class _ClientPremiumScreenState extends State<ClientPremiumScreen> {
  final _auth = FirebaseAuth.instance;
  final _firestore = FirebaseFirestore.instance;

  bool _isProcessing = false;

  /// Abre el link de suscripción de Mercado Pago.
  Future<void> _openMercadoPago() async {
    const url =
        'https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=4da004399b654d9383867f31bce31cac';
    final uri = Uri.parse(url);

    try {
      setState(() => _isProcessing = true);

      if (await canLaunchUrl(uri)) {
        await launchUrl(
          uri,
          mode: LaunchMode.externalApplication,
        );
      } else {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('No se pudo abrir Mercado Pago.'),
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error al abrir Mercado Pago: $e'),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isProcessing = false);
      }
    }
  }

  /// Activar Premium en Firestore (lo usas cuando ya confirmaste el pago).
  Future<void> _activatePremiumManual() async {
    final user = _auth.currentUser;
    if (user == null) return;

    setState(() => _isProcessing = true);

    try {
      await _firestore.collection('users').doc(user.uid).update({
        'isPremium': true,
        'premiumPlan': 'premium',
        'premiumSince': FieldValue.serverTimestamp(),
      });

      if (!mounted) return;

      // Feedback visual
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Cuenta Premium activada ✅'),
        ),
      );

      // Ir directo al foro
      Navigator.of(context).pushNamed('/clientForum');
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error al activar Premium: $e'),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isProcessing = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = _auth.currentUser;
    final uid = user?.uid;

    if (uid == null) {
      return const Scaffold(
        body: Center(child: Text('Debes iniciar sesión.')),
      );
    }

    final userDocStream =
        _firestore.collection('users').doc(uid).snapshots();

    return Scaffold(
      appBar: AppBar(
        title: const Text('MarketPet Premium'),
      ),
      body: StreamBuilder<DocumentSnapshot<Map<String, dynamic>>>(
        stream: userDocStream,
        builder: (context, snapshot) {
          final data = snapshot.data?.data() ?? {};
          final isPremium = (data['isPremium'] as bool?) ?? false;

          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                const SizedBox(height: 8),
                const Text(
                  'Un solo plan, todo para tu mascota',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(
                      color: Theme.of(context).colorScheme.primary,
                      width: 1.2,
                    ),
                  ),
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        _PremiumHeader(),
                        SizedBox(height: 12),
                        Text(
                          'Incluye:',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 6),
                        _BenefitRow(
                          text:
                              'Acceso al foro exclusivo de tutores y profesionales.',
                        ),
                        _BenefitRow(
                          text:
                              'Ficha completa de mascotas + diarios de vida exportables en PDF.',
                        ),
                        _BenefitRow(
                          text:
                              'Prioridad en futuras funcionalidades (recordatorios, alertas, etc.).',
                        ),
                        _BenefitRow(
                          text:
                              'Identificación rápida de tu cuenta como Premium en la app.',
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                if (isPremium)
                  Column(
                    children: [
                      const Text(
                        'Tu cuenta ya es Premium 🎉',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Navigator.of(context).pushNamed('/clientForum');
                          },
                          icon: const Icon(Icons.forum_outlined),
                          label: const Text('Ir al foro Premium'),
                        ),
                      ),
                    ],
                  )
                else
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      ElevatedButton.icon(
                        onPressed: _isProcessing ? null : _openMercadoPago,
                        icon: _isProcessing
                            ? const SizedBox(
                                width: 18,
                                height: 18,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : const Icon(Icons.credit_card),
                        label: Text(
                          _isProcessing
                              ? 'Abriendo Mercado Pago...'
                              : 'Suscribirme con Mercado Pago',
                        ),
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size.fromHeight(46),
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextButton(
                        onPressed:
                            _isProcessing ? null : _activatePremiumManual,
                        child: const Text(
                          'Ya pagué / Activar Premium manualmente',
                        ),
                      ),
                    ],
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _PremiumHeader extends StatelessWidget {
  const _PremiumHeader();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(
          Icons.workspace_premium,
          size: 28,
          color: Colors.amber,
        ),
        const SizedBox(width: 8),
        const Text(
          'MarketPet Premium',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const Spacer(),
        Text(
          '\$4.990 / mes',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Theme.of(context).colorScheme.primary,
          ),
        ),
      ],
    );
  }
}

class _BenefitRow extends StatelessWidget {
  final String text;

  const _BenefitRow({required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.check_circle_outline, size: 18),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}
