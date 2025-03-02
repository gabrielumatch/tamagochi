import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { usePet } from "../contexts/PetContext";
// import { useUser } from "../contexts/UserContext";
import { router } from "expo-router";
import Colors from "../constants/Colors";
import { useColorScheme } from "react-native";
import Layout from "../constants/Layout";

// Mock user hook until TypeScript resolves the import issue
const useUser = () => {
  return {
    user: {
      coins: 100,
      items: [],
      settings: {
        notificationsEnabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
        theme: "system",
      },
      achievements: {},
    },
    isLoading: false,
    addCoins: () => {},
    spendCoins: () => true,
    addItem: () => {},
    useItem: () => true,
    toggleNotifications: () => {},
    toggleSound: () => {},
    toggleVibration: () => {},
    setTheme: () => {},
    unlockAchievement: () => {},
  };
};

export default function SplashScreen() {
  const { pet, isLoading } = usePet();
  const { user } = useUser();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  useEffect(() => {
    // Wait for pet data to load
    if (isLoading) return;

    // Set a timeout for the splash screen
    const timer = setTimeout(() => {
      // If pet exists, go to home screen, otherwise go to create pet screen
      if (pet) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(create)/create-pet");
      }
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, [pet, isLoading]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.logoEmoji}>🐣</Text>
      <Text style={[styles.title, { color: colors.text }]}>Tamagotchi</Text>
      <Text style={[styles.subtitle, { color: colors.text + "99" }]}>
        Your virtual pet companion
      </Text>

      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Layout.spacing.xl,
  },
  logoEmoji: {
    fontSize: 100,
    marginBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: Layout.spacing.xl,
  },
  loading: {
    marginTop: Layout.spacing.xl,
  },
});
