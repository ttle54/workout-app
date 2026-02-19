import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { X, Play, Trash2, Dumbbell } from 'lucide-react-native';
import { useWorkout, WorkoutPreset } from '../context/WorkoutContext';

interface TemplatesModalProps {
    visible: boolean;
    onClose: () => void;
    onLoad: (preset: WorkoutPreset) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({ visible, onClose, onLoad }) => {
    const { presets, deletePreset } = useWorkout();

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Delete Template",
            `Are you sure you want to delete "${name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deletePreset(id) }
            ]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Workout Templates</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X size={24} color={Colors.dark.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    {presets.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No templates found.</Text>
                            <Text style={styles.emptySubtext}>Create a workout and tap "Save Routine".</Text>
                        </View>
                    ) : (
                        presets.map(preset => (
                            <View key={preset.id} style={styles.card}>
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardTitle}>{preset.name}</Text>
                                    <View style={styles.exercisePreview}>
                                        {preset.exercises.slice(0, 3).map((ex, i) => (
                                            <Text key={i} style={styles.previewText}>• {ex.name}</Text>
                                        ))}
                                        {preset.exercises.length > 3 && (
                                            <Text style={styles.previewText}>+ {preset.exercises.length - 3} more</Text>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={styles.loadBtn}
                                        onPress={() => onLoad(preset)}
                                    >
                                        <Play size={20} color={Colors.dark.background} fill={Colors.dark.background} />
                                        <Text style={styles.loadBtnText}>Start</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.deleteBtn}
                                        onPress={() => handleDelete(preset.id, preset.name)}
                                    >
                                        <Trash2 size={20} color={Colors.dark.error} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    closeBtn: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardInfo: {
        flex: 1,
        paddingRight: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 8,
    },
    exercisePreview: {
        gap: 2,
    },
    previewText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
    },
    actions: {
        alignItems: 'center',
        gap: 12,
    },
    loadBtn: {
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    loadBtnText: {
        color: Colors.dark.background,
        fontWeight: 'bold',
    },
    deleteBtn: {
        padding: 8,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.textSecondary,
        marginBottom: 8,
    },
    emptySubtext: {
        color: Colors.dark.textSecondary,
    }
});
