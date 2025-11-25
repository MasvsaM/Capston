import 'package:flutter/material.dart';
import '../models/pet_model.dart';

class PetsProvider extends ChangeNotifier {
  final List<PetModel> _pets = [];

  List<PetModel> get pets => List.unmodifiable(_pets);

  void addPet(PetModel pet) {
    _pets.add(pet);
    notifyListeners();
  }
}
