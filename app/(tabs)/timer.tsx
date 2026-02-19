import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Dimensions, TextInput, Modal, Alert, Keyboard } from 'react-native';
import { ScreenLayout } from '../../components/ScreenLayout';
import { Colors } from '../../constants/Colors';
import { Play, Pause, RotateCcw, Flag, Clock, Timer as TimerIcon } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type TimerMode = 'stopwatch' | 'countdown';

const PRESETS = [
    { label: 'Quick Rest', duration: 30 },
    { label: 'Rest', duration: 60 },
    { label: 'Long Rest', duration: 120 },
    { label: 'HIIT Work', duration: 45 },
    { label: 'Tabata', duration: 20 },
    { label: 'Stretch', duration: 300 },
];

export default function Timer() {
    const [mode, setMode] = useState<TimerMode>('stopwatch');

    // Stopwatch State
    const [swRunning, setSwRunning] = useState(false);
    const [swTime, setSwTime] = useState(0);
    const [laps, setLaps] = useState<number[]>([]);
    const swInterval = useRef<NodeJS.Timeout | null>(null);

    // Countdown State
    const [cdRunning, setCdRunning] = useState(false);
    const [cdTimeLeft, setCdTimeLeft] = useState(0); // in ms
    const [cdTotalTime, setCdTotalTime] = useState(0); // in ms (for progress)
    const [inputHours, setInputHours] = useState('');
    const [inputMinutes, setInputMinutes] = useState('');
    const [inputSeconds, setInputSeconds] = useState('');
    const cdInterval = useRef<NodeJS.Timeout | null>(null);

    // --- STOPWATCH LOGIC ---
    useEffect(() => {
        if (swRunning) {
            const startTime = Date.now() - swTime;
            swInterval.current = setInterval(() => {
                setSwTime(Date.now() - startTime);
            }, 10);
        } else {
            if (swInterval.current) clearInterval(swInterval.current);
        }
        return () => { if (swInterval.current) clearInterval(swInterval.current); };
    }, [swRunning]);

    const handleSwReset = () => {
        setSwRunning(false);
        setSwTime(0);
        setLaps([]);
    };

    const handleLap = () => {
        setLaps([swTime, ...laps]);
    };

    // --- COUNTDOWN LOGIC ---
    useEffect(() => {
        if (cdRunning && cdTimeLeft > 0) {
            const endTime = Date.now() + cdTimeLeft;
            cdInterval.current = setInterval(() => {
                const left = endTime - Date.now();
                if (left <= 0) {
                    setCdTimeLeft(0);
                    setCdRunning(false);
                    if (cdInterval.current) clearInterval(cdInterval.current);
                    Alert.alert("Timer Finished!", "Time to get back to work! 💪");
                } else {
                    setCdTimeLeft(left);
                }
            }, 100); // 100ms precision is enough for countdown
        } else {
            if (cdInterval.current) clearInterval(cdInterval.current);
        }
        return () => { if (cdInterval.current) clearInterval(cdInterval.current); };
    }, [cdRunning]);

    const startCountdown = (durationMs: number) => {
        if (durationMs <= 0) return;
        setCdTotalTime(durationMs);
        setCdTimeLeft(durationMs);
        setCdRunning(true);
        Keyboard.dismiss();
    };

    const handleReviewStart = () => {
        if (cdTimeLeft > 0 && !cdRunning) {
            // Resume
            setCdRunning(true);
            return;
        }

        const h = parseInt(inputHours) || 0;
        const m = parseInt(inputMinutes) || 0;
        const s = parseInt(inputSeconds) || 0;
        const totalMs = (h * 3600 + m * 60 + s) * 1000;

        if (totalMs > 0) {
            startCountdown(totalMs);
        }
    };

    const handleCdReset = () => {
        setCdRunning(false);
        setCdTimeLeft(0);
        setCdTotalTime(0);
    };

    const applyPreset = (seconds: number) => {
        setInputHours('');
        setInputMinutes(Math.floor(seconds / 60).toString());
        setInputSeconds((seconds % 60).toString());
        handleCdReset();
        startCountdown(seconds * 1000);
    };

    // --- TIMING FORMATTERS ---
    const formatSwTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);
        return {
            main: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            sub: `.${milliseconds.toString().padStart(2, '0')}`
        };
    };

    const formatCdTime = (ms: number) => {
        if (ms <= 0) return "00:00:00";
        const totalSeconds = Math.ceil(ms / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const renderStopwatch = () => {
        const time = formatSwTime(swTime);
        return (
            <View style={styles.modeContainer}>
                <View style={styles.timerCircle}>
                    <View style={styles.timeWrapper}>
                        <Text style={styles.timeMain}>{time.main}</Text>
                        <Text style={styles.timeSub}>{time.sub}</Text>
                    </View>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={swRunning ? handleLap : handleSwReset}
                    >
                        {swRunning ? (
                            <Flag size={24} color={Colors.dark.text} />
                        ) : (
                            <RotateCcw size={24} color={Colors.dark.text} />
                        )}
                        <Text style={styles.buttonLabel}>{swRunning ? 'Lap' : 'Reset'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton, swRunning && styles.stopButton]}
                        onPress={() => setSwRunning(!swRunning)}
                    >
                        {swRunning ? (
                            <Pause size={32} color={Colors.dark.text} fill={Colors.dark.text} />
                        ) : (
                            <Play size={32} color={Colors.dark.background} fill={Colors.dark.background} style={{ marginLeft: 4 }} />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.lapsContainer}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.lapsContent}>
                        {laps.map((lapTime, index) => {
                            const lapDiff = index === laps.length - 1 ? lapTime : lapTime - laps[index + 1];
                            const fLap = formatSwTime(lapTime);
                            const fDiff = formatSwTime(lapDiff);

                            return (
                                <View key={index} style={styles.lapRow}>
                                    <Text style={styles.lapIndex}>Lap {laps.length - index}</Text>
                                    <Text style={styles.lapTime}>{fDiff.main}{fDiff.sub}</Text>
                                    <Text style={styles.totalTime}>{fLap.main}{fLap.sub}</Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        );
    };

    const renderCountdown = () => {
        const progress = cdTotalTime > 0 ? cdTimeLeft / cdTotalTime : 1;

        return (
            <View style={styles.modeContainer}>
                {/* Visual Progress or Time Display */}
                {cdRunning || cdTimeLeft > 0 ? (
                    <View style={[styles.timerCircle, { borderColor: cdRunning ? Colors.dark.primary : Colors.dark.textSecondary }]}>
                        <Text style={styles.cdTimeDisplay}>{formatCdTime(cdTimeLeft)}</Text>
                        <Text style={styles.label}>{cdRunning ? 'REMAINING' : 'PAUSED'}</Text>
                    </View>
                ) : (
                    <View style={styles.inputContainer}>
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="00"
                                placeholderTextColor={Colors.dark.textSecondary}
                                keyboardType="number-pad"
                                value={inputHours}
                                onChangeText={setInputHours}
                                maxLength={2}
                            />
                            <Text style={styles.inputLabel}>hr</Text>
                        </View>
                        <Text style={styles.colon}>:</Text>
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="00"
                                placeholderTextColor={Colors.dark.textSecondary}
                                keyboardType="number-pad"
                                value={inputMinutes}
                                onChangeText={setInputMinutes}
                                maxLength={2}
                            />
                            <Text style={styles.inputLabel}>min</Text>
                        </View>
                        <Text style={styles.colon}>:</Text>
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="00"
                                placeholderTextColor={Colors.dark.textSecondary}
                                keyboardType="number-pad"
                                value={inputMinutes.length > 0 || inputHours.length > 0 ? inputSeconds : inputSeconds}
                                // Autofocus logic could go here, simplifying to just manual entry
                                onChangeText={setInputSeconds}
                                maxLength={2}
                            />
                            <Text style={styles.inputLabel}>sec</Text>
                        </View>
                    </View>
                )}

                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={handleCdReset}
                        disabled={cdTimeLeft === 0 && !cdRunning}
                    >
                        <RotateCcw size={24} color={cdTimeLeft > 0 || cdRunning ? Colors.dark.text : Colors.dark.textSecondary} />
                        <Text style={[styles.buttonLabel, { color: cdTimeLeft > 0 || cdRunning ? Colors.dark.text : Colors.dark.textSecondary }]}>Reset</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton, cdRunning && styles.stopButton]}
                        onPress={cdRunning ? () => setCdRunning(false) : handleReviewStart}
                    >
                        {cdRunning ? (
                            <Pause size={32} color={Colors.dark.text} fill={Colors.dark.text} />
                        ) : (
                            <Play size={32} color={Colors.dark.background} fill={Colors.dark.background} style={{ marginLeft: 4 }} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Presets Grid */}
                {!cdRunning && cdTimeLeft === 0 && (
                    <View style={styles.presetsContainer}>
                        <Text style={styles.sectionTitle}>Quick Presets</Text>
                        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsGrid}> */}
                        <View style={styles.presetsGrid}>
                            {PRESETS.map((preset) => (
                                <TouchableOpacity
                                    key={preset.label}
                                    style={styles.presetCard}
                                    onPress={() => applyPreset(preset.duration)}
                                >
                                    <Clock size={20} color={Colors.dark.primary} style={{ marginBottom: 8 }} />
                                    <Text style={styles.presetLabel}>{preset.label}</Text>
                                    <Text style={styles.presetTime}>{preset.duration}s</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {/* </ScrollView> */}
                    </View>
                )}
            </View>
        );
    };

    return (
        <ScreenLayout>
            {/* Mode Toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleBtn, mode === 'stopwatch' && styles.toggleBtnActive]}
                    onPress={() => setMode('stopwatch')}
                >
                    <Clock size={16} color={mode === 'stopwatch' ? Colors.dark.background : Colors.dark.textSecondary} />
                    <Text style={[styles.toggleText, mode === 'stopwatch' && styles.toggleTextActive]}>Stopwatch</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, mode === 'countdown' && styles.toggleBtnActive]}
                    onPress={() => setMode('countdown')}
                >
                    <TimerIcon size={16} color={mode === 'countdown' ? Colors.dark.background : Colors.dark.textSecondary} />
                    <Text style={[styles.toggleText, mode === 'countdown' && styles.toggleTextActive]}>Countdown</Text>
                </TouchableOpacity>
            </View>

            {mode === 'stopwatch' ? renderStopwatch() : renderCountdown()}

        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        padding: 4,
        alignSelf: 'center',
        marginBottom: 24,
    },
    toggleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 6,
    },
    toggleBtnActive: {
        backgroundColor: Colors.dark.primary,
    },
    toggleText: {
        color: Colors.dark.textSecondary,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: Colors.dark.background,
        fontWeight: 'bold',
    },
    modeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', // Center vertically
    },
    timerCircle: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: (width * 0.6) / 2,
        borderWidth: 2,
        borderColor: Colors.dark.surface,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(20, 20, 20, 0.5)',
        marginBottom: 20, // Reduced from 24
    },
    timeWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    timeMain: {
        fontSize: 56,
        fontWeight: '200',
        color: Colors.dark.text,
        fontVariant: ['tabular-nums'],
    },
    timeSub: {
        fontSize: 28,
        fontWeight: '200',
        color: Colors.dark.primary,
        fontVariant: ['tabular-nums'],
        marginBottom: 8,
    },
    cdTimeDisplay: {
        fontSize: 56,
        fontWeight: 'bold',
        color: Colors.dark.text,
        fontVariant: ['tabular-nums'],
    },
    label: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
        marginTop: 4,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 60,
        marginBottom: 8, // Reduced from 16
    },
    button: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: Colors.dark.primary,
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    stopButton: {
        backgroundColor: Colors.dark.error,
    },
    secondaryButton: {
        backgroundColor: Colors.dark.surface,
        flexDirection: 'column',
        gap: 4
    },
    buttonLabel: {
        fontSize: 10,
        color: Colors.dark.textSecondary,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    lapsContainer: {
        flex: 1,
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
        paddingHorizontal: 16,
    },
    lapsContent: {
        paddingVertical: 16,
    },
    lapRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.dark.surface,
    },
    lapIndex: {
        color: Colors.dark.textSecondary,
        width: 60,
    },
    lapTime: {
        color: Colors.dark.text,
        fontVariant: ['tabular-nums'],
        fontWeight: 'bold',
    },
    totalTime: {
        color: Colors.dark.textSecondary,
        fontVariant: ['tabular-nums'],
        width: 90,
        textAlign: 'right',
    },
    // Input Styles
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: width * 0.6,
        marginBottom: 20, // Reduced from 24
    },
    inputGroup: {
        alignItems: 'center',
    },
    input: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.dark.text,
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        padding: 12,
        width: 80,
        textAlign: 'center',
    },
    inputLabel: {
        color: Colors.dark.textSecondary,
        marginTop: 4,
        fontSize: 12,
    },
    colon: {
        fontSize: 48,
        color: Colors.dark.textSecondary,
        marginHorizontal: 8,
        marginBottom: 20,
    },
    // Preset Styles
    presetsContainer: {
        width: '100%',
        marginTop: 8, // Reduced from 20
    },
    sectionTitle: {
        color: Colors.dark.textSecondary,
        fontWeight: 'bold',
        marginBottom: 12,
        marginLeft: 4,
    },
    presetsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    presetCard: {
        width: '30%',
        backgroundColor: Colors.dark.surface,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    presetLabel: {
        color: Colors.dark.text,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,
        textAlign: 'center',
    },
    presetTime: {
        color: Colors.dark.textSecondary,
        fontSize: 10,
    },
});
