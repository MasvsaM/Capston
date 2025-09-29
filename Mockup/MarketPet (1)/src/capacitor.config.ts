import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.marketpet.app',
  appName: 'MarketPet',
  webDir: 'dist/marketpet',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#030213",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: "#030213"
    }
  }
};

export default config;