import React, { useMemo, useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { usePet } from "../../contexts/PetContext";
import { EVOLUTION, THRESHOLDS, TIME } from "../../constants/GameRules";
import { DimensionValue } from "react-native";
import {
  getEvolutionSettings,
  ATTRIBUTE_THRESHOLDS,
} from "../../constants/PetSettings";
import { PetType, PetStage } from "../../constants/PetTypes";

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
  const { pet, evolvePet } = usePet();
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const initializedRef = useRef(false);
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const lastUpdateTimeRef = useRef<number>(0);

  // Start pulsing animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      pulseAnim.stopAnimation();
    };
  }, [pulseAnim]);

  const evolutionInfo = useMemo(() => {
    if (!pet)
      return {
        secondsLeft: 0,
        totalSeconds: 0,
        progress: 0,
        canEvolve: false,
        nextStage: "",
        isEgg: false,
        secondsUntilEvolution: 0,
      };

    // Ensure we have valid pet type and stage, defaulting to "cat" and "egg" if undefined
    const petType = (pet.type as PetType) || PetType.CAT;
    const petStage = (pet.stage as PetStage) || PetStage.EGG;

    // Get evolution settings for this pet type and stage
    const evolutionSettings = getEvolutionSettings(petType, petStage);

    // Determine current stage and next stage
    let nextStage = "";

    switch (petStage) {
      case PetStage.EGG:
        nextStage = PetStage.BABY;
        break;
      case PetStage.BABY:
        nextStage = PetStage.CHILD;
        break;
      case PetStage.CHILD:
        nextStage = PetStage.TEEN;
        break;
      case PetStage.TEEN:
        nextStage = PetStage.ADULT;
        break;
      case PetStage.ADULT:
        // Already at max evolution
        return {
          secondsLeft: 0,
          totalSeconds: 0,
          progress: 1, // Full progress
          canEvolve: false,
          nextStage: "Max Level",
          isEgg: false,
          secondsUntilEvolution: 0,
        };
      default:
        return {
          secondsLeft: 0,
          totalSeconds: 0,
          progress: 0,
          canEvolve: false,
          nextStage: "",
          isEgg: false,
          secondsUntilEvolution: 0,
        };
    }

    // Calculate seconds passed since last evolution (for testing)
    const now = Date.now();
    const secondsPassed = (now - pet.birthDate) / 1000 - pet.lastEvolutionAge;

    // Get total seconds needed for evolution
    const totalSeconds = evolutionSettings.timeToEvolve;

    // Calculate seconds left and progress
    const secondsLeft = Math.max(0, totalSeconds - secondsPassed);
    const progress =
      totalSeconds > 0 ? Math.min(1, secondsPassed / totalSeconds) : 1;

    // Check if pet can evolve (all attributes above threshold and enough time has passed)
    const canEvolve =
      progress >= 1 &&
      pet.attributes.hunger > evolutionSettings.requiredAttributes.hunger &&
      pet.attributes.happiness >
        evolutionSettings.requiredAttributes.happiness &&
      pet.attributes.health > evolutionSettings.requiredAttributes.health &&
      pet.attributes.energy > evolutionSettings.requiredAttributes.energy;

    // Special case for egg
    const isEgg = pet.stage === PetStage.EGG;

    return {
      secondsLeft,
      totalSeconds,
      progress: progress,
      canEvolve,
      nextStage: nextStage.charAt(0).toUpperCase() + nextStage.slice(1), // Capitalize
      isEgg,
      secondsUntilEvolution: Math.round(secondsLeft), // Round to nearest integer
    };
  }, [pet]);

  // Set up the countdown timer
  useEffect(() => {
    if (!pet) return;

    // Initialize the seconds left only once per evolution info change
    if (!initializedRef.current) {
      const seconds = evolutionInfo.secondsUntilEvolution;
      setSecondsLeft(seconds);
      initializedRef.current = true;
      console.log(
        `[Evolution] Timer initialized with ${seconds} seconds until ${
          evolutionInfo.isEgg ? "hatching" : "evolution"
        }`
      );
    }

    // Set up the countdown interval - update once per second
    const interval = setInterval(() => {
      const now = Date.now();
      // Only update if at least 1000ms (1 second) has passed since last update
      if (now - lastUpdateTimeRef.current >= 1000) {
        lastUpdateTimeRef.current = now;

        setSecondsLeft((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            console.log(`[Evolution] Countdown reached zero`);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    // Clean up the interval
    return () => {
      clearInterval(interval);
      console.log(`[Evolution] Countdown interval cleared`);
    };
  }, [evolutionInfo.secondsUntilEvolution, pet, evolutionInfo.isEgg]);

  // Reset initialization when evolution info changes
  useEffect(() => {
    initializedRef.current = false;
  }, [evolutionInfo.secondsUntilEvolution]);

  // Trigger evolution when countdown reaches zero
  useEffect(() => {
    if (secondsLeft === 0 && pet) {
      // For eggs or when the pet can evolve, trigger evolution
      if (evolutionInfo.isEgg || evolutionInfo.canEvolve) {
        console.log(
          `[Evolution] Triggering evolution to ${evolutionInfo.nextStage}`
        );
        // Add a small delay to make the UI update visible
        const timer = setTimeout(() => {
          evolvePet();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [secondsLeft, evolutionInfo, pet, evolvePet]);

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

    // Convert seconds to hours, minutes, seconds - using Math.floor to ensure integers
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = Math.floor(secondsLeft % 60);

    // Format the countdown string
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    setCountdown(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);

    // Log countdown every 10 seconds to avoid console spam
    if (Math.floor(secondsLeft) % 10 === 0 || secondsLeft <= 5) {
      console.log(
        `[Evolution] Countdown: ${formattedHours}:${formattedMinutes}:${formattedSeconds}`
      );
    }
  }, [secondsLeft, evolutionInfo, pet]);

  // Format the time left string in a more human-readable format
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

    // Format time in a more human-readable way
    if (secondsLeft > 0) {
      const hours = Math.floor(secondsLeft / 3600);
      const minutes = Math.floor((secondsLeft % 3600) / 60);

      if (hours > 0) {
        return `Evolving to ${evolutionInfo.nextStage} in ${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        return `Evolving to ${evolutionInfo.nextStage} in ${minutes}m`;
      } else {
        return `Evolving to ${evolutionInfo.nextStage} in <1m`;
      }
    }

    return `Evolving to ${evolutionInfo.nextStage} soon`;
  }, [pet, evolutionInfo, secondsLeft]);

  // Determine the color of the progress bar
  const progressColor = useMemo(() => {
    if (evolutionInfo.isEgg) {
      // For eggs, show a pulsing progress based on the countdown
      const progress = 1 - secondsLeft / 30; // Assuming 30 seconds for egg hatching
      return `rgba(233, 30, 99, ${0.5 + progress * 0.5})`; // Pink with varying opacity
    }
    if (evolutionInfo.canEvolve) return "#4CAF50"; // Green
    if (evolutionInfo.progress >= 1) return "#FFC107"; // Yellow (waiting for attributes)
    if (evolutionInfo.progress >= 0.75) return "#8BC34A"; // Light green
    if (evolutionInfo.progress >= 0.5) return "#2196F3"; // Blue
    if (evolutionInfo.progress >= 0.25) return "#9C27B0"; // Purple
    return "#E91E63"; // Pink
  }, [evolutionInfo, secondsLeft]);

  if (!pet) return null;

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Evolution: {timeLeftText}</Text>
          <Text style={styles.countdown}>
            {evolutionInfo.canEvolve || pet?.stage === PetStage.ADULT
              ? countdown
              : `${Math.floor(evolutionInfo.progress * 100)}%`}
          </Text>
        </View>
      )}
      <View style={[styles.barContainer, { height, width }]}>
        {evolutionInfo.isEgg ? (
          // For eggs, show a special hatching progress bar
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.floor((1 - secondsLeft / 30) * 100)}%`, // Assuming 30 seconds for egg hatching
                backgroundColor: progressColor,
              },
            ]}
          />
        ) : (
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.floor(evolutionInfo.progress * 100)}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        )}
        {(evolutionInfo.canEvolve || secondsLeft <= 5) && (
          <Animated.View
            style={[styles.pulseOverlay, { opacity: pulseAnim }]}
          />
        )}
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
  },
});

export default EvolutionStatusBar;
