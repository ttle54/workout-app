import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
import { ChevronRight, Calendar, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.7; // Shows next card slightly

interface ProgramCardProps {
    title: string;
    level: string;
    daysPerWeek: number;
    durationMins: number;
    color: string;
    onPress: () => void;
}

export const ProgramCard = ({ title, level, daysPerWeek, durationMins, color, onPress }: ProgramCardProps) => {
    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: color }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.content}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{level}</Text>
                </View>
                <Text style={styles.title}>{title}</Text>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Calendar size={14} color="rgba(0,0,0,0.6)" />
                        <Text style={styles.metaText}>{daysPerWeek} days/wk</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Clock size={14} color="rgba(0,0,0,0.6)" />
                        <Text style={styles.metaText}>{durationMins} mins</Text>
                    </View>
                </View>
            </View>

            <View style={styles.arrowContainer}>
                <ChevronRight size={24} color="#000" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        height: 160,
        borderRadius: 20,
        marginRight: 16,
        padding: 20,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    content: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
    },
    badge: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 8,
        marginBottom: 8,
    },
    metaContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        color: 'rgba(0,0,0,0.7)',
        fontSize: 12,
        fontWeight: '600',
    },
    arrowContainer: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
