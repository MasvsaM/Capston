# App_flutter

Aplicación Flutter conectada a Firebase para el ecosistema **MarketPet** (Android, iOS y Web). Todas las pantallas, colecciones y variables están en español. Usa esta guía paso a paso para dejar Firebase listo para producción sin depender de FlutterFire CLI.

## Requisitos locales
- Flutter 3.19+ y Dart 3+ instalados (incluye `flutter_localizations`).
- Cuenta de Firebase con permisos de propietario.
- Archivos de configuración descargados desde la consola de Firebase:
  - `android/app/google-services.json`
  - `ios/Runner/GoogleService-Info.plist` y `macos/Runner/GoogleService-Info.plist`
  - `lib/firebase_options.dart` completo con tus valores de Firebase (puedes copiar este molde y pegar tus claves):
    ```dart
    import 'package:firebase_core/firebase_core.dart';

    const FirebaseOptions firebaseWebPro = FirebaseOptions(
      apiKey: 'TU_API_KEY',
      appId: 'TU_APP_ID',
      messagingSenderId: 'TU_MESSAGING_SENDER_ID',
      projectId: 'TU_PROJECT_ID',
      authDomain: 'TU_DOMINIO.firebaseapp.com',
      storageBucket: 'TU_BUCKET.appspot.com',
      measurementId: 'G-XXXXXXX',
    );

    const FirebaseOptions firebaseAndroidPro = FirebaseOptions(
      apiKey: 'TU_API_KEY',
      appId: 'TU_APP_ID',
      messagingSenderId: 'TU_MESSAGING_SENDER_ID',
      projectId: 'TU_PROJECT_ID',
      storageBucket: 'TU_BUCKET.appspot.com',
    );

    const FirebaseOptions firebaseIosPro = FirebaseOptions(
      apiKey: 'TU_API_KEY',
      appId: 'TU_APP_ID',
      messagingSenderId: 'TU_MESSAGING_SENDER_ID',
      projectId: 'TU_PROJECT_ID',
      storageBucket: 'TU_BUCKET.appspot.com',
      iosBundleId: 'com.tuempresa.marketpet',
    );
    ```

## Guía rápida multiplataforma (Firebase y Flutter por separado)
1. **Autentícate en Firebase CLI y selecciona proyecto**
   ```bash
   npm install -g firebase-tools           # si aún no lo tienes
   firebase login                         # usa tu cuenta de owner
   firebase use <id_proyecto>             # selecciona el proyecto productivo
   ```
2. **Registra apps en la consola de Firebase**
   - Android: registra el `package name` definitivo y descarga `google-services.json`.
   - iOS/macOS: registra los `bundle id` definitivos y descarga `GoogleService-Info.plist` para cada plataforma.
   - Web: crea la app web, copia las claves para completar `firebase_options.dart` o usa `Firebase.initializeApp` con `FirebaseOptions`.
3. **Coloca los archivos en el proyecto**
   - Copia los JSON/PLIST en las rutas indicadas y añade `firebase_options.dart` con los valores correctos.
   - Revisa que `android/app/build.gradle` tenga aplicado el plugin `com.google.gms.google-services` y `ios/Runner` tenga los frameworks de Firebase.
4. **Firmar builds de producción**
   - Android: genera `key.jks`, crea `android/key.properties` y referencia en `android/app/build.gradle`.
   - iOS/macOS: usa certificados y perfiles de aprovisionamiento *Release* en Xcode.
5. **Correr y probar por plataforma**
   ```bash
   flutter run -d <dispositivo_android>   # o -d ios, -d macos, -d chrome
   ```
6. **Construir artefactos de release por separado**
   ```bash
   flutter build apk --release
   flutter build ios --release
   flutter build macos --release
   flutter build web --release
   ```

## Checklist de Firebase para producción
1. **Proyecto y apps registradas (Android, iOS, Web, macOS)**
   - Registra cada app con el `package name` / `bundle id` definitivo y sube los archivos de configuración a las rutas indicadas.
   - Activa Dynamic Links si los usarás para compartir foros o microservicios.
2. **Autenticación**
   - Activa Email/Password y personaliza las plantillas de correo en español.
   - Habilita dominios autorizados en Web y revisa reCAPTCHA si usas Phone/Auth anónimo.
