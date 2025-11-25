class UserModel {
  final String id;
  final String email;
  final String role;

  UserModel({required this.id, required this.email, required this.role});

  factory UserModel.fromMap(String id, Map<String, dynamic> map) {
    return UserModel(
      id: id,
      email: map['email'] ?? '',
      role: map['role'] ?? 'client',
    );
  }

  Map<String, dynamic> toMap() => {'email': email, 'role': role};
}
