import "dotenv/config";

export default {
  expo: {
    name: "Find-to-Watch",
    slug: "Find-to-Watch",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "findtowatch",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.tiagofreis.FindtoWatch",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      permissions: ["NOTIFICATIONS"],
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundColor: "#ffffff",
      },
      package: "com.tiagofreis.FindtoWatch",
      googleServicesFile: "./google-services.json",
      useNextNotificationsApi: true,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/logo.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/logo.png",
          color: "#FF231F7C" 
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "8cc0eb9b-860c-40ad-a7b2-15f235a16cc4",
      },
      tmdbToken: process.env.TMDB_TOKEN, // Variável de ambiente para o token TMDB
      omdbToken: process.env.OMDB_KEY,
    },
  },
};
