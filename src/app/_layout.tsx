import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useSettingsStore } from '@/stores';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const themeMode = useSettingsStore((s) => s.themeMode);

  const [fontsLoaded] = useFonts({
    'KFGQPC-Uthmanic-HAFS': require('../../assets/fonts/KFGQPC-Uthmanic-HAFS.otf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const resolvedScheme = themeMode === 'system' ? systemColorScheme : themeMode;
  const isDark = resolvedScheme === 'dark';

  const colors = Colors[isDark ? 'dark' : 'light'];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="wazifah-sugro" />
      <Stack.Screen name="wazifah-kubro" />
      <Stack.Screen name="bookmark" />
      <Stack.Screen name="settings" />
      <Stack.Screen
        name="surah/[id]"
        options={{
          headerShown: true,
          title: '',
          presentation: 'card',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="kitab/[id]"
        options={{
          headerShown: true,
          title: '',
          presentation: 'card',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="kitab/[id]/[chapter]"
        options={{
          headerShown: true,
          title: '',
          presentation: 'card',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
    </Stack>
  );
}