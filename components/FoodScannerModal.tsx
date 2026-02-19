import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ActivityIndicator, Alert, Platform, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';
import { X, Camera, Image as ImageIcon, Check, Loader2, Utensils } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface FoodScannerModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (name: string, calories: number, protein: number, carbs: number, fat: number, meal: string) => void;
}

export const FoodScannerModal = ({ visible, onClose, onAdd }: FoodScannerModalProps) => {
    const [step, setStep] = useState<'initial' | 'scanning' | 'result'>('initial');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [scannedResult, setScannedResult] = useState<{ name: string; calories: number; protein: number; carbs: number; fat: number } | null>(null);
    const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

    const pickImage = async (useCamera: boolean) => {
        try {
            let result;
            if (useCamera) {
                const permission = await ImagePicker.requestCameraPermissionsAsync();
                if (permission.granted === false) {
                    Alert.alert("Permission Required", "Camera access is needed to scan food.");
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.5,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.5,
                });
            }

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
                simulateScanning();
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not capture image.");
        }
    };

    const simulateScanning = () => {
        setStep('scanning');
        setTimeout(() => {
            // Mock AI Result with Macros
            const mockFoods = [
                { name: "Avocado Toast", calories: 350, protein: 12, carbs: 45, fat: 18 },
                { name: "Grilled Chicken Salad", calories: 420, protein: 45, carbs: 12, fat: 22 },
                { name: "Protein Shake", calories: 180, protein: 30, carbs: 5, fat: 3 },
                { name: "Salmon & Rice", calories: 550, protein: 40, carbs: 50, fat: 20 },
                { name: "Oatmeal & Berries", calories: 300, protein: 10, carbs: 55, fat: 6 },
            ];
            const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
            setScannedResult(randomFood);
            setStep('result');
        }, 2000);
    };

    const handleReset = () => {
        setStep('initial');
        setImageUri(null);
        setScannedResult(null);
        setSelectedMeal(null);
    };

    const handleConfirm = () => {
        if (scannedResult && selectedMeal) {
            onAdd(scannedResult.name, scannedResult.calories, scannedResult.protein, scannedResult.carbs, scannedResult.fat, selectedMeal);
            handleReset();
            onClose();
        }
    };

    const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>AI Food Scanner</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={Colors.dark.text} />
                        </TouchableOpacity>
                    </View>

                    {step === 'initial' && (
                        <View style={styles.initialContent}>
                            <View style={styles.placeholderContainer}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
                                    style={styles.placeholderImage}
                                />
                                <View style={styles.overlay}>
                                    <Text style={styles.overlayText}>Scan your meal to get instant nutrition facts</Text>
                                </View>
                            </View>
                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(true)}>
                                    <Camera size={24} color={Colors.dark.background} />
                                    <Text style={styles.actionButtonText}>Take Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.secondaryButton} onPress={() => pickImage(false)}>
                                    <ImageIcon size={24} color={Colors.dark.primary} />
                                    <Text style={styles.secondaryButtonText}>Upload</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {step === 'scanning' && (
                        <View style={styles.scanningContent}>
                            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
                            <View style={styles.scanningOverlay}>
                                <ActivityIndicator size="large" color={Colors.dark.primary} />
                                <Text style={styles.scanningText}>AI Analyzing...</Text>
                            </View>
                        </View>
                    )}

                    {step === 'result' && scannedResult && (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            <View style={styles.resultContent}>
                                <Image source={{ uri: imageUri! }} style={styles.resultImage} />

                                <View style={styles.resultCard}>
                                    <Text style={styles.detectedLabel}>Detected</Text>
                                    <Text style={styles.foodName}>{scannedResult.name}</Text>
                                    <Text style={styles.caloriesText}>{scannedResult.calories} kcal</Text>
                                    <View style={styles.macroRow}>
                                        <Text style={styles.macroText}>Protein: {scannedResult.protein}g</Text>
                                        <Text style={styles.macroText}>Carbs: {scannedResult.carbs}g</Text>
                                        <Text style={styles.macroText}>Fat: {scannedResult.fat}g</Text>
                                    </View>
                                </View>

                                <Text style={styles.mealLabel}>Add to which meal?</Text>
                                <View style={styles.mealGrid}>
                                    {meals.map((meal) => (
                                        <TouchableOpacity
                                            key={meal}
                                            style={[
                                                styles.mealOption,
                                                selectedMeal === meal && styles.mealOptionSelected
                                            ]}
                                            onPress={() => setSelectedMeal(meal)}
                                        >
                                            <Text style={[
                                                styles.mealOptionText,
                                                selectedMeal === meal && styles.mealOptionTextSelected
                                            ]}>{meal}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={[styles.confirmButton, !selectedMeal && styles.disabledButton]}
                                    onPress={() => {
                                        if (!selectedMeal) {
                                            Alert.alert("Select Meal", "Please select a meal category (e.g., Breakfast) to add this item.");
                                            return;
                                        }
                                        handleConfirm();
                                    }}
                                >
                                    <Check size={20} color={Colors.dark.background} />
                                    <Text style={styles.confirmButtonText}>Add to Log</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleReset} style={styles.retryButton}>
                                    <Text style={styles.retryText}>Retake</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    )}
                </View>
            </View>
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
        backgroundColor: Colors.dark.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        height: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    initialContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    placeholderContainer: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        position: 'relative',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    overlayText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    actionButtons: {
        gap: 12,
    },
    actionButton: {
        backgroundColor: Colors.dark.primary,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    actionButtonText: {
        color: Colors.dark.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: Colors.dark.surface,
        borderWidth: 1,
        borderColor: Colors.dark.primary,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryButtonText: {
        color: Colors.dark.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    scanningContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 24,
        borderWidth: 4,
        borderColor: Colors.dark.primary,
    },
    scanningOverlay: {
        alignItems: 'center',
        gap: 12,
    },
    scanningText: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: '600',
    },
    resultContent: {
        flex: 1,
    },
    resultImage: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        marginBottom: 16,
    },
    resultCard: {
        backgroundColor: Colors.dark.background,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    detectedLabel: {
        color: Colors.dark.primary,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    foodName: {
        color: Colors.dark.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    caloriesText: {
        color: Colors.dark.textSecondary,
        fontSize: 18,
    },
    mealLabel: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    mealGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    mealOption: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        backgroundColor: Colors.dark.background,
    },
    mealOptionSelected: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    mealOptionText: {
        color: Colors.dark.textSecondary,
        fontWeight: '600',
    },
    mealOptionTextSelected: {
        color: Colors.dark.background,
    },
    confirmButton: {
        backgroundColor: Colors.dark.success,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    confirmButtonText: {
        color: Colors.dark.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    },
    retryButton: {
        padding: 16,
        alignItems: 'center',
    },
    retryText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    macroRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    macroText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    }
});
