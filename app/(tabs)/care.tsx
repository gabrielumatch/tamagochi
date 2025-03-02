import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, Image } from "react-native";
import { usePet } from "../../contexts/PetContext";
import { useUser } from "../../contexts/UserContext";
import PetDisplay from "../../components/pet/PetDisplay";
import StatusBars from "../../components/pet/StatusBars";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import Layout from "../../constants/Layout";
import { FontAwesome5 } from "@expo/vector-icons";

export default function CareScreen() {
  const {
    pet,
    isLoading,
    feedPet,
    cleanPet,
    putPetToSleep,
    updatePetAttributes,
  } = usePet();
  const { user } = useUser();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];
  const [activeAction, setActiveAction] = useState<string | null>(null);

  // If loading or no pet, show a message
  if (isLoading || !pet) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>
          {isLoading ? "Loading..." : "Create a pet first!"}
        </Text>
      </View>
    );
  }

  // Handle feeding the pet
  const handleFeed = (foodType: "regular" | "treat" | "healthy") => {
    setActiveAction(`feed-${foodType}`);
    feedPet(foodType);

    // Reset active action after animation
    setTimeout(() => {
      setActiveAction(null);
      updatePetAttributes();
    }, 2000);
  };

  // Handle cleaning the pet
  const handleClean = () => {
    setActiveAction("clean");
    cleanPet();

    // Reset active action after animation
    setTimeout(() => {
      setActiveAction(null);
      updatePetAttributes();
    }, 2000);
  };

  // Handle putting the pet to sleep
  const handleSleep = () => {
    setActiveAction("sleep");
    putPetToSleep();

    // Reset active action after animation
    setTimeout(() => {
      setActiveAction(null);
      updatePetAttributes();
    }, 2000);
  };

  // Determine pet animation based on active action
  const getPetAnimation = () => {
    if (!activeAction) return "idle";

    if (activeAction.startsWith("feed")) {
      return "eating";
    } else if (activeAction === "clean") {
      return "happy";
    } else if (activeAction === "sleep") {
      return "sleeping";
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
        <PetDisplay pet={pet} animation={getPetAnimation()} />
        <StatusBars attributes={pet.attributes} />
      </Card>

      {/* Feeding Section */}
      <Card style={styles.actionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Feed Your Pet
        </Text>
        <Text
          style={[styles.sectionDescription, { color: colors.text + "99" }]}
        >
          Keep your pet's hunger level high by feeding it regularly.
        </Text>

        <View style={styles.foodOptions}>
          <View style={styles.foodOption}>
            <Button
              title="Regular Food"
              onPress={() => handleFeed("regular")}
              type="primary"
              disabled={activeAction !== null}
              style={styles.foodButton}
            />
            <View style={styles.foodDetails}>
              <FontAwesome5
                name="drumstick-bite"
                size={16}
                color={colors.hunger}
              />
              <Text style={[styles.foodEffect, { color: colors.hunger }]}>
                +20 Hunger
              </Text>
            </View>
          </View>

          <View style={styles.foodOption}>
            <Button
              title="Treat"
              onPress={() => handleFeed("treat")}
              type="secondary"
              disabled={activeAction !== null}
              style={styles.foodButton}
            />
            <View style={styles.foodDetails}>
              <FontAwesome5 name="cookie" size={16} color={colors.hunger} />
              <Text style={[styles.foodEffect, { color: colors.hunger }]}>
                +10 Hunger
              </Text>
              <FontAwesome5
                name="smile"
                size={16}
                color={colors.happiness}
                style={{ marginLeft: 8 }}
              />
              <Text style={[styles.foodEffect, { color: colors.happiness }]}>
                +15 Happiness
              </Text>
            </View>
          </View>

          <View style={styles.foodOption}>
            <Button
              title="Healthy Food"
              onPress={() => handleFeed("healthy")}
              type="outline"
              disabled={activeAction !== null}
              style={styles.foodButton}
            />
            <View style={styles.foodDetails}>
              <FontAwesome5 name="carrot" size={16} color={colors.hunger} />
              <Text style={[styles.foodEffect, { color: colors.hunger }]}>
                +15 Hunger
              </Text>
              <FontAwesome5
                name="heart"
                size={16}
                color={colors.health}
                style={{ marginLeft: 8 }}
              />
              <Text style={[styles.foodEffect, { color: colors.health }]}>
                +10 Health
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Other Care Options */}
      <Card style={styles.actionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Other Care Options
        </Text>

        <View style={styles.otherOptions}>
          <View style={styles.otherOption}>
            <Button
              title="Clean Pet"
              onPress={handleClean}
              type="primary"
              disabled={activeAction !== null}
              style={styles.careButton}
            />
            <View style={styles.careDetails}>
              <FontAwesome5 name="shower" size={16} color={colors.health} />
              <Text style={[styles.careEffect, { color: colors.health }]}>
                +15 Health
              </Text>
            </View>
          </View>

          <View style={styles.otherOption}>
            <Button
              title="Put to Sleep"
              onPress={handleSleep}
              type="primary"
              disabled={activeAction !== null}
              style={styles.careButton}
            />
            <View style={styles.careDetails}>
              <FontAwesome5 name="bed" size={16} color={colors.energy} />
              <Text style={[styles.careEffect, { color: colors.energy }]}>
                +50 Energy
              </Text>
              <FontAwesome5
                name="utensils"
                size={16}
                color={colors.hunger}
                style={{ marginLeft: 8 }}
              />
              <Text style={[styles.careEffect, { color: colors.hunger }]}>
                -5 Hunger
              </Text>
            </View>
          </View>
        </View>
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
  petCard: {
    padding: Layout.spacing.md,
  },
  actionCard: {
    padding: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: Layout.spacing.xs,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: Layout.spacing.md,
  },
  foodOptions: {
    gap: Layout.spacing.md,
  },
  foodOption: {
    marginBottom: Layout.spacing.sm,
  },
  foodButton: {
    marginBottom: Layout.spacing.xs,
  },
  foodDetails: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.sm,
  },
  foodEffect: {
    fontSize: 12,
    marginLeft: 4,
    marginRight: 8,
  },
  otherOptions: {
    gap: Layout.spacing.md,
  },
  otherOption: {
    marginBottom: Layout.spacing.sm,
  },
  careButton: {
    marginBottom: Layout.spacing.xs,
  },
  careDetails: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.sm,
  },
  careEffect: {
    fontSize: 12,
    marginLeft: 4,
    marginRight: 8,
  },
});
