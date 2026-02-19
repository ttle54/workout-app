import React from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { ScreenLayout } from '../../components/ScreenLayout';
import { Colors } from '../../constants/Colors';
import { Calendar, ChevronRight, Clock, Trophy, Dumbbell } from 'lucide-react-native';
import { useWorkout, CompletedWorkout } from '../../context/WorkoutContext';

export default function History() {
    const { history } = useWorkout();

    // Helper to calculate total volume for a workout
    const calculateVolume = (workout: CompletedWorkout) => {
        let total = 0;
        workout.exercises.forEach(ex => {
            ex.sets.forEach(set => {
                if (set.completed && set.weight && set.reps) {
                    total += parseFloat(set.weight) * parseFloat(set.reps);
                }
            });
        });
        return total; // in lbs
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        return `${mins}m`;
    };

    const renderItem = ({ item }: { item: CompletedWorkout }) => (
        <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.date}>{formatDate(item.date)}</Text>
                    <Text style={styles.name}>{item.name}</Text>
                </View>
                <ChevronRight size={20} color={Colors.dark.textSecondary} />
            </View>

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Clock size={14} color={Colors.dark.primary} style={styles.icon} />
                    <Text style={styles.statText}>{formatDuration(item.durationSeconds)}</Text>
                </View>
                <View style={styles.stat}>
                    <Dumbbell size={14} color={Colors.dark.secondary} style={styles.icon} />
                    <Text style={styles.statText}>{calculateVolume(item).toLocaleString()} lbs</Text>
                </View>
                {/* Placeholder for PRs if we implement that logic later */}
                {/* <View style={styles.stat}>
             <Trophy size={14} color={Colors.dark.warning} style={styles.icon} />
             <Text style={[styles.statText, { color: Colors.dark.warning }]}>{item.prs} PRs</Text>
          </View> */}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenLayout>
            <Text style={styles.title}>Workout History</Text>

            {history.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No workouts yet. Go track one!</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}

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
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
    },
    card: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    date: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
        marginBottom: 4,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    icon: {
        marginRight: 6,
    },
    statText: {
        color: Colors.dark.text,
        fontWeight: '500',
        fontSize: 12,
    },
});
