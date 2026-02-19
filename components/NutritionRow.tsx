import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Plus } from 'lucide-react-native';

interface FoodItem {
    id: string;
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
}

interface NutritionRowProps {
    meal: string;
    calories: number;
    items: FoodItem[];
    onAdd: () => void;
    theme?: any; // Add theme prop
}

export const NutritionRow = ({ meal, calories, items, onAdd, theme }: NutritionRowProps) => {
    // Determine colors based on theme presence
    const textColor = theme ? theme.text : Colors.dark.text;
    const secondaryTextColor = theme ? theme.textSecondary : Colors.dark.textSecondary;
    const backgroundColor = theme ? theme.surface : Colors.dark.background;
    const borderColor = theme ? theme.border : Colors.dark.border;

    return (
        <View style={[styles.container, { borderBottomColor: borderColor }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.mealName, { color: textColor }]}>{meal}</Text>
                    <Text style={[styles.totalCalories, { color: secondaryTextColor }]}>{calories} kcal</Text>
                </View>
                <TouchableOpacity onPress={onAdd}>
                    <Plus size={24} color={theme ? theme.primary : Colors.dark.primary} />
                </TouchableOpacity>
            </View>

            {items.length > 0 ? (
                <View style={styles.foodList}>
                    {items.map((item, index) => (
                        <View key={item.id} style={[styles.foodItem, { backgroundColor: theme ? theme.surface : Colors.dark.surface }]}>
                            <View style={styles.foodInfo}>
                                <Text style={[styles.foodName, { color: textColor }]}>{item.name}</Text>
                                {(item.protein || item.carbs || item.fat) && (
                                    <Text style={[styles.foodMacros, { color: secondaryTextColor }]}>
                                        {item.protein ? `P: ${item.protein}g ` : ''}
                                        {item.carbs ? `C: ${item.carbs}g ` : ''}
                                        {item.fat ? `F: ${item.fat}g` : ''}
                                    </Text>
                                )}
                            </View>
                            <Text style={[styles.foodCalories, { color: textColor }]}>{item.calories}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={[styles.emptyText, { color: secondaryTextColor }]}>No food logged</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    mealName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    totalCalories: {
        fontSize: 14,
        fontWeight: '600',
    },
    foodList: {
        gap: 8,
    },
    foodItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
    },
    foodInfo: {
        flex: 1,
    },
    foodName: {
        fontSize: 14,
        fontWeight: '500',
    },
    foodMacros: {
        fontSize: 12,
        marginTop: 2,
    },
    foodCalories: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
});
