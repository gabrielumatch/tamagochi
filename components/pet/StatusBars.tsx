import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { PetAttributes } from "../../contexts/PetContext";
import { FontAwesome5 } from "@expo/vector-icons";
import Layout from "../../constants/Layout";
import { ATTRIBUTE_DECREASE } from "../../constants/GameRules";

interface StatusBarProps {
  value: number;
  label: string;
  icon: string;
  color: string;
  decreaseRate: number; // Points per hour
}

function StatusBar({
  value,
  label,
  icon,
  color,
  decreaseRate,
}: StatusBarProps) {
  const [countdown, setCountdown] = useState<string>("");
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  // Calculate time until next decrease (1 point)
  useEffect(() => {
    // For demo purposes, we'll scale down the time: 1 hour = 60 seconds
    // In a real app, this would use the actual time remaining
    const timeToDecrease = (60 * 60) / decreaseRate; // seconds per point
    const scaledTime = Math.floor(timeToDecrease / 60); // scaled for demo

    // Initialize the seconds left
    setSecondsLeft(scaledTime);

    // Set up the countdown interval
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) {
          // Reset the timer when it reaches zero
          return scaledTime;
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up the interval
    return () => clearInterval(interval);
  }, [decreaseRate]);

  // Format the countdown time
  useEffect(() => {
    // Convert seconds to minutes and seconds
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    // Format the countdown string
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    setCountdown(`${formattedMinutes}:${formattedSeconds}`);
  }, [secondsLeft]);

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

  return (
    <View style={styles.container}>
      <StatusBar
        value={attributes.health}
        label="Health"
        icon="heart"
        color={colors.health}
        decreaseRate={ATTRIBUTE_DECREASE.HEALTH_WHEN_CRITICAL}
      />
      <StatusBar
        value={attributes.happiness}
        label="Happiness"
        icon="smile"
        color={colors.happiness}
        decreaseRate={ATTRIBUTE_DECREASE.HAPPINESS}
      />
      <StatusBar
        value={attributes.hunger}
        label="Hunger"
        icon="utensils"
        color={colors.hunger}
        decreaseRate={ATTRIBUTE_DECREASE.HUNGER}
      />
      <StatusBar
        value={attributes.energy}
        label="Energy"
        icon="bolt"
        color={colors.energy}
        decreaseRate={ATTRIBUTE_DECREASE.ENERGY}
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
