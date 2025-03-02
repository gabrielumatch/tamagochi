import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { usePet } from "../../contexts/PetContext";
import {
  getDecreaseRates,
  getEvolutionSettings,
} from "../../constants/PetSettings";
import { PetType, PetStage } from "../../constants/PetTypes";

/**
 * A component that displays the current pet settings for debugging.
 */
const PetSettingsDisplay: React.FC = () => {
  const { pet } = usePet();

  if (!pet) return null;

  const petType = pet.type as PetType;
  const petStage = pet.stage as PetStage;

  // Get the current settings
  const decreaseRates = getDecreaseRates(petType, petStage);
  const evolutionSettings = getEvolutionSettings(petType, petStage);

  // Calculate time since last evolution
  const now = Date.now();
  const secondsSinceLastEvolution =
    (now - pet.birthDate) / 1000 - pet.lastEvolutionAge;
  const secondsUntilEvolution = Math.max(
    0,
    evolutionSettings.timeToEvolve - secondsSinceLastEvolution
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Current Pet Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pet Info</Text>
        <Text style={styles.text}>Type: {petType}</Text>
        <Text style={styles.text}>Stage: {petStage}</Text>
        <Text style={styles.text}>Age: {pet.age} days</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attribute Decrease Rates</Text>
        <Text style={styles.text}>
          Health: {decreaseRates.health.points} points every{" "}
          {decreaseRates.health.seconds} seconds
        </Text>
        <Text style={styles.text}>
          Happiness: {decreaseRates.happiness.points} points every{" "}
          {decreaseRates.happiness.seconds} seconds
        </Text>
        <Text style={styles.text}>
          Hunger: {decreaseRates.hunger.points} points every{" "}
          {decreaseRates.hunger.seconds} seconds
        </Text>
        <Text style={styles.text}>
          Energy: {decreaseRates.energy.points} points every{" "}
          {decreaseRates.energy.seconds} seconds
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evolution Settings</Text>
        <Text style={styles.text}>
          Time to evolve: {evolutionSettings.timeToEvolve} seconds
        </Text>
        <Text style={styles.text}>
          Time since last evolution: {Math.floor(secondsSinceLastEvolution)}{" "}
          seconds
        </Text>
        <Text style={styles.text}>
          Time until next evolution: {Math.floor(secondsUntilEvolution)} seconds
        </Text>
        <Text style={styles.text}>Required attributes:</Text>
        <Text style={styles.subText}>
          Health: {evolutionSettings.requiredAttributes.health}%
        </Text>
        <Text style={styles.subText}>
          Happiness: {evolutionSettings.requiredAttributes.happiness}%
        </Text>
        <Text style={styles.subText}>
          Hunger: {evolutionSettings.requiredAttributes.hunger}%
        </Text>
        <Text style={styles.subText}>
          Energy: {evolutionSettings.requiredAttributes.energy}%
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Attributes</Text>
        <Text style={styles.text}>
          Health: {pet.attributes.health.toFixed(1)}%
        </Text>
        <Text style={styles.text}>
          Happiness: {pet.attributes.happiness.toFixed(1)}%
        </Text>
        <Text style={styles.text}>
          Hunger: {pet.attributes.hunger.toFixed(1)}%
        </Text>
        <Text style={styles.text}>
          Energy: {pet.attributes.energy.toFixed(1)}%
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  text: {
    fontSize: 14,
    marginBottom: 3,
  },
  subText: {
    fontSize: 14,
    marginBottom: 3,
    marginLeft: 10,
    color: "#555",
  },
});

export default PetSettingsDisplay;
