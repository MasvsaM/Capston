# Market

## Flujo de verificación

Para validar los cambios recientes se ejecutaron los siguientes comandos desde la carpeta `Market`:

1. `ng test --watch=false --browsers=ChromeHeadless`
2. `ng build`
3. `ionic serve --no-open`

Los dos primeros comandos permiten asegurar que las pruebas unitarias (incluidos los nuevos escenarios para el panel de proveedores y el servicio de acceso a datos) pasan correctamente y que la aplicación compila sin errores.

`ionic serve --no-open` inicia el servidor de desarrollo de Ionic sin abrir el navegador automáticamente. Es útil para verificar que la aplicación arranca adecuadamente; finaliza el proceso con `Ctrl+C` cuando ya no se necesite.

## Firebase en web, Android e iOS

La guía `docs/firebase-capacitor.md` resume cómo preparar las plataformas nativas, agregar los archivos `google-services.json` y `GoogleService-Info.plist`, y ejecutar la app con live-reload en un iPhone real desde VS Code en macOS.


