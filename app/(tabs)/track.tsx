import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenLayout } from '../../components/ScreenLayout';
import { Colors } from '../../constants/Colors';
import { Plus, Trash2, Check, Clock, BookTemplate, Save, LayoutList } from 'lucide-react-native';
import { ExerciseSelector } from '../../components/ExerciseSelector';
import { TemplatesModal } from '../../components/TemplatesModal';
import { useWorkout, WorkoutExercise, WorkoutSet, CompletedWorkout, WorkoutPreset } from '../../context/WorkoutContext';

export default function Track() {
    const { saveWorkout, savePreset } = useWorkout();
    const [duration, setDuration] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [templatesVisible, setTemplatesVisible] = useState(false);
    const [workout, setWorkout] = useState<WorkoutExercise[]>([]);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive) {
            interval = setInterval(() => {
                setDuration(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerActive]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hours > 0 ? hours + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Workout Logic
    const addExercise = (exercise: any) => {
        const newExercise: WorkoutExercise = {
            id: Math.random().toString(),
            exerciseId: exercise.id,
            name: exercise.name,
            sets: [
                { id: Math.random().toString(), weight: '', reps: '', completed: false }
            ]
        };
        setWorkout([...workout, newExercise]);
    };

    const loadPreset = (preset: WorkoutPreset) => {
        // Confirm overwrite if workout not empty
        const applyPreset = () => {
            const newWorkout = preset.exercises.map(ex => ({
                ...ex,
                id: Math.random().toString(),
                sets: ex.sets.map(s => ({ ...s, id: Math.random().toString(), completed: false, weight: '', reps: '' })) // Reset vals
            }));
            setWorkout(newWorkout);
            setDuration(0);
            setIsTimerActive(true);
            setTemplatesVisible(false);
        };

        if (workout.length > 0) {
            Alert.alert(
                "Overwrite Workout?",
                "Loading a template will clear your current progress.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Load", style: "destructive", onPress: applyPreset }
                ]
            );
        } else {
            applyPreset();
        }
    };

    const handleSavePreset = () => {
        if (workout.length === 0) return;

        const save = (name: string) => {
            const newPreset: WorkoutPreset = {
                id: Math.random().toString(),
                name: name || "My Custom Routine",
                exercises: workout.map(ex => ({
                    ...ex,
                    sets: ex.sets.map(s => ({ ...s, weight: '', reps: '', completed: false })) // Strip data
                }))
            };
            savePreset(newPreset);
            Alert.alert("Success", "Routine saved to templates!");
        };

        if (Platform.OS === 'ios') {
            Alert.prompt(
                "Save Routine",
                "Enter a name for this template:",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Save", onPress: (text?: string) => save(text || "") }
                ],
                "plain-text"
            );
        } else if (Platform.OS === 'web') {
            const name = window.prompt("Enter a name for this template:");
            if (name) save(name);
        } else {
            // Android fallback (simplified)
            save(`Routine ${new Date().toLocaleDateString()}`);
        }
    };

    const removeExercise = (exerciseIndex: number) => {
        const newWorkout = [...workout];
        newWorkout.splice(exerciseIndex, 1);
        setWorkout(newWorkout);
    };

    const addSet = (exerciseIndex: number) => {
        const newWorkout = [...workout];
        const previousSet = newWorkout[exerciseIndex].sets[newWorkout[exerciseIndex].sets.length - 1];

        newWorkout[exerciseIndex].sets.push({
            id: Math.random().toString(),
            weight: previousSet ? previousSet.weight : '', // Copy previous weight
            reps: previousSet ? previousSet.reps : '',     // Copy previous reps
            completed: false
        });
        setWorkout(newWorkout);
    };

    const removeSet = (exerciseIndex: number, setIndex: number) => {
        const newWorkout = [...workout];
        newWorkout[exerciseIndex].sets.splice(setIndex, 1);
        setWorkout(newWorkout);
    };

    const updateSet = (exerciseIndex: number, setIndex: number, field: keyof WorkoutSet, value: any) => {
        const newWorkout = [...workout];
        // @ts-ignore
        newWorkout[exerciseIndex].sets[setIndex][field] = value;
        setWorkout(newWorkout);
    };

    const finishWorkout = () => {
        if (workout.length === 0) {
            if (Platform.OS === 'web') {
                window.alert("Add some exercises first!");
            } else {
                Alert.alert("Empty Workout", "Add some exercises first!");
            }
            return;
        }

        const saveAndReset = () => {
            const completedWorkout: CompletedWorkout = {
                id: Math.random().toString(),
                date: new Date(),
                name: "Workout Session", // Could enhance to ask for name or use Preset name
                durationSeconds: duration,
                exercises: workout
            };

            saveWorkout(completedWorkout);
            setWorkout([]);
            setDuration(0);
            setIsTimerActive(false);

            if (Platform.OS === 'web') {
                window.alert("Your progress has been recorded in History.");
            } else {
                Alert.alert("Workout Saved!", "Your progress has been recorded in History.");
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm("Great job! Finish and save workout?")) {
                saveAndReset();
            }
        } else {
            Alert.alert(
                "Finish Workout?",
                "Great job! Provide a quick confirmation to save.",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Finish",
                        style: "default",
                        onPress: saveAndReset
                    }
                ]
            );
        }
    };

    return (
        <ScreenLayout>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Track Workout</Text>
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                            <TouchableOpacity onPress={() => setTemplatesVisible(true)}>
                                <Text style={styles.linkText}>Templates</Text>
                            </TouchableOpacity>
                            {workout.length > 0 && (
                                <TouchableOpacity onPress={handleSavePreset}>
                                    <Text style={styles.linkText}>Save Routine</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.finishButton, { opacity: workout.length === 0 ? 0.5 : 1 }]}
                        onPress={finishWorkout}
                        disabled={workout.length === 0}
                    >
                        <Text style={styles.finishText}>Finish</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statusBar}>
                    <TouchableOpacity
                        style={styles.timerContainer}
                        onPress={() => setIsTimerActive(!isTimerActive)}
                    >
                        <Clock size={20} color={isTimerActive ? Colors.dark.primary : Colors.dark.textSecondary} />
                        <Text style={[styles.timer, { color: isTimerActive ? Colors.dark.primary : Colors.dark.textSecondary }]}>
                            {formatTime(duration)}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {workout.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Start by adding an exercise</Text>
                        </View>
                    ) : null}

                    {workout.map((ex, exIndex) => (
                        <View key={ex.id} style={styles.exerciseCard}>
                            <View style={styles.exerciseHeader}>
                                <Text style={styles.exerciseName}>{ex.name}</Text>
                                <TouchableOpacity onPress={() => removeExercise(exIndex)} style={styles.deleteButton}>
                                    <Trash2 size={20} color={Colors.dark.error} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.headersRow}>
                                <View style={{ flex: 1, alignItems: 'center' }}><Text style={styles.colHeader}>Set</Text></View>
                                <View style={{ flex: 2.5, alignItems: 'center' }}><Text style={styles.colHeader}>lbs</Text></View>
                                <View style={{ flex: 2.5, alignItems: 'center' }}><Text style={styles.colHeader}>Reps</Text></View>
                                <View style={{ flex: 1, alignItems: 'center' }}><Text style={styles.colHeader}>✓</Text></View>
                            </View>

                            {ex.sets.map((set, setIndex) => (
                                <View key={set.id} style={[styles.setRow, set.completed && styles.setRowCompleted]}>
                                    <View style={styles.colContainerSmall}>
                                        <Text style={[styles.setNumber, set.completed && styles.textCompleted]}>{setIndex + 1}</Text>
                                    </View>

                                    <View style={styles.colContainerLarge}>
                                        <TextInput
                                            style={[styles.input, set.completed && styles.inputCompleted]}
                                            placeholder="-"
                                            placeholderTextColor={Colors.dark.textSecondary}
                                            keyboardType="numeric"
                                            value={set.weight}
                                            onChangeText={(text) => updateSet(exIndex, setIndex, 'weight', text)}
                                            editable={!set.completed}
                                        />
                                    </View>

                                    <View style={styles.colContainerLarge}>
                                        <TextInput
                                            style={[styles.input, set.completed && styles.inputCompleted]}
                                            placeholder="-"
                                            placeholderTextColor={Colors.dark.textSecondary}
                                            keyboardType="numeric"
                                            value={set.reps}
                                            onChangeText={(text) => updateSet(exIndex, setIndex, 'reps', text)}
                                            editable={!set.completed}
                                        />
                                    </View>

                                    <View style={styles.colContainerSmall}>
                                        <TouchableOpacity
                                            style={[styles.checkButton, set.completed && styles.checkButtonActive]}
                                            onPress={() => updateSet(exIndex, setIndex, 'completed', !set.completed)}
                                        >
                                            {set.completed && <Check size={16} color={Colors.dark.background} strokeWidth={4} />}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity style={styles.addSetButton} onPress={() => addSet(exIndex)}>
                                <Plus size={16} color={Colors.dark.primary} />
                                <Text style={styles.addSetText}>Add Set</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={styles.addExerciseButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Plus size={24} color={Colors.dark.background} />
                        <Text style={styles.addExerciseText}>Add Exercise</Text>
                    </TouchableOpacity>
                </ScrollView>

                <ExerciseSelector
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSelect={addExercise}
                />

                <TemplatesModal
                    visible={templatesVisible}
                    onClose={() => setTemplatesVisible(false)}
                    onLoad={loadPreset}
                />
            </KeyboardAvoidingView>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    finishButton: {
        backgroundColor: Colors.dark.success,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    finishText: {
        color: Colors.dark.background,
        fontWeight: 'bold',
    },
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 16,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    timer: {
        fontSize: 18,
        fontVariant: ['tabular-nums'],
        fontWeight: 'bold',
        marginLeft: 8,
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.dark.border,
        borderStyle: 'dashed',
        borderRadius: 16,
        marginBottom: 24,
    },
    emptyText: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
    },
    exerciseCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    exerciseName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    deleteButton: {
        padding: 4,
    },
    headersRow: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    colHeader: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    colContainerSmall: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colContainerLarge: {
        flex: 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4, // Internal spacing
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8, // Tighter spacing
    },
    setRowCompleted: {
        opacity: 0.5,
    },
    setNumber: {
        color: Colors.dark.textSecondary,
        fontWeight: '600',
        fontSize: 16,
    },
    textCompleted: {
        color: Colors.dark.success,
    },
    input: {
        width: '100%',
        backgroundColor: 'transparent',
        color: Colors.dark.text,
        textAlign: 'center',
        paddingVertical: 4,
        fontSize: 18,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    inputCompleted: {
        color: Colors.dark.success,
        borderBottomColor: 'transparent',
    },
    checkButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    checkButtonActive: {
        backgroundColor: Colors.dark.success,
        borderColor: Colors.dark.success,
    },
    addSetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
        marginTop: 8,
    },
    addSetText: {
        color: Colors.dark.primary,
        fontWeight: '600',
        marginLeft: 8,
    },
    addExerciseButton: {
        backgroundColor: Colors.dark.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        marginTop: 8,
    },
    addExerciseText: {
        color: Colors.dark.background,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    linkText: {
        color: Colors.dark.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});
