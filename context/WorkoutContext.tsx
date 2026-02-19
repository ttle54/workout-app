import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface WorkoutSet {
    id: string;
    weight: string;
    reps: string;
    completed: boolean;
}

export interface WorkoutExercise {
    id: string;
    exerciseId: string;
    name: string;
    sets: WorkoutSet[];
}

export interface CompletedWorkout {
    id: string;
    date: Date;
    name: string; // e.g. "Workout Session"
    durationSeconds: number;
    exercises: WorkoutExercise[];
}

export interface UserMetrics {
    currentWeight?: string;
    weightHistory: { date: string; weight: number }[];
    photos: { id: string; date: string; uri: string }[];
    measurements: {
        date: string;
        chest?: string;
        waist?: string;
        arms?: string;
        legs?: string;
    }[];
}

export interface WorkoutPreset {
    id: string;
    name: string;
    exercises: WorkoutExercise[];
}

// Default Presets
const DEFAULT_PRESETS: WorkoutPreset[] = [
    {
        id: 'preset_push',
        name: 'Push Day A',
        exercises: [
            { id: 'p1', exerciseId: 'chest_1', name: 'Bench Press', sets: [{ id: 's1', weight: '', reps: '', completed: false }] },
            { id: 'p2', exerciseId: 'shoulders_1', name: 'Overhead Press', sets: [{ id: 's2', weight: '', reps: '', completed: false }] },
            { id: 'p3', exerciseId: 'chest_2', name: 'Incline Dumbbell Press', sets: [{ id: 's3', weight: '', reps: '', completed: false }] },
            { id: 'p4', exerciseId: 'arms_2', name: 'Tricep Dip', sets: [{ id: 's4', weight: '', reps: '', completed: false }] },
        ]
    },
    {
        id: 'preset_pull',
        name: 'Pull Day A',
        exercises: [
            { id: 'pu1', exerciseId: 'back_1', name: 'Deadlift', sets: [{ id: 's1', weight: '', reps: '', completed: false }] },
            { id: 'pu2', exerciseId: 'back_2', name: 'Pull Up', sets: [{ id: 's2', weight: '', reps: '', completed: false }] },
            { id: 'pu3', exerciseId: 'back_3', name: 'Barbell Row', sets: [{ id: 's3', weight: '', reps: '', completed: false }] },
            { id: 'pu4', exerciseId: 'arms_1', name: 'Barbell Curl', sets: [{ id: 's4', weight: '', reps: '', completed: false }] },
        ]
    },
    {
        id: 'preset_legs',
        name: 'Legs Day A',
        exercises: [
            { id: 'l1', exerciseId: 'legs_1', name: 'Squat', sets: [{ id: 's1', weight: '', reps: '', completed: false }] },
            { id: 'l2', exerciseId: 'legs_2', name: 'Lunges', sets: [{ id: 's2', weight: '', reps: '', completed: false }] },
            { id: 'l3', exerciseId: 'legs_3', name: 'Leg Press', sets: [{ id: 's3', weight: '', reps: '', completed: false }] },
            { id: 'l4', exerciseId: 'legs_4', name: 'Calf Raise', sets: [{ id: 's4', weight: '', reps: '', completed: false }] },
        ]
    }
];

interface WorkoutContextType {
    history: CompletedWorkout[];
    userMetrics: UserMetrics;
    presets: WorkoutPreset[];
    saveWorkout: (workout: CompletedWorkout) => Promise<void>;
    updateMetrics: (newMetrics: Partial<UserMetrics>) => Promise<void>;
    addPhoto: (uri: string) => Promise<void>;
    savePreset: (preset: WorkoutPreset) => Promise<void>;
    deletePreset: (id: string) => Promise<void>;
    clearHistory: () => Promise<void>;
    logWeight: (weight: number) => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const STORAGE_KEY = '@workout_app_history';
const METRICS_KEY = '@workout_app_metrics';
const PRESETS_KEY = '@workout_app_presets';

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
    const [history, setHistory] = useState<CompletedWorkout[]>([]);
    const [presets, setPresets] = useState<WorkoutPreset[]>([]);
    const [userMetrics, setUserMetrics] = useState<UserMetrics>({
        weightHistory: [],
        photos: [],
        measurements: []
    });

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load History
                const jsonHistory = await AsyncStorage.getItem(STORAGE_KEY);
                if (jsonHistory != null) {
                    const parsedHistory = JSON.parse(jsonHistory).map((w: any) => ({
                        ...w,
                        date: new Date(w.date)
                    }));
                    setHistory(parsedHistory);
                }

