# Guía rápida: Firebase + Capacitor (web, Android e iOS)

Esta guía resume lo necesario para ejecutar la app con Firebase en web y en dispositivos físicos (Android/iOS) desde macOS con VS Code.

## 1. Dependencias previas
- Node 20+ y PNPM/NPM instalados.
- Xcode (con herramientas de línea de comandos) y CocoaPods (`sudo gem install cocoapods`) para iOS.
- Android SDK + Android Studio para Android.
- Firebase CLI opcional para emuladores/hosting.

## 2. Instalar dependencias del proyecto
```bash
npm install
```

## 3. Configuración de Firebase
1. En la consola de Firebase crea las apps para Web, Android e iOS con el **mismo proyecto** `marketpet-5bc0f`.
2. Descarga los archivos de configuración nativos y colócalos en las rutas estándar:
   - `android/app/google-services.json`
   - `ios/App/App/GoogleService-Info.plist`
3. Añade los dominios de OAuth permitidos que usarás en pruebas (por ejemplo `localhost`, `192.168.x.x` y `capacitor://localhost`).
4. Si usas entornos distintos, reemplaza las llaves en `src/environments/*.ts` o en `conexionFirebase.env` según corresponda.

> El código ya inicializa Firebase con persistencia `indexedDB` para entornos nativos y resuelve los `redirects` de Google/Facebook automáticamente.

## 4. Preparar plataformas
```bash
npx cap add android
npx cap add ios
npm run build
npx cap sync
```

## 5. Ejecutar en web
```bash
npm start
# o
ionic serve --no-open
```

## 6. Ejecutar en iPhone real (live-reload desde VS Code)
```bash
ionic capacitor run ios -l --external
```
- Conecta el iPhone por USB y selecciona el dispositivo en la ventana de Xcode que abre automáticamente.
- Acepta los permisos de red en el teléfono si se solicitan.

## 7. Ejecutar en Android físico
```bash
ionic capacitor run android -l --external
```
- Acepta el permiso de seguridad para cargar contenido desde la red local.

## 8. Sincronizar cambios después de editar el frontend
```bash
npm run build
npx cap sync
```

Con estos pasos la misma base de código funciona en web, Android e iOS aprovechando Firebase Auth/Firestore con el flujo de `redirect` en móviles.
