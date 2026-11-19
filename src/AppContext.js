import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();
const API_URL = 'http://10.241.153.241:5000/api/habits';

export function AppProvider({ children }) {
    const [habits, setHabits] = useState([]);
    const [dark, setDark] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [history, setHistory] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            // MongoDB _id ko id bana diya taake poori app me ek jaisa chale
            const fixedData = data.map(h => ({ ...h, id: h._id || h.id }));
            setHabits(fixedData);

            const savedTheme = await AsyncStorage.getItem('dark');
            const savedHistory = await AsyncStorage.getItem('history');
            const savedDate = await AsyncStorage.getItem('lastDate');
            const today = new Date().toDateString();

            let parsedHistory = savedHistory ? JSON.parse(savedHistory) : {};

            if (savedDate && savedDate !== today && fixedData.length > 0) {
                const total = fixedData.length;
                const completed = fixedData.filter(h => h.done).length;
                const percent = Math.round((completed / total) * 100);
                parsedHistory[savedDate] = { total, completed, percent };
                await AsyncStorage.setItem('history', JSON.stringify(parsedHistory));
            }
            await AsyncStorage.setItem('lastDate', today);
            setHistory(parsedHistory);
            if (savedTheme !== null) setDark(JSON.parse(savedTheme));
            setLoaded(true);
        } catch (e) {
            console.log('API Error');
            setLoaded(true);
        }
    }

    async function updateTodayHistory(currentHabits) {
        const today = new Date().toDateString();
        if (currentHabits.length === 0) return;
        const total = currentHabits.length;
        const completed = currentHabits.filter(h => h.done).length;
        const percent = Math.round((completed / total) * 100);
        const newHistory = { ...history, [today]: { total, completed, percent } };
        setHistory(newHistory);
        await AsyncStorage.setItem('history', JSON.stringify(newHistory));
    }

    const addHabit = async (name, description) => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description: description || '' }),
            });
            const newHabit = await res.json();
            const fixedHabit = { ...newHabit, id: newHabit._id || newHabit.id };
            const updated = [...habits, fixedHabit];
            setHabits(updated);
            updateTodayHistory(updated);
        } catch (e) { console.log(e); }
    };

    const toggleHabit = async (id) => {
        const habit = habits.find(h => (h._id || h.id) === id);
        if (!habit) return;
        const updatedHabit = { ...habit, done: !habit.done };
        const updated = habits.map(h => (h._id || h.id) === id ? updatedHabit : h);
        setHabits(updated);
        updateTodayHistory(updated);
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done: updatedHabit.done }),
            });
        } catch (e) { console.log(e); }
    };

    const deleteHabit = async (id) => {
        const updated = habits.filter(h => (h._id || h.id) !== id);
        setHabits(updated);
        updateTodayHistory(updated);
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        } catch (e) { console.log(e); }
    };

    const toggleTheme = async () => {
        const newVal = !dark;
        setDark(newVal);
        await AsyncStorage.setItem('dark', JSON.stringify(newVal));
    };

    return (
        <AppContext.Provider value={{ habits, addHabit, toggleHabit, toggle: toggleHabit, deleteHabit, removeHabit: deleteHabit, dark, toggleTheme, loaded, history }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}