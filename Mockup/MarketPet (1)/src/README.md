# MarketPet - Ionic Angular

MarketPet es una aplicación móvil desarrollada con Ionic Angular y Firebase que conecta a dueños de mascotas con proveedores de servicios especializados (veterinarios, paseadores, cuidadores y vendedores de productos).

## 🚀 Características Principales

- **Autenticación completa**: Login/registro con email y redes sociales
- **Perfiles de mascotas**: Gestión detallada de información, vacunas e historial médico
- **Búsqueda de servicios**: Encuentra veterinarios, paseadores, grooming y más
- **Sistema de citas**: Agenda y gestiona citas con proveedores
- **Planes de suscripción**: Básico, Premium y Familiar con beneficios escalados
- **Dashboard para proveedores**: Panel especializado para gestionar servicios
- **Diseño móvil-first**: Interfaz optimizada para dispositivos móviles

## 🛠️ Tecnologías Utilizadas

- **Framework**: Ionic 7 + Angular 17
- **Backend**: Firebase (Auth, Firestore)
- **Lenguaje**: TypeScript
- **Estilos**: SCSS + Variables CSS personalizadas
- **Iconos**: Ionicons
- **Deployment**: Capacitor para iOS/Android

## 📱 Estructura de la Aplicación

```
src/
├── app/
│   ├── guards/              # Guardias de rutas
│   ├── models/              # Interfaces y modelos de datos
│   ├── pages/               # Páginas de la aplicación
│   │   ├── splash/          # Pantalla de carga inicial
│   │   ├── auth/            # Login y registro
│   │   ├── onboarding/      # Introducción para nuevos usuarios
│   │   ├── tabs/            # Navegación principal con tabs
│   │   ├── pets/            # Gestión de mascotas
│   │   ├── providers/       # Búsqueda de servicios
│   │   ├── appointments/    # Gestión de citas
│   │   └── subscription/    # Planes y suscripciones
│   ├── services/            # Servicios de la aplicación
│   │   ├── auth.service.ts  # Autenticación con Firebase
│   │   └── data.service.ts  # Gestión de datos con Firestore
│   └── app.routes.ts        # Configuración de rutas
├── environments/            # Configuración de entornos
├── theme/                   # Variables de diseño
└── global.scss             # Estilos globales
```

## 🔧 Configuración e Instalación

### 1. Prerrequisitos

```bash
# Instalar Node.js (versión 18 o superior)
# Instalar Ionic CLI
npm install -g @ionic/cli

# Instalar Angular CLI
npm install -g @angular/cli
```

### 2. Configuración del Proyecto

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd marketpet-ionic

# Instalar dependencias
npm install
```

### 3. Configuración de Firebase

1. **Crear proyecto en Firebase Console**:
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto llamado "marketpet-app"
   - Habilita Authentication y Firestore Database

2. **Configurar Authentication**:
   - Ve a Authentication > Sign-in method
   - Habilita Email/Password, Google y Facebook
   - Para Google: Agrega tu dominio en dominios autorizados
   - Para Facebook: Configura la App ID y App Secret

3. **Configurar Firestore**:
   - Ve a Firestore Database > Crear base de datos
   - Selecciona modo de prueba (cambiar a producción después)
   - Elige una ubicación cerca de tus usuarios

4. **Obtener configuración**:
   - Ve a Configuración del proyecto > Aplicaciones web
   - Registra una nueva aplicación web
   - Copia la configuración de Firebase

5. **Actualizar archivos de configuración**:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "tu-api-key-aqui",
    authDomain: "marketpet-app.firebaseapp.com",
    projectId: "marketpet-app",
    storageBucket: "marketpet-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456789"
  }
};

// src/environments/environment.prod.ts (para producción)
export const environment = {
  production: true,
  firebase: {
    // Configuración de producción
  }
};
```

### 4. Configuración de Reglas de Firestore

```javascript
// Reglas básicas para Firestore (Firebase Console > Firestore > Reglas)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Pets collection
    match /pets/{petId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Providers collection (lectura pública, escritura solo del propietario)
    match /providers/{providerId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Appointments collection
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == resource.data.providerId);
    }
  }
}
```

## 🚀 Ejecución del Proyecto

