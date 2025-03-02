/**
 * GameRules.ts
 *
 * This file contains all the constants and rules that govern the Tamagotchi game mechanics.
 * Centralizing these values makes it easier to balance gameplay and maintain consistency.
 */

// Pet Evolution Stages and Timelines
export const EVOLUTION = {
  STAGES: {
    EGG: "egg",
    BABY: "baby",
    CHILD: "child",
    TEEN: "teen",
    ADULT: "adult",
  },
  DAYS_TO_EVOLVE: {
    EGG_TO_BABY: 0, // Immediate after creation
    BABY_TO_CHILD: 2,
    CHILD_TO_TEEN: 5,
    TEEN_TO_ADULT: 10,
  },
  REQUIREMENTS: {
    MIN_ATTRIBUTE_PERCENTAGE: 40, // Minimum attribute level required for evolution
  },
};

// Attribute Decrease Rates (per hour)
export const ATTRIBUTE_DECREASE = {
  HUNGER: 5,
  HAPPINESS: 3,
  ENERGY: 2, // When awake
  HEALTH_WHEN_CRITICAL: 2, // When other attributes are below threshold
  CRITICAL_THRESHOLD: 20, // Percentage below which attributes are considered critical
};

// Care Action Effects
export const CARE_ACTIONS = {
  FOOD: {
    REGULAR: { hunger: 20, happiness: 0, health: 0 },
    TREAT: { hunger: 10, happiness: 15, health: 0 },
    HEALTHY: { hunger: 15, happiness: 0, health: 10 },
    PREMIUM: { hunger: 30, happiness: 5, health: 0 },
    GOURMET: { hunger: 15, happiness: 25, health: 0 },
    VITAMIN: { hunger: 10, happiness: 0, health: 20 },
  },
  CLEAN: {
    BASIC: { health: 15 },
    WITH_STATION: { health: 18 }, // With grooming station
  },
  SLEEP: {
    ENERGY_GAIN: 50,
    HUNGER_LOSS: 5,
    WITH_BED_MULTIPLIER: 1.1, // 10% bonus with pet bed
  },
  PLAY: {
    HAPPINESS_GAIN: 20,
    ENERGY_LOSS: 10,
    HUNGER_LOSS: 5,
    WITH_PLAY_AREA_MULTIPLIER: 1.15, // 15% bonus with play area
    DAILY_LIMIT: 5,
  },
};

// Mini-Games
export const GAMES = {
  CATCH: {
    MIN_COINS: 10,
    MAX_COINS: 30,
    NAME: "Catch Game",
    DESCRIPTION: "Tap to catch falling items",
  },
  MEMORY: {
    MIN_COINS: 15,
    MAX_COINS: 40,
    NAME: "Memory Game",
    DESCRIPTION: "Match pairs of cards",
  },
  DANCE: {
    MIN_COINS: 20,
    MAX_COINS: 50,
    NAME: "Dance Game",
    DESCRIPTION: "Follow the rhythm pattern",
  },
};

// Economy
export const ECONOMY = {
  STARTING_COINS: 100,
  EARNINGS: {
    DAILY_LOGIN: 20,
    MILESTONE_MIN: 50,
    MILESTONE_MAX: 100,
    GOOD_CARE_DAILY: 5, // When all attributes above 70%
  },
  SHOP_PRICES: {
    BASIC_MIN: 50,
    BASIC_MAX: 100,
    PREMIUM_MIN: 150,
    PREMIUM_MAX: 300,
    SPECIAL_MIN: 500,
  },
};

