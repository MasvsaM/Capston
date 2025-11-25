class ProviderModel {
  final String id;
  final String name;
  final String specialty;

  ProviderModel({required this.id, required this.name, required this.specialty});

  factory ProviderModel.fromMap(String id, Map<String, dynamic> map) {
    return ProviderModel(
      id: id,
      name: map['name'] ?? '',
      specialty: map['specialty'] ?? '',
    );
  }

  Map<String, dynamic> toMap() => {'name': name, 'specialty': specialty};
}
