import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../AppContext';

export default function Home() {
  const { habits, toggleHabit, deleteHabit, dark, toggleTheme } = useApp();
  const done = habits.filter(h => h.done).length;
  const bg = dark ? '#1A1A2E' : '#F7F8FC';
  const cardBg = dark ? '#2A2A44' : '#fff';
  const txt = dark ? '#fff' : '#000';
  const sub = dark ? '#aaa' : '#666';

  return (
    <View style={[styles.c, { backgroundColor: bg }]}>
      <View style={styles.top}><Text style={[styles.small, { color: '#6C63FF' }]}>YOUR DAILY ROUTINE</Text>
        <TouchableOpacity onPress={toggleTheme}><Text style={{ fontSize: 26 }}>{dark ? '🌙' : '☀️'}</Text></TouchableOpacity>
      </View>
      <Text style={[styles.big, { color: txt }]}>Build Better Habits.</Text>
      <Text style={{ color: sub }}>Small steps. Big changes.</Text>
      <View style={styles.progressCard}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Today's Progress</Text><Text style={{ color: '#fff', fontSize: 20, marginTop: 8 }}>{done} / {habits.length} Completed</Text></View>
      <Text style={[styles.head, { color: txt }]}>My Habits</Text>
      <FlatList data={habits} keyExtractor={(item) => item._id || item.id} ListEmptyComponent={<Text style={{ color: sub, textAlign: 'center', marginTop: 20 }}>No habits yet. Add your first habit!</Text>}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: cardBg }]}>
            <TouchableOpacity onPress={() => toggleHabit(item._id || item.id)}><Text style={{ fontSize: 22 }}>{item.done ? '✅' : '⬜'}</Text></TouchableOpacity>
            <Text style={[styles.name, { color: txt, textDecorationLine: item.done ? 'line-through' : 'none' }]}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteHabit(item._id || item.id)}><Text style={{ color: '#ff5555', fontSize: 18 }}>X</Text></TouchableOpacity>
          </View>
        )} />
      <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(tabs)/add')}><Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Add Habit</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  c: { flex: 1, padding: 22, paddingTop: 65 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  small: { fontSize: 13, fontWeight: 'bold' },
  big: { fontSize: 30, fontWeight: 'bold', marginTop: 8 },
  progressCard: { backgroundColor: '#6C63FF', padding: 18, borderRadius: 16, marginTop: 18, marginBottom: 18 },
  head: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  row: { padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  name: { flex: 1, fontSize: 16, fontWeight: '600' },
  addBtn: { backgroundColor: '#6C63FF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
});