import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Pet, PetStage, PetType } from "../../constants/PetTypes";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import Layout from "../../constants/Layout";
import { THRESHOLDS } from "../../constants/GameRules";
import { getPetEmoji as getPetEmojiFromSettings } from "../../constants/PetSettings";

// Pet emojis for different types and stages
const petEmojis = {
  [PetStage.EGG]: "🥚",
  [PetStage.BABY]: "🐣",
  [PetStage.CHILD]: "🐥",
  [PetStage.TEEN]: "🐤",
  [PetStage.ADULT]: "🐔",
  [PetStage.DEAD]: "💀",
};

// Stage names for display
const stageNames = {
  [PetStage.EGG]: "Egg",
  [PetStage.BABY]: "Baby",
  [PetStage.CHILD]: "Child",
  [PetStage.TEEN]: "Teen",
  [PetStage.ADULT]: "Adult",
  [PetStage.DEAD]: "Dead",
};

// Mood emojis based on overall pet condition
const moodEmojis = {
  excellent: { emoji: "😄", label: "Happy" },
  good: { emoji: "🙂", label: "Content" },
  average: { emoji: "😐", label: "Okay" },
  poor: { emoji: "😟", label: "Unhappy" },
  critical: { emoji: "😢", label: "Sad" },
};

interface PetDisplayProps {
  pet: Pet;
  animation?: "idle" | "happy" | "sad" | "eating" | "sleeping" | "playing";
}

// Memoize the entire component to prevent unnecessary rerenders
const PetDisplay = React.memo(
  function PetDisplay({ pet, animation = "idle" }: PetDisplayProps) {
    const colorScheme = useColorScheme() || "light";
    const colors = Colors[colorScheme];

    // Animation values - persist between renders
    const animationValues = useRef({
      bounce: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(1),
    }).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    // Memoize pet type and stage to avoid recalculations
    const petType = useMemo(
      () => (pet.type as PetType) || PetType.BIRD,
      [pet.type]
    );
    const petStage = useMemo(
      () => (pet.stage as PetStage) || PetStage.EGG,
      [pet.stage]
    );

    // Memoize the rotation interpolation
    const rotate = useMemo(() => {
      return animationValues.rotate.interpolate({
        inputRange: [-1, 1],
        outputRange: ["-30deg", "30deg"],
      });
    }, [animationValues.rotate]);

    // Get the appropriate emoji based on pet type and stage - memoized
    const petEmoji = useMemo(() => {
      return (
        petEmojis[petType]?.[petStage] ||
        petEmojis[PetType.BIRD][petStage] ||
        "🥚"
      );
    }, [petType, petStage]);

    // Add sleeping indicator if the pet is sleeping - memoized
    const displayEmoji = useMemo(() => {
      return animation === "sleeping" ? `${petEmoji} 💤` : petEmoji;
    }, [animation, petEmoji]);

    // Get the stage name for display - memoized
    const stageName = useMemo(() => {
      return stageNames[petStage] || "Unknown";
    }, [petStage]);

    // Calculate pet's overall mood based on attributes - memoized
    const mood = useMemo(() => {
      if (petStage === PetStage.EGG) {
        return moodEmojis.excellent; // Eggs are always in excellent mood
      }

      const { health, happiness, hunger, energy } = pet.attributes;
      const avgAttribute = (health + happiness + hunger + energy) / 4;

      if (avgAttribute >= THRESHOLDS.HIGH) {
        return moodEmojis.excellent;
      } else if (avgAttribute >= THRESHOLDS.MEDIUM) {
        return moodEmojis.good;
      } else if (avgAttribute >= THRESHOLDS.LOW) {
        return moodEmojis.average;
      } else if (avgAttribute >= THRESHOLDS.CRITICAL) {
        return moodEmojis.poor;
      } else {
        return moodEmojis.critical;
      }
    }, [pet.attributes, petStage]);

    // Memoize styles that depend on colors to prevent recalculation
    const memoizedStyles = useMemo(
      () => ({
        nameText: [styles.nameText, { color: colors.text }],
        ageText: [styles.ageText, { color: colors.text + "80" }],
        stageText: [styles.stageText, { color: colors.text }],
        moodText: [styles.moodText, { color: colors.text }],
        animatedViewStyle: {
          transform: [
            { translateY: animationValues.bounce },
            { rotate },
            { scale: animationValues.scale },
          ],
        },
      }),
      [colors.text, rotate, animationValues]
    );

    // Create animation sequences - memoized to avoid recreating on every render
    const createAnimationSequence = useCallback(() => {
      // Reset animations
      animationValues.bounce.setValue(0);
      animationValues.rotate.setValue(0);
      animationValues.scale.setValue(1);

      let sequence;

      switch (animation) {
        case "idle":
          // Gentle breathing animation
          sequence = Animated.loop(
            Animated.sequence([
              Animated.timing(animationValues.scale, {
                toValue: 1.05,
                duration: 2000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
              Animated.timing(animationValues.scale, {
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
          sequence = Animated.loop(
            Animated.sequence([
              Animated.timing(animationValues.bounce, {
                toValue: -20,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
              Animated.timing(animationValues.bounce, {
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
          sequence = Animated.loop(
            Animated.sequence([
              Animated.timing(animationValues.rotate, {
                toValue: -0.05,
                duration: 1000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
              Animated.timing(animationValues.rotate, {
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
          sequence = Animated.loop(
            Animated.sequence([
              Animated.timing(animationValues.scale, {
                toValue: 1.1,
                duration: 300,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(animationValues.scale, {
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
          sequence = Animated.loop(
            Animated.sequence([
              Animated.timing(animationValues.scale, {
                toValue: 1.03,
                duration: 1500,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
              Animated.timing(animationValues.scale, {
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
          sequence = Animated.loop(
            Animated.parallel([
              Animated.sequence([
                Animated.timing(animationValues.bounce, {
                  toValue: -10,
                  duration: 200,
                  easing: Easing.out(Easing.cubic),
                  useNativeDriver: true,
                }),
                Animated.timing(animationValues.bounce, {
                  toValue: 0,
                  duration: 150,
                  easing: Easing.bounce,
                  useNativeDriver: true,
                }),
                Animated.delay(100),
              ]),
              Animated.sequence([
                Animated.timing(animationValues.rotate, {
                  toValue: 0.1,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(animationValues.rotate, {
                  toValue: -0.1,
                  duration: 400,
                  useNativeDriver: true,
                }),
                Animated.timing(animationValues.rotate, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]),
            ])
          );
          break;
      }

      return sequence;
    }, [animation, animationValues]);

  // Get the appropriate emoji based on pet stage and type
  const getPetEmoji = () => {
    // Use the pet type and stage to get the correct emoji
    return (
      getPetEmojiFromSettings(pet.type, pet.stage) ||
      petEmojis[pet.stage as PetStage] ||
      "🥚"
    );
  };

      // Create and start new animation
      const sequence = createAnimationSequence();
      if (sequence) {
        animationRef.current = sequence;
        sequence.start();
      }

      // Clean up on unmount or when animation changes
      return () => {
        if (animationRef.current) {
          animationRef.current.stop();
          animationRef.current = null;
        }
      };
    }, [createAnimationSequence]);

    // Memoize the pet info section to prevent unnecessary rerenders
    const PetInfo = useMemo(
      () => (
        <View style={styles.nameContainer}>
          <Text style={memoizedStyles.nameText}>{pet.name}</Text>
          <View style={styles.infoContainer}>
            <Text style={memoizedStyles.ageText}>
              Age: {pet.age} {pet.age === 1 ? "day" : "days"}
            </Text>
            <View style={styles.stageIndicator}>
              <Text style={memoizedStyles.stageText}>{stageName}</Text>
            </View>
          </View>
          <View style={styles.moodContainer}>
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={memoizedStyles.moodText}>{mood.label}</Text>
          </View>
        </View>
      ),
      [pet.name, pet.age, stageName, mood, memoizedStyles]
    );

    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.petContainer, memoizedStyles.animatedViewStyle]}
        >
          <Text style={styles.emojiText}>{displayEmoji}</Text>
        </Animated.View>

        {PetInfo}
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    // Only re-render if these specific properties change
    return (
      prevProps.animation === nextProps.animation &&
      prevProps.pet.name === nextProps.pet.name &&
      prevProps.pet.age === nextProps.pet.age &&
      prevProps.pet.type === nextProps.pet.type &&
      prevProps.pet.stage === nextProps.pet.stage &&
      prevProps.pet.attributes.health === nextProps.pet.attributes.health &&
      prevProps.pet.attributes.happiness ===
        nextProps.pet.attributes.happiness &&
      prevProps.pet.attributes.hunger === nextProps.pet.attributes.hunger &&
      prevProps.pet.attributes.energy === nextProps.pet.attributes.energy
    );
  }
);

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
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  ageText: {
    fontSize: 16,
    marginRight: 10,
  },
  stageIndicator: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  stageText: {
    fontSize: 14,
    fontWeight: "600",
  },
  moodContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  moodEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  moodText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default PetDisplay;
