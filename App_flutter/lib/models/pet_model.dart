class PetModel {
  final String id;
  final String name;
  final String type;

  PetModel({required this.id, required this.name, required this.type});

  factory PetModel.fromMap(String id, Map<String, dynamic> map) {
    return PetModel(
      id: id,
      name: map['name'] ?? '',
      type: map['type'] ?? '',
    );
  }

  Map<String, dynamic> toMap() => {'name': name, 'type': type};
}
