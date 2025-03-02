import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { PetAttributes } from "../../contexts/PetContext";
import { FontAwesome5 } from "@expo/vector-icons";
import Layout from "../../constants/Layout";
import { ATTRIBUTE_DECREASE } from "../../constants/GameRules";
import { usePet } from "../../contexts/PetContext";

interface StatusBarProps {
  value: number;
  label: string;
  icon: string;
  color: string;
  decreaseRate: number; // Points per hour
  attributeName: "health" | "happiness" | "hunger" | "energy";
}

function StatusBar({
  value,
  label,
  icon,
  color,
  decreaseRate,
  attributeName,
}: StatusBarProps) {
  const [countdown, setCountdown] = useState<string>("00:00");
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const { pet, setPet } = usePet();
  const shouldDecreaseRef = useRef(false);
  const initializedRef = useRef(false);

  // Calculate time until next decrease (1 point)
  useEffect(() => {
    // For demo purposes, we'll scale down the time: 1 hour = 60 seconds (for testing)
    // In a real app, this would use the actual time remaining
    const timeToDecrease = (60 * 60) / decreaseRate; // seconds per point

    // Use different scaling factors for different attributes to balance the game
    let scaleFactor = 60; // Default scale: 1 hour = 60 seconds

    // Hunger should decrease more slowly than other attributes for balance
    if (attributeName === "hunger") {
      scaleFactor = 120; // 1 hour = 120 seconds for hunger (slower)
    } else if (attributeName === "happiness") {
      scaleFactor = 90; // 1 hour = 90 seconds for happiness (medium)
    } else if (attributeName === "energy") {
      scaleFactor = 80; // 1 hour = 80 seconds for energy (medium-fast)
    }

    const scaledTime = Math.floor(timeToDecrease / scaleFactor);

    console.log(`[${label}] Decrease rate: ${decreaseRate} points/hour`);
    console.log(
      `[${label}] Time to decrease 1 point: ${timeToDecrease.toFixed(
        2
      )} seconds`
    );
    console.log(`[${label}] Scale factor: 1 hour = ${scaleFactor} seconds`);
    console.log(`[${label}] Scaled time for testing: ${scaledTime} seconds`);

    // Initialize the seconds left only once
    if (!initializedRef.current) {
      setSecondsLeft(scaledTime);
      initializedRef.current = true;
      console.log(`[${label}] Timer initialized with ${scaledTime} seconds`);
    }

    // Set up the countdown interval
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Mark that we should decrease the attribute
          shouldDecreaseRef.current = true;
          // Reset the timer when it reaches zero
          console.log(`[${label}] Timer reset, attribute should decrease`);
          return scaledTime;
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up the interval
    return () => clearInterval(interval);
  }, [decreaseRate, label, attributeName]);

  // Handle the actual attribute decrease in a separate effect
  useEffect(() => {
    // Use a setTimeout to ensure we're not updating state during render
    if (shouldDecreaseRef.current && pet && setPet) {
      const timer = setTimeout(() => {
        shouldDecreaseRef.current = false;

        console.log(`[${label}] Decreasing ${attributeName} by 1 point`);

        setPet((prevPet) => {
          if (!prevPet) return null;

          // Create a copy of the attributes
          const updatedAttributes = { ...prevPet.attributes };

          // Decrease the specific attribute by 1 point
          if (attributeName === "health") {
            updatedAttributes.health = Math.max(
              0,
              updatedAttributes.health - 1
            );
          } else if (attributeName === "happiness") {
            updatedAttributes.happiness = Math.max(
              0,
              updatedAttributes.happiness - 1
            );
          } else if (attributeName === "hunger") {
            updatedAttributes.hunger = Math.max(
              0,
              updatedAttributes.hunger - 1
            );
          } else if (attributeName === "energy") {
            updatedAttributes.energy = Math.max(
              0,
              updatedAttributes.energy - 1
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
  }, [secondsLeft, pet, setPet, attributeName, label]);

  // Format the countdown time
  useEffect(() => {
    // Convert seconds to minutes and seconds
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    // Format the countdown string
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    setCountdown(`${formattedMinutes}:${formattedSeconds}`);

    // Log every 10 seconds to avoid console spam
    if (secondsLeft % 10 === 0 || secondsLeft <= 5) {
      console.log(
        `[${label}] Countdown: ${formattedMinutes}:${formattedSeconds}, Value: ${value.toFixed(
          2
        )}`
      );
    }
  }, [secondsLeft, label, value]);

  return (
    <View style={styles.statusBarContainer}>
      <View style={styles.labelContainer}>
        <FontAwesome5 name={icon} size={14} color={color} style={styles.icon} />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${value}%`,
              backgroundColor: color,
              // Add a pulsing effect for critical values
              opacity: value <= 20 ? 0.8 : 1,
            },
          ]}
        />
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{Math.round(value)}%</Text>
        <Text style={[styles.countdownText, { color }]}>-1 in {countdown}</Text>
      </View>
    </View>
  );
}

interface StatusBarsProps {
  attributes: PetAttributes;
}

export default function StatusBars({ attributes }: StatusBarsProps) {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  console.log("StatusBars rendered with attributes:", {
    health: attributes.health.toFixed(2),
    happiness: attributes.happiness.toFixed(2),
    hunger: attributes.hunger.toFixed(2),
    energy: attributes.energy.toFixed(2),
  });

  return (
    <View style={styles.container}>
      <StatusBar
        value={attributes.health}
        label="Health"
        icon="heart"
        color={colors.health}
        decreaseRate={ATTRIBUTE_DECREASE.HEALTH_WHEN_CRITICAL}
        attributeName="health"
      />
      <StatusBar
        value={attributes.happiness}
        label="Happiness"
        icon="smile"
        color={colors.happiness}
        decreaseRate={ATTRIBUTE_DECREASE.HAPPINESS}
        attributeName="happiness"
      />
      <StatusBar
        value={attributes.hunger}
        label="Hunger"
        icon="utensils"
        color={colors.hunger}
        decreaseRate={ATTRIBUTE_DECREASE.HUNGER}
        attributeName="hunger"
      />
      <StatusBar
        value={attributes.energy}
        label="Energy"
        icon="bolt"
        color={colors.energy}
        decreaseRate={ATTRIBUTE_DECREASE.ENERGY}
        attributeName="energy"
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
});
