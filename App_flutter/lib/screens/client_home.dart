import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'client_services_screen.dart';
import 'client_bookings_screen.dart';

import 'package:pdf/widgets.dart' as pw;
import 'package:pdf/pdf.dart';
import 'package:printing/printing.dart';

class ClientHomeScreen extends StatefulWidget {
  const ClientHomeScreen({super.key});

  @override
  State<ClientHomeScreen> createState() => _ClientHomeScreenState();
}

class _ClientHomeScreenState extends State<ClientHomeScreen> {
  int _currentIndex = 0;

  void _goToTab(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final pages = <Widget>[
      _ClientOverviewPage(
        onGoToServices: () => _goToTab(1),
        onGoToPets: () => _goToTab(2),
      ),
      const ClientServicesScreen(),
      const ClientPetsScreen(),
      const ClientProfileScreen(),
    ];

    return Scaffold(
      body: pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        type: BottomNavigationBarType.fixed,
        onTap: _goToTab,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: 'Inicio',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Servicios'),
          BottomNavigationBarItem(
            icon: Icon(Icons.pets_outlined),
            label: 'Mascotas',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }
}

/// =======================
///  PÁGINA: INICIO CLIENTE
/// =======================
class _ClientOverviewPage extends StatelessWidget {
  final VoidCallback onGoToServices;
  final VoidCallback onGoToPets;

  const _ClientOverviewPage({
    required this.onGoToServices,
    required this.onGoToPets,
  });

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    if (user == null) {
      return const Scaffold(body: Center(child: Text('Debes iniciar sesión.')));
    }

    final uid = user.uid;

    final userDocStream = FirebaseFirestore.instance
        .collection('users')
        .doc(uid)
        .snapshots();

    final petsStream = FirebaseFirestore.instance
        .collection('pets')
        .where('ownerId', isEqualTo: uid)
        .snapshots();

    final bookingsStream = FirebaseFirestore.instance
        .collection('bookings')
        .where('clientId', isEqualTo: uid)
        .snapshots();

    return Scaffold(
      appBar: AppBar(title: const Text('Inicio')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ---- HEADER USUARIO ----
              StreamBuilder<DocumentSnapshot<Map<String, dynamic>>>(
                stream: userDocStream,
                builder: (context, snapshot) {
                  final data = snapshot.data?.data() ?? {};
                  final name =
                      (data['displayName'] as String?) ?? user.email ?? '';
                  final isPremium = (data['isPremium'] as bool?) ?? false;

                  return Row(
                    children: [
                      CircleAvatar(
                        radius: 26,
                        child: Text(
                          (name.isNotEmpty ? name[0] : '?').toUpperCase(),
                          style: const TextStyle(fontSize: 20),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Hola, $name',
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(
                                  isPremium
                                      ? Icons.workspace_premium
                                      : Icons.star_border,
                                  size: 16,
                                  color: isPremium ? Colors.amber : Colors.grey,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  isPremium
                                      ? 'Cuenta Premium'
                                      : 'Cuenta estándar',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: isPremium
                                        ? Colors.amber[800]
                                        : Colors.black54,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: 24),

              // ---- KPIs RÁPIDOS ----
              Row(
                children: [
                  Expanded(
                    child: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
                      stream: petsStream,
                      builder: (context, snapshot) {
                        final count = snapshot.data?.docs.length ?? 0;
                        return _KpiCard(
                          label: 'Mascotas',
                          value: '$count',
                          icon: Icons.pets,
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
                      stream: bookingsStream,
                      builder: (context, snapshot) {
                        final count = snapshot.data?.docs.length ?? 0;
                        return _KpiCard(
                          label: 'Reservas',
                          value: '$count',
                          icon: Icons.event_available,
                        );
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              const Text(
                'Accesos rápidos',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),

              _QuickActionCard(
                icon: Icons.search,
                title: 'Buscar servicios para mi mascota',
                subtitle: 'Peluquería, veterinaria, paseos, hospedaje y más.',
                onTap: onGoToServices,
              ),
              const SizedBox(height: 8),
              _QuickActionCard(
                icon: Icons.pets_outlined,
                title: 'Gestionar perfiles de mis mascotas',
                subtitle: 'Agrega fichas con info importante para emergencias.',
                onTap: onGoToPets,
              ),
              const SizedBox(height: 8),
              _QuickActionCard(
                icon: Icons.event_note_outlined,
                title: 'Ver mis reservas',
                subtitle: 'Revisa tus reservas activas y pasadas.',
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const ClientBookingsScreen(),
                    ),
                  );
                },
              ),
              const SizedBox(height: 8),
              _QuickActionCard(
                icon: Icons.forum_outlined,
                title: 'Comunidad (próximamente)',
                subtitle: 'Disponible para cuentas Premium más adelante.',
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Esta sección estará disponible pronto 🐾'),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _KpiCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _KpiCard({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.primary;
    return Card(
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: color.withOpacity(0.1),
              child: Icon(icon, color: color),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(label, style: const TextStyle(fontSize: 12)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.primary;
    return Card(
      elevation: 1,
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(0.1),
          child: Icon(icon, color: color),
        ),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}

/// =======================
///  PÁGINA: MASCOTAS
/// =======================
class ClientPetsScreen extends StatefulWidget {
  const ClientPetsScreen({super.key});

  @override
  State<ClientPetsScreen> createState() => _ClientPetsScreenState();
}

class _ClientPetsScreenState extends State<ClientPetsScreen> {
  final _auth = FirebaseAuth.instance;
  final _firestore = FirebaseFirestore.instance;

  // ===== Dialogo para crear / editar mascota =====
  Future<void> _showPetDialog({
    DocumentSnapshot<Map<String, dynamic>>? doc,
  }) async {
    final isEdit = doc != null;
    final data = doc?.data() ?? {};

    final nameController = TextEditingController(
      text: data['name'] as String? ?? '',
    );
    final weightController = TextEditingController(
      text: (data['weightKg'] is num)
          ? (data['weightKg'] as num).toString()
          : '',
    );
    final colorController = TextEditingController(
      text: data['color'] as String? ?? '',
    );
    final microchipController = TextEditingController(
      text: data['microchipId'] as String? ?? '',
    );
    final notesController = TextEditingController(
      text: data['notes'] as String? ?? '',
    );

    String selectedSpecies = (data['species'] as String?) ?? 'Perro';
    String selectedBreed = (data['breed'] as String?) ?? '';
    String selectedSex = (data['sex'] as String?) ?? 'No indicado';
    String selectedAvatar = (data['avatarEmoji'] as String?) ?? '🐶';
    bool vaccinesUpToDate = (data['vaccinesUpToDate'] as bool?) ?? false;

    DateTime? birthDate;
    final birthRaw = data['birthDate'];
    if (birthRaw is Timestamp) {
      birthDate = birthRaw.toDate();
    }

    final formKey = GlobalKey<FormState>();

    const speciesBreeds = <String, List<String>>{
      'Perro': [
        'Mestizo',
        'Labrador Retriever',
        'Golden Retriever',
        'Pastor Alemán',
        'Pastor Australiano',
        'Border Collie',
        'Poodle Toy',
        'Poodle Mediano',
        'Poodle Estándar',
        'Bulldog Inglés',
        'Bulldog Francés',
        'Beagle',
        'Chihuahua',
        'Yorkshire Terrier',
        'Shih Tzu',
        'Pug',
        'Maltés',
        'Pinscher Miniatura',
        'Dálmata',
        'Rottweiler',
        'Doberman',
        'Husky Siberiano',
        'Samoyedo',
        'Schnauzer Miniatura',
        'Schnauzer Mediano',
        'Cocker Spaniel Inglés',
        'Cocker Spaniel Americano',
        'Basset Hound',
        'Weimaraner',
        'Shar Pei',
        'Akita Inu',
        'Bóxer',
        'Galgo',
        'Staffordshire Bull Terrier',
        'American Bully',
        'Otro',
      ],
      'Gato': [
        'Mestizo',
        'Doméstico pelo corto',
        'Doméstico pelo largo',
        'Siamés',
        'Persa',
        'Bengalí',
        'Angora Turco',
        'Maine Coon',
        'Ragdoll',
        'Sphynx',
        'British Shorthair',
        'Scottish Fold',
        'Azul Ruso',
        'Abisinio',
        'Bombay',
        'Otro',
      ],
      'Ave': [
        'Perico Australiano',
        'Agapornis (Inseparable)',
        'Ninfa (Carolina)',
        'Canario',
        'Diamante Mandarín',
        'Loro Amazona',
        'Loro Gris Africano',
        'Cacatúa',
        'Perico Monje',
        'Otro',
      ],
      'Roedor': [
        'Hamster',
        'Hamster Sirio',
        'Hamster Enano Ruso',
        'Hamster Roborovski',
        'Cobaya / Cuy',
        'Conejo enano',
        'Conejo mediano',
        'Chinchilla',
        'Rata doméstica',
        'Ratón doméstico',
        'Degú',
        'Gerbo',
        'Otro',
      ],
      'Reptil': [
        'Iguana verde',
        'Gecko leopardo',
        'Dragón barbudo',
        'Camaleón velado',
        'Camaleón pantera',
        'Tortuga de tierra',
        'Tortuga acuática',
        'Serpiente del maíz',
        'Pitón bola',
        'Otro',
      ],
      'Pez': [
        'Goldfish',
        'Betta',
        'Guppy',
        'Molly',
        'Platy',
        'Tetra Neón',
        'Tetra Cardenal',
        'Pez ángel',
        'Pez disco',
        'Cíclido africano',
        'Cíclido enano',
        'Plecostomus',
        'Carpa koi (de estanque)',
        'Otro',
      ],
      'Anfibio': [
        'Axolote',
        'Rana arborícola',
        'Rana enana acuática',
        'Tritón',
        'Salamandra',
        'Otro',
      ],
      'Exótico pequeño': [
        'Hurón',
        'Erizo africano',
        'Sugar glider',
        'Degú (exótico)',
        'Otro',
      ],
      'Otro': ['Otro (especificar)'],
    };

    const sexOptions = ['Macho', 'Hembra', 'No indicado'];
    const avatarOptions = ['🐶', '🐱', '🐰', '🦜', '🐢', '🐹'];

    await showDialog(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (dialogContext, setStateDialog) {
            final breedsForSpecies = speciesBreeds[selectedSpecies] ?? const [];
            final showBreedDropdown = breedsForSpecies.isNotEmpty;

            return AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              title: Text(isEdit ? 'Editar mascota' : 'Nueva mascota'),
              content: Form(
                key: formKey,
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // ===== DATOS BÁSICOS =====
                      const Text(
                        'Datos básicos',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          children: [
                            // Avatar
                            Column(
                              children: [
                                GestureDetector(
                                  onTap: () {
                                    final currentIndex = avatarOptions.indexOf(
                                      selectedAvatar,
                                    );
                                    final nextIndex =
                                        (currentIndex + 1) %
                                        avatarOptions.length;
                                    setStateDialog(() {
                                      selectedAvatar = avatarOptions[nextIndex];
                                    });
                                  },
                                  child: CircleAvatar(
                                    radius: 30,
                                    child: Text(
                                      selectedAvatar,
                                      style: const TextStyle(fontSize: 30),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  'Toca el ícono para cambiar el avatar',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: Colors.black54,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),

                            TextFormField(
                              controller: nameController,
                              decoration: const InputDecoration(
                                labelText: 'Nombre',
                                border: OutlineInputBorder(),
                              ),
                              validator: (v) {
                                if (v == null || v.trim().isEmpty) {
                                  return 'Ingresa un nombre';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 8),

                            // Especie
                            DropdownButtonFormField<String>(
                              value: selectedSpecies,
                              decoration: const InputDecoration(
                                labelText: 'Especie',
                                border: OutlineInputBorder(),
                              ),
                              items: speciesBreeds.keys
                                  .map(
                                    (sp) => DropdownMenuItem(
                                      value: sp,
                                      child: Text(sp),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (value) {
                                if (value == null) return;
                                setStateDialog(() {
                                  selectedSpecies = value;
                                  selectedBreed = '';
                                });
                              },
                            ),
                            const SizedBox(height: 8),

                            // Raza
                            if (showBreedDropdown)
                              DropdownButtonFormField<String>(
                                value:
                                    selectedBreed.isNotEmpty &&
                                        breedsForSpecies.contains(selectedBreed)
                                    ? selectedBreed
                                    : null,
                                decoration: const InputDecoration(
                                  labelText: 'Raza',
                                  border: OutlineInputBorder(),
                                ),
                                items: breedsForSpecies
                                    .map(
                                      (b) => DropdownMenuItem(
                                        value: b,
                                        child: Text(b),
                                      ),
                                    )
                                    .toList(),
                                onChanged: (value) {
                                  setStateDialog(() {
                                    selectedBreed = value ?? '';
                                  });
                                },
                              )
                            else
                              TextFormField(
                                initialValue: selectedBreed,
                                decoration: const InputDecoration(
                                  labelText: 'Raza (opcional)',
                                  border: OutlineInputBorder(),
                                ),
                                onChanged: (value) {
                                  selectedBreed = value;
                                },
                              ),
                            const SizedBox(height: 8),

                            // Sexo
                            DropdownButtonFormField<String>(
                              value: selectedSex,
                              decoration: const InputDecoration(
                                labelText: 'Sexo',
                                border: OutlineInputBorder(),
                              ),
                              items: sexOptions
                                  .map(
                                    (s) => DropdownMenuItem(
                                      value: s,
                                      child: Text(s),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (value) {
                                if (value == null) return;
                                setStateDialog(() {
                                  selectedSex = value;
                                });
                              },
                            ),
                            const SizedBox(height: 8),

                            // Fecha de nacimiento
                            InkWell(
                              onTap: () async {
                                final now = DateTime.now();
                                final firstDate = DateTime(now.year - 30);
                                final initialDate = birthDate ?? now;
                                final picked = await showDatePicker(
                                  context: dialogContext,
                                  firstDate: firstDate,
                                  lastDate: now,
                                  initialDate: initialDate,
                                );
                                if (picked != null) {
                                  setStateDialog(() {
                                    birthDate = picked;
                                  });
                                }
                              },
                              child: InputDecorator(
                                decoration: const InputDecoration(
                                  labelText: 'Fecha de nacimiento (aprox.)',
                                  border: OutlineInputBorder(),
                                ),
                                child: Row(
                                  children: [
                                    Text(
                                      birthDate != null
                                          ? '${birthDate!.day}/${birthDate!.month}/${birthDate!.year}'
                                          : 'Toca para seleccionar',
                                    ),
                                    const Spacer(),
                                    const Icon(Icons.calendar_today, size: 16),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),

                            // Color
                            TextFormField(
                              controller: colorController,
                              decoration: const InputDecoration(
                                labelText: 'Color / señas',
                                border: OutlineInputBorder(),
                              ),
                            ),
                            const SizedBox(height: 8),

                            TextFormField(
                              controller: microchipController,
                              decoration: const InputDecoration(
                                labelText: 'Microchip / Identificación',
                                border: OutlineInputBorder(),
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 16),

                      // ===== SALUD Y CUIDADOS =====
                      const Text(
                        'Salud y cuidados',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: TextFormField(
                                    controller: weightController,
                                    decoration: const InputDecoration(
                                      labelText: 'Peso aprox. (kg)',
                                      border: OutlineInputBorder(),
                                    ),
                                    keyboardType:
                                        const TextInputType.numberWithOptions(
                                          decimal: true,
                                        ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),

                            SwitchListTile(
                              contentPadding: EdgeInsets.zero,
                              title: const Text('Vacunas al día'),
                              value: vaccinesUpToDate,
                              onChanged: (value) {
                                setStateDialog(() {
                                  vaccinesUpToDate = value;
                                });
                              },
                            ),
                            const SizedBox(height: 8),

                            TextFormField(
                              controller: notesController,
                              decoration: const InputDecoration(
                                labelText:
                                    'Notas e historial (alergias, medicamentos, cirugías, observaciones)',
                                border: OutlineInputBorder(),
                              ),
                              maxLines: 4,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(dialogContext).pop(),
                  child: const Text('Cancelar'),
                ),
                ElevatedButton(
                  onPressed: () async {
                    if (!formKey.currentState!.validate()) return;

                    final user = _auth.currentUser;
                    if (user == null) return;

                    final payload = <String, dynamic>{
                      'ownerId': user.uid,
                      'name': nameController.text.trim(),
                      'species': selectedSpecies,
                      'breed': selectedBreed.trim(),
                      'sex': selectedSex,
                      'notes': notesController.text.trim(),
                      'avatarEmoji': selectedAvatar,
                      'vaccinesUpToDate': vaccinesUpToDate,
                      'updatedAt': FieldValue.serverTimestamp(),
                    };

                    if (birthDate != null) {
                      payload['birthDate'] = Timestamp.fromDate(birthDate!);
                    }

                    final weightText = weightController.text.trim().replaceAll(
                      ',',
                      '.',
                    );
                    final weight = double.tryParse(weightText);
                    if (weight != null) {
                      payload['weightKg'] = weight;
                    }
                    if (colorController.text.trim().isNotEmpty) {
                      payload['color'] = colorController.text.trim();
                    }
                    if (microchipController.text.trim().isNotEmpty) {
                      payload['microchipId'] = microchipController.text.trim();
                    }

                    if (isEdit) {
                      await doc!.reference.update(payload);
                    } else {
                      payload['createdAt'] = FieldValue.serverTimestamp();
                      await _firestore.collection('pets').add(payload);
                    }

                    if (mounted) {
                      Navigator.of(dialogContext).pop();
                    }
                  },
                  child: const Text('Guardar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Future<void> _deletePet(DocumentReference<Map<String, dynamic>> ref) async {
    await ref.delete();
  }

  // Edad estimada para mostrar y PDF
  String _formatAge(DateTime? birthDate) {
    if (birthDate == null) return '';
    final now = DateTime.now();
    int years = now.year - birthDate.year;
    int months = now.month - birthDate.month;
    if (now.day < birthDate.day) {
      months -= 1;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    if (years <= 0 && months <= 0) return 'Menos de 1 mes';
    if (years <= 0) return '$months meses';
    if (months <= 0) return '$years años';
    return '$years años $months meses';
  }

  // ===== Exportar ficha en PDF (usa pdf + printing) =====
  Future<void> _exportPetToPdf(
    DocumentSnapshot<Map<String, dynamic>> doc,
  ) async {
    final data = doc.data();
    if (data == null) return;

    DateTime? birthDate;
    final birthRaw = data['birthDate'];
    if (birthRaw is Timestamp) {
      birthDate = birthRaw.toDate();
    }
    final ageText = _formatAge(birthDate);

    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Padding(
            padding: const pw.EdgeInsets.all(24),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                pw.Text(
                  'Ficha de mascota',
                  style: pw.TextStyle(
                    fontSize: 22,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
                pw.SizedBox(height: 16),
                pw.Text('Nombre: ${data['name'] ?? ''}'),
                pw.Text('Especie: ${data['species'] ?? ''}'),
                pw.Text('Raza: ${data['breed'] ?? ''}'),
                pw.Text('Sexo: ${data['sex'] ?? ''}'),
                if (birthDate != null)
                  pw.Text(
                    'Fecha de nacimiento: '
                    '${birthDate!.day}/${birthDate!.month}/${birthDate!.year}',
                  ),
                if (ageText.isNotEmpty) pw.Text('Edad aprox.: $ageText'),
                if (data['weightKg'] != null)
                  pw.Text('Peso aprox.: ${data['weightKg']} kg'),
                if (data['color'] != null)
                  pw.Text('Color/señas: ${data['color']}'),
                if (data['microchipId'] != null)
                  pw.Text('Microchip/ID: ${data['microchipId']}'),
                pw.Text(
                  'Vacunas al día: '
                  '${(data['vaccinesUpToDate'] as bool? ?? false) ? "Sí" : "No"}',
                ),
                pw.SizedBox(height: 16),
                pw.Text(
                  'Notas e historial:',
                  style: pw.TextStyle(fontWeight: pw.FontWeight.bold),
                ),
                pw.SizedBox(height: 4),
                pw.Text((data['notes'] as String?) ?? ''),
              ],
            ),
          );
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdf.save(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = _auth.currentUser;
    if (user == null) {
      return const Scaffold(body: Center(child: Text('Debes iniciar sesión.')));
    }

    final petsStream = _firestore
        .collection('pets')
        .where('ownerId', isEqualTo: user.uid)
        .orderBy('name')
        .snapshots();

    return Scaffold(
      appBar: AppBar(title: const Text('Mis mascotas')),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: petsStream,
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(
              child: Text('Error al cargar mascotas: ${snapshot.error}'),
            );
          }
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final docs = snapshot.data?.docs ?? [];
          if (docs.isEmpty) {
            return const Center(
              child: Text(
                'Aún no has agregado mascotas.\n'
                'Usa el botón + para crear un perfil.',
                textAlign: TextAlign.center,
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: docs.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final doc = docs[index];
              final data = doc.data();

              final name = data['name'] as String? ?? '';
              final species = data['species'] as String? ?? '';
              final breed = data['breed'] as String? ?? '';
              final notes = data['notes'] as String? ?? '';
              final avatarEmoji = data['avatarEmoji'] as String? ?? '🐾';
              final vaccinesUpToDate =
                  (data['vaccinesUpToDate'] as bool?) ?? false;
              final weight = (data['weightKg'] is num)
                  ? (data['weightKg'] as num)
                  : null;

              DateTime? birthDate;
              final birthRaw = data['birthDate'];
              if (birthRaw is Timestamp) {
                birthDate = birthRaw.toDate();
              }
              final ageText = _formatAge(birthDate);

              final mainLine = [
                if (species.isNotEmpty) species,
                if (breed.isNotEmpty) breed,
                if (ageText.isNotEmpty) ageText,
              ].join(' • ');

              return Card(
                child: ListTile(
                  leading: CircleAvatar(
                    child: Text(
                      avatarEmoji,
                      style: const TextStyle(fontSize: 22),
                    ),
                  ),
                  title: Text(name),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (mainLine.isNotEmpty) Text(mainLine),
                      if (weight != null)
                        Text(
                          'Peso aprox.: ${weight.toString()} kg',
                          style: const TextStyle(fontSize: 12),
                        ),
                      Text(
                        vaccinesUpToDate
                            ? 'Vacunas al día'
                            : 'Vacunas pendientes o por revisar',
                        style: TextStyle(
                          fontSize: 12,
                          color: vaccinesUpToDate
                              ? Colors.green[700]
                              : Colors.orange[700],
                        ),
                      ),
                      if (notes.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(
                            notes,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                    ],
                  ),
                  trailing: PopupMenuButton<String>(
                    onSelected: (value) async {
                      if (value == 'diary') {
                        // 👉 Abrir diario de vida de esta mascota
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => PetDiaryScreen(
                              petId: doc.id,
                              petName: name,
                              avatarEmoji: avatarEmoji,
                            ),
                          ),
                        );
                      } else if (value == 'edit') {
                        await _showPetDialog(doc: doc);
                      } else if (value == 'delete') {
                        await _deletePet(doc.reference);
                      } else if (value == 'pdf') {
                        await _exportPetToPdf(doc);
                      }
                    },
                    itemBuilder: (context) => const [
                      PopupMenuItem(
                        value: 'diary',
                        child: Text('Ver diario de vida'),
                      ),
                      PopupMenuItem(value: 'edit', child: Text('Editar')),
                      PopupMenuItem(
                        value: 'pdf',
                        child: Text('Exportar ficha (PDF)'),
                      ),
                      PopupMenuItem(value: 'delete', child: Text('Eliminar')),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showPetDialog(),
        child: const Icon(Icons.add),
      ),
    );
  }
}

/// =======================
///  DIARIO DE VIDA MASCOTA
/// =======================
class PetDiaryScreen extends StatefulWidget {
  final String petId;
  final String petName;
  final String avatarEmoji;

  const PetDiaryScreen({
    super.key,
    required this.petId,
    required this.petName,
    required this.avatarEmoji,
  });

  @override
  State<PetDiaryScreen> createState() => _PetDiaryScreenState();
}

class _PetDiaryScreenState extends State<PetDiaryScreen> {
  final _auth = FirebaseAuth.instance;
  final _firestore = FirebaseFirestore.instance;

  Future<void> _showDiaryEntryDialog({
    DocumentSnapshot<Map<String, dynamic>>? doc,
  }) async {
    final isEdit = doc != null;
    final data = doc?.data() ?? {};

    final titleController = TextEditingController(
      text: data['title'] as String? ?? '',
    );
    final vetController = TextEditingController(
      text: data['vetName'] as String? ?? '',
    );
    final clinicController = TextEditingController(
      text: data['clinicName'] as String? ?? '',
    );
    final notesController = TextEditingController(
      text: data['notes'] as String? ?? '',
    );
    final weightController = TextEditingController(
      text: (data['weightKg'] is num)
          ? (data['weightKg'] as num).toString()
          : '',
    );

    String selectedType = (data['type'] as String?) ?? 'Consulta veterinaria';

    DateTime date = DateTime.now();
    final dateRaw = data['date'];
    if (dateRaw is Timestamp) {
      date = dateRaw.toDate();
    }

    final formKey = GlobalKey<FormState>();

    const entryTypes = <String>[
      'Consulta veterinaria',
      'Vacuna',
      'Desparasitación',
      'Cirugía / procedimiento',
      'Control general',
      'Peso y evaluación',
      'Otro',
    ];

    await showDialog(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (dialogContext, setStateDialog) {
            return AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              title: Text(isEdit ? 'Editar evento' : 'Nuevo evento'),
              content: Form(
                key: formKey,
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Datos del evento',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 8),
                      DropdownButtonFormField<String>(
                        value: selectedType,
                        decoration: const InputDecoration(
                          labelText: 'Tipo de evento',
                          border: OutlineInputBorder(),
                        ),
                        items: entryTypes
                            .map(
                              (t) => DropdownMenuItem(value: t, child: Text(t)),
                            )
                            .toList(),
                        onChanged: (value) {
                          if (value == null) return;
                          setStateDialog(() {
                            selectedType = value;
                          });
                        },
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: titleController,
                        decoration: const InputDecoration(
                          labelText: 'Título / motivo',
                          border: OutlineInputBorder(),
                        ),
                        validator: (v) {
                          if (v == null || v.trim().isEmpty) {
                            return 'Ingresa un título o motivo';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 8),
                      InkWell(
                        onTap: () async {
                          final picked = await showDatePicker(
                            context: dialogContext,
                            firstDate: DateTime(2000),
                            lastDate: DateTime.now().add(
                              const Duration(days: 365),
                            ),
                            initialDate: date,
                          );
                          if (picked != null) {
                            setStateDialog(() {
                              date = picked;
                            });
                          }
                        },
                        child: InputDecorator(
                          decoration: const InputDecoration(
                            labelText: 'Fecha',
                            border: OutlineInputBorder(),
                          ),
                          child: Row(
                            children: [
                              Text(
                                '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}',
                              ),
                              const Spacer(),
                              const Icon(Icons.calendar_today, size: 16),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Detalles para el veterinario',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: vetController,
                        decoration: const InputDecoration(
                          labelText: 'Veterinario (opcional)',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: clinicController,
                        decoration: const InputDecoration(
                          labelText: 'Clínica / lugar (opcional)',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: weightController,
                        decoration: const InputDecoration(
                          labelText: 'Peso en esta visita (kg, opcional)',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: const TextInputType.numberWithOptions(
                          decimal: true,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: notesController,
                        decoration: const InputDecoration(
                          labelText:
                              'Notas (síntomas, diagnóstico, medicamentos, indicaciones)',
                          border: OutlineInputBorder(),
                        ),
                        maxLines: 4,
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(dialogContext).pop(),
                  child: const Text('Cancelar'),
                ),
                ElevatedButton(
                  onPressed: () async {
                    if (!formKey.currentState!.validate()) return;

                    final user = _auth.currentUser;
                    if (user == null) return;

                    final payload = <String, dynamic>{
                      'ownerId': user.uid,
                      'petId': widget.petId,
                      'petName': widget.petName,
                      'type': selectedType,
                      'title': titleController.text.trim(),
                      'vetName': vetController.text.trim(),
                      'clinicName': clinicController.text.trim(),
                      'notes': notesController.text.trim(),
                      'date': Timestamp.fromDate(date),
                      'updatedAt': FieldValue.serverTimestamp(),
                    };

                    final weightText = weightController.text.trim().replaceAll(
                      ',',
                      '.',
                    );
                    final weight = double.tryParse(weightText);
                    if (weight != null) {
                      payload['weightKg'] = weight;
                    }

                    if (isEdit) {
                      await doc!.reference.update(payload);
                    } else {
                      payload['createdAt'] = FieldValue.serverTimestamp();
                      await _firestore
                          .collection('pet_diary_entries')
                          .add(payload);
                    }

                    if (mounted) {
                      Navigator.of(dialogContext).pop();
                    }
                  },
                  child: const Text('Guardar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Future<void> _deleteEntry(DocumentReference<Map<String, dynamic>> ref) async {
    await ref.delete();
  }

  IconData _iconForType(String type) {
    final t = type.toLowerCase();
    if (t.contains('vacuna')) return Icons.vaccines_outlined;
    if (t.contains('consulta')) return Icons.medical_information_outlined;
    if (t.contains('cirugía') || t.contains('procedimiento')) {
      return Icons.local_hospital_outlined;
    }
    if (t.contains('peso')) return Icons.monitor_weight_outlined;
    return Icons.event_note_outlined;
  }

  String _formatDate(Timestamp? ts) {
    if (ts == null) return '';
    final d = ts.toDate();
    return '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
  }

  // ===== Exportar diario completo a PDF =====
  Future<void> _exportDiaryToPdf() async {
    final user = _auth.currentUser;
    if (user == null) return;

    try {
      // Datos de la mascota
      final petSnap = await _firestore
          .collection('pets')
          .doc(widget.petId)
          .get();
      final petData = petSnap.data() ?? {};

      final petName = (petData['name'] as String?) ?? widget.petName;
      final species = (petData['species'] as String?) ?? '';
      final breed = (petData['breed'] as String?) ?? '';
      final sex = (petData['sex'] as String?) ?? '';
      final color = (petData['color'] as String?) ?? '';
      final microchip = (petData['microchipId'] as String?) ?? '';
      final vaccinesUpToDate = (petData['vaccinesUpToDate'] as bool?) ?? false;
      final weightKg = petData['weightKg'];

      DateTime? birthDate;
      final birthRaw = petData['birthDate'];
      if (birthRaw is Timestamp) {
        birthDate = birthRaw.toDate();
      }

      String ageText = '';
      if (birthDate != null) {
        final now = DateTime.now();
        int years = now.year - birthDate.year;
        int months = now.month - birthDate.month;
        if (now.day < birthDate.day) months -= 1;
        if (months < 0) {
          years -= 1;
          months += 12;
        }
        if (years <= 0 && months <= 0) {
          ageText = 'Menos de 1 mes';
        } else if (years <= 0) {
          ageText = '$months meses';
        } else if (months <= 0) {
          ageText = '$years años';
        } else {
          ageText = '$years años $months meses';
        }
      }

      // Eventos del diario
      final entriesSnap = await _firestore
          .collection('pet_diary_entries')
          .where('petId', isEqualTo: widget.petId)
          .where('ownerId', isEqualTo: user.uid)
          .get();

      final entries = entriesSnap.docs.toList();
      entries.sort((a, b) {
        final da = a.data();
        final db = b.data();
        final ta = da['date'];
        final tb = db['date'];

        DateTime? daDate;
        DateTime? dbDate;

        if (ta is Timestamp) daDate = ta.toDate();
        if (tb is Timestamp) dbDate = tb.toDate();

        if (daDate == null && dbDate == null) return 0;
        if (daDate == null) return 1;
        if (dbDate == null) return -1;

        // más reciente primero
        return dbDate.compareTo(daDate);
      });

      final pdf = pw.Document();

      pdf.addPage(
        pw.MultiPage(
          pageFormat: PdfPageFormat.a4,
          margin: const pw.EdgeInsets.all(24),
          build: (context) {
            return [
              pw.Row(
                crossAxisAlignment: pw.CrossAxisAlignment.center,
                children: [
                  pw.Container(
                    width: 40,
                    height: 40,
                    alignment: pw.Alignment.center,
                    decoration: pw.BoxDecoration(
                      shape: pw.BoxShape.circle,
                      border: pw.Border.all(width: 1),
                    ),
                    child: pw.Text(
                      widget.avatarEmoji,
                      style: const pw.TextStyle(fontSize: 26),
                    ),
                  ),
                  pw.SizedBox(width: 12),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        'Diario de vida',
                        style: pw.TextStyle(
                          fontSize: 20,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                      pw.Text(petName, style: const pw.TextStyle(fontSize: 16)),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(height: 16),

              // Datos de la mascota
              pw.Text(
                'Datos de la mascota',
                style: pw.TextStyle(
                  fontSize: 14,
                  fontWeight: pw.FontWeight.bold,
                ),
              ),
              pw.SizedBox(height: 6),
              pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  if (species.isNotEmpty) pw.Text('Especie: $species'),
                  if (breed.isNotEmpty) pw.Text('Raza: $breed'),
                  if (sex.isNotEmpty) pw.Text('Sexo: $sex'),
                  if (ageText.isNotEmpty) pw.Text('Edad aprox.: $ageText'),
                  if (weightKg != null) pw.Text('Peso aprox.: $weightKg kg'),
                  if (color.isNotEmpty) pw.Text('Color / señas: $color'),
                  if (microchip.isNotEmpty)
                    pw.Text('Microchip / ID: $microchip'),
                  pw.Text('Vacunas al día: ${vaccinesUpToDate ? "Sí" : "No"}'),
                ],
              ),
              pw.SizedBox(height: 16),

              pw.Text(
                'Eventos registrados',
                style: pw.TextStyle(
                  fontSize: 14,
                  fontWeight: pw.FontWeight.bold,
                ),
              ),
              pw.SizedBox(height: 8),

              if (entries.isEmpty)
                pw.Text('No hay eventos registrados en el diario.')
              else
                pw.Column(
                  children: entries.map((entry) {
                    final ed = entry.data();
                    final type = (ed['type'] as String?) ?? '';
                    final title = (ed['title'] as String?) ?? '';
                    final notes = (ed['notes'] as String?) ?? '';
                    final vetName = (ed['vetName'] as String?) ?? '';
                    final clinicName = (ed['clinicName'] as String?) ?? '';
                    final weightVisit = ed['weightKg'];
                    final ts = ed['date'] as Timestamp?;
                    String dateText = '';
                    if (ts != null) {
                      final d = ts.toDate();
                      dateText =
                          '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
                    }

                    final header = title.isNotEmpty ? title : type;

                    return pw.Container(
                      margin: const pw.EdgeInsets.only(bottom: 8),
                      padding: const pw.EdgeInsets.all(8),
                      decoration: pw.BoxDecoration(
                        border: pw.Border.all(width: 0.5),
                        borderRadius: pw.BorderRadius.circular(6),
                      ),
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          pw.Text(
                            header,
                            style: pw.TextStyle(
                              fontSize: 12,
                              fontWeight: pw.FontWeight.bold,
                            ),
                          ),
                          if (dateText.isNotEmpty)
                            pw.Text(
                              'Fecha: $dateText',
                              style: const pw.TextStyle(fontSize: 11),
                            ),
                          if (type.isNotEmpty)
                            pw.Text(
                              'Tipo: $type',
                              style: const pw.TextStyle(fontSize: 11),
                            ),
                          if (vetName.isNotEmpty)
                            pw.Text(
                              'Veterinario: $vetName',
                              style: const pw.TextStyle(fontSize: 11),
                            ),
                          if (clinicName.isNotEmpty)
                            pw.Text(
                              'Clínica: $clinicName',
                              style: const pw.TextStyle(fontSize: 11),
                            ),
                          if (weightVisit != null)
                            pw.Text(
                              'Peso en esta visita: $weightVisit kg',
                              style: const pw.TextStyle(fontSize: 11),
                            ),
                          if (notes.isNotEmpty) ...[
                            pw.SizedBox(height: 4),
                            pw.Text(
                              notes,
                              style: const pw.TextStyle(fontSize: 11),
                            ),
                          ],
                        ],
                      ),
                    );
                  }).toList(),
                ),
            ];
          },
        ),
      );

      await Printing.layoutPdf(
        onLayout: (PdfPageFormat format) async => pdf.save(),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error al exportar diario: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = _auth.currentUser;
    if (user == null) {
      return const Scaffold(body: Center(child: Text('Debes iniciar sesión.')));
    }

    // Query SIN orderBy, ordenamos en memoria
    final entriesStream = _firestore
        .collection('pet_diary_entries')
        .where('petId', isEqualTo: widget.petId)
        .where('ownerId', isEqualTo: user.uid)
        .snapshots();

    return Scaffold(
      appBar: AppBar(
        title: Text('Diario de ${widget.petName}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.picture_as_pdf_outlined),
            tooltip: 'Exportar diario (PDF)',
            onPressed: _exportDiaryToPdf,
          ),
        ],
      ),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: entriesStream,
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(
              child: Text('Error al cargar el diario: ${snapshot.error}'),
            );
          }
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final docs = (snapshot.data?.docs ?? []).toList();
          docs.sort((a, b) {
            final da = a.data();
            final db = b.data();
            final ta = da['date'];
            final tb = db['date'];

            DateTime? daDate;
            DateTime? dbDate;

            if (ta is Timestamp) daDate = ta.toDate();
            if (tb is Timestamp) dbDate = tb.toDate();

            if (daDate == null && dbDate == null) return 0;
            if (daDate == null) return 1;
            if (dbDate == null) return -1;

            return dbDate.compareTo(daDate);
          });

          if (docs.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(
                  'Aún no has registrado eventos en el diario de ${widget.petName}.\n'
                  'Usa el botón + para agregar consultas, vacunas u otros eventos importantes.',
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: docs.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final doc = docs[index];
              final data = doc.data();
              final type = data['type'] as String? ?? '';
              final title = data['title'] as String? ?? '';
              final notes = data['notes'] as String? ?? '';
              final vetName = data['vetName'] as String? ?? '';
              final clinicName = data['clinicName'] as String? ?? '';
              final dateTs = data['date'] as Timestamp?;
              final dateText = _formatDate(dateTs);

              final subtitleLines = <String>[];
              if (dateText.isNotEmpty) subtitleLines.add(dateText);
              if (vetName.isNotEmpty) subtitleLines.add('Vet: $vetName');
              if (clinicName.isNotEmpty) {
                subtitleLines.add('Clínica: $clinicName');
              }

              return Card(
                child: ListTile(
                  leading: CircleAvatar(child: Icon(_iconForType(type))),
                  title: Text(title.isNotEmpty ? title : type),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (subtitleLines.isNotEmpty)
                        Text(
                          subtitleLines.join(' • '),
                          style: const TextStyle(fontSize: 12),
                        ),
                      if (notes.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(
                            notes,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                    ],
                  ),
                  onTap: () => _showDiaryEntryDialog(doc: doc),
                  trailing: PopupMenuButton<String>(
                    onSelected: (value) async {
                      if (value == 'edit') {
                        await _showDiaryEntryDialog(doc: doc);
                      } else if (value == 'delete') {
                        await _deleteEntry(doc.reference);
                      }
                    },
                    itemBuilder: (context) => const [
                      PopupMenuItem(value: 'edit', child: Text('Editar')),
                      PopupMenuItem(value: 'delete', child: Text('Eliminar')),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showDiaryEntryDialog(),
        child: const Icon(Icons.add),
      ),
    );
  }
}

/// =======================
///  PÁGINA: PERFIL / CUENTA
/// =======================
class ClientProfileScreen extends StatelessWidget {
  const ClientProfileScreen({super.key});

  Future<void> _signOut(BuildContext context) async {
    await FirebaseAuth.instance.signOut();
    Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      return const Scaffold(
        body: Center(child: Text('Debes iniciar sesión.')),
      );
    }

    final uid = user.uid;
    final email = user.email ?? '';

    final userDocStream =
        FirebaseFirestore.instance.collection('users').doc(uid).snapshots();

    return Scaffold(
      appBar: AppBar(title: const Text('Mi cuenta')),
      body: StreamBuilder<DocumentSnapshot<Map<String, dynamic>>>(
        stream: userDocStream,
        builder: (context, snapshot) {
          final data = snapshot.data?.data() ?? {};
          final isPremium = (data['isPremium'] as bool?) ?? false;

          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (email.isNotEmpty)
                  ListTile(
                    leading: const Icon(Icons.email_outlined),
                    title: Text(email),
                    subtitle: const Text('Correo de inicio de sesión'),
                  ),
                const SizedBox(height: 16),

                // Estado de la cuenta
                Row(
                  children: [
                    Icon(
                      isPremium ? Icons.workspace_premium : Icons.star_border,
                      color: isPremium ? Colors.amber : Colors.grey,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      isPremium ? 'Cuenta Premium activa' : 'Cuenta estándar',
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Bloque Premium
                if (!isPremium)
                  Card(
                    margin: const EdgeInsets.only(top: 8),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'MarketPet Premium',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Accede al foro exclusivo, ficha avanzada de tus mascotas '
                            'y más beneficios pensados para ti y tu peludo.',
                          ),
                          const SizedBox(height: 8),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: () {
                                Navigator.of(context)
                                    .pushNamed('/clientPremium');
                              },
                              icon: const Icon(Icons.workspace_premium),
                              label: const Text('Ver plan Premium'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  Card(
                    margin: const EdgeInsets.only(top: 8),
                    child: ListTile(
                      leading: const Icon(
                        Icons.workspace_premium,
                        color: Colors.amber,
                      ),
                      title: const Text('Gracias por ser parte de Premium'),
                      subtitle: const Text(
                        'Puedes acceder al foro exclusivo cuando quieras.',
                      ),
                      trailing: TextButton(
                        onPressed: () {
                          Navigator.of(context).pushNamed('/clientForum');
                        },
                        child: const Text('Ir al foro'),
                      ),
                    ),
                  ),

                const SizedBox(height: 16),
                const Text(
                  'Configuración (en construcción)',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Aquí podrás manejar notificaciones, preferencias, '
                  'cuenta Premium y más.',
                ),
                const Spacer(),
                Center(
                  child: ElevatedButton.icon(
                    onPressed: () => _signOut(context),
                    icon: const Icon(Icons.logout),
                    label: const Text('Cerrar sesión'),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
