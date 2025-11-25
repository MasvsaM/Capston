import '../../../models/provider_model.dart';
import '../../../services/firebase_providers_service.dart';

class ProviderRepository {
  final FirebaseProvidersService _service;

  ProviderRepository(this._service);

  Future<void> addService(ProviderModel provider) {
    return _service.addService(provider.toMap());
  }
}
