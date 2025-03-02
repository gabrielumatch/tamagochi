import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, Pressable } from "react-native";
import { usePet } from "../../contexts/PetContext";
// import { useUser } from "../../contexts/UserContext";
import PetDisplay from "../../components/pet/PetDisplay";
import StatusBars from "../../components/pet/StatusBars";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { router } from "expo-router";
import Layout from "../../constants/Layout";
import { PetStage } from "../../constants/PetTypes";
import EvolutionStatusBar from "../../components/pet/EvolutionStatusBar";

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

export default function HomeScreen() {
  const { pet, isLoading, updatePetAttributes, createPet, evolvePet } =
    usePet();
  const { user } = useUser();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  // Update pet attributes when the screen is focused
  useEffect(() => {
    console.log("Home screen mounted, updating pet attributes");
    if (pet) {
      updatePetAttributes();
    }

    // Set up an interval to update pet attributes every 10 seconds (for testing)
    const interval = setInterval(() => {
      console.log("Interval triggered, updating pet attributes");
      if (pet) {
        updatePetAttributes();
      }
    }, 10000); // Changed from 60000 (1 minute) to 10000 (10 seconds) for testing

    return () => {
      console.log("Home screen unmounted, clearing interval");
      clearInterval(interval);
    };
  }, [pet, updatePetAttributes]);

  // Check if pet is dead and redirect to game-over modal
  useEffect(() => {
    if (pet && pet.stage === PetStage.DEAD) {
      router.push("/(modals)/game-over");
    }
  }, [pet]);

  // Navigation handlers
  const navigateToCreatePet = () => {
    router.push("/(create)/create-pet");
  };

  const navigateToCare = () => {
    router.push("/(tabs)/care");
  };

  const navigateToPlay = () => {
    router.push("/(tabs)/play");
  };

  const navigateToShop = () => {
    router.push("/(tabs)/shop");
  };

  // If loading, show a loading message
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading your pet...</Text>
      </View>
    );
  }

  // If no pet exists, show the create pet screen
  if (!pet) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Card style={styles.createPetCard}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome to Tamagotchi!
          </Text>
          <Text style={[styles.subtitle, { color: colors.text + "99" }]}>
            Create your virtual pet and take care of it.
          </Text>
          <Button
            title="Create New Pet"
            size="large"
            onPress={navigateToCreatePet}
          />
        </Card>
      </View>
    );
  }

  // Determine pet mood based on attributes
  const getPetMood = () => {
    const { health, happiness, hunger, energy } = pet.attributes;

    if (health < 20 || happiness < 20 || hunger < 20 || energy < 20) {
      return "sad";
    }

    if (health > 80 && happiness > 80 && hunger > 80 && energy > 80) {
      return "happy";
    }

    return "idle";
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Pet Display */}
      <Card style={styles.petCard}>
        <PetDisplay pet={pet} animation={getPetMood()} />
        <StatusBars attributes={pet.attributes} />
      </Card>

      {/* Add the Evolution Status Bar */}
      <View style={styles.evolutionContainer}>
        <EvolutionStatusBar />
      </View>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionButtons}>
          <Button
            title="Feed"
            type="primary"
            style={styles.actionButton}
            onPress={navigateToCare}
          />
          <Button
            title="Play"
            type="secondary"
            style={styles.actionButton}
            onPress={navigateToPlay}
          />
          <Button
            title="Shop"
            type="outline"
            style={styles.actionButton}
            onPress={navigateToShop}
          />
        </View>
      </Card>

      {/* Stats */}
      <Card style={styles.statsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Pet Stats
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.text + "99" }]}>
              Stage
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {pet.stage.charAt(0).toUpperCase() + pet.stage.slice(1)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.text + "99" }]}>
              Age
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {pet.age} {pet.age === 1 ? "day" : "days"}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.text + "99" }]}>
              Coins
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {user?.coins || 0}
            </Text>
          </View>
        </View>
      </Card>

      {/* Debug Evolution Button (for testing) */}
      <Card style={styles.debugCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Debug Controls
        </Text>
        <Button
          title="Force Evolution"
          type="outline"
          onPress={evolvePet}
          style={styles.debugButton}
        />
        <Text style={[styles.debugText, { color: colors.text + "99" }]}>
          This button is for testing only. It forces your pet to evolve to the
          next stage.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
  },
  createPetCard: {
    margin: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    alignItems: "center",
    gap: Layout.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: Layout.spacing.md,
  },
  petCard: {
    padding: Layout.spacing.md,
  },
  actionsCard: {
    padding: Layout.spacing.md,
  },
  statsCard: {
    padding: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: Layout.spacing.md,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  evolutionContainer: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  debugCard: {
    padding: Layout.spacing.md,
  },
  debugButton: {
    marginVertical: Layout.spacing.sm,
  },
  debugText: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