3. **Firestore (colecciones en español)**
   - Colecciones: `users`, `mascotas`, `proveedores`, `proveedores/{id}/microservicios`, `foros`, `config`.
   - Reglas de partida:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /users/{usuarioId} {
           allow read, write: if request.auth != null && request.auth.uid == usuarioId;
         }
         match /mascotas/{mascotaId} {
           allow read, write: if request.auth != null && request.auth.uid == request.resource.data.idDueno;
         }
         match /proveedores/{proveedorId} {
           allow read, write: if request.auth != null && request.auth.uid == proveedorId;
           match /microservicios/{microId} {
             allow read, write: if request.auth != null && request.auth.uid == proveedorId;
           }
         }
         match /foros/{foroId} {
           allow read, write: if request.auth != null;
         }
         match /config/{docId} {
           allow read, write: if request.auth != null && request.auth.token.admin == true;
         }
       }
     }
     ```
   - Activa modo de producción, prueba con el simulador y genera índices si Firestore los solicita.
4. **Storage (fotos de mascotas y microservicios)**
   - Habilita Storage con reglas basadas en `request.auth != null` y separa buckets por entorno (prod/staging).
5. **Crashlytics y Analytics**
   - Activa Crashlytics, lanza un crash de prueba en *release* y confirma recepción.
   - Define eventos clave en `FirebaseAnalytics`: login/registro, creación de mascota, creación de foro, pago WebPay.
6. **Mensajería (FCM) y App Check**
   - Genera la server key y configura App Check (DeviceCheck, Play Integrity, reCAPTCHA v3) para proteger Firestore/Storage.
7. **Hosting/Funciones opcionales**
   - Si publicas el panel web de envíos, sirve `build/web` en Firebase Hosting o tu CDN.
   - Usa Cloud Functions para notificaciones post-pago WebPay o ajustes de inventario.
8. **Monitoreo y roles**
   - Configura roles por equipo en la consola, habilita alertas de facturación y de Crashlytics.

### Colecciones y campos en español
- `users`: `uid`, `email`, `rol` (`cliente`, `proveedor`, `admin`), `esPremium`, `creadoEn`, `actualizadoEn`.
- `mascotas`: `nombre`, `especie`, `raza`, `edad`, `peso`, `notas`, `idDueno` (uid), `creadoEn`.
- `proveedores`: `servicioPrincipal`, `detalleServicios`, `zonaCobertura`, `costosOperativos`, `ingresosAcumulados`, `suscripcionActiva`, `microservicios[]`, `creadoEn`.
- `proveedores/{id}/microservicios`: `nombre`, `descripcion`, `precio`, `imagenUrl`, `creadoEn`.
- `foros`: `titulo`, `descripcion`, `creadorId`, `miembros[]`, `creadoEn`.
- `config/precios`: `premiumMensual`, `cuotaProveedor`, `actualizadoEn`.

## Comandos en la terminal
Ejecuta los de Firebase desde cualquier ruta y los de Flutter dentro de `App_flutter`.

**Firebase CLI**
- `firebase login` (una sola vez por dispositivo)
- `firebase use <id_proyecto>` (elige el proyecto productivo)
- `firebase deploy --only firestore:rules,storage` (sube reglas seguras)
- `firebase deploy --only hosting` (si publicas el panel web de envíos)

**Flutter**
- `flutter pub get`
- `dart format lib`
- `flutter run -d <dispositivo>` (usa `chrome` para web)
- `flutter build apk --release`
- `flutter build ios --release`
- `flutter build macos --release`
- `flutter build web --release`
- `flutter test`

## Estructura de pantallas (todas en español)
- **pantalla_autenticacion.dart**: login/registro con selección de rol y formulario inicial de proveedor.
- **pestanas_principales.dart**: navegación de cliente con pestañas de Mascotas, Explorar, Foros, Premium y Tienda WebPay.
- **pagina_mascotas.dart**: CRUD de mascotas en Firestore.
- **pagina_explorar.dart**: listado de tiendas, parques y servicios cercanos.
- **pagina_foros.dart**: creación y unión a foros comunitarios.
- **pagina_premium.dart**: activación/cancelación de plan premium y beneficios.
- **pagina_tienda_webpay.dart**: flujo simulado de pago WebPay y seguimiento web.
- **inicio_proveedores.dart**: panel para proveedores (servicio principal, microservicios, márgenes y suscripción).
- **inicio_admin.dart**: panel admin para precios de suscripción, cambio de roles y métricas de negocio.

## Flujo por rol
- **Cliente**: se autentica, gestiona mascotas, puede explorar servicios, crear/entrar a foros, activar Premium y comprar por WebPay.
- **Proveedor**: completa formulario de servicio, publica microservicios con precios y monitorea suscripción/margen.
- **Admin**: ajusta precios de suscripción, cambia roles de usuarios y visualiza métricas de negocio.

¡Listo! Con esta guía puedes preparar Firebase y ejecutar la app para llevar MarketPet a producción.
