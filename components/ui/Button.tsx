import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
}

export default function Button({
  title,
  onPress,
  type = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  hapticFeedback = true,
}: ButtonProps) {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  const handlePress = () => {
    if (disabled || loading) return;

    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onPress();
  };

  const getBackgroundColor = () => {
    if (disabled) return colors.tabIconDefault;

    switch (type) {
      case "primary":
        return colors.primary;
      case "secondary":
        return colors.secondary;
      case "outline":
        return "transparent";
      case "danger":
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text + "80";

    switch (type) {
      case "outline":
        return colors.primary;
      default:
        return "#FFFFFF";
    }
  };

  const getBorderColor = () => {
    if (type === "outline") {
      return disabled ? colors.tabIconDefault : colors.primary;
    }
    return "transparent";
  };

  const getButtonSize = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 4,
        };
      case "medium":
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 6,
        };
      case "large":
        return {
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 8,
        };
      default:
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 6,
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "small":
        return 14;
      case "medium":
        return 16;
      case "large":
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonSize(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: type === "outline" ? 1 : 0,
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: getTextSize(),
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
});
