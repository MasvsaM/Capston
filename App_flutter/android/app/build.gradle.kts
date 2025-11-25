plugins {
    id("com.android.application")
    // START: FlutterFire Configuration
    id("com.google.gms.google-services")
    // END: FlutterFire Configuration
    id("kotlin-android")
    // El plugin de Flutter debe ir después de los de Android y Kotlin.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.app_flutter"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        // Usamos Java 17, compatible con las versiones nuevas de Android
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    // Sí, Gradle marca esto como "deprecated", pero sigue funcionando.
    // Más adelante se puede migrar a compilerOptions DSL si quieres.
    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }

    defaultConfig {
        // Application ID (paquete de la app)
        applicationId = "com.example.app_flutter"

        // Valores que controla Flutter (desde android/Flutter.gradle)
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    buildTypes {
        release {
            // Por ahora firmamos con la key de debug para poder probar `--release`.
            // Cuando tengas tu key.jks, aquí ponemos la config de release real.
            signingConfig = signingConfigs.getByName("debug")

            // IMPORTANTE: No hacemos shrink de código ni de recursos aún
            isMinifyEnabled = false
            isShrinkResources = false
        }
        debug {
            // Config extra de debug (por ahora vacío)
        }
    }
}

// Este bloque lo usa Flutter internamente para encontrar el código Dart.
flutter {
    source = "../.."
}
