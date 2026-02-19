import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { LucideIcon } from 'lucide-react-native';

interface WidgetProps {
    title: string;
    value?: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    color?: string;
    style?: any;
    onPress?: () => void;
    children?: React.ReactNode;
}

export const Widget: React.FC<WidgetProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = Colors.dark.primary,
    style,
    onPress,
    children
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, style]}
            activeOpacity={0.7}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    {Icon && <Icon size={18} color={color} style={styles.icon} />}
                    <Text style={[styles.title, { color: Colors.dark.textSecondary }]}>{title}</Text>
                </View>
            </View>

            {children ? (
                children
            ) : (
                <View style={styles.content}>
                    {value && <Text style={styles.value}>{value}</Text>}
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    header: {
        marginBottom: 8,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    content: {
        marginTop: 4,
    },
    value: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginTop: 4,
    },
});
