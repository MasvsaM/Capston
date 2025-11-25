import 'package:flutter/material.dart';
import '../services/firebase_auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final FirebaseAuthService _authService = FirebaseAuthService();

  Future<void> logout() async {
    await _authService.signOut();
    notifyListeners();
  }
}
