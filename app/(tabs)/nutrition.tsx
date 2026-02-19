import React, { useState, useMemo } from 'react';
import { Text, StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Linking, Image, ImageBackground } from 'react-native';
import { ScreenLayout } from '../../components/ScreenLayout';
import { Colors } from '../../constants/Colors';
import { PieChart, ProgressChart, BarChart } from 'react-native-chart-kit';
import { NutritionRow } from '../../components/NutritionRow';
import { AddFoodModal } from '../../components/AddFoodModal';
import { FoodScannerModal } from '../../components/FoodScannerModal';
import { ExternalLink, Plus, ScanLine, ChevronRight, BookOpen, Utensils, Pill } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

interface FoodItem {
    id: string;
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
}

interface MealLog {
    items: FoodItem[];
    totalCalories: number;
}

export default function Nutrition() {
    // State for meals
    const [meals, setMeals] = useState<{ [key: string]: MealLog }>({
        'Breakfast': { items: [], totalCalories: 0 },
        'Lunch': { items: [], totalCalories: 0 },
        'Dinner': { items: [], totalCalories: 0 },
        'Snacks': { items: [], totalCalories: 0 },
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [scannerVisible, setScannerVisible] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState('');

    const calorieGoal = 2500;

    // Calculate total consumed
    const caloriesConsumed = useMemo(() => {
        return Object.values(meals).reduce((acc, meal) => acc + meal.totalCalories, 0);
    }, [meals]);

    const macros = useMemo(() => {
        let p = 0, c = 0, f = 0, fbr = 0;
        Object.values(meals).forEach(meal => {
            meal.items.forEach(item => {
                p += item.protein || 0;
                c += item.carbs || 0;
                f += item.fat || 0;
                fbr += item.fiber || 0;
            });
        });
        return { p, c, f, fbr };
    }, [meals]);

    const progress = Math.min(caloriesConsumed / calorieGoal, 1);

    const handleAddFood = (name: string, calories: number, fiber?: number) => {
        const newItem: FoodItem = { id: Math.random().toString(), name, calories, fiber };

        setMeals(prev => ({
            ...prev,
            [selectedMeal]: {
                items: [...prev[selectedMeal].items, newItem],
                totalCalories: prev[selectedMeal].totalCalories + calories
            }
        }));
    };

    const handleAddScannedFood = (name: string, calories: number, protein: number, carbs: number, fat: number, fiber: number, meal: string) => {
        const newItem: FoodItem = {
            id: Math.random().toString(),
            name,
            calories,
            protein,
            carbs,
            fat,
            fiber
        };

        setMeals(prev => ({
            ...prev,
            [meal]: {
                items: [...prev[meal].items, newItem],
                totalCalories: prev[meal].totalCalories + calories
            }
        }));
    };

    const openAddModal = (meal: string) => {
        setSelectedMeal(meal);
        setModalVisible(true);
    };

    // Use centralized theme
    const theme = Colors.urbanNeon;

    const macroData = [
        {
            name: "Protein",
            population: macros.p > 0 ? macros.p : 10,
            color: theme.primary, // Electric Lime
            legendFontColor: theme.textSecondary,
            legendFontSize: 12
        },
        {
            name: "Carbs",
            population: macros.c > 0 ? macros.c : 10,
            color: theme.secondary, // Neon Orange
            legendFontColor: theme.textSecondary,
            legendFontSize: 12
        },
        {
            name: "Fat",
            population: macros.f > 0 ? macros.f : 10,
            color: theme.tertiary, // Neon Cyan
            legendFontColor: theme.textSecondary,
            legendFontSize: 12
        },
        {
            name: "Fiber",
            population: macros.fbr > 0 ? macros.fbr : 5,
            color: theme.quaternary || '#D946EF', // Hot Pink
            legendFontColor: theme.textSecondary,
            legendFontSize: 12
        }
    ];

    const chartConfig = {
        backgroundGradientFrom: theme.surface,
        backgroundGradientTo: theme.surface,
        color: (opacity = 1) => theme.primary, // Default to Primary
        strokeWidth: 2,
        barPercentage: 0.5,
        decimalPlaces: 0,
        labelColor: (opacity = 1) => theme.text,
    };

    // Placeholder images (using available assets)
    const resourceContent = [
        { id: '1', title: 'Healthy Recipes', url: 'https://www.nutrition.gov', icon: <Utensils color="#000" size={24} />, image: require('../../assets/images/recipes.png') },
        { id: '2', title: 'Supplements 101', url: 'https://www.eatright.org', icon: <Pill color="#000" size={24} />, image: require('../../assets/images/supplements.png') },
        { id: '3', title: 'Nutrition Guides', url: 'https://www.myplate.gov', icon: <BookOpen color="#000" size={24} />, image: require('../../assets/images/recipes.png') }, // Reusing recipes for now as we missed the 3rd gen
    ];

    return (
        <ScreenLayout style={{ backgroundColor: theme.background }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Header with Compact Scan Button */}
                <View style={styles.headerRow}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Nutrition</Text>
                    <TouchableOpacity style={[styles.scanButtonSmall, { backgroundColor: theme.primary, shadowColor: theme.primary }]} onPress={() => setScannerVisible(true)}>
                        <ScanLine size={20} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Calorie Progress Card */}
                <View style={[styles.chartCard, { backgroundColor: theme.surface }]}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={[styles.chartTitle, { color: theme.text }]}>Calories</Text>
                            <Text style={[styles.calRemainingText, { color: theme.text }]}>{Math.max(0, calorieGoal - caloriesConsumed)} <Text style={[styles.subText, { color: theme.textSecondary }]}>left</Text></Text>
                        </View>
                        <ProgressChart
                            data={{ labels: ["Log"], data: [progress] }}
                            width={100}
                            height={100}
                            strokeWidth={10}
                            radius={40}
                            chartConfig={{
                                ...chartConfig,
                                color: (opacity = 1) => `rgba(255, 105, 180, ${opacity})`, // Using hot pink / secondary instead of theme.secondary overriding opacity
                                labelColor: () => "transparent",
                            }}
                            hideLegend={true}
                        />
                    </View>

                    <View style={[styles.statsRow, { backgroundColor: theme.background }]}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Goal</Text>
                            <Text style={[styles.statVal, { color: theme.text }]}>{calorieGoal}</Text>
                        </View>
                        <View style={[styles.statSeparator, { backgroundColor: theme.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Food</Text>
                            <Text style={[styles.statVal, { color: theme.text }]}>{caloriesConsumed}</Text>
                        </View>
                        <View style={[styles.statSeparator, { backgroundColor: theme.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Burned</Text>
                            <Text style={[styles.statVal, { color: theme.text }]}>450</Text>
                        </View>
                    </View>
                </View>

                {/* Macros & Weekly Trend */}
                <View style={styles.chartsRow}>
                    {/* Size reduced for Macro Pie */}
                    <View style={[styles.chartCard, { flex: 1, marginRight: 8, padding: 8, height: 220, alignItems: 'center', backgroundColor: theme.surface }]}>
                        <Text style={[styles.chartTitle, { fontSize: 16, alignSelf: 'flex-start', color: theme.text }]}>Macros</Text>
                        <PieChart
                            data={macroData}
                            width={screenWidth / 2 - 30}
                            height={120}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"0"} // Adjusted padding
                            center={[screenWidth / 8, 0]} // Roughly center
                            absolute={false}
                            hasLegend={false}
                        />
                        <View style={styles.macroLegend}>
                            <Text style={{ color: theme.primary, fontSize: 10, fontWeight: 'bold' }}>P: {Math.round(macros.p)}g</Text>
                            <Text style={{ color: theme.secondary, fontSize: 10, fontWeight: 'bold' }}>C: {Math.round(macros.c)}g</Text>
                            <Text style={{ color: theme.tertiary, fontSize: 10, fontWeight: 'bold' }}>F: {Math.round(macros.f)}g</Text>
                            <Text style={{ color: theme.quaternary || '#D946EF', fontSize: 10, fontWeight: 'bold' }}>Fib: {Math.round(macros.fbr)}g</Text>
                        </View>
                    </View>

                    {/* Weekly Trend Bar Chart */}
                    <View style={[styles.chartCard, { flex: 1, marginLeft: 8, padding: 12, height: 220, backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={[styles.chartTitle, { fontSize: 16, alignSelf: 'flex-start', color: theme.text }]}>Weekly</Text>
                        <BarChart
                            data={{
                                labels: ["M", "T", "W", "T", "F", "S", "S"],
                                datasets: [{ data: [2100, 2400, 1800, 2500, 2200, 2600, 2100] }]
                            }}
                            width={screenWidth / 2 - 40} // Fit comfortably within the flex-1 container (half screen minus padding/margins)
                            height={160}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={{
                                ...chartConfig,
                                backgroundColor: theme.surface,
                                backgroundGradientFrom: theme.surface,
                                backgroundGradientTo: theme.surface,
                                color: (opacity = 1) => theme.tertiary, // Teal/Cyan for Weekly
                                barPercentage: 0.6,
                                propsForLabels: {
                                    fontSize: 10,
                                    fill: theme.textSecondary
                                },
                            }}
                            withInnerLines={false}
                            showValuesOnTopOfBars={false}
                            fromZero
                            withHorizontalLabels={false}
                            style={{
                                paddingRight: 0, // Removes arbitrary right padding that pushes chart off-center
                                marginLeft: -20, // Negative margin offsets react-native-chart-kit's default Y-axis space when horizontal labels are hidden
                            }}
                        />
                    </View>
                </View>

                {/* Trusted Resources: Image Cards */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Trusted Resources</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.resourcesScroll}
                >
                    {resourceContent.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[styles.resourceCardImage, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => Linking.openURL(item.url)}
                        >
                            <View style={[styles.resourceIconBg, { backgroundColor: theme.primary }]}>
                                {item.icon}
                            </View>
                            <Text style={[styles.resourceTitle, { color: theme.text }]}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Today's Meals */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Meals</Text>
                    <View style={[styles.card, { backgroundColor: theme.surface }]}>
                        {Object.keys(meals).map(meal => (
                            <NutritionRow
                                key={meal}
                                meal={meal}
                                calories={meals[meal].totalCalories}
                                items={meals[meal].items}
                                onAdd={() => openAddModal(meal)}
                                theme={theme}
                            />
                        ))}
                    </View>
                </View>

                {/* Modals */}
                <AddFoodModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onAdd={handleAddFood}
                    mealName={selectedMeal}
                />

                <FoodScannerModal
                    visible={scannerVisible}
                    onClose={() => setScannerVisible(false)}
                    onAdd={handleAddScannedFood}
                />
            </ScrollView>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    scanButtonSmall: {
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
    chartCard: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    calRemainingText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 14,
        fontWeight: '400',
    },
    statsRow: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    statVal: {
        fontSize: 16,
        fontWeight: '600',
    },
    statSeparator: {
        width: 1,
        height: 24,
    },
    chartsRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    macroLegend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    resourcesScroll: {
        paddingRight: 20,
        marginBottom: 24,
    },
    resourceCardImage: {
        width: 120,
        height: 140,
        borderRadius: 16,
        marginRight: 12,
        padding: 12,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 3,
    },
    resourceIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resourceTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    section: {
        marginBottom: 16,
    },
    card: {
        borderRadius: 16,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
