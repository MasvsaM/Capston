# Market

## Flujo de verificación

Para validar los cambios recientes se ejecutaron los siguientes comandos desde la carpeta `Market`:

1. `ng test --watch=false --browsers=ChromeHeadless`
2. `ng build`
3. `ionic serve --no-open`

Los dos primeros comandos permiten asegurar que las pruebas unitarias (incluidos los nuevos escenarios para el panel de proveedores y el servicio de acceso a datos) pasan correctamente y que la aplicación compila sin errores.

`ionic serve --no-open` inicia el servidor de desarrollo de Ionic sin abrir el navegador automáticamente. Es útil para verificar que la aplicación arranca adecuadamente; finaliza el proceso con `Ctrl+C` cuando ya no se necesite.

> **Nota:** `ng test` requiere un ejecutable de Chrome/Chromium disponible en el entorno. Si no lo tienes instalado, instala uno compatible y exporta la ruta mediante `CHROME_BIN=/ruta/al/binario`. En entornos restringidos (como este contenedor) la descarga automática del navegador puede fallar.

> **Nota:** `ionic serve` descarga el CLI de Ionic a través del registro de npm cuando se ejecuta con `npx`. Si tu entorno bloquea el acceso al registro, instala `@ionic/cli` de forma local/global o usa un mirror accesible antes de lanzar el comando.
