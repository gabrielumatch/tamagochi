import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { usePet } from "../../contexts/PetContext";
import { EVOLUTION, THRESHOLDS, TIME } from "../../constants/GameRules";
import { DimensionValue } from "react-native";
import {
  getEvolutionSettings,
  ATTRIBUTE_THRESHOLDS,
} from "../../constants/PetSettings";
import { PetType, PetStage } from "../../constants/PetTypes";
import { TimerManager } from "../utils/TimerManager";

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
  const { pet, evolvePet, canPetEvolve } = usePet();
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const initializedRef = useRef(false);
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const timerIdRef = useRef<string>("evolution-timer");

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
    }

    // Calculate time since last evolution
    const now = Date.now();
    const secondsSinceLastEvolution =
      (now - pet.birthDate) / 1000 - pet.lastEvolutionAge;

    // Calculate seconds left until evolution
    const totalSeconds = evolutionSettings.timeToEvolve;
    const secondsUntilEvolution = Math.max(
      0,
      totalSeconds - secondsSinceLastEvolution
    );

    // Calculate progress (0 to 1)
    const progress = Math.min(1, secondsSinceLastEvolution / totalSeconds);

    // Check if attributes are good enough for evolution
    const canEvolve =
      pet.attributes.hunger > evolutionSettings.requiredAttributes.hunger &&
      pet.attributes.happiness >
        evolutionSettings.requiredAttributes.happiness &&
      pet.attributes.health > evolutionSettings.requiredAttributes.health &&
      pet.attributes.energy > evolutionSettings.requiredAttributes.energy;

    // Check if this is an egg (special case for hatching)
    const isEgg = petStage === PetStage.EGG;

    return {
      secondsLeft: Math.ceil(secondsUntilEvolution),
      totalSeconds,
      progress,
      canEvolve: canEvolve && secondsUntilEvolution <= 0,
      nextStage,
      isEgg,
      secondsUntilEvolution,
    };
  }, [pet]);

  // Update countdown handler
  const updateCountdown = useCallback(() => {
    if (!pet) return;

    setSecondsLeft((prev) => {
      // Don't decrement below zero
      if (prev <= 0) {
        return 0;
      }
      return prev - 1;
    });
  }, [pet]);

  // Set up the countdown timer using the centralized timer manager
  useEffect(() => {
    if (!pet) return;

    // Initialize the seconds left only once per evolution info change
    if (!initializedRef.current) {
      const seconds = evolutionInfo.secondsUntilEvolution;
      setSecondsLeft(Math.ceil(seconds));
      initializedRef.current = true;
      console.log(
        `[Evolution] Timer initialized with ${Math.ceil(
          seconds
        )} seconds until ${evolutionInfo.isEgg ? "hatching" : "evolution"}`
      );
    }

    // Register with the timer manager
    const timerManager = TimerManager.getInstance();
    timerManager.registerTimer(
      timerIdRef.current,
      updateCountdown,
      1000 // Update every second
    );

    // Clean up on unmount
    return () => {
      timerManager.unregisterTimer(timerIdRef.current);
      console.log(`[Evolution] Countdown interval cleared`);
    };
  }, [
    evolutionInfo.secondsUntilEvolution,
    pet,
    evolutionInfo.isEgg,
    updateCountdown,
  ]);

  // Reset initialization when evolution info changes
  useEffect(() => {
    initializedRef.current = false;
  }, [evolutionInfo.secondsUntilEvolution]);

  // Trigger evolution when countdown reaches zero
  useEffect(() => {
    if (secondsLeft === 0 && pet) {
      // Use the optimized canPetEvolve function to check if evolution is possible
      if (canPetEvolve()) {
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
  }, [secondsLeft, evolutionInfo, pet, evolvePet, canPetEvolve]);

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
