import '../../../models/user_model.dart';
import '../../../services/firebase_user_service.dart';

class UserRepository {
  final FirebaseUserService _service;

  UserRepository(this._service);

  Future<void> saveUser(UserModel user) {
    return _service.saveUserProfile(user.toMap());
  }
}
