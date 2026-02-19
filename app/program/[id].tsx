import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { ArrowLeft, Calendar, Clock, Activity, Target, X, CirclePlay } from 'lucide-react-native';
import { Exercises } from '../../constants/Data';
import { VideoCard } from '../../components/VideoCard';
import YoutubePlayer from "react-native-youtube-iframe";

const programsData = {
    '1': { title: 'Start Strong', level: 'Beginner', days: 3, mins: 45, color: Colors.urbanNeon.primary, description: 'A perfect starting point for your fitness journey. Focuses on proper form, basic movement patterns, and building a foundation.', activities: ['legs_1', 'chest_3', 'abs_1', 'chest_2', 'legs_2'] },
    '2': { title: 'Upper Power', level: 'Intermediate', days: 4, mins: 60, color: Colors.urbanNeon.secondary, description: 'Designed to increase upper body strength and muscle mass. Incorporates compound movements and progressive overload.', activities: ['chest_1', 'back_2', 'shoulders_1', 'back_3', 'chest_4', 'arms_1'] },
    '3': { title: 'Legs & Glutes', level: 'Advanced', days: 2, mins: 75, color: Colors.urbanNeon.tertiary, description: 'Intense lower body focus targeting glutes, quads, and hamstrings for maximum hypertrophy and strength gains.', activities: ['legs_1', 'back_1', 'legs_2', 'legs_3', 'legs_4'] },
    '4': { title: 'HIIT Burn', level: 'All Levels', days: 5, mins: 30, color: Colors.urbanNeon.quaternary, description: 'High-intensity interval training designed to burn fat and improve cardiovascular endurance in minimal time.', activities: ['cardio_2', 'chest_3', 'legs_1', 'abs_2', 'cardio_1'] },
};

export default function ProgramDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const programId = Array.isArray(id) ? id[0] : id;
    const program = programsData[programId as keyof typeof programsData];

    const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

    if (!program) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <Text style={styles.errorText}>Program not found.</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const programExercises = program.activities.map(actId =>
        Exercises.find(ex => ex.id === actId)
    ).filter(Boolean);

    const renderVideoModal = () => {
        if (!selectedVideo) return null;

        return (
            <Modal
                visible={!!selectedVideo}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedVideo(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.videoPlaceholder}>
                            {selectedVideo.videoId ? (
                                <YoutubePlayer
                                    height={250}
                                    play={true}
                                    videoId={selectedVideo.videoId}
                                />
                            ) : (
                                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <CirclePlay size={64} color={Colors.dark.primary} />
                                    <Text style={styles.placeholderText}>Video Unavailable</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedVideo.name}</Text>
                                <TouchableOpacity onPress={() => setSelectedVideo(null)}>
                                    <X size={24} color={Colors.dark.text} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.sectionTitleModal}>Instructions</Text>
                                <Text style={styles.descriptionModal}>{selectedVideo.description}</Text>

                                <Text style={styles.sectionTitleModal}>Benefits</Text>
                                {selectedVideo.benefits?.map((benefit: string, idx: number) => (
                                    <Text key={idx} style={styles.bulletPoint}>• {benefit}</Text>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: Colors.dark.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={[styles.header, { backgroundColor: program.color }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButtonIcon}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{program.level}</Text>
                </View>
                <Text style={styles.title}>{program.title}</Text>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Calendar size={16} color="rgba(0,0,0,0.6)" />
                        <Text style={styles.metaText}>{program.days} days/week</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Clock size={16} color="rgba(0,0,0,0.6)" />
                        <Text style={styles.metaText}>{program.mins} mins/session</Text>
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Target size={20} color={program.color} />
                        <Text style={[styles.sectionTitle, { color: Colors.dark.text }]}>Overview</Text>
                    </View>
                    <Text style={[styles.description, { color: Colors.dark.textSecondary }]}>{program.description}</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Activity size={20} color={program.color} />
                        <Text style={[styles.sectionTitle, { color: Colors.dark.text }]}>Featured Activities</Text>
                    </View>
                    <View style={styles.activitiesContainer}>
                        {programExercises.map((exercise, index) => (
                            exercise ? (
                                <VideoCard
                                    key={exercise.id}
                                    title={exercise.name}
                                    category={exercise.category}
                                    duration="5:00"
                                    onPress={() => setSelectedVideo(exercise)}
                                    theme={Colors.urbanNeon}
                                />
                            ) : null
                        ))}
                    </View>
                </View>
            </View>

            {renderVideoModal()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 24, paddingTop: 60, paddingBottom: 32, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    backButtonIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    badge: { backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12 },
    badgeText: { color: '#000', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#000', marginBottom: 16 },
    metaContainer: { flexDirection: 'row', gap: 16 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { color: 'rgba(0,0,0,0.7)', fontSize: 14, fontWeight: '600' },
    content: { padding: 24 },
    section: { marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold' },
    description: { fontSize: 16, lineHeight: 24 },
    activitiesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

    // Error View
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { fontSize: 18, color: '#fff', marginBottom: 16 },
    backButton: { padding: 12, backgroundColor: '#333', borderRadius: 8 },
    backButtonText: { color: '#fff', fontSize: 16 },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '90%', overflow: 'hidden' },
    videoPlaceholder: { width: '100%', height: 250, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    placeholderText: { color: '#A0AEC0', marginTop: 12 },
    modalBody: { flex: 1, padding: 24 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#2D3748', flex: 1, marginRight: 16 },
    sectionTitleModal: { fontSize: 18, fontWeight: 'bold', color: '#2D3748', marginBottom: 8, marginTop: 16 },
    descriptionModal: { fontSize: 16, color: '#4A5568', lineHeight: 24, },
    bulletPoint: { fontSize: 16, color: '#718096', marginBottom: 8, marginLeft: 8 },
});
