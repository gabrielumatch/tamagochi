import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { PetAttributes } from "../../contexts/PetContext";
import { FontAwesome5 } from "@expo/vector-icons";
import Layout from "../../constants/Layout";

interface StatusBarProps {
  value: number;
  label: string;
  icon: string;
  color: string;
}

function StatusBar({ value, label, icon, color }: StatusBarProps) {
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
      <Text style={styles.valueText}>{Math.round(value)}%</Text>
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
      />
      <StatusBar
        value={attributes.happiness}
        label="Happiness"
        icon="smile"
        color={colors.happiness}
      />
      <StatusBar
        value={attributes.hunger}
        label="Hunger"
        icon="utensils"
        color={colors.hunger}
      />
      <StatusBar
        value={attributes.energy}
        label="Energy"
        icon="bolt"
        color={colors.energy}
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
  valueText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "500",
    width: 40,
    textAlign: "right",
  },
});
