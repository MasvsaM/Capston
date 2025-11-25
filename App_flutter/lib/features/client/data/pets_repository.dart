import '../../../models/pet_model.dart';
import '../../../services/firebase_pets_service.dart';

class PetsRepository {
  final FirebasePetsService _service;

  PetsRepository(this._service);

  Future<void> addPet(PetModel pet) {
    return _service.addPet(pet.toMap());
  }

  Future<List<PetModel>> fetchPets() async {
    final data = await _service.fetchPets();
    return [
      for (final item in data)
        PetModel.fromMap(item['id'] as String? ?? '', item)
    ];
  }
}
