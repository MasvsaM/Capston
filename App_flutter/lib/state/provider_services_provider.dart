import 'package:flutter/material.dart';
import '../models/provider_model.dart';

class ProviderServicesProvider extends ChangeNotifier {
  final List<ProviderModel> _services = [];

  List<ProviderModel> get services => List.unmodifiable(_services);

  void addService(ProviderModel service) {
    _services.add(service);
    notifyListeners();
  }
}
