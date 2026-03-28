import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    Modal,
    Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const ViewUserProfile = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        type: 'logout', // 'logout' or 'delete'
        title: '',
        message: '',
        icon: '',
        confirmText: '',
        confirmColor: '',
    });

    const openLogoutModal = () => {
        setModalConfig({
            type: 'logout',
            title: 'Sign Out',
            message: 'Are you sure you want to log out of your account?',
            icon: 'log-out',
            confirmText: 'Logout',
            confirmColor: '#3277F1',
        });
        setModalVisible(true);
    };


    const handleConfirm = async () => {
        setModalVisible(false);
        if (modalConfig.type === 'logout') {
            logout();
        } else {
            try {
                await deleteAccount();
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Custom Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={[styles.modalIconCircle, { backgroundColor: modalConfig.confirmColor + '20' }]}>
                            <Feather name={modalConfig.icon} size={32} color={modalConfig.confirmColor} />
                        </View>

                        <Text style={styles.modalTitle}>{modalConfig.title}</Text>
                        <Text style={styles.modalMessage}>{modalConfig.message}</Text>

                        <View style={styles.modalActionRow}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.confirmBtn, { backgroundColor: modalConfig.confirmColor }]}
                                onPress={handleConfirm}
                            >
                                <Text style={styles.confirmBtnText}>{modalConfig.confirmText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Screen Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#1B2A4E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {/* Profile Identity Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
                    </View>
                    <Text style={styles.userName}>{user?.name || "User Name"}</Text>
                    <Text style={styles.userEmail}>{user?.email || "email@example.com"}</Text>
                </View>

                {/* Info Details Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile Details</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.iconCircle}>
                            <Feather name="user" size={18} color="#3277F1" />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Full Name</Text>
                            <Text style={styles.infoValue}>{user?.name || "N/A"}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.iconCircle}>
                            <Feather name="mail" size={18} color="#3277F1" />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Email Address</Text>
                            <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.footerActions}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={openLogoutModal}>
                        <Feather name="log-out" size={20} color="#FFF" />
                        <Text style={styles.logoutBtnText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ViewUserProfile;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F5FF', paddingTop: 30 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 15,
        // backgroundColor: '#FFF'
    },
    backButton: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#F5F7FA', justifyContent: 'center', alignItems: 'center'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B2A4E' },
    content: { flex: 1, padding: 20 },

    // Profile Section
    profileCard: {
        backgroundColor: '#FFF', borderRadius: 25, padding: 30,
        alignItems: 'center', marginBottom: 25, elevation: 3
    },
    avatar: {
        width: 90, height: 90, borderRadius: 45, backgroundColor: '#3277F1',
        justifyContent: 'center', alignItems: 'center', marginBottom: 15,
        shadowColor: '#3277F1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8
    },
    avatarText: { color: '#FFF', fontSize: 36, fontWeight: 'bold' },
    userName: { fontSize: 22, fontWeight: 'bold', color: '#1B2A4E' },
    userEmail: { fontSize: 14, color: '#8A96AC', marginTop: 4 },

    // Info Section
    section: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 25 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1B2A4E', marginBottom: 20 },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    iconCircle: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#F0F5FF', justifyContent: 'center', alignItems: 'center', marginRight: 15
    },
    infoLabel: { fontSize: 12, color: '#8A96AC', marginBottom: 2 },
    infoValue: { fontSize: 15, fontWeight: '600', color: '#1B2A4E' },
    divider: { height: 1, backgroundColor: '#F0F5FF', marginVertical: 15 },

    // Footer Actions
    footerActions: { marginTop: 'auto', gap: 12 },
    logoutBtn: {
        flexDirection: 'row', backgroundColor: '#3277F1', height: 60,
        borderRadius: 15, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#3277F1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 3
    },
    logoutBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },

    // --- Modal Styles ---
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(27, 42, 78, 0.7)', // Tinted backdrop
        justifyContent: 'center', alignItems: 'center', padding: 20
    },
    modalCard: {
        backgroundColor: '#FFF', width: '100%', borderRadius: 25,
        padding: 30, alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10
    },
    modalIconCircle: {
        width: 80, height: 80, borderRadius: 40,
        justifyContent: 'center', alignItems: 'center', marginBottom: 20
    },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1B2A4E', marginBottom: 10 },
    modalMessage: { fontSize: 16, color: '#8A96AC', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
    modalActionRow: { flexDirection: 'row', gap: 15 },
    cancelBtn: {
        flex: 1, height: 55, borderRadius: 15,
        backgroundColor: '#F5F7FA', justifyContent: 'center', alignItems: 'center'
    },
    cancelBtnText: { color: '#8A96AC', fontWeight: 'bold', fontSize: 16 },
    confirmBtn: {
        flex: 2, height: 55, borderRadius: 15,
        justifyContent: 'center', alignItems: 'center', elevation: 2
    },
    confirmBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});