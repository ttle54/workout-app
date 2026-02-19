import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../constants/Colors';
import { X, Check } from 'lucide-react-native';

interface AddFoodModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (name: string, calories: number) => void;
    mealName: string;
}

export const AddFoodModal = ({ visible, onClose, onAdd, mealName }: AddFoodModalProps) => {
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');

    const handleAdd = () => {
        if (foodName && calories) {
            onAdd(foodName, parseInt(calories, 10));
            setFoodName('');
            setCalories('');
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContent}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Add to {mealName}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={Colors.dark.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Food Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Oatmeal & Berries"
                            placeholderTextColor={Colors.dark.textSecondary}
                            value={foodName}
                            onChangeText={setFoodName}
                            autoFocus
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Calories</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., 350"
                            placeholderTextColor={Colors.dark.textSecondary}
                            keyboardType="numeric"
                            value={calories}
                            onChangeText={setCalories}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.addButton, (!foodName || !calories) && styles.disabledButton]}
                        onPress={handleAdd}
                        disabled={!foodName || !calories}
                    >
                        <Check size={20} color={Colors.dark.background} />
                        <Text style={styles.addButtonText}>Add Food</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.dark.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: Colors.dark.background,
        borderRadius: 12,
        padding: 16,
        color: Colors.dark.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    addButton: {
        backgroundColor: Colors.dark.primary,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    disabledButton: {
        opacity: 0.5,
    },
    addButtonText: {
        color: Colors.dark.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
