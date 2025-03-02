import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Pet, PetStage } from "../../contexts/PetContext";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import Layout from "../../constants/Layout";

// Pet emojis for different stages
const petEmojis = {
  [PetStage.EGG]: "🥚",
  [PetStage.BABY]: "🐣",
  [PetStage.CHILD]: "🐥",
  [PetStage.TEEN]: "🐤",
  [PetStage.ADULT]: "🐔",
};

interface PetDisplayProps {
  pet: Pet;
  animation?: "idle" | "happy" | "sad" | "eating" | "sleeping" | "playing";
}

export default function PetDisplay({
  pet,
  animation = "idle",
}: PetDisplayProps) {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  // Animation values
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Set up animations based on the animation prop
  useEffect(() => {
    // Reset animations
    bounceAnim.setValue(0);
    rotateAnim.setValue(0);
    scaleAnim.setValue(1);

    let animationSequence;

    switch (animation) {
      case "idle":
        // Gentle breathing animation
        animationSequence = Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.05,
              duration: 2000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 2000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case "happy":
        // Bouncing animation
        animationSequence = Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: -20,
              duration: 300,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 200,
              easing: Easing.bounce,
              useNativeDriver: true,
            }),
            Animated.delay(500),
          ])
        );
        break;

      case "sad":
        // Slow side-to-side movement
        animationSequence = Animated.loop(
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: -0.05,
              duration: 1000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0.05,
              duration: 1000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case "eating":
        // Forward and backward movement
        animationSequence = Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.1,
              duration: 300,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.95,
              duration: 300,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case "sleeping":
        // Gentle pulsing
        animationSequence = Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.03,
              duration: 1500,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.97,
              duration: 1500,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case "playing":
        // Rotation and bounce
        animationSequence = Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.timing(bounceAnim, {
                toValue: -10,
                duration: 200,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
              Animated.timing(bounceAnim, {
                toValue: 0,
                duration: 150,
                easing: Easing.bounce,
                useNativeDriver: true,
              }),
              Animated.delay(100),
            ]),
            Animated.sequence([
              Animated.timing(rotateAnim, {
                toValue: 0.1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(rotateAnim, {
                toValue: -0.1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
            ]),
          ])
        );
        break;
    }

    if (animationSequence) {
      animationSequence.start();
    }

    return () => {
      if (animationSequence) {
        animationSequence.stop();
      }
    };
  }, [animation, bounceAnim, rotateAnim, scaleAnim]);

  // Interpolate rotation for transform
  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-30deg", "30deg"],
  });

  // Get the appropriate emoji based on pet stage
  const getPetEmoji = () => {
    return petEmojis[pet.stage] || "🥚";
  };

  // Add sleeping indicator if the pet is sleeping
  const getDisplayEmoji = () => {
    if (animation === "sleeping") {
      return `${getPetEmoji()} 💤`;
    }
    return getPetEmoji();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.petContainer,
          {
            transform: [
              { translateY: bounceAnim },
              { rotate },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <Text style={styles.emojiText}>{getDisplayEmoji()}</Text>
      </Animated.View>

      <View style={styles.nameContainer}>
        <Text style={[styles.nameText, { color: colors.text }]}>
          {pet.name}
        </Text>
        <Text style={[styles.ageText, { color: colors.text + "80" }]}>
          Age: {pet.attributes.age} {pet.attributes.age === 1 ? "day" : "days"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: Layout.spacing.lg,
  },
  petContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Layout.spacing.md,
  },
  emojiText: {
    fontSize: 80,
  },
  nameContainer: {
    alignItems: "center",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ageText: {
    fontSize: 16,
  },
});