// Shop Items
export const SHOP_ITEMS = {
  CATEGORIES: {
    FOOD: "food",
    TOY: "toy",
    DECORATION: "decoration",
    SPECIAL: "special",
  },
  ITEMS: [
    // Food items
    {
      id: "premium_food",
      name: "Premium Food",
      description:
        "High-quality food that satisfies hunger and adds a bit of happiness",
      price: 75,
      category: "food",
      effect: { hunger: 30, happiness: 5 },
      icon: "🍗",
    },
    {
      id: "gourmet_treat",
      name: "Gourmet Treat",
      description: "A delicious treat that makes your pet very happy",
      price: 90,
      category: "food",
      effect: { hunger: 15, happiness: 25 },
      icon: "🍰",
    },
    {
      id: "vitamin_supplement",
      name: "Vitamin Supplement",
      description: "Nutritional supplement that improves health",
      price: 100,
      category: "food",
      effect: { hunger: 10, health: 20 },
      icon: "💊",
    },

    // Toy items
    {
      id: "basic_toy",
      name: "Basic Toy",
      description: "A simple toy for your pet to play with",
      price: 100,
      category: "toy",
      effect: { happiness: 25 },
      icon: "🧸",
    },
    {
      id: "interactive_toy",
      name: "Interactive Toy",
      description: "An engaging toy that provides lots of fun but uses energy",
      price: 150,
      category: "toy",
      effect: { happiness: 40, energy: -15 },
      icon: "🎮",
    },
    {
      id: "educational_toy",
      name: "Educational Toy",
      description:
        "A toy that stimulates your pet mentally and improves health",
      price: 180,
      category: "toy",
      effect: { happiness: 30, health: 5 },
      icon: "🧩",
    },

    // Decoration items
    {
      id: "pet_bed",
      name: "Pet Bed",
      description: "A comfortable bed that improves sleep quality",
      price: 200,
      category: "decoration",
      effect: { sleepBoost: 0.1 }, // 10% boost to sleep effectiveness
      icon: "🛏️",
      permanent: true,
    },
    {
      id: "play_area",
      name: "Play Area",
      description: "A dedicated space for play that increases happiness gain",
      price: 250,
      category: "decoration",
      effect: { playBoost: 0.15 }, // 15% boost to play happiness gain
      icon: "🎪",
      permanent: true,
    },
    {
      id: "grooming_station",
      name: "Grooming Station",
      description: "Improves the effectiveness of cleaning",
      price: 300,
      category: "decoration",
      effect: { cleanBoost: 0.2 }, // 20% boost to cleaning effectiveness
      icon: "🚿",
      permanent: true,
    },

    // Special items
    {
      id: "evolution_boost",
      name: "Evolution Boost",
      description: "Speeds up evolution by 1 day",
      price: 500,
      category: "special",
      effect: { evolutionDays: -1 },
      icon: "⏩",
    },
    {
      id: "attribute_potion",
      name: "Attribute Potion",
      description: "Instantly raises all attributes by 30 points",
      price: 750,
      category: "special",
      effect: { hunger: 30, happiness: 30, energy: 30, health: 30 },
      icon: "🧪",
    },
    {
      id: "rare_costume",
      name: "Rare Costume",
      description: "A unique appearance for your pet",
      price: 1000,
      category: "special",
      effect: { cosmetic: true },
      icon: "👑",
      permanent: true,
    },
  ],
};

// Thresholds for pet states
export const THRESHOLDS = {
  CRITICAL: 20, // Below this percentage, pet is in critical condition
  LOW: 40, // Below this percentage, pet is in poor condition
  MEDIUM: 70, // Below this percentage, pet is in average condition
  HIGH: 90, // Below this percentage, pet is in good condition
  // Above HIGH percentage, pet is in excellent condition
};

// Time constants (in milliseconds)
export const TIME = {
  MILLISECONDS_PER_HOUR: 3600000,
  MILLISECONDS_PER_DAY: 86400000,
  UPDATE_INTERVAL: 60000, // Update pet stats every minute
};

export default {
  EVOLUTION,
  ATTRIBUTE_DECREASE,
  CARE_ACTIONS,
  GAMES,
  ECONOMY,
  SHOP_ITEMS,
  THRESHOLDS,
  TIME,
};
