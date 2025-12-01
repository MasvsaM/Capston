import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ProviderScheduleScreen extends StatefulWidget {
  const ProviderScheduleScreen({super.key});

  @override
  State<ProviderScheduleScreen> createState() =>
      _ProviderScheduleScreenState();
}

class _ProviderScheduleScreenState extends State<ProviderScheduleScreen> {
  final _auth = FirebaseAuth.instance;
  final _firestore = FirebaseFirestore.instance;

  bool _loading = true;
  bool _saving = false;

  // Días de trabajo (1 = Lunes ... 7 = Domingo)
  final Set<int> _workDays = {1, 2, 3, 4, 5};

  TimeOfDay _startTime = const TimeOfDay(hour: 9, minute: 0);
  TimeOfDay _endTime = const TimeOfDay(hour: 18, minute: 0);
  int _slotMinutes = 60;

  final TextEditingController _hourlyRateCtrl =
      TextEditingController();
  final TextEditingController _marginCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadConfig();
  }

  @override
  void dispose() {
    _hourlyRateCtrl.dispose();
    _marginCtrl.dispose();
    super.dispose();
  }

  int _timeOfDayToMinutes(TimeOfDay t) => t.hour * 60 + t.minute;

  TimeOfDay _minutesToTimeOfDay(int minutes) {
    final h = minutes ~/ 60;
    final m = minutes % 60;
    return TimeOfDay(hour: h.clamp(0, 23), minute: m.clamp(0, 59));
  }

  Future<void> _loadConfig() async {
    final user = _auth.currentUser;
    if (user == null) {
      setState(() => _loading = false);
      return;
    }

    try {
      final doc = await _firestore
          .collection('providerConfigs')
          .doc(user.uid)
          .get();

      if (doc.exists) {
        final data = doc.data()!;
        final days = (data['workDays'] as List<dynamic>?)
                ?.map((e) => e as int)
                .toSet() ??
            {1, 2, 3, 4, 5};

        _workDays
          ..clear()
          ..addAll(days);

        final startMinutes = data['startMinutes'] as int?;
        final endMinutes = data['endMinutes'] as int?;
        final slotMinutes = data['slotMinutes'] as int?;

        if (startMinutes != null) {
          _startTime = _minutesToTimeOfDay(startMinutes);
        }
        if (endMinutes != null) {
          _endTime = _minutesToTimeOfDay(endMinutes);
        }
        if (slotMinutes != null && slotMinutes > 0) {
          _slotMinutes = slotMinutes;
        }

        final hourlyRate = (data['hourlyRate'] as num?)?.toDouble();
        final marginPercent =
            (data['marginPercent'] as num?)?.toDouble();

        _hourlyRateCtrl.text =
            hourlyRate != null ? hourlyRate.toStringAsFixed(0) : '';
        _marginCtrl.text =
            marginPercent != null ? marginPercent.toStringAsFixed(0) : '';
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content:
                Text('No se pudo cargar la configuración: $e'),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _pickTime({
    required bool isStart,
  }) async {
    final initial = isStart ? _startTime : _endTime;

    final picked = await showTimePicker(
      context: context,
      initialTime: initial,
    );

    if (picked == null) return;

    setState(() {
      if (isStart) {
        _startTime = picked;
      } else {
        _endTime = picked;
      }
    });
  }

  Future<void> _saveConfig() async {
    final user = _auth.currentUser;
    if (user == null) return;

    if (_workDays.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Selecciona al menos un día de trabajo',
          ),
        ),
      );
      return;
    }

    final startMinutes = _timeOfDayToMinutes(_startTime);
    final endMinutes = _timeOfDayToMinutes(_endTime);

    if (endMinutes <= startMinutes) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content:
              Text('La hora de término debe ser posterior a la de inicio'),
        ),
      );
      return;
    }

    final hourRateText =
        _hourlyRateCtrl.text.trim().replaceAll(',', '.');
    final marginText =
        _marginCtrl.text.trim().replaceAll(',', '.');

    final hourlyRate = double.tryParse(hourRateText);
    final margin = double.tryParse(marginText);

    if (hourlyRate == null || hourlyRate <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Ingresa un valor válido para el valor/hora'),
        ),
      );
      return;
    }

    if (margin == null || margin < 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Ingresa un margen de ganancia válido'),
        ),
      );
      return;
    }

    setState(() => _saving = true);

    try {
      final payload = <String, dynamic>{
        'workDays': _workDays.toList()..sort(),
        'startMinutes': startMinutes,
        'endMinutes': endMinutes,
        'slotMinutes': _slotMinutes,
        'hourlyRate': hourlyRate,
        'marginPercent': margin.clamp(0, 100),
        'currency': 'CLP',
        'updatedAt': FieldValue.serverTimestamp(),
      };

      await _firestore
          .collection('providerConfigs')
          .doc(user.uid)
          .set(payload, SetOptions(merge: true));

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Agenda y tarifas guardadas correctamente'),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('No se pudo guardar la configuración: $e'),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _saving = false);
      }
    }
  }

  String _formatTimeOfDay(TimeOfDay t) {
    final h = t.hour.toString().padLeft(2, '0');
    final m = t.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  Widget _buildDayChip(int day, String label) {
    final selected = _workDays.contains(day);
    return FilterChip(
      label: Text(label),
      selected: selected,
      onSelected: (value) {
        setState(() {
          if (value) {
            _workDays.add(day);
          } else {
            _workDays.remove(day);
          }
        });
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final profitExample = () {
      final rate =
          double.tryParse(_hourlyRateCtrl.text.trim()) ?? 0;
      final margin =
          double.tryParse(_marginCtrl.text.trim()) ?? 0;
      if (rate <= 0 || margin <= 0) return null;
      final profit = rate * (margin / 100);
      return profit;
    }();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Agenda y horarios'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Días de atención',
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      children: [
                        _buildDayChip(1, 'Lun'),
                        _buildDayChip(2, 'Mar'),
                        _buildDayChip(3, 'Mié'),
                        _buildDayChip(4, 'Jue'),
                        _buildDayChip(5, 'Vie'),
                        _buildDayChip(6, 'Sáb'),
                        _buildDayChip(7, 'Dom'),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Horario por día',
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () =>
                                _pickTime(isStart: true),
                            child: Text(
                              'Inicio: ${_formatTimeOfDay(_startTime)}',
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () =>
                                _pickTime(isStart: false),
                            child: Text(
                              'Término: ${_formatTimeOfDay(_endTime)}',
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Duración de cada bloque',
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium,
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<int>(
                      value: _slotMinutes,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(
                          value: 30,
                          child: Text('30 minutos'),
                        ),
                        DropdownMenuItem(
                          value: 45,
                          child: Text('45 minutos'),
                        ),
                        DropdownMenuItem(
                          value: 60,
                          child: Text('60 minutos'),
                        ),
                        DropdownMenuItem(
                          value: 90,
                          child: Text('90 minutos'),
                        ),
                      ],
                      onChanged: (value) {
                        if (value == null) return;
                        setState(() {
                          _slotMinutes = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Tarifas y margen',
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _hourlyRateCtrl,
                            keyboardType:
                                TextInputType.number,
                            decoration:
                                const InputDecoration(
                              labelText: 'Valor por hora (CLP)',
                              border: OutlineInputBorder(),
                            ),
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                        const SizedBox(width: 12),
                        SizedBox(
                          width: 120,
                          child: TextField(
                            controller: _marginCtrl,
                            keyboardType:
                                TextInputType.number,
                            decoration:
                                const InputDecoration(
                              labelText: 'Margen %',
                              border: OutlineInputBorder(),
                            ),
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                      ],
                    ),
                    if (profitExample != null) ...[
                      const SizedBox(height: 8),
                      Text(
                        'Ganancia estimada por hora: '
                        '\$${profitExample.toStringAsFixed(0)}',
                        style: TextStyle(
                          color: Theme.of(context)
                              .colorScheme
                              .primary,
                        ),
                      ),
                    ],
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton.icon(
                        icon: _saving
                            ? const SizedBox(
                                width: 18,
                                height: 18,
                                child:
                                    CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : const Icon(Icons.save),
                        label: Text(
                          _saving ? 'Guardando...' : 'Guardar',
                        ),
                        onPressed: _saving ? null : _saveConfig,
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
