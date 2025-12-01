import 'service_blocks.dart';

class ProviderServiceConfig {
  final String serviceId;
  bool enabled;
  bool useBookings;
  bool useHomeVisits;
  bool useCatalog;

  // Nuevo: precio base y % descuento (por servicio)
  double? basePrice;
  double? discountPercent;

  ProviderServiceConfig({
    required this.serviceId,
    this.enabled = false,
    this.useBookings = false,
    this.useHomeVisits = false,
    this.useCatalog = false,
    this.basePrice,
    this.discountPercent,
  });

  factory ProviderServiceConfig.fromMap(Map<String, dynamic> map) {
    return ProviderServiceConfig(
      serviceId: (map['serviceId'] as String?) ?? '',
      enabled: (map['enabled'] as bool?) ?? false,
      useBookings: (map['useBookings'] as bool?) ?? false,
      useHomeVisits: (map['useHomeVisits'] as bool?) ?? false,
      useCatalog: (map['useCatalog'] as bool?) ?? false,
      basePrice: (map['basePrice'] as num?)?.toDouble(),
      discountPercent: (map['discountPercent'] as num?)?.toDouble(),
    );
  }

  factory ProviderServiceConfig.fromServiceBlock(
    ServiceBlock block, {
    bool enabled = false,
  }) {
    return ProviderServiceConfig(
      serviceId: block.id,
      enabled: enabled,
      useBookings: block.enableBookings && enabled,
      useHomeVisits: block.enableHomeVisits && enabled,
      useCatalog: block.enableCatalog && enabled,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'serviceId': serviceId,
      'enabled': enabled,
      'useBookings': useBookings,
      'useHomeVisits': useHomeVisits,
      'useCatalog': useCatalog,
      'basePrice': basePrice,
      'discountPercent': discountPercent,
    };
  }
}
