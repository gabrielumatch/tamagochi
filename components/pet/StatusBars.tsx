import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Layout from "../../constants/Layout";
import { ATTRIBUTE_DECREASE } from "../../constants/GameRules";
import { usePet } from "../../contexts/PetContext";
import { getDecreaseRates } from "../../constants/PetSettings";
import { PetType, PetStage, PetAttributes } from "../../constants/PetTypes";
import { TimerManager } from "../utils/TimerManager";

interface StatusBarProps {
  value: number;
  label: string;
  icon: string;
  color: string;
  attributeName: "health" | "happiness" | "hunger" | "energy";
  petType: PetType;
  petStage: PetStage;
}

// Memoize the StatusBar component to prevent unnecessary rerenders
const StatusBar = React.memo(function StatusBar({
  value,
  label,
  icon,
  color,
  attributeName,
  petType,
  petStage,
}: StatusBarProps) {
  const [countdown, setCountdown] = useState<string>("00:00");
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const { pet, setPet } = usePet();
  const shouldDecreaseRef = useRef(false);
  const initializedRef = useRef(false);
  const timerIdRef = useRef<string>(`${attributeName}-${petType}-${petStage}`);

  // Get the decrease settings for this pet type, stage, and attribute - memoized
  const decreaseSettings = useMemo(() => {
    const decreaseRates = getDecreaseRates(petType, petStage);
    const attributeSettings = decreaseRates[attributeName];
    return {
      pointsToDecrease: attributeSettings.points,
      secondsPerDecrease: attributeSettings.seconds,
    };
  }, [attributeName, petType, petStage]);

  const { pointsToDecrease, secondsPerDecrease } = decreaseSettings;

  // Handle countdown update
  const updateCountdown = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        // Mark that we should decrease the attribute
        shouldDecreaseRef.current = true;
        // Reset the timer when it reaches zero
        console.log(`[${label}] Timer reset, attribute should decrease`);
        return secondsPerDecrease;
      }
      return prev - 1;
    });
  }, [label, secondsPerDecrease]);

  // Set up the timer using the centralized timer manager
  useEffect(() => {
    console.log(
      `[${label}] Decrease settings: ${pointsToDecrease} points every ${secondsPerDecrease} seconds`
    );

    // Initialize the seconds left only once
    if (!initializedRef.current) {
      setSecondsLeft(secondsPerDecrease);
      initializedRef.current = true;
      console.log(
        `[${label}] Timer initialized with ${secondsPerDecrease} seconds`
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
    };
  }, [label, updateCountdown, pointsToDecrease, secondsPerDecrease]);

  // Handle the actual attribute decrease in a separate effect
  useEffect(() => {
    // Use a setTimeout to ensure we're not updating state during render
    if (shouldDecreaseRef.current && pet && setPet) {
      const timer = setTimeout(() => {
        shouldDecreaseRef.current = false;

        console.log(
          `[${label}] Decreasing ${attributeName} by ${pointsToDecrease} points`
        );

        setPet((prevPet) => {
          if (!prevPet) return null;

          // Create a copy of the attributes
          const updatedAttributes = { ...prevPet.attributes };

          // Decrease the specific attribute by the specified points
          if (attributeName === "health") {
            updatedAttributes.health = Math.max(
              0,
              updatedAttributes.health - pointsToDecrease
            );
          } else if (attributeName === "happiness") {
            updatedAttributes.happiness = Math.max(
              0,
              updatedAttributes.happiness - pointsToDecrease
            );
          } else if (attributeName === "hunger") {
            updatedAttributes.hunger = Math.max(
              0,
              updatedAttributes.hunger - pointsToDecrease
            );
          } else if (attributeName === "energy") {
            updatedAttributes.energy = Math.max(
              0,
              updatedAttributes.energy - pointsToDecrease
            );
          }

          // Return the updated pet
          return {
            ...prevPet,
            attributes: updatedAttributes,
          };
        });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [attributeName, label, pet, pointsToDecrease, secondsLeft, setPet]);

  // Format the countdown time
  useEffect(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    setCountdown(
      `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`
    );

    // Log countdown every 10 seconds to avoid console spam
    if (secondsLeft % 10 === 0 || secondsLeft <= 5) {
      console.log(
        `[${label}] Countdown: ${countdown}, Value: ${value.toFixed(2)}`
      );
    }
  }, [secondsLeft, label, value, countdown]);

  // Memoize styles to prevent recreation on each render
  const memoizedStyles = useMemo(
    () => ({
      barFill: {
        width: `${value}%` as any,
        backgroundColor: color,
      },
      iconContainer: {
        backgroundColor: color + "40",
      },
    }),
    [value, color]
  );

  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, memoizedStyles.iconContainer]}>
        <FontAwesome5 name={icon} size={16} color={color} />
      </View>
      <View style={styles.barContainer}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.countdown, { color: colors.text + "80" }]}>
            {countdown}
          </Text>
        </View>
        <View style={styles.bar}>
          <View style={[styles.barFill, memoizedStyles.barFill]} />
        </View>
      </View>
    </View>
  );
});

interface StatusBarsProps {
  attributes: PetAttributes;
}

export default function StatusBars({ attributes }: StatusBarsProps) {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];
  const { pet } = usePet();

  // Default to CAT type and EGG stage if pet is not available
  const petType = (pet?.type as PetType) || PetType.CAT;
  const petStage = (pet?.stage as PetStage) || PetStage.EGG;

  console.log("StatusBars rendered with attributes:", {
    health: attributes.health.toFixed(2),
    happiness: attributes.happiness.toFixed(2),
    hunger: attributes.hunger.toFixed(2),
    energy: attributes.energy.toFixed(2),
    petType,
    petStage,
  });

  return (
    <View style={styles.container}>
      <StatusBar
        value={attributes.health}
        label="Health"
        icon="heart"
        color={colors.health}
        attributeName="health"
        petType={petType}
        petStage={petStage}
      />
      <StatusBar
        value={attributes.happiness}
        label="Happiness"
        icon="smile"
        color={colors.happiness}
        attributeName="happiness"
        petType={petType}
        petStage={petStage}
      />
      <StatusBar
        value={attributes.hunger}
        label="Hunger"
        icon="utensils"
        color={colors.hunger}
        attributeName="hunger"
        petType={petType}
        petStage={petStage}
      />
      <StatusBar
        value={attributes.energy}
        label="Energy"
        icon="bolt"
        color={colors.energy}
        attributeName="energy"
        petType={petType}
        petStage={petStage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: Layout.spacing.sm,
  },
  statusBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
  },
  valueContainer: {
    marginLeft: 8,
    width: 80,
  },
  valueText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "right",
  },
  countdownText: {
    fontSize: 10,
    textAlign: "right",
  },
  iconContainer: {
    backgroundColor: "#00000040",
    borderRadius: 16,
    padding: 4,
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bar: {
    flex: 1,
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
  },
  countdown: {
    fontSize: 10,
    fontWeight: "500",
  },
});
