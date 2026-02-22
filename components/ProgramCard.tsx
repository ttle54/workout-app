import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
import { ChevronRight, Calendar, Clock } from 'lucide-react-native';

const width = Math.min(Dimensions.get('window').width, 480);
const cardWidth = (width - 48) / 2; // Fits 2 gracefully on a row like VideoCard

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
            <View style={styles.topSection}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{level}</Text>
                </View>
                <View style={styles.arrowContainer}>
                    <ChevronRight size={16} color="#000" />
                </View>
            </View>

            <View style={styles.bottomSection}>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Calendar size={12} color="rgba(0,0,0,0.6)" />
                        <Text style={styles.metaText}>{daysPerWeek} d/wk</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Clock size={12} color="rgba(0,0,0,0.6)" />
                        <Text style={styles.metaText}>{durationMins} m</Text>
                    </View>
                </View>
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
        padding: 16,
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    bottomSection: {
        justifyContent: 'flex-end',
    },
    badge: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
        lineHeight: 22,
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
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
