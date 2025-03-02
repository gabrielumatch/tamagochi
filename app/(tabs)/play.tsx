import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
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

// Simple game types
type GameType = "catch" | "memory" | "dance";

export default function PlayScreen() {
  const { pet, isLoading, playWithPet, updatePetAttributes } = usePet();
  const { user, addCoins } = useUser();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

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

  // Start a game
  const startGame = (gameType: GameType) => {
    setActiveGame(gameType);
    setGameCompleted(false);
  };

  // Complete a game
  const completeGame = () => {
    // Play with pet to increase happiness
    playWithPet();

    // Add coins as a reward
    addCoins(10);

    // Mark game as completed
    setGameCompleted(true);

    // Update pet attributes
    updatePetAttributes();
  };

  // Render the active game
  const renderGame = () => {
    if (!activeGame) return null;

    return (
      <Card style={styles.gameCard}>
        <Text style={[styles.gameTitle, { color: colors.text }]}>
          {activeGame === "catch" && "Catch Game"}
          {activeGame === "memory" && "Memory Game"}
          {activeGame === "dance" && "Dance Game"}
        </Text>

        {!gameCompleted ? (
          <View style={styles.gameContent}>
            <Text
              style={[styles.gameInstructions, { color: colors.text + "99" }]}
            >
              {activeGame === "catch" && "Tap the ball when it appears!"}
              {activeGame === "memory" && "Remember the pattern and repeat it!"}
              {activeGame === "dance" &&
                "Follow the dance moves with your pet!"}
            </Text>

            <View style={styles.gamePlaceholder}>
              <FontAwesome5
                name={
                  activeGame === "catch"
                    ? "baseball-ball"
                    : activeGame === "memory"
                    ? "brain"
                    : "music"
                }
                size={48}
                color={colors.primary}
              />
              <Text
                style={[styles.placeholderText, { color: colors.text + "99" }]}
              >
                Game simulation
              </Text>
            </View>

            <Button
              title="Complete Game"
              onPress={completeGame}
              type="primary"
              size="large"
              style={styles.gameButton}
            />
          </View>
        ) : (
          <View style={styles.gameCompleted}>
            <FontAwesome5 name="trophy" size={48} color={colors.success} />
            <Text style={[styles.completedText, { color: colors.text }]}>
              Game Completed!
            </Text>
            <Text style={[styles.rewardText, { color: colors.text + "99" }]}>
              You earned 10 coins and your pet is happier!
            </Text>
            <Button
              title="Play Again"
              onPress={() => startGame(activeGame)}
              type="primary"
              style={styles.gameButton}
            />
            <Button
              title="Back to Games"
              onPress={() => setActiveGame(null)}
              type="outline"
              style={styles.gameButton}
            />
          </View>
        )}
      </Card>
    );
  };

  // Render the game selection
  const renderGameSelection = () => {
    return (
      <>
        <Card style={styles.petCard}>
          <PetDisplay pet={pet} animation={gameCompleted ? "happy" : "idle"} />
          <StatusBars attributes={pet.attributes} />
        </Card>

        <Card style={styles.gamesCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Play Games
          </Text>
          <Text
            style={[styles.sectionDescription, { color: colors.text + "99" }]}
          >
            Play games with your pet to increase happiness and earn coins!
          </Text>

          <View style={styles.gamesList}>
            <TouchableOpacity
              style={[
                styles.gameItem,
                { backgroundColor: colors.primary + "20" },
              ]}
              onPress={() => startGame("catch")}
            >
              <FontAwesome5
                name="baseball-ball"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.gameName, { color: colors.text }]}>
                Catch Game
              </Text>
              <Text
                style={[styles.gameDescription, { color: colors.text + "99" }]}
              >
                A simple game of catch with your pet
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.gameItem,
                { backgroundColor: colors.secondary + "20" },
              ]}
              onPress={() => startGame("memory")}
            >
              <FontAwesome5 name="brain" size={24} color={colors.secondary} />
              <Text style={[styles.gameName, { color: colors.text }]}>
                Memory Game
              </Text>
              <Text
                style={[styles.gameDescription, { color: colors.text + "99" }]}
              >
                Test your memory with patterns
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.gameItem,
                { backgroundColor: colors.accent + "20" },
              ]}
              onPress={() => startGame("dance")}
            >
              <FontAwesome5 name="music" size={24} color={colors.accent} />
              <Text style={[styles.gameName, { color: colors.text }]}>
                Dance Game
              </Text>
              <Text
                style={[styles.gameDescription, { color: colors.text + "99" }]}
              >
                Dance with your pet to the rhythm
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {activeGame ? renderGame() : renderGameSelection()}
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
  gamesCard: {
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
  gamesList: {
    gap: Layout.spacing.md,
  },
  gameItem: {
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    flexDirection: "column",
    alignItems: "center",
  },
  gameName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
  },
  gameDescription: {
    fontSize: 14,
    textAlign: "center",
  },
  gameCard: {
    padding: Layout.spacing.md,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Layout.spacing.md,
  },
  gameContent: {
    alignItems: "center",
  },
  gameInstructions: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: Layout.spacing.lg,
  },
  gamePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#00000010",
    borderRadius: Layout.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Layout.spacing.lg,
  },
  placeholderText: {
    marginTop: Layout.spacing.sm,
    fontSize: 14,
  },
  gameButton: {
    marginTop: Layout.spacing.md,
    minWidth: 200,
  },
  gameCompleted: {
    alignItems: "center",
    padding: Layout.spacing.lg,
  },
  completedText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: Layout.spacing.md,
  },
  rewardText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: Layout.spacing.sm,
    marginBottom: Layout.spacing.lg,
  },
});
