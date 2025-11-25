# App_flutter

Aplicación Flutter conectada a Firebase para el ecosistema **MarketPet**. Todas las pantallas y variables están en español. Sigue esta guía paso a paso para dejar Firebase listo para producción y ejecutar la app.

## Requisitos locales
- Flutter 3.19+ y Dart 3+ instalados.
- Cuenta de Firebase con permisos de propietario.
- Archivos de configuración generados por `flutterfire configure`:
  - `android/app/google-services.json`
  - `ios/Runner/GoogleService-Info.plist` y `macos/Runner/GoogleService-Info.plist`
  - `lib/firebase_options.dart` ya incluido.

## Checklist de Firebase para producción
1. **Proyecto y apps registradas (Android, iOS, Web, macOS)**
   - Crea/selecciona el proyecto en Firebase y registra las apps Android, iOS, Web y macOS con los `package name` finales.
   - Descarga y coloca los archivos de configuración en las rutas indicadas arriba (usa `flutterfire configure` para regenerarlos cuando cambies IDs de app o agregues plataformas nuevas).
   - Android: define el SHA-1/256 de release en Firebase > Configuración del proyecto > Tus apps para que funcione autenticación y Dynamic Links.
   - iOS/macOS: crea el archivo `Runner/GoogleService-Info.plist` para cada plataforma y habilita `Push Notifications` + `Background Modes` en Xcode si usarás FCM.
   - Web: agrega los dominios productivos en Authentication y (si usas Hosting) en la configuración de hosting o tu CDN.

2. **Autenticación**
   - Activa Email/Password y desactiva proveedores que no usarás en producción.
   - Personaliza las plantillas de correo (verificación y restablecimiento) en español.
   - En Web, agrega tus dominios productivos en **Authentication > Configuración > Dominios autorizados**.

3. **Firestore**
   - Crea las colecciones que usa la app: `users`, `mascotas`, `proveedores`, `proveedores/{id}/microservicios`, `foros`.
   - Campos clave en español (los verás en el código): `users.rol`, `users.esPremium`, `mascotas.idDueno`, `mascotas.nombre`, `proveedores.servicioPrincipal`, `microservicios.nombre`.
   - Reglas de partida (ajusta a tus necesidades):
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
       }
     }
     ```
   - Pasa a modo de producción (no uses modo de prueba) y prueba las reglas con el simulador.
   - Crea índices compuestos si Firestore te los sugiere en las consultas.

4. **Storage (si usas fotos/archivos)**
   - Activa Storage y usa reglas que restrinjan por `request.auth != null`.
   - Para separar entornos, crea buckets independientes de producción/staging.

5. **Crashlytics y Analytics**
   - Activa Crashlytics y genera un crash de prueba desde una build release para verificar reportes.
   - Define eventos mínimos en Analytics (inicio de sesión, creación de mascota, pago WebPay simulado) usando `FirebaseAnalytics`.

6. **Mensajería (FCM) y App Check**
   - Genera la clave del servidor (Server key) y guárdala en un gestor seguro.
   - Activa App Check (DeviceCheck/Integrity/recaptcha) para proteger Firestore y Storage (Android, iOS y Web tienen proveedores específicos).

7. **Monitoreo y alertas**
   - Configura roles por equipo en Firebase Console y elimina accesos innecesarios.
   - Activa alertas de Crashlytics y facturación por correo o Slack.

8. **Firmas y despliegue**
   - Android: genera `key.jks`, configura `key.properties` y actualiza `android/app/build.gradle` con `signingConfigs { release {} }`.
   - iOS/macOS: crea certificados y perfiles de aprovisionamiento; en Xcode usa esquema `Release` y registra `Bundle ID` definitivo.
   - Web: habilita `flutter config --enable-web`, construye con `flutter build web --release` y sirve la carpeta `build/web` en Hosting/CDN.

## Comandos en la terminal
Ejecuta todos desde la carpeta `App_flutter`:
- Instalar dependencias: `flutter pub get`
- Formatear código: `dart format lib`
- Ver dependencias de Firebase: `flutterfire configure`
- Lanzar app en Android/iOS/web: `flutter run -d <dispositivo>` (usa `chrome` para web)
- Generar builds de producción: `flutter build apk --release`, `flutter build ios --release`, `flutter build web --release`
- Probar (si tienes Flutter SDK en el entorno): `flutter test`

## Estructura de pantallas (todas en español)
- **pantalla_autenticacion.dart**: login/registro con selección de rol y formulario inicial de proveedor.
- **pestanas_principales.dart**: navegación de cliente con pestañas de Mascotas, Explorar, Foros, Premium y Tienda WebPay.
- **pagina_mascotas.dart**: CRUD de mascotas en Firestore.
- **pagina_explorar.dart**: listado de tiendas, parques y servicios cercanos.
- **pagina_foros.dart**: creación y unión a foros comunitarios.
- **pagina_premium.dart**: activación/cancelación de plan premium y beneficios.
- **pagina_tienda_webpay.dart**: flujo simulado de pago WebPay y seguimiento web.
- **inicio_proveedores.dart**: panel para proveedores (servicio principal, microservicios, márgenes y suscripción).
- **inicio_admin.dart**: panel admin para precios, roles, métricas y conexión de dashboards.

## Flujo por rol
- **Cliente**: se autentica, gestiona mascotas, puede explorar servicios, crear/entrar a foros, activar Premium y comprar por WebPay.
- **Proveedor**: completa formulario de servicio, publica microservicios con precios y monitorea suscripción/margen.
- **Admin**: ajusta precios de suscripción, cambia roles de usuarios y visualiza métricas de negocio.

¡Listo! Con esta guía puedes preparar Firebase y ejecutar la app para llevar MarketPet a producción.
