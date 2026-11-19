import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../AppContext';

export default function Progress() {
    const { habits, dark, toggleTheme, history } = useApp();
    const done = habits.filter(h => h.done).length;
    const pending = habits.length - done;
    const percent = habits.length === 0 ? 0 : Math.round((done / habits.length) * 100);
    const bg = dark ? '#1A1A2E' : '#F7F8FC';
    const txt = dark ? '#fff' : '#000';
    const today = new Date();
    const todayIndex = today.getDay();
    const week = [
        { name: 'Sunday', i: 0 },
        { name: 'Monday', i: 1 },
        { name: 'Tuesday', i: 2 },
        { name: 'Wednesday', i: 3 },
        { name: 'Thursday', i: 4 },
        { name: 'Friday', i: 5 },
        { name: 'Saturday', i: 6 },
    ];
    const getPercentForDay = (dayIndex: number) => {
        if (dayIndex === todayIndex) return percent;
        if (dayIndex > todayIndex) return 0;
        const date = new Date(today);
        date.setDate(today.getDate() - (todayIndex - dayIndex));
        const dateString = date.toDateString();
        if (history && history[dateString]) {
            return history[dateString].percent;
        }
        return 0;
    };
    return (
        <View style={[styles.c, { backgroundColor: bg }]}>
            <View style={styles.top}>
                <Text style={[styles.t, { color: txt }]}>Progress</Text>
                <TouchableOpacity onPress={toggleTheme}><Text style={{ fontSize: 26 }}>{dark ? '🌙' : '☀️'}</Text></TouchableOpacity>
            </View>
            <View style={styles.card}>
                <Text style={styles.w}>Completed: {done}</Text>
                <Text style={styles.w}>Pending: {pending}</Text>
                <Text style={styles.w}>Today: {percent}%</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                {week.map((d) => {
                    const p = getPercentForDay(d.i);
                    return (
                        <View key={d.name} style={styles.row}>
                            <Text style={[styles.day, { color: txt }]}>{d.name}</Text>
                            <View style={styles.barBg}>
                                <View style={[styles.barFill, { width: `${p}%` }]} />
                            </View>
                            <Text style={[styles.pct, { color: txt }]}>{p}%</Text>
                        </View>
                    );
                })}
            </View>
            <Text style={{ color: '#888', marginTop: 16 }}>Total Habits: {habits.length}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    c: { flex: 1, padding: 22, paddingTop: 65 },
    top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    t: { fontSize: 26, fontWeight: 'bold' },
    card: { backgroundColor: '#6C63FF', padding: 18, borderRadius: 16, marginTop: 20 },
    w: { color: '#fff', fontSize: 16, marginBottom: 4 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    day: { width: 105, fontSize: 15, fontWeight: '600' },
    barBg: { flex: 1, height: 18, backgroundColor: '#E0E0E0', borderRadius: 10, overflow: 'hidden' },
    barFill: { height: '100%', backgroundColor: '#6C63FF' },
    pct: { width: 45, textAlign: 'right', fontSize: 15, fontWeight: '600' },
});