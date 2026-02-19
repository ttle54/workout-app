import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { Colors } from '../constants/Colors';
import { useWorkout } from '../context/WorkoutContext';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Clock, Dumbbell } from 'lucide-react-native';

export default function History() {
    const router = useRouter();
    const { history } = useWorkout();

    // Sort history by date descending
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const renderWorkoutItem = ({ item }: { item: any }) => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const durationMins = Math.floor(item.durationSeconds / 60);

        const totalVolume = item.exercises.reduce((acc: number, ex: any) => {
            return acc + ex.sets.reduce((sAcc: number, s: any) => {
                if (s.completed) return sAcc + (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0);
                return sAcc;
            }, 0);
        }, 0);

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.cardTitle}>{item.name || "Workout"}</Text>
                        <View style={styles.metaRow}>
                            <Calendar size={14} color={Colors.dark.textSecondary} />
                            <Text style={styles.metaText}>{formattedDate}</Text>
                            <Clock size={14} color={Colors.dark.textSecondary} style={{ marginLeft: 8 }} />
                            <Text style={styles.metaText}>{durationMins} min</Text>
                        </View>
                    </View>
                    <View style={styles.volumeBadge}>
                        <Dumbbell size={14} color={Colors.dark.primary} />
                        <Text style={styles.volumeText}>{totalVolume} kg</Text>
                    </View>
                </View>

                <View style={styles.exerciseList}>
                    {item.exercises.map((ex: any, index: number) => (
                        <Text key={index} style={styles.exerciseText}>
                            {ex.sets.filter((s: any) => s.completed).length} x {ex.name}
                        </Text>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <ScreenLayout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={Colors.dark.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Workout History</Text>
            </View>

            <FlatList
                data={sortedHistory}
                renderItem={renderWorkoutItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Dumbbell size={48} color={Colors.dark.textSecondary} />
                        <Text style={styles.emptyText}>No completed workouts yet.</Text>
                        <Text style={styles.emptySubtext}>Finish a workout to see it here!</Text>
                    </View>
                }
            />
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
    },
    card: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    volumeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(204, 255, 0, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    volumeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.dark.primary,
    },
    exerciseList: {
        gap: 4,
    },
    exerciseText: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        gap: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    emptySubtext: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    }
});
