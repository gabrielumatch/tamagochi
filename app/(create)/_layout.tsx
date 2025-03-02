import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "../../constants/Colors";

export default function CreateLayout() {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="create-pet"
        options={{
          title: "Create New Pet",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
