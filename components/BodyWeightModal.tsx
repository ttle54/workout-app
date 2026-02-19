import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { X, Scale } from 'lucide-react-native';
import { useWorkout } from '../context/WorkoutContext';

interface BodyWeightModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (weight: number) => void;
    currentWeight: number;
    theme?: any;
}

export const BodyWeightModal = ({ visible, onClose, onSave, currentWeight, theme }: BodyWeightModalProps) => {
    const [weight, setWeight] = useState(currentWeight?.toString() || '');
    const t = theme || Colors.dark;
    const { logWeight } = useWorkout();

    const handleSave = async () => {
        if (weight) {
            const w = parseFloat(weight);
            if (!isNaN(w)) {
                await logWeight(w);
                Alert.alert("Success", `Logged body weight: ${weight} kg`);
                setWeight('');
                onClose();
            } else {
                Alert.alert("Error", "Please enter a valid number");
            }
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Scale size={24} color={Colors.dark.primary} />
                            <Text style={styles.title}>Log Body Weight</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={Colors.dark.text} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.description}>
                        Track your weight to see your progress over time.
                    </Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="70.0"
                            placeholderTextColor={Colors.dark.textSecondary}
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={setWeight}
                            autoFocus
                        />
                        <Text style={styles.unit}>lbs</Text>
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Log</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.dark.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    description: {
        color: Colors.dark.textSecondary,
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 30,
    },
    input: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.dark.text,
        textAlign: 'center',
        width: 150,
        borderBottomWidth: 2,
        borderBottomColor: Colors.dark.primary,
        paddingBottom: 5,
    },
    unit: {
        fontSize: 24,
        color: Colors.dark.textSecondary,
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: Colors.dark.primary,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: Colors.dark.background,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