                // Load Metrics
                const jsonMetrics = await AsyncStorage.getItem(METRICS_KEY);
                if (jsonMetrics != null) {
                    setUserMetrics(JSON.parse(jsonMetrics));
                }

                // Load Presets
                const jsonPresets = await AsyncStorage.getItem(PRESETS_KEY);
                if (jsonPresets != null) {
                    setPresets(JSON.parse(jsonPresets));
                } else {
                    // Seed defaults
                    setPresets(DEFAULT_PRESETS);
                    await AsyncStorage.setItem(PRESETS_KEY, JSON.stringify(DEFAULT_PRESETS));
                }
            } catch (e) {
                console.error("Failed to load data", e);
            }
        };
        loadData();
    }, []);

    const saveWorkout = async (workout: CompletedWorkout) => {
        try {
            const newHistory = [workout, ...history];
            setHistory(newHistory);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        } catch (e) {
            console.error("Failed to save workout", e);
        }
    };

    const updateMetrics = async (newMetrics: Partial<UserMetrics>) => {
        try {
            const updated = { ...userMetrics, ...newMetrics };
            setUserMetrics(updated);
            await AsyncStorage.setItem(METRICS_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error("Failed to save metrics", e);
        }
    };

    const addPhoto = async (uri: string) => {
        const newPhoto = {
            id: Math.random().toString(),
            date: new Date().toISOString(),
            uri
        };
        const updatedPhotos = [newPhoto, ...userMetrics.photos];
        await updateMetrics({ photos: updatedPhotos });
    };

    const savePreset = async (preset: WorkoutPreset) => {
        try {
            const newPresets = [...presets, preset];
            setPresets(newPresets);
            await AsyncStorage.setItem(PRESETS_KEY, JSON.stringify(newPresets));
        } catch (e) {
            console.error("Failed to save preset", e);
        }
    };

    const deletePreset = async (id: string) => {
        try {
            const newPresets = presets.filter(p => p.id !== id);
            setPresets(newPresets);
            await AsyncStorage.setItem(PRESETS_KEY, JSON.stringify(newPresets));
        } catch (e) {
            console.error("Failed to delete preset", e);
        }
    };

    const clearHistory = async () => {
        try {
            setHistory([]);
            setUserMetrics({ weightHistory: [], photos: [], measurements: [] });
            await AsyncStorage.removeItem(STORAGE_KEY);
            await AsyncStorage.removeItem(METRICS_KEY);
        } catch (e) {
            console.error("Failed to clear history", e);
        }
    }

    const logWeight = async (weight: number) => {
        const newEntry = { date: new Date().toISOString(), weight };
        const newHistory = [...userMetrics.weightHistory, newEntry];
        // Sort by date just in case
        newHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        await updateMetrics({
            currentWeight: weight.toString(),
            weightHistory: newHistory
        });
    };

    return (
        <WorkoutContext.Provider value={{
            history,
            userMetrics,
            presets,
            saveWorkout,
            updateMetrics,
            addPhoto,
            savePreset,
            deletePreset,
            clearHistory,
            logWeight
        }}>
            {children}
        </WorkoutContext.Provider>
    );
};

export const useWorkout = () => {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error('useWorkout must be used within a WorkoutProvider');
    }
    return context;
};
