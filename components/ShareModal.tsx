import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { Facebook, Instagram, Twitter, MessageCircle, X } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

interface ShareModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
}

export const ShareModal = ({ visible, onClose, theme }: ShareModalProps) => {
    if (!visible) return null;

    const shareOptions = [
        {
            id: 'facebook',
            name: 'Facebook',
            icon: <Facebook size={24} color="#1877F2" />,
            action: () => Linking.openURL('https://www.facebook.com')
        },
        {
            id: 'messenger',
            name: 'Messenger',
            icon: <MessageCircle size={24} color="#0084FF" />,
            action: () => Linking.openURL('fb-messenger://')
        },
        {
            id: 'instagram',
            name: 'Instagram',
            icon: <Instagram size={24} color="#C13584" />,
            action: () => Linking.openURL('instagram://app')
        },
        {
            id: 'twitter',
            name: 'X (Twitter)',
            icon: <Twitter size={24} color="#000" />,
            action: () => Linking.openURL('twitter://post?message=Check out my workout progress!')
        },
    ];

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1} />
                <View style={[styles.modalView, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.header}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Share Progress</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={theme.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.grid}>
                        {shareOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[styles.optionCard, { backgroundColor: theme.background, borderColor: theme.border }]}
                                onPress={() => {
                                    option.action();
                                    onClose();
                                }}
                            >
                                <View style={styles.iconContainer}>
                                    {option.icon}
                                </View>
                                <Text style={[styles.optionText, { color: theme.text }]}>{option.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minHeight: 300,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    optionCard: {
        width: (width - 48 - 16) / 2, // (Screen width - padding - gap) / 2
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
