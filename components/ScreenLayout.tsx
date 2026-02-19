import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';

interface ScreenLayoutProps {
    children: React.ReactNode;
    style?: any;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children, style }) => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />
            <View style={[styles.content, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    content: {
        flex: 1,
        padding: 16,
        paddingBottom: 0, // Avoid double padding if needed, but 16 is good standard
    },
});