### Desarrollo Web

```bash
# Ejecutar en el navegador
ionic serve

# O con Angular CLI
ng serve
```

### Desarrollo Móvil

```bash
# Agregar plataformas
ionic capacitor add ios
ionic capacitor add android

# Compilar y sincronizar
ionic capacitor build
ionic capacitor sync

# Ejecutar en dispositivo/simulador
ionic capacitor run ios
ionic capacitor run android

# Abrir en IDE nativo
ionic capacitor open ios
ionic capacitor open android
```

## 🔐 Configuración de Autenticación Social

### Google Sign-In

1. **Configurar en Google Cloud Console**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea credenciales OAuth 2.0
   - Agrega dominios autorizados

2. **Para aplicación móvil** (opcional):
```bash
# Instalar plugin de Google Sign-In
npm install @codetrix-studio/capacitor-google-auth

# Configurar en capacitor.config.ts
plugins: {
  GoogleAuth: {
    scopes: ['profile', 'email'],
    serverClientId: 'tu-client-id.googleusercontent.com',
    forceCodeForRefreshToken: true,
  }
}
```

### Facebook Sign-In

1. **Configurar en Facebook Developers**:
   - Ve a [Facebook Developers](https://developers.facebook.com/)
   - Crea una nueva aplicación
   - Configura Facebook Login

2. **Para aplicación móvil** (opcional):
```bash
# Instalar plugin de Facebook Login
npm install @capacitor-community/facebook-login
```

## 📊 Estructura de Datos

### Colecciones de Firestore

1. **users**: Información de usuarios
2. **pets**: Perfiles de mascotas
3. **providers**: Información de proveedores de servicios
4. **appointments**: Citas programadas
5. **reviews**: Reseñas y calificaciones

### Ejemplo de Documentos

```typescript
// Usuario
{
  uid: "user123",
  name: "Juan Pérez",
  email: "juan@email.com",
  phone: "+56912345678",
  location: "Santiago, Chile",
  planType: "Premium",
  userType: "client",
  createdAt: timestamp,
  updatedAt: timestamp
}

// Mascota
{
  id: "pet123",
  userId: "user123",
  name: "Max",
  species: "Perro",
  breed: "Golden Retriever",
  age: "3 años",
  weight: "28 kg",
  vaccinations: ["Rabia", "Parvovirus"],
  createdAt: timestamp
}
```

## 🎨 Personalización del Diseño

### Variables de Color

```scss
// src/theme/variables.scss
:root {
  --ion-color-primary: #030213;
  --ion-color-secondary: #3dc2ff;
  --ion-color-success: #2dd36f;
  --ion-color-warning: #ffc409;
  --ion-color-danger: #eb445a;
}
```

### Estilos Personalizados

```scss
// src/global.scss
.marketpet-card {
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.marketpet-button {
  --border-radius: 12px;
  height: 48px;
}
```

## 🚢 Deployment

### Web (Firebase Hosting)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Inicializar Firebase Hosting
firebase init hosting

# Compilar para producción
ionic build --prod

# Deployar
firebase deploy --only hosting
```

### Aplicación Móvil

```bash
# iOS (requiere Xcode y cuenta de Apple Developer)
ionic capacitor build ios
# Abrir en Xcode para firmar y subir a App Store

# Android (requiere Android Studio)
ionic capacitor build android
# Abrir en Android Studio para generar APK/AAB
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
ng test

# Ejecutar tests e2e
ng e2e

# Tests con cobertura
ng test --code-coverage
```

## 📈 Funcionalidades Futuras

- [ ] Chat en tiempo real entre usuarios y proveedores
- [ ] Sistema de geolocalización avanzado
- [ ] Integración con pasarelas de pago
- [ ] Notificaciones push personalizadas
- [ ] Sistema de reviews y calificaciones
- [ ] Dashboard analytics para proveedores
- [ ] Modo offline con sincronización

## 🤝 Contribución

1. Fork del repositorio
2. Crear una rama para la funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de los cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@marketpet.cl
- Issues: [GitHub Issues](tu-repositorio/issues)
- Documentación: [Wiki del proyecto](tu-repositorio/wiki)

---

**MarketPet Team** - Conectando mascotas con amor ❤️🐾