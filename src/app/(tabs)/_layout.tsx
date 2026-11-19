import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: () => <Text>🏠</Text> }} />
            <Tabs.Screen name="add" options={{ title: 'Add Habit', tabBarIcon: () => <Text>➕</Text> }} />
            <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: () => <Text>📊</Text> }} />
        </Tabs>
    );
}