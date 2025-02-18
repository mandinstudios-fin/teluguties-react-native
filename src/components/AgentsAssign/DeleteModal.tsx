import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DeleteModal = ({ visible, onClose, onConfirm }) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Are you sure?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.noButton} onPress={onClose}>
                            <Text style={styles.noText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.yesButton} onPress={onConfirm}>
                            <Text style={styles.yesText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    noButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    noText: {
        color: 'black',
        fontSize: 16,
    },
    yesButton: {
        backgroundColor: '#ff5c5c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    yesText: {
        color: 'white',
        fontSize: 16,
    },
});

export default DeleteModal;
