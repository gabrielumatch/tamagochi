import React, { useMemo, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { usePet, PetStage } from "../../contexts/PetContext";
import { EVOLUTION, THRESHOLDS, TIME } from "../../constants/GameRules";
import { DimensionValue } from "react-native";

interface EvolutionStatusBarProps {
  showLabel?: boolean;
  height?: number;
  width?: DimensionValue;
}

/**
 * A component that displays a status bar showing how much time is left until the pet evolves.
 * The bar fills up as the pet gets closer to evolution.
 */
const EvolutionStatusBar: React.FC<EvolutionStatusBarProps> = ({
  showLabel = true,
  height = 12,
  width = "100%",
}) => {
  const { pet } = usePet();
  const [countdown, setCountdown] = useState<string>("");
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const evolutionInfo = useMemo(() => {
    if (!pet)
      return {
        daysLeft: 0,
        totalDays: 0,
        progress: 0,
        canEvolve: false,
        nextStage: "",
        isEgg: false,
        secondsUntilEvolution: 0,
      };

    // Determine current stage and days needed for next evolution
    let daysNeeded = 0;
    let nextStage = "";

    switch (pet.stage) {
      case PetStage.EGG:
        daysNeeded = EVOLUTION.DAYS_TO_EVOLVE.EGG_TO_BABY;
        nextStage = PetStage.BABY;
        break;
      case PetStage.BABY:
        daysNeeded = EVOLUTION.DAYS_TO_EVOLVE.BABY_TO_CHILD;
        nextStage = PetStage.CHILD;
        break;
      case PetStage.CHILD:
        daysNeeded = EVOLUTION.DAYS_TO_EVOLVE.CHILD_TO_TEEN;
        nextStage = PetStage.TEEN;
        break;
      case PetStage.TEEN:
        daysNeeded = EVOLUTION.DAYS_TO_EVOLVE.TEEN_TO_ADULT;
        nextStage = PetStage.ADULT;
        break;
      case PetStage.ADULT:
        // Already at max evolution
        return {
          daysLeft: 0,
          totalDays: 0,
          progress: 1, // Full progress
          canEvolve: false,
          nextStage: "Max Level",
          isEgg: false,
          secondsUntilEvolution: 0,
        };
      default:
        return {
          daysLeft: 0,
          totalDays: 0,
          progress: 0,
          canEvolve: false,
          nextStage: "",
          isEgg: false,
          secondsUntilEvolution: 0,
        };
    }

    // Calculate days passed since last evolution
    const daysPassed = pet.age - pet.lastEvolutionAge;

    // Calculate days left and progress
    const daysLeft = Math.max(0, daysNeeded - daysPassed);
    const progress = daysNeeded > 0 ? Math.min(1, daysPassed / daysNeeded) : 1;

    // Calculate seconds until evolution (for real-time countdown)
    // In a real app, this would use the actual time remaining
    // For demo purposes, we'll use a scaled-down version where 1 day = 60 seconds
    const secondsUntilEvolution = Math.max(0, Math.floor(daysLeft * 60));

    // Check if pet can evolve (all attributes above threshold and enough days have passed)
    const canEvolve =
      progress >= 1 &&
      pet.attributes.hunger > THRESHOLDS.LOW &&
      pet.attributes.happiness > THRESHOLDS.LOW &&
      pet.attributes.health > THRESHOLDS.LOW &&
      pet.attributes.energy > THRESHOLDS.LOW;

    // Special case for egg - it should evolve immediately
    const isEgg = pet.stage === PetStage.EGG;

    return {
      daysLeft,
      totalDays: daysNeeded,
      progress: isEgg ? 0 : progress, // Eggs should show 0 progress until they hatch
      canEvolve: isEgg ? false : canEvolve, // Eggs can't evolve until the timer triggers it
      nextStage: nextStage.charAt(0).toUpperCase() + nextStage.slice(1), // Capitalize
      isEgg,
      secondsUntilEvolution: isEgg ? 30 : secondsUntilEvolution, // Eggs hatch in 30 seconds for demo
    };
  }, [pet]);

  // Set up the countdown timer
  useEffect(() => {
    if (!pet) return;

    // Initialize the seconds left
    setSecondsLeft(evolutionInfo.secondsUntilEvolution);

    // Set up the countdown interval
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up the interval
    return () => clearInterval(interval);
  }, [evolutionInfo.secondsUntilEvolution, pet]);

  // Format the countdown time
  useEffect(() => {
    if (secondsLeft <= 0) {
      if (evolutionInfo.canEvolve) {
        setCountdown("Ready!");
      } else if (pet?.stage === PetStage.ADULT) {
        setCountdown("Max level");
      } else if (evolutionInfo.progress >= 1) {
        setCountdown("Waiting for attributes");
      } else if (evolutionInfo.isEgg) {
        setCountdown("Hatching...");
      } else {
        setCountdown("00:00:00");
      }
      return;
    }

    // Convert seconds to hours, minutes, seconds
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    // Format the countdown string
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    setCountdown(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
  }, [secondsLeft, evolutionInfo, pet]);

  // Format the time left string
  const timeLeftText = useMemo(() => {
    if (!pet) return "";

    if (pet.stage === PetStage.EGG) {
      return "Hatching soon...";
    }

    if (evolutionInfo.canEvolve) {
      return `Ready to evolve to ${evolutionInfo.nextStage}!`;
    }

    if (pet.stage === PetStage.ADULT) {
      return "Max evolution reached";
    }

    if (evolutionInfo.progress >= 1) {
      return `Waiting for attributes to improve`;
    }

    return `${evolutionInfo.daysLeft} day${
      evolutionInfo.daysLeft !== 1 ? "s" : ""
    } until ${evolutionInfo.nextStage}`;
  }, [evolutionInfo, pet]);

  // Determine the color of the progress bar
  const progressColor = useMemo(() => {
    if (evolutionInfo.isEgg) return "#E91E63"; // Pink for egg
    if (evolutionInfo.canEvolve) return "#4CAF50"; // Green
    if (evolutionInfo.progress >= 1) return "#FFC107"; // Yellow (waiting for attributes)
    if (evolutionInfo.progress >= 0.75) return "#8BC34A"; // Light green
    if (evolutionInfo.progress >= 0.5) return "#2196F3"; // Blue
    if (evolutionInfo.progress >= 0.25) return "#9C27B0"; // Purple
    return "#E91E63"; // Pink
  }, [evolutionInfo]);

  if (!pet) return null;

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Evolution: {timeLeftText}</Text>
          <Text style={styles.countdown}>{countdown}</Text>
        </View>
      )}
      <View style={[styles.barContainer, { height, width }]}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${evolutionInfo.progress * 100}%`,
              backgroundColor: progressColor,
            },
          ]}
        />
        {evolutionInfo.canEvolve && <View style={styles.pulseOverlay} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  countdown: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF5722",
  },
  barContainer: {
    backgroundColor: "#E0E0E0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
  pulseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    opacity: 0.7,
    // Add animation in a real implementation
  },
});

export default EvolutionStatusBar;
