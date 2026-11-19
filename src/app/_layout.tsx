import { Stack } from 'expo-router';
import { AppProvider } from '../AppContext';

export default function Layout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppProvider>
  );
}