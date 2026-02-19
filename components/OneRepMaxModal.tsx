import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';
import { X, Calculator } from 'lucide-react-native';

interface OneRepMaxModalProps {
    visible: boolean;
    onClose: () => void;
    theme?: any;
}

export const OneRepMaxModal = ({ visible, onClose, theme }: OneRepMaxModalProps) => {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [result, setResult] = useState<number | null>(null);
    const t = theme || Colors.dark;

    const calculateORM = () => {
        const w = parseFloat(weight);
        const r = parseFloat(reps);

        if (w && r) {
            // Epley Formula: 1RM = Weight * (1 + Reps/30)
            const orm = w * (1 + r / 30);
            setResult(Math.round(orm));
        } else {
            setResult(null);
        }
    };

    const percentages = [95, 90, 85, 80, 75, 70, 65, 60, 50];

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
                            <Calculator size={24} color={Colors.dark.primary} />
                            <Text style={styles.title}>1RM Calculator</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={Colors.dark.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <Text style={styles.description}>
                            Estimate your one-rep max based on your performance.
                        </Text>

                        <View style={styles.inputRow}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Weight (lbs)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    placeholderTextColor={Colors.dark.textSecondary}
                                    keyboardType="numeric"
                                    value={weight}
                                    onChangeText={setWeight}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Reps</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    placeholderTextColor={Colors.dark.textSecondary}
                                    keyboardType="numeric"
                                    value={reps}
                                    onChangeText={setReps}
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.calcButton} onPress={calculateORM}>
                            <Text style={styles.calcButtonText}>Calculate</Text>
                        </TouchableOpacity>

                        {result !== null && (
                            <View style={styles.resultContainer}>
                                <Text style={styles.resultLabel}>Estimated 1 Rep Max</Text>
                                <Text style={styles.resultValue}>{result} lbs</Text>

                                <View style={styles.table}>
                                    <View style={styles.tableHeader}>
                                        <Text style={styles.tableHeaderText}>% of 1RM</Text>
                                        <Text style={styles.tableHeaderText}>Weight</Text>
                                    </View>
                                    {percentages.map((p) => (
                                        <View key={p} style={styles.tableRow}>
                                            <Text style={styles.tableText}>{p}%</Text>
                                            <Text style={[styles.tableText, { fontWeight: 'bold', color: Colors.dark.text }]}>
                                                {Math.round(result * (p / 100))} lbs
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </ScrollView>
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
        height: '80%',
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
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    inputContainer: {
        flex: 1,
    },
    label: {
        color: Colors.dark.text,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        padding: 16,
        color: Colors.dark.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    calcButton: {
        backgroundColor: Colors.dark.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 30,
    },
    calcButtonText: {
        color: Colors.dark.background,
        fontWeight: 'bold',
        fontSize: 16,
    },
    resultContainer: {
        alignItems: 'center',
    },
    resultLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
        marginBottom: 4,
    },
    resultValue: {
        color: Colors.dark.primary,
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    table: {
        width: '100%',
        backgroundColor: Colors.dark.surface,
        borderRadius: 16,
        padding: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
        paddingBottom: 8,
    },
    tableHeaderText: {
        color: Colors.dark.textSecondary,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    tableText: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
    },
});
