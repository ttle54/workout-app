import React, { useState } from 'react';
import { Text, StyleSheet, View, Modal, TouchableOpacity, ScrollView, TextInput, Image, Dimensions, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { X, Camera, Plus, Save, TrendingUp, Ruler, Activity } from 'lucide-react-native';
import { useWorkout } from '../context/WorkoutContext';
import * as ImagePicker from 'expo-image-picker';
import { LineChart } from 'react-native-chart-kit';

const width = Math.min(Dimensions.get('window').width, 480);

interface ProgressModalProps {
    visible: boolean;
    onClose: () => void;
}

type Tab = 'metrics' | 'photos' | 'analytics';

export const ProgressModal: React.FC<ProgressModalProps> = ({ visible, onClose }) => {
    const { userMetrics, updateMetrics, addPhoto, history } = useWorkout();
    const [activeTab, setActiveTab] = useState<Tab>('metrics');

    // Metrics Inputs
    const [weight, setWeight] = useState(userMetrics.currentWeight || '');
    const [chest, setChest] = useState('');
    const [waist, setWaist] = useState('');
    const [arms, setArms] = useState('');

    const handleSaveMetrics = async () => {
        const newHistoryItem = { date: new Date().toISOString(), weight: parseFloat(weight) || 0 };
        const updatedWeightHistory = [newHistoryItem, ...userMetrics.weightHistory];

        const newMeasurement = {
            date: new Date().toISOString(),
            chest,
            waist,
            arms
        };
        const updatedMeasurements = [newMeasurement, ...userMetrics.measurements];

        await updateMetrics({
            currentWeight: weight,
            weightHistory: updatedWeightHistory,
            measurements: updatedMeasurements
        });

        Alert.alert("Success", "Measurements logged!");
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            await addPhoto(result.assets[0].uri);
        }
    };

    // Analytics Calculation (One Rep Max Estimate - Epley Formula)
    // 1RM = Weight * (1 + Reps/30)
    const calculateOneRepMax = () => {
        let max1RM = 0;
        let bestLift = "";

        history.forEach(workout => {
            workout.exercises.forEach(ex => {
                ex.sets.forEach(set => {
                    if (set.completed) {
                        const w = parseFloat(set.weight) || 0;
                        const r = parseFloat(set.reps) || 0;
                        if (w > 0 && r > 0) {
                            const oneRM = w * (1 + r / 30);
                            if (oneRM > max1RM) {
                                max1RM = oneRM;
                                bestLift = `${ex.name} (${w}lbs x ${r})`;
                            }
                        }
                    }
                });
            });
        });
        return { max1RM, bestLift };
    };

    const analytics = calculateOneRepMax();

    // Chart Data Preparation
    const weightData = userMetrics.weightHistory
        .slice(0, 5) // Last 5 entries
        .reverse() // Show chronological
        .map(h => h.weight);

    const renderCombinedAnalytics = () => (
        <ScrollView showsVerticalScrollIndicator={false}>
            {/* 1RM Card */}
            <View style={styles.analyticsCard}>
                <View style={styles.analyticsHeader}>
                    <Activity size={24} color={Colors.dark.primary} />
                    <Text style={styles.analyticsTitle}>Best Estimated 1RM</Text>
                </View>
                <Text style={styles.analyticsBigValue}>{Math.round(analytics.max1RM)} lbs</Text>
                <Text style={styles.analyticsSubtitle}>{analytics.bestLift || "No lifts recorded yet"}</Text>
            </View>

            {/* Weight Chart */}
            {weightData.length > 1 ? (
                <View style={[styles.analyticsCard, { marginTop: 16 }]}>
                    <Text style={styles.analyticsTitle}>Body Weight Trend</Text>
                    <LineChart
                        data={{
                            labels: [], // Hide labels for clean look on small card
                            datasets: [{ data: weightData }]
                        }}
                        width={width - 80} // Card padding
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix="lbs"
                        chartConfig={{
                            backgroundColor: Colors.dark.surface,
                            backgroundGradientFrom: Colors.dark.surface,
                            backgroundGradientTo: Colors.dark.surface,
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(10, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: { borderRadius: 16 },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: Colors.dark.primary
                            }
                        }}
                        bezier
                        style={{ marginVertical: 8, borderRadius: 16 }}
                    />
                </View>
            ) : (
                <View style={[styles.analyticsCard, { marginTop: 16, alignItems: 'center', padding: 32 }]}>
                    <Text style={styles.placeholderText}>Log at least 2 weight entries to see progress graph.</Text>
                </View>
            )}
        </ScrollView>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Your Progress</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X size={24} color={Colors.dark.text} />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    {['metrics', 'photos', 'analytics'].map((t) => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.tab, activeTab === t && styles.activeTab]}
                            onPress={() => setActiveTab(t as Tab)}
                        >
                            <Text style={[styles.tabText, activeTab === t && styles.activeTabText]}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.content}>
                    {activeTab === 'metrics' && (
                        <ScrollView>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Body Weight (lbs)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={weight}
                                    onChangeText={setWeight}
                                    keyboardType="numeric"
                                    placeholder="Enter weight"
                                    placeholderTextColor={Colors.dark.textSecondary}
                                />
                            </View>

                            <Text style={styles.sectionTitle}>Measurements (in)</Text>
                            <View style={styles.row}>
                                <View style={styles.halfInput}>
                                    <Text style={styles.label}>Chest</Text>
                                    <TextInput style={styles.input} value={chest} onChangeText={setChest} keyboardType="numeric" placeholder="0" placeholderTextColor={Colors.dark.textSecondary} />
                                </View>
                                <View style={styles.halfInput}>
                                    <Text style={styles.label}>Waist</Text>
                                    <TextInput style={styles.input} value={waist} onChangeText={setWaist} keyboardType="numeric" placeholder="0" placeholderTextColor={Colors.dark.textSecondary} />
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.halfInput}>
                                    <Text style={styles.label}>Arms</Text>
                                    <TextInput style={styles.input} value={arms} onChangeText={setArms} keyboardType="numeric" placeholder="0" placeholderTextColor={Colors.dark.textSecondary} />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveMetrics}>
                                <Save size={20} color={Colors.dark.text} />
                                <Text style={styles.saveText}>Log Entry</Text>
                            </TouchableOpacity>

                            <View style={{ marginTop: 32 }}>
                                <Text style={styles.sectionTitle}>Log History</Text>
                                {userMetrics.measurements.map((m, i) => (
                                    <View key={i} style={styles.historyRow}>
                                        <Text style={styles.historyDate}>{new Date(m.date).toLocaleDateString()}</Text>
                                        <Text style={styles.historyVal}>{userMetrics.weightHistory[i]?.weight} lbs (Weight)</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    )}

                    {activeTab === 'photos' && (
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                                <Camera size={24} color={Colors.dark.text} />
                                <Text style={styles.uploadText}>Add Progress Photo</Text>
                            </TouchableOpacity>
                            <ScrollView contentContainerStyle={styles.photoGrid}>
                                {userMetrics.photos.map(p => (
                                    <View key={p.id} style={styles.photoContainer}>
                                        <Image source={{ uri: p.uri }} style={styles.photo} />
                                        <Text style={styles.photoDate}>{new Date(p.date).toLocaleDateString()}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {activeTab === 'analytics' && renderCombinedAnalytics()}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    closeBtn: {
        padding: 4,
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: Colors.dark.surface,
    },
    activeTab: {
        backgroundColor: Colors.dark.primary,
    },
    tabText: {
        color: Colors.dark.textSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: Colors.dark.background,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: Colors.dark.textSecondary,
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: Colors.dark.surface,
        color: Colors.dark.text,
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    halfInput: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        color: Colors.dark.text,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.dark.primary,
        padding: 16,
        borderRadius: 16,
        gap: 8,
        marginTop: 12,
    },
    saveText: {
        color: Colors.dark.background,
        fontWeight: 'bold',
        fontSize: 16,
    },
    historyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    historyDate: {
        color: Colors.dark.text,
    },
    historyVal: {
        color: Colors.dark.textSecondary,
    },
    // Photos
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.dark.surface,
        padding: 16,
        borderRadius: 16,
        gap: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        borderStyle: 'dashed',
    },
    uploadText: {
        color: Colors.dark.text,
        fontWeight: '600',
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    photoContainer: {
        width: '48%',
        marginBottom: 12,
    },
    photo: {
        width: '100%',
        height: 150,
        borderRadius: 12,
        backgroundColor: Colors.dark.surface,
    },
    photoDate: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    analyticsCard: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 16,
        padding: 20,
    },
    analyticsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    analyticsTitle: {
        fontSize: 16,
        color: Colors.dark.text,
        fontWeight: 'bold',
    },
    analyticsBigValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.dark.primary,
        marginVertical: 4,
    },
    analyticsSubtitle: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
    },
    placeholderText: {
        color: Colors.dark.textSecondary,
        textAlign: 'center',
    }
});
