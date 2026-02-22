import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Mail, Lock, ArrowRight, User, Dumbbell, Apple, CircleUserRound } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { ScreenLayout } from '../components/ScreenLayout';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();
    const theme = Colors.urbanNeon;

    const handleLogin = async () => {
        if (!firstName.trim()) {
            alert('Please enter your first name');
            return;
        }
        await login(firstName, email);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/exercise');
        }
    };

    const handleSocialLogin = async (provider: string) => {
        // Mock social login
        await login('Alex', `alex@${provider}.com`);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/exercise');
        }
    };

    return (
        <ScreenLayout style={{ backgroundColor: theme.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Dumbbell size={48} color={theme.primary} />
                        </View>
                        <Text style={[styles.title, { color: theme.text }]}>Welcome to Fun Fitness</Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                            Sign in to track your PRs, programs, and stay consistent.
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <User size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="First Name"
                                placeholderTextColor={theme.textSecondary}
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>

                        <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Mail size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Email"
                                placeholderTextColor={theme.textSecondary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Lock size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Password"
                                placeholderTextColor={theme.textSecondary}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.loginButton, { backgroundColor: theme.primary }]}
                            onPress={handleLogin}
                        >
                            <Text style={[styles.loginButtonText, { color: '#000' }]}>Let's Do It</Text>
                            <ArrowRight size={20} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <Text style={[styles.dividerText, { color: theme.textSecondary }]}>or continue with</Text>
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    </View>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => handleSocialLogin('apple')}
                        >
                            <Apple size={24} color={theme.text} />
                            <Text style={[styles.socialButtonText, { color: theme.text }]}>Apple</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => handleSocialLogin('google')}
                        >
                            <CircleUserRound size={24} color={theme.text} />
                            <Text style={[styles.socialButtonText, { color: theme.text }]}>Google</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={router.back}>
                            <Text style={[styles.link, { color: theme.textSecondary }]}>
                                Continue as Guest
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginBottom: 24,
        shadowColor: Colors.urbanNeon.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    formContainer: {
        gap: 16,
        marginBottom: 32,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    loginButton: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        gap: 8,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 14,
        fontWeight: '500',
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 40,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        height: 60,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    socialButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
    },
    link: {
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
