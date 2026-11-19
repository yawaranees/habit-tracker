import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../AppContext';

export default function Add() {
    const { addHabit, dark, toggleTheme } = useApp();
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const bg = dark ? '#1A1A2E' : '#F7F8FC';
    const txt = dark ? '#fff' : '#000';

    const save = () => {
        if (!name.trim()) { Alert.alert('Error', 'Please enter habit name'); return; }
        addHabit(name, desc);
        setName(''); setDesc('');
        Alert.alert('Saved', 'Habit added to Home!');
        router.push('/(tabs)');
    };

    return (
        <View style={[styles.c, { backgroundColor: bg }]}>
            <View style={styles.top}><Text style={[styles.t, { color: txt }]}>Add Habit</Text><TouchableOpacity onPress={toggleTheme}><Text style={{ fontSize: 26 }}>{dark ? '🌙' : '☀️'}</Text></TouchableOpacity></View>
            <TextInput style={styles.i} placeholder="Habit name - Learn Programming" value={name} onChangeText={setName} />
            <TextInput style={styles.i} placeholder="Description - Practice daily" value={desc} onChangeText={setDesc} />
            <TouchableOpacity style={styles.b} onPress={save}><Text style={styles.bt}>Save</Text></TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    c: { flex: 1, padding: 22, paddingTop: 65 },
    top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    t: { fontSize: 26, fontWeight: 'bold' },
    i: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 12 },
    b: { backgroundColor: '#6C63FF', padding: 16, borderRadius: 12, alignItems: 'center' },
    bt: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});