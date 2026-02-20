import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
import { Play } from 'lucide-react-native';

const width = Math.min(Dimensions.get('window').width, 480);
const cardWidth = (width - 48) / 2; // 2 columns with padding

interface VideoCardProps {
    title: string;
    category: string;
    duration: string;
    onPress: () => void;
    theme?: any;
}

export const VideoCard = ({ title, category, duration, onPress, theme }: VideoCardProps) => {
    const t = theme || Colors.dark; // Fallback

    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]} onPress={onPress}>
            <View style={styles.imageContainer}>
                {/* Placeholder for video thumbnail */}
                <View style={[styles.placeholder, { backgroundColor: t.background }]}>
                    <Play size={32} color={t.primary} fill={t.primary} />
                </View>
                <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{duration}</Text>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, { color: t.text }]} numberOfLines={2}>{title}</Text>
                <Text style={[styles.category, { color: t.textSecondary }]}>{category}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '48%',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        // Shadow for light mode
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 3,
    },
    imageContainer: {
        height: 100,
        width: '100%',
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    durationText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        height: 40, // Fixed height for 2 lines
    },
    category: {
        fontSize: 12,
    },
});
