import React, { useState } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, TextInput, ScrollView, Modal, Platform } from 'react-native';
import { ScreenLayout } from '../../components/ScreenLayout';
import { Colors } from '../../constants/Colors';
import { Search, Plus, X, Info, Dumbbell, Target, Notebook } from 'lucide-react-native';
import { Exercises, Exercise } from '../../constants/Data';
import { useWorkout } from '../../context/WorkoutContext'; // Optional: Use to add directly from library if desired

const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio'];

export default function Library() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    const filteredExercises = Exercises.filter(ex =>
        (selectedCategory === 'All' || ex.category === selectedCategory) &&
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderDetailModal = () => {
        if (!selectedExercise) return null;

        return (
            <Modal
                visible={!!selectedExercise}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedExercise(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
                            <TouchableOpacity onPress={() => setSelectedExercise(null)} style={styles.closeButton}>
                                <X size={24} color={Colors.dark.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.tagContainer}>
                                <View style={styles.tag}>
                                    <Dumbbell size={14} color={Colors.dark.primary} />
                                    <Text style={styles.tagText}>{selectedExercise.category}</Text>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Target size={18} color={Colors.dark.secondary} />
                                    <Text style={styles.sectionTitle}>Muscles</Text>
                                </View>
                                <Text style={styles.bodyText}>{selectedExercise.muscles}</Text>
                            </View>

                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Info size={18} color={Colors.dark.warning} />
                                    <Text style={styles.sectionTitle}>Instructions</Text>
                                </View>
                                <Text style={styles.bodyText}>{selectedExercise.description}</Text>
                            </View>

                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Notebook size={18} color={Colors.dark.success} />
                                    <Text style={styles.sectionTitle}>Benefits</Text>
                                </View>
                                {selectedExercise.benefits.map((benefit, index) => (
                                    <View key={index} style={styles.bulletPoint}>
                                        <View style={styles.bullet} />
                                        <Text style={styles.bodyText}>{benefit}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.doneButton}
                            onPress={() => setSelectedExercise(null)}
                        >
                            <Text style={styles.doneButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <ScreenLayout>
            <Text style={styles.title}>Exercise Library</Text>

            <View style={styles.searchContainer}>
                <Search size={20} color={Colors.dark.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search exercises..."
                    placeholderTextColor={Colors.dark.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryChip,
                                selectedCategory === cat && styles.categoryChipActive
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === cat && styles.categoryTextActive
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredExercises}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.exerciseItem}
                        onPress={() => setSelectedExercise(item)}
                    >
                        <View style={styles.exerciseInfo}>
                            <Text style={styles.exerciseName}>{item.name}</Text>
                            <Text style={styles.exerciseMuscles} numberOfLines={1}>{item.category} • {item.muscles}</Text>
                        </View>
                        <View style={styles.infoButton}>
                            <Info size={20} color={Colors.dark.primary} />
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {renderDetailModal()}
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 16,
    },
    categoriesContainer: {
        marginBottom: 16,
        height: 36,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: Colors.dark.surface,
        marginRight: 8,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    categoryChipActive: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    categoryText: {
        color: Colors.dark.textSecondary,
        fontWeight: '600',
    },
    categoryTextActive: {
        color: Colors.dark.background,
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 20,
    },
    exerciseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    exerciseMuscles: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    infoButton: {
        padding: 8,
        backgroundColor: 'rgba(10, 255, 255, 0.1)',
        borderRadius: 8,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: Colors.dark.background,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        borderRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    tagContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(10, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    tagText: {
        color: Colors.dark.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    bodyText: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        gap: 12,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.dark.textSecondary,
        marginTop: 9,
    },
    doneButton: {
        backgroundColor: Colors.dark.surface,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    doneButtonText: {
        color: Colors.dark.text,
        fontWeight: 'bold',
        fontSize: 16,
    }
});
