MarketPet

MarketPet es una aplicación web y móvil desarrollada con Ionic y Angular que funciona como intermediario entre proveedores y clientes de productos y servicios para animales domésticos, exóticos y de granja.

La aplicación permite:

Registro y gestión de perfiles de clientes y proveedores.

Publicación y contratación de servicios y productos.

Registro de mascotas con ficha completa (nombre, edad, especie, vacunas, foto, etc.).

Suscripción a un plan Premium que ofrece feed personalizado y sin anuncios.

Análisis de comportamiento de clientes mediante minería de datos para mostrar tendencias.

Agenda de compras y servicios con recordatorios.

Lenguajes y Tecnologías

Frontend: TypeScript, HTML, CSS

Framework: Angular 20, Ionic 8

Backend (API): Node.js / Express (en carpeta separada)

Mobile: Capacitor 7

DEPENDENCIAS DEL PROYECTO

Dependencias principales

| Paquete                           | Versión |
| --------------------------------- | ------- |
| @angular/animations               | 20.0.0  |
| @angular/common                   | 20.0.0  |
| @angular/compiler                 | 20.0.0  |
| @angular/core                     | 20.0.0  |
| @angular/forms                    | 20.0.0  |
| @angular/platform-browser         | 20.0.0  |
| @angular/platform-browser-dynamic | 20.0.0  |
| @angular/router                   | 20.0.0  |
| @capacitor/app                    | 7.1.0   |
| @capacitor/core                   | 7.4.3   |
| @capacitor/haptics                | 7.0.2   |
| @capacitor/keyboard               | 7.0.3   |
| @capacitor/status-bar             | 7.0.3   |
| @ionic/angular                    | 8.0.0   |
| ionicons                          | 7.0.0   |
| rxjs                              | 7.8.0   |
| tslib                             | 2.3.0   |
| zone.js                           | 0.15.0  |

Dependencias de desarrollo
| Paquete                                | Versión |
| -------------------------------------- | ------- |
| @angular-devkit/build-angular          | 20.0.0  |
| @angular-eslint/builder                | 20.0.0  |
| @angular-eslint/eslint-plugin          | 20.0.0  |
| @angular-eslint/eslint-plugin-template | 20.0.0  |
| @angular-eslint/schematics             | 20.0.0  |
| @angular-eslint/template-parser        | 20.0.0  |
| @angular/cli                           | 20.0.0  |
| @angular/compiler-cli                  | 20.0.0  |
| @angular/language-service              | 20.0.0  |
| @capacitor/cli                         | 7.4.3   |
| @ionic/angular-toolkit                 | 12.0.0  |
| @types/jasmine                         | 5.1.0   |
| @typescript-eslint/eslint-plugin       | 8.18.0  |
| @typescript-eslint/parser              | 8.18.0  |
| eslint                                 | 9.16.0  |
| eslint-plugin-import                   | 2.29.1  |
| eslint-plugin-jsdoc                    | 48.2.1  |
| eslint-plugin-prefer-arrow             | 1.2.2   |
| jasmine-core                           | 5.1.0   |
| jasmine-spec-reporter                  | 5.0.0   |
| karma                                  | 6.4.0   |
| karma-chrome-launcher                  | 3.2.0   |
| karma-coverage                         | 2.2.0   |
| karma-jasmine                          | 5.1.0   |
| karma-jasmine-html-reporter            | 2.1.0   |
| typescript                             | 5.8.0   |



Scripts disponibles

| Comando         | Descripción                                         |
| --------------- | --------------------------------------------------- |
| `npm start`     | Levanta el proyecto en modo desarrollo (`ng serve`) |
| `npm run build` | Compila el proyecto para producción                 |
| `npm run watch` | Compila el proyecto en modo watch (desarrollo)      |
| `npm test`      | Ejecuta pruebas unitarias                           |
| `npm run lint`  | Ejecuta ESLint para revisar errores de código       |



Estructura de carpetas
marketpet/
├─ frontend/          # Aplicación Ionic/Angular
│  ├─ src/
│  │  ├─ app/         # Páginas y componentes
│  │  ├─ assets/      # Imágenes y recursos
│  │  └─ environments/
├─ backend/           # API y servicios
├─ package.json
├─ README.md
└─ ...

