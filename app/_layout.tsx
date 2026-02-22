import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { Colors } from '../constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { WorkoutProvider } from '../context/WorkoutContext';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
    const [loaded] = useFonts({
        // If we add custom fonts later, they go here.
        // 'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    const CustomDarkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            background: Colors.dark.background,
            text: Colors.dark.text,
            card: Colors.dark.surface,
            border: Colors.dark.border,
            primary: Colors.dark.primary,
        },
    };

    return (
        <AuthProvider>
            <WorkoutProvider>
                <ThemeProvider value={CustomDarkTheme}>
                    <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
                        <View style={{ flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: Colors.dark.background }}>
                            <Stack>
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
                                <Stack.Screen name="+not-found" />
                            </Stack>
                        </View>
                    </View>
                    <StatusBar style="light" />
                </ThemeProvider>
            </WorkoutProvider>
        </AuthProvider>
    );
}
