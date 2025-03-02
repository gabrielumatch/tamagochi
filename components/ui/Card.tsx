import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import Layout from "../../constants/Layout";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: number;
  padding?: keyof typeof Layout.spacing;
}

export default function Card({
  children,
  style,
  elevation = 2,
  padding = "md",
}: CardProps) {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          padding: Layout.spacing[padding],
          shadowOpacity: colorScheme === "dark" ? 0.3 : 0.1,
          elevation: colorScheme === "dark" ? elevation / 2 : elevation,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    overflow: "hidden",
  },
});
