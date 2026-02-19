import React, { useMemo, useState } from 'react';
import { Text, StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { ScreenLayout } from '../../components/ScreenLayout';
import { Colors } from '../../constants/Colors';
import { Dumbbell, Clock, Activity, Flame, ChevronRight, Play, Timer as TimerIcon, History as HistoryIcon, Calculator, Scale, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useWorkout } from '../../context/WorkoutContext';
import { LineChart, ContributionGraph } from 'react-native-chart-kit';
import { ProgressWidget } from '../../components/ProgressWidget';
import { ProgressModal } from '../../components/ProgressModal';
import { OneRepMaxModal } from '../../components/OneRepMaxModal';
import { BodyWeightModal } from '../../components/BodyWeightModal';
import { ShareModal } from '../../components/ShareModal';

const screenWidth = Dimensions.get('window').width;

export default function Progress() {
    const router = useRouter();
    const [ormVisible, setOrmVisible] = useState(false);
    const [weightVisible, setWeightVisible] = useState(false);
    const [progressModalVisible, setProgressModalVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [chartMode, setChartMode] = useState<'volume' | 'weight'>('volume');
    const { history, userMetrics } = useWorkout();
    const theme = Colors.urbanNeon;

    // Stats Logic
    const stats = useMemo(() => {
        // Daily Metrics
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayWorkouts = history.filter(w => new Date(w.date).toDateString() === today.toDateString());
        const todayDurationMins = todayWorkouts.reduce((acc, w) => acc + (w.durationSeconds / 60), 0);
        const dailyCalories = Math.floor(todayDurationMins * 8); // Est. 8 cal/min
        const avgHeartRate = todayDurationMins > 0 ? 128 : 0; // Mock HR

        // Volume History for Chart (Last 7 workouts or days)
        const lastWorkouts = history.slice(0, 6).reverse();
        const volumeData = lastWorkouts.map(w => {
            let vol = 0;
            w.exercises.forEach(ex => {
                ex.sets.forEach(s => {
                    if (s.completed) vol += (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0);
                });
            });
            return vol;
        });

        const volumeLabels = lastWorkouts.map(w => {
            const d = new Date(w.date);
            return `${d.getMonth() + 1}/${d.getDate()}`;
        });

        // Weight History for Chart (Last 7 entries)
        const sortedWeight = [...userMetrics.weightHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const recentWeights = sortedWeight.slice(-7);
        const weightData = recentWeights.map(w => w.weight);
        const weightLabels = recentWeights.map(w => {
            const d = new Date(w.date);
            return `${d.getMonth() + 1}/${d.getDate()}`;
        });


        // Contribution Graph Data (Heatmap) - Last 90 days
        const contributionData = history.map(w => ({
            date: new Date(w.date).toISOString().split('T')[0],
            count: 1
        }));

        return {
            dailyCalories,
            avgHeartRate,
            volumeData: volumeData.length > 0 ? volumeData : [0],
            volumeLabels: volumeLabels.length > 0 ? volumeLabels : ['Now'],
            weightData: weightData.length > 0 ? weightData : [0],
            weightLabels: weightLabels.length > 0 ? weightLabels : ['Now'],
            contributionData,
            totalWorkouts: history.length
        };
    }, [history, userMetrics.weightHistory]);

    return (
        <ScreenLayout style={{ backgroundColor: theme.background }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Progress</Text>
                    <TouchableOpacity
                        style={[styles.headerButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                        onPress={() => setShareVisible(true)}
                    >
                        <Share2 size={20} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Daily Summary Cards */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { borderColor: theme.primary, backgroundColor: theme.surface }]}>
                        <View style={[styles.statIcon, { backgroundColor: theme.background }]}>
                            <Flame size={20} color={theme.primary} fill={theme.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.statValue, { color: theme.primary }]}>{stats.dailyCalories}</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Calories Burned</Text>
                        </View>
                    </View>
                    <View style={[styles.statCard, { borderColor: theme.accent, backgroundColor: theme.surface }]}>
                        <View style={[styles.statIcon, { backgroundColor: theme.background }]}>
                            <Activity size={20} color={theme.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.statValue, { color: theme.accent }]}>
                                {stats.avgHeartRate > 0 ? `${stats.avgHeartRate} bpm` : '--'}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Avg Heart Rate</Text>
                        </View>
                    </View>
                </View>

                {/* Chart Section */}
                <View style={[styles.chartCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>{chartMode === 'volume' ? 'Volume Trend' : 'Body Weight'}</Text>

                        {/* Toggle */}
                        <View style={[styles.toggleContainer, { backgroundColor: theme.border }]}>
                            <TouchableOpacity
                                style={[styles.toggleBtn, chartMode === 'volume' && styles.toggleBtnActive]}
                                onPress={() => setChartMode('volume')}
                            >
                                <Dumbbell size={14} color={chartMode === 'volume' ? '#000' : theme.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleBtn, chartMode === 'weight' && styles.toggleBtnActive]}
                                onPress={() => setChartMode('weight')}
                            >
                                <Scale size={14} color={chartMode === 'weight' ? '#000' : theme.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <LineChart
                        data={{
                            labels: chartMode === 'volume' ? stats.volumeLabels : stats.weightLabels,
                            datasets: [{
                                data: chartMode === 'volume' ? stats.volumeData : stats.weightData
                            }]
                        }}
                        width={screenWidth - 66} // Card padding accounting
                        height={180}
                        yAxisLabel=""
                        yAxisSuffix={chartMode === 'volume' ? "" : " lbs"}
                        chartConfig={{
                            backgroundColor: theme.surface,
                            backgroundGradientFrom: theme.surface,
                            backgroundGradientTo: theme.surface,
                            decimalPlaces: 0,
                            color: (opacity = 1) => chartMode === 'volume' ? theme.primary : theme.accent,
                            labelColor: (opacity = 1) => theme.textSecondary,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "4",
                                strokeWidth: "2",
                                stroke: chartMode === 'volume' ? theme.primary : theme.accent
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />
                </View>

                {/* Consistency Heatmap */}
                <View style={[styles.chartCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Consistency</Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{stats.totalWorkouts} Workouts</Text>
                    </View>
                    <ContributionGraph
                        values={stats.contributionData}
                        endDate={new Date()}
                        numDays={90}
                        width={screenWidth - 66}
                        height={220}
                        chartConfig={{
                            backgroundColor: theme.surface,
                            backgroundGradientFrom: theme.surface,
                            backgroundGradientTo: theme.surface,
                            color: (opacity = 1) => theme.primary,
                            labelColor: (opacity = 1) => theme.textSecondary,
                        }}
                        tooltipDataAttrs={() => ({})}
                    />
                </View>

                {/* Personal Progress Widget */}
                <ProgressWidget
                    onOpenWeightLog={() => setProgressModalVisible(true)}
                    weightChange={-1.5} // Mock
                    totalWorkouts={stats.totalWorkouts}
                    theme={theme}
                />

                {/* Quick Actions Grid */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity
                        style={[styles.actionButtonLarge, { backgroundColor: theme.primary }]}
                        onPress={() => router.push('/(tabs)/track')}
                    >
                        <Play size={24} color="#000" fill="#000" />
                        <Text style={[styles.actionButtonTextLarge, { color: '#000' }]}>Start Workout</Text>
                    </TouchableOpacity>

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionButtonSmall, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => router.push('/history')}
                        >
                            <HistoryIcon size={20} color={theme.text} />
                            <Text style={[styles.actionButtonTextSmall, { color: theme.text }]}>History</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButtonSmall, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => router.push('/(tabs)/timer')}
                        >
                            <TimerIcon size={20} color={theme.text} />
                            <Text style={[styles.actionButtonTextSmall, { color: theme.text }]}>Timer</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionButtonSmall, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => setOrmVisible(true)}
                        >
                            <Calculator size={20} color={theme.text} />
                            <Text style={[styles.actionButtonTextSmall, { color: theme.text }]}>1RM Calc</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButtonSmall, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => setWeightVisible(true)}
                        >
                            <Scale size={20} color={theme.text} />
                            <Text style={[styles.actionButtonTextSmall, { color: theme.text }]}>Log Weight</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <OneRepMaxModal visible={ormVisible} onClose={() => setOrmVisible(false)} theme={theme} />
            <ProgressModal visible={progressModalVisible} onClose={() => setProgressModalVisible(false)} />
            <BodyWeightModal
                visible={weightVisible}
                onClose={() => setWeightVisible(false)}
                theme={theme}
                currentWeight={parseFloat(userMetrics.currentWeight || '0')}
                onSave={(w) => {
                    // handle save
                    setWeightVisible(false);
                }}
            />
            <ShareModal
                visible={shareVisible}
                onClose={() => setShareVisible(false)}
                theme={theme}
            />
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: 40,
        paddingHorizontal: 16, // Added horizontal padding for content
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
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
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2, // Added from the edit
    },
    statLabel: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
        fontWeight: '500', // Added from the edit
    },
    chartCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        alignItems: 'center', // Center chart
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 8,
    },
    quickActionsGrid: {
        gap: 12,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButtonLarge: {
        height: 60,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: "#000", // Added from the edit
        shadowOffset: { width: 0, height: 2 }, // Added from the edit
        shadowOpacity: 0.1, // Added from the edit
        shadowRadius: 3.84, // Added from the edit
        elevation: 5, // Added from the edit
    },
    actionButtonSmall: {
        flex: 1,
        height: 80,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        shadowColor: "#000", // Added from the edit
        shadowOffset: { width: 0, height: 1 }, // Added from the edit
        shadowOpacity: 0.1, // Added from the edit
        shadowRadius: 1, // Added from the edit
    },
    actionButtonTextLarge: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    actionButtonTextSmall: {
        fontSize: 14,
        fontWeight: '600',
    },
    // Toggle Styles
    toggleContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        padding: 2,
    },
    toggleBtn: {
        padding: 6,
        borderRadius: 6,
    },
    toggleBtnActive: {
        backgroundColor: '#FFF',
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
});
