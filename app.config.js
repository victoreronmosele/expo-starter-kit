// app.config.js
import 'dotenv/config';

export default {
  name: "Kinde-Expo-Starter-Kit",
  slug: "Kinde-Expo-Starter-Kit",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "kindeexpostarterkit",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    imageWidth: 200,
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    // Kinde configuration
    EXPO_PUBLIC_KINDE_DOMAIN: process.env.EXPO_PUBLIC_KINDE_DOMAIN,
    EXPO_PUBLIC_KINDE_CLIENT_ID: process.env.EXPO_PUBLIC_KINDE_CLIENT_ID,
  }
};