import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
import { X, Dumbbell, Activity, Calendar, Award, LogIn } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = Math.min(width * 0.85, 400);

type Step = {
    title: string;
    description: string;
    icon: React.ReactNode;
};

const guideSteps: Step[] = [
    {
        title: "Welcome to Fun Fitness!",
        description: "Your ultimate fitness companion. Let's take a quick tour to get you started on your journey to greatness.",
        icon: <Dumbbell size={64} color={Colors.urbanNeon.primary} />
    },
    {
        title: "Log & Track",
        description: "Effortlessly log your workouts, reps, and sets. Watch your progress graphs climb as you consistently put in the work.",
        icon: <Activity size={64} color={Colors.urbanNeon.accent} />
    },
    {
        title: "Programs & Plans",
        description: "Access curated programs designed to challenge you, whether you're a beginner or a seasoned lifter.",
        icon: <Calendar size={64} color={Colors.urbanNeon.secondary} />
    },
    {
        title: "Stay Consistent",
        description: "Earn achievements, hit personal bests, and maintain a blazing streak by simply showing up every day.",
        icon: <Award size={64} color={Colors.urbanNeon.tertiary} />
    },
];

type Props = {
    visible: boolean;
    onClose: () => void;
};

export const UserGuideModal: React.FC<Props> = ({ visible, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const theme = Colors.urbanNeon;

    const handleNext = () => {
        if (currentStep < guideSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onClose();
        }
    };

    const handleLoginAction = () => {
        onClose();
        router.push('/login');
    };

    const currentData = guideSteps[currentStep];

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { backgroundColor: theme.surface }]}>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <X size={24} color={theme.text} />
                    </TouchableOpacity>

                    <View style={styles.contentContainer}>
                        <View style={styles.iconContainer}>
                            {currentData.icon}
                        </View>

                        <Text style={[styles.title, { color: theme.text }]}>{currentData.title}</Text>
                        <Text style={[styles.description, { color: theme.textSecondary }]}>
                            {currentData.description}
                        </Text>
                    </View>

                    {/* Progress Indicators */}
                    <View style={styles.progressContainer}>
                        {guideSteps.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.progressDot,
                                    { backgroundColor: index === currentStep ? theme.primary : theme.border }
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.actionContainer}>
                        {!isAuthenticated && (
                            <TouchableOpacity
                                style={[styles.loginButton, { borderColor: theme.border }]}
                                onPress={handleLoginAction}
                            >
                                <LogIn size={20} color={theme.text} style={{ marginRight: 8 }} />
                                <Text style={[styles.loginText, { color: theme.text }]}>Login Now</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.nextButton, { backgroundColor: theme.primary }]}
                            onPress={handleNext}
                        >
                            <Text style={[styles.nextText, { color: '#000' }]}>
                                {currentStep === guideSteps.length - 1 ? 'Get Started' : 'Next'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 8,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
    },
    contentContainer: {
        alignItems: 'center',
        marginTop: 20,
        minHeight: 220, // Prevents jumping content
    },
    iconContainer: {
        marginBottom: 24,
        padding: 24,
        borderRadius: 40,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 24,
        gap: 8,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    actionContainer: {
        width: '100%',
        gap: 12,
    },
    nextButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    nextText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 1,
    },
    loginText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
