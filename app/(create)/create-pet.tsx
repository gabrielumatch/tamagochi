import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { usePet } from "../../contexts/PetContext";
import { PetType } from "../../constants/PetTypes";
// import { useUser } from "../../contexts/UserContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { useColorScheme } from "react-native";
import { router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

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
    addCoins: (amount: number) => {},
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

// Pet type options with emojis and descriptions
const petTypes = [
  {
    id: "cat",
    name: "Cat",
    description: "Playful and independent. Needs moderate attention.",
    emoji: "🐱",
  },
  {
    id: "dog",
    name: "Dog",
    description: "Loyal and energetic. Needs lots of attention and play.",
    emoji: "🐶",
  },
  {
    id: "bird",
    name: "Bird",
    description: "Cheerful and musical. Needs regular interaction.",
    emoji: "🐦",
  },
];

export default function CreatePetScreen() {
  const { createPet } = usePet();
  const { user, addCoins } = useUser();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  const [petName, setPetName] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Handle pet creation
  const handleCreatePet = async () => {
    if (!petName.trim()) {
      Alert.alert("Error", "Please enter a name for your pet.");
      return;
    }

    if (!selectedType) {
      Alert.alert("Error", "Please select a pet type.");
      return;
    }

    setIsCreating(true);

    try {
      // Create the new pet
      createPet(petName.trim(), selectedType as PetType);

      // Give the user some starting coins
      addCoins(100);

      // Navigate to home screen
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Failed to create pet:", error);
      Alert.alert("Error", "Failed to create pet. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Card style={styles.headerCard}>
        <Text style={[styles.title, { color: colors.text }]}>
          Create Your Pet
        </Text>
        <Text style={[styles.subtitle, { color: colors.text + "99" }]}>
          Choose a pet type and give it a name to begin your journey!
        </Text>
      </Card>

      {/* Pet Name Input */}
      <Card style={styles.inputCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Name Your Pet
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.card + "40",
              borderColor: colors.border,
            },
          ]}
          placeholder="Enter pet name"
          placeholderTextColor={colors.text + "80"}
          value={petName}
          onChangeText={setPetName}
          maxLength={20}
        />
      </Card>

      {/* Pet Type Selection */}
      <Card style={styles.typeCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Choose Pet Type
        </Text>

        {petTypes.map((type) => (
          <View
            key={type.id}
            style={[
              styles.typeOption,
              selectedType === type.id && {
                borderColor: colors.primary,
                backgroundColor: colors.primary + "10",
              },
            ]}
          >
            <Button
              type={selectedType === type.id ? "primary" : "outline"}
              title={type.name}
              onPress={() => setSelectedType(type.id)}
              style={styles.typeButton}
            />
            <View style={styles.typeContent}>
              <Text style={styles.emojiText}>{type.emoji}</Text>
              <View style={styles.typeInfo}>
                <Text style={[styles.typeName, { color: colors.text }]}>
                  {type.name}
                </Text>
                <Text
                  style={[
                    styles.typeDescription,
                    { color: colors.text + "99" },
                  ]}
                >
                  {type.description}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Card>

      {/* Create Button */}
      <Button
        title={isCreating ? "Creating..." : "Create Pet"}
        onPress={handleCreatePet}
        disabled={isCreating || !petName.trim() || !selectedType}
        type="primary"
        style={styles.createButton}
      />
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
  headerCard: {
    padding: Layout.spacing.md,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  inputCard: {
    padding: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: Layout.spacing.md,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    fontSize: 16,
  },
  typeCard: {
    padding: Layout.spacing.md,
  },
  typeOption: {
    marginBottom: Layout.spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: Layout.borderRadius.md,
    overflow: "hidden",
  },
  typeButton: {
    height: 80,
    justifyContent: "flex-start",
    marginBottom: -80, // Make the button overlay the content
    opacity: 0.001, // Make it nearly invisible but still clickable
  },
  typeContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 80,
    paddingHorizontal: Layout.spacing.md,
  },
  emojiText: {
    fontSize: 40,
    marginRight: Layout.spacing.md,
    width: 60,
    textAlign: "center",
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
  },
  createButton: {
    marginTop: Layout.spacing.sm,
  },
});
