import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { TrendingUp, User } from 'lucide-react-native';
import { useWorkout } from '../context/WorkoutContext';
import { ProgressModal } from './ProgressModal';

export const ProgressWidget = ({ onOpenWeightLog, weightChange, totalWorkouts, theme }: any) => {
    // If no theme provided (fallback), use dark (though we should always pass it now)
    const t = theme || Colors.dark;

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: t.surface, borderColor: t.border }]} onPress={onOpenWeightLog}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <View style={[styles.iconBg, { backgroundColor: t.primary + '20' }]}>
                        <TrendingUp size={20} color={t.primary} />
                    </View>
                    <Text style={[styles.title, { color: t.text }]}>My Progress</Text>
                </View>
                <Text style={[styles.action, { color: t.primary }]}>Update</Text>
            </View>

            <View style={styles.content}>
                <View style={[styles.stat, { backgroundColor: t.background }]}>
                    <Text style={[styles.value, { color: weightChange < 0 ? t.primary : t.warning }]}>
                        {weightChange > 0 ? '+' : ''}{weightChange}%
                    </Text>
                    <Text style={[styles.label, { color: t.textSecondary }]}>Weight Change</Text>
                </View>
                <View style={[styles.stat, { backgroundColor: t.background }]}>
                    <Text style={[styles.value, { color: t.text }]}>
                        {totalWorkouts}
                    </Text>
                    <Text style={[styles.label, { color: t.textSecondary }]}>Total Workouts</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBg: {
        padding: 8,
        borderRadius: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    action: {
        fontWeight: '600',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    stat: {
        borderRadius: 12,
        padding: 16,
        flex: 1,
        alignItems: 'center',
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
    }
});
