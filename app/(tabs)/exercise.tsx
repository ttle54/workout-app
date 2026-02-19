import React, { useState } from 'react';
import { Text, StyleSheet, View, FlatList, TextInput, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { ScreenLayout } from '../../components/ScreenLayout';
import { Colors } from '../../constants/Colors';
import { Search, X, CirclePlay, Dumbbell, Play, History } from 'lucide-react-native';
import { Exercises } from '../../constants/Data';
import { VideoCard } from '../../components/VideoCard';
import { ProgramCard } from '../../components/ProgramCard';
import { useRouter } from 'expo-router';

import YoutubePlayer from "react-native-youtube-iframe";

const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio'];

export default function Exercise() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

    // Mock Programs Data
    const programs = [
        { id: '1', title: 'Start Strong', level: 'Beginner', days: 3, mins: 45, color: Colors.urbanNeon.primary },
        { id: '2', title: 'Upper Power', level: 'Intermediate', days: 4, mins: 60, color: Colors.urbanNeon.secondary },
        { id: '3', title: 'Legs & Glutes', level: 'Advanced', days: 2, mins: 75, color: Colors.urbanNeon.tertiary },
        { id: '4', title: 'HIIT Burn', level: 'All Levels', days: 5, mins: 30, color: Colors.urbanNeon.quaternary },
    ];

    // Filter exercises
    const filteredVideos = Exercises.filter(ex =>
        (selectedCategory === 'All' || ex.category === selectedCategory) &&
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(ex => ({
        ...ex,
        duration: '5:00', // Estimate
    }));

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
                                <Text style={styles.sectionTitle}>Instructions</Text>
                                <Text style={styles.description}>{selectedVideo.description}</Text>

                                <Text style={styles.sectionTitle}>Benefits</Text>
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

    const router = useRouter();
    // Use urbanNeon theme
    const theme = Colors.urbanNeon;

    const renderHeader = () => (
        <>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Exercise</Text>
                    <TouchableOpacity
                        style={[styles.headerButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                        onPress={() => router.push('/history')}
                    >
                        <History size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Quick Start Widget */}
            <TouchableOpacity
                style={[styles.startWorkoutCard, { backgroundColor: theme.primary, borderColor: theme.surface, shadowColor: theme.primary }]}
                onPress={() => router.push('/(tabs)/track')}
            >
                <View style={[styles.startIconContainer, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                    <Play size={24} color="#000" fill="#000" />
                </View>
                <View>
                    <Text style={[styles.startTitle, { color: '#000' }]}>Start Workout</Text>
                    <Text style={[styles.startSubtitle, { color: '#000', opacity: 0.8 }]}>Track your custom session</Text>
                </View>
                <Dumbbell size={24} color="#000" style={{ marginLeft: 'auto', opacity: 0.8 }} />
            </TouchableOpacity>

            {/* Featured Programs Section */}
            <View style={styles.programsSection}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>For You</Text>
                    <TouchableOpacity>
                        <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.programsScroll}
                >
                    {programs.map(prog => (
                        <ProgramCard
                            key={prog.id}
                            title={prog.title}
                            level={prog.level}
                            daysPerWeek={prog.days}
                            durationMins={prog.mins}
                            color={prog.color}
                            onPress={() => { }} // Placeholder for program detail
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Exercise Library Section */}
            <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16, color: theme.text }]}>Library</Text>

            <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
                <Search size={20} color={theme.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Search exercises..."
                    placeholderTextColor={theme.textSecondary}
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
                                { backgroundColor: theme.surface, borderColor: theme.border },
                                selectedCategory === cat && { backgroundColor: theme.primary, borderColor: theme.primary }
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[
                                styles.categoryText,
                                { color: theme.textSecondary },
                                selectedCategory === cat && { color: '#000', fontWeight: 'bold' }
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    );

    return (
        <ScreenLayout style={{ backgroundColor: theme.background }}>
            <FlatList
                data={filteredVideos}
                keyExtractor={item => item.id}
                ListHeaderComponent={renderHeader}
                renderItem={({ item }) => (
                    <VideoCard
                        title={item.name}
                        category={item.category}
                        duration={item.duration}
                        onPress={() => setSelectedVideo(item)}
                        theme={theme}
                    />
                )}
                columnWrapperStyle={styles.columnWrapper}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {renderVideoModal()}
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    header: {
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    startWorkoutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        gap: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    startIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    startSubtitle: {
        fontSize: 14,
    },
    programsSection: {
        marginBottom: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    programsScroll: {
        paddingRight: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
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
        marginRight: 8,
        borderWidth: 1,
    },
    categoryText: {
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)', // Keep dark overlay for video focus
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF', // White background
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%',
        overflow: 'hidden',
    },
    videoPlaceholder: {
        width: '100%',
        height: 250,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    placeholderText: {
        color: '#A0AEC0',
        marginTop: 12,
    },
    modalBody: {
        flex: 1,
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3748',
        flex: 1,
        marginRight: 16,
    },
    description: {
        fontSize: 16,
        color: '#4A5568',
        lineHeight: 24,
        marginBottom: 20,
    },
    bulletPoint: {
        fontSize: 16,
        color: '#718096',
        marginBottom: 8,
        marginLeft: 8,
    },
});
