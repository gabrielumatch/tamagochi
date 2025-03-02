import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { usePet } from "../../contexts/PetContext";
import { useUser } from "../../contexts/UserContext";
import { PetStage } from "../../constants/PetTypes";
import Button from "../../components/ui/Button";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function GameOverModal() {
  const router = useRouter();
  const { pet, resurrectPet } = usePet();
  const { user, useItem, spendCoins } = useUser();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];
  const [isResurrecting, setIsResurrecting] = useState(false);
  const [isSpendingCoins, setIsSpendingCoins] = useState(false);

  const RESURRECTION_COST = 100;
  const hasResurrectionStone =
    user?.items.includes("resurrection_stone") || false;
  const hasEnoughCoins = (user?.coins || 0) >= RESURRECTION_COST;

  // Check if pet is dead
  useEffect(() => {
    if (pet && pet.stage !== PetStage.DEAD) {
      // If pet is not dead, redirect back to home
      router.replace("/");
    }
  }, [pet, router]);

  // Handle resurrection with stone
  const handleResurrectWithStone = () => {
    if (!hasResurrectionStone) {
      Alert.alert(
        "No Resurrection Stone",
        "You don't have a resurrection stone in your inventory.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsResurrecting(true);

    // Use the resurrection stone
    const success = useItem("resurrection_stone");

    if (success) {
      // Resurrect the pet
      resurrectPet();

      setTimeout(() => {
        setIsResurrecting(false);
        Alert.alert(
          "Pet Resurrected!",
          "Your pet has been brought back to life!",
          [
            {
              text: "OK",
              onPress: () => router.replace("/"),
            },
          ]
        );
      }, 1500);
    } else {
      setIsResurrecting(false);
      Alert.alert(
        "Resurrection Failed",
        "Something went wrong while trying to resurrect your pet.",
        [{ text: "OK" }]
      );
    }
  };

  // Handle resurrection with coins
  const handleResurrectWithCoins = () => {
    if (!hasEnoughCoins) {
      Alert.alert(
        "Not Enough Coins",
        `You need ${RESURRECTION_COST} coins to resurrect your pet. You have ${
          user?.coins || 0
        } coins.`,
        [{ text: "OK" }]
      );
      return;
    }

    setIsSpendingCoins(true);

    // Spend coins
    const success = spendCoins(RESURRECTION_COST);

    if (success) {
      // Resurrect the pet
      resurrectPet();

      setTimeout(() => {
        setIsSpendingCoins(false);
        Alert.alert(
          "Pet Resurrected!",
          "Your pet has been brought back to life!",
          [
            {
              text: "OK",
              onPress: () => router.replace("/"),
            },
          ]
        );
      }, 1500);
    } else {
      setIsSpendingCoins(false);
      Alert.alert(
        "Resurrection Failed",
        "Something went wrong while trying to resurrect your pet.",
        [{ text: "OK" }]
      );
    }
  };

  // Handle starting over
  const handleStartOver = () => {
    Alert.alert(
      "Start Over",
      "Are you sure you want to start over with a new pet? Your current pet will be lost forever.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start Over",
          style: "destructive",
          onPress: () => router.replace("/"),
        },
      ]
    );
  };

  if (!pet) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Game Over</Text>

        <View style={styles.petInfo}>
          <FontAwesome5 name="ghost" size={60} color={colors.text} />
          <Text style={[styles.petName, { color: colors.text }]}>
            {pet.name}
          </Text>
          <Text style={[styles.petAge, { color: colors.text + "99" }]}>
            Lived for {Math.floor(pet.age)} days
          </Text>
        </View>

        <Text style={[styles.message, { color: colors.text }]}>
          Your pet has passed away. What would you like to do?
        </Text>

        {hasResurrectionStone && (
          <Button
            title={
              isResurrecting ? "Resurrecting..." : "Use Resurrection Stone"
            }
            onPress={handleResurrectWithStone}
            disabled={isResurrecting}
            style={{ ...styles.button, backgroundColor: "#8e44ad" }}
          />
        )}

        <Button
          title={
            isSpendingCoins
              ? "Resurrecting..."
              : `Resurrect with ${RESURRECTION_COST} Coins`
          }
          onPress={handleResurrectWithCoins}
          disabled={!hasEnoughCoins || isSpendingCoins}
          style={
            !hasEnoughCoins
              ? { ...styles.button, ...styles.disabledButton }
              : styles.button
          }
        />

        <Button
          title="Start Over with New Pet"
          onPress={handleStartOver}
          style={{ ...styles.button, ...styles.startOverButton }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  petInfo: {
    alignItems: "center",
    marginBottom: 30,
  },
  petName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  petAge: {
    fontSize: 16,
    marginTop: 5,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    width: "100%",
    marginBottom: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  startOverButton: {
    backgroundColor: "#e74c3c",
  },
});
