import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';

// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
    android: {
        "adaptiveIcon": {
            "backgroundColor": "#ffffff",
            "foregroundImage": "./assets/images/adaptive-icon.png"
        },
        edgeToEdgeEnabled: true,
        package: "com.favour_nj.realstay",
        config: {
            googleMaps: {
                apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!
            }
        }
    },
    experiments: {
        typedRoutes: true,
        reactCompiler: true,
    },
    extra: {
        eas: {
            projectId: "56f5452c-56fe-4e31-9313-21bcd20a16df"
        },
        router: {}
    },
    icon: "./assets/images/icon.png",
    ios: {
        "bundleIdentifier": "com.favournj.realstay",
        "infoPlist": {
            "ITSAppUsesNonExemptEncryption": false
        },
        "supportsTablet": false,
        "usesIcloudStorage": true
    },
    "name": "realstay",
    newArchEnabled: true,
    "orientation": "portrait",
    "owner": "favour_nj",
    "plugins": [
        "expo-router",
        [
            "expo-splash-screen",
            {
                "backgroundColor": "#ffffff",
                "image": "./assets/images/splash-icon.png",
                "imageWidth": 200,
                "resizeMode": "contain"
            }
        ],
        [
            "expo-asset",
            {
                "assets": [
                    "./assets/images/imports/onboarding/house1.png",
                    "./assets/images/imports/onboarding/house2.png",
                    "./assets/images/imports/onboarding/house3.png",
                    "./assets/images/imports/onboarding/house4.png",
                    "./assets/images/imports/onboarding/house5.png",
                    "./assets/images/imports/logo.png"
                ]
            }
        ],
        "expo-secure-store",
        [
            "expo-image-picker",
            {
                "photosPermission": "The app accesses your photos to let you share them with your friends."
            }
        ],
        "expo-document-picker",
        [
            "expo-location",
            {
                "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location.",
                "locationWhenInUsePermission": "Show current location on map."
            }
        ],
        "expo-web-browser",
        [
            "expo-font",
            {
                "android": {
                    "fonts": [
                        {
                            "fontDefinitions": [
                                {
                                    "path": "./assets/fonts/figtree_bold.ttf",
                                    "weight": 700
                                },
                                {
                                    "path": "./assets/fonts/figtree_semibold.ttf",
                                    "weight": 600
                                },
                                {
                                    "path": "./assets/fonts/figtree_medium.ttf",
                                    "weight": 500
                                },
                                {
                                    "path": "./assets/fonts/figtree_regular.ttf",
                                    "weight": 400
                                }
                            ],
                            "fontFamily": "Figtree"
                        }
                    ]
                },
                "fonts": [],
                "ios": {
                    "fonts": [
                        "./assets/fonts/figtree_bold.ttf",
                        "./assets/fonts/figtree_semibold.ttf",
                        "./assets/fonts/figtree_medium.ttf",
                        "./assets/fonts/figtree_regular.ttf"
                    ]
                }
            }
        ],
        "expo-localization",
    ],
    scheme: "realstay",
    slug: "realstay",
    userInterfaceStyle: "automatic",
    version: "0.1.1",
    web: {
        bundler: "metro",
        favicon: "./assets/images/favicon.png",
        output: "static"
    }
})