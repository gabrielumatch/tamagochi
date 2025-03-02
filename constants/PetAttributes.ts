import { PetStage } from "../contexts/PetContext";

// Pet evolution requirements
export const EVOLUTION_DAYS = {
  [PetStage.EGG]: 0.5, // 12 hours
  [PetStage.BABY]: 2, // 2 days
  [PetStage.CHILD]: 5, // 5 days
  [PetStage.TEEN]: 10, // 10 days
};

// Attribute decrease rates per hour
export const DECREASE_RATES = {
  HUNGER: 5,
  HAPPINESS: 3,
  ENERGY: 2,
};

// Interaction effects
export const FOOD_EFFECTS = {
  REGULAR: {
    HUNGER: 20,
    HAPPINESS: 0,
    HEALTH: 0,
  },
  TREAT: {
    HUNGER: 10,
    HAPPINESS: 15,
    HEALTH: 0,
  },
  HEALTHY: {
    HUNGER: 15,
    HAPPINESS: 0,
    HEALTH: 10,
  },
};

export const PLAY_EFFECTS = {
  HAPPINESS: 20,
  ENERGY: -10,
  HUNGER: -5,
};

export const CLEAN_EFFECTS = {
  HEALTH: 15,
};

export const SLEEP_EFFECTS = {
  ENERGY: 50,
  HUNGER: -5,
};

// Critical thresholds
export const CRITICAL_THRESHOLD = 20; // Attributes below this percentage trigger notifications

// Pet emojis by stage
export const PET_EMOJIS = {
  [PetStage.EGG]: "🥚",
  [PetStage.BABY]: "🐣",
  [PetStage.CHILD]: "🐥",
  [PetStage.TEEN]: "🐤",
  [PetStage.ADULT]: "🐔",
};

// Pet animations by action
export const PET_ANIMATIONS = {
  IDLE: "idle",
  HAPPY: "happy",
  SAD: "sad",
  EATING: "eating",
  SLEEPING: "sleeping",
  PLAYING: "playing",
};
