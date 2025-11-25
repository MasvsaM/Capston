import '../../../services/firebase_auth_service.dart';

class AuthRepository {
  final FirebaseAuthService _service;

  AuthRepository(this._service);

  Future<void> login(String email, String password) {
    return _service.signIn(email, password);
  }

  Future<void> register(String email, String password) {
    return _service.register(email, password);
  }

  Future<void> logout() => _service.signOut();
}
