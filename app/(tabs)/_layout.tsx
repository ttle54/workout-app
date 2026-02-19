import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '../../constants/Colors';
import { LayoutDashboard, PlusCircle, History, Timer, BookOpen, Dumbbell, Banana } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
    const colorScheme = 'dark'; // Force dark mode for this premium look

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.dark.tabIconSelected,
                tabBarInactiveTintColor: Colors.dark.tabIconDefault,
                tabBarStyle: {
                    backgroundColor: Colors.dark.surface,
                    borderTopColor: Colors.dark.border,
                    height: Platform.OS === 'ios' ? 96 : 70,
                    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
                    paddingTop: 8,
                },
            }}>
            <Tabs.Screen
                name="exercise"
                options={{
                    title: 'Exercise',
                    tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="progress"
                options={{
                    title: 'Progress',
                    tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="nutrition"
                options={{
                    title: 'Nutrition',
                    tabBarIcon: ({ color }) => <Banana size={24} color={color} />, // Banana icon
                }}
            />

            <Tabs.Screen
                name="track"
                options={{
                    title: 'Track',
                    href: null,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    href: null,
                }}
            />
            <Tabs.Screen
                name="timer"
                options={{
                    title: 'Timer',
                    href: null,
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    title: 'Library',
                    href: null,
                }}
            />
        </Tabs>
    );
}
