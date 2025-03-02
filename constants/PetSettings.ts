/**
 * PetSettings.ts
 *
 * This file contains detailed settings for different pet types and evolution stages.
 * It centralizes all pet-specific constants to make balancing and adjustments easier.
 */

import { PetStage, PetType } from "./PetTypes";

// Interface for attribute decrease rates
interface AttributeDecreaseRates {
  health: {
    points: number;
    seconds: number;
  };
  happiness: {
    points: number;
    seconds: number;
  };
  hunger: {
    points: number;
    seconds: number;
  };
  energy: {
    points: number;
    seconds: number;
  };
}

// Interface for evolution settings
interface EvolutionSettings {
  timeToEvolve: number; // in seconds for testing, would be days in production
  requiredAttributes: {
    health: number;
    happiness: number;
    hunger: number;
    energy: number;
  };
}

// Interface for pet stage settings
interface PetStageSettings {
  decreaseRates: AttributeDecreaseRates;
  evolution: EvolutionSettings;
  emoji: string;
  displayName: string;
}

// Interface for pet type settings - using string literals instead of enum values
interface PetTypeSettings {
  egg: PetStageSettings;
  baby: PetStageSettings;
  child: PetStageSettings;
  teen: PetStageSettings;
  adult: PetStageSettings;
}

// Master settings object for all pet types and stages
export const PET_SETTINGS: Record<string, PetTypeSettings> = {
  cat: {
    egg: {
      decreaseRates: {
        health: { points: 1, seconds: 20 },
        happiness: { points: 1, seconds: 40 },
        hunger: { points: 2, seconds: 30 },
        energy: { points: 1, seconds: 50 },
      },
      evolution: {
        timeToEvolve: 30, // 30 seconds for testing
        requiredAttributes: {
          health: 50,
          happiness: 50,
          hunger: 50,
          energy: 50,
        },
      },
      emoji: "🥚",
      displayName: "Cat Egg",
    },
    baby: {
      decreaseRates: {
        health: { points: 1, seconds: 30 },
        happiness: { points: 2, seconds: 25 },
        hunger: { points: 3, seconds: 20 },
        energy: { points: 2, seconds: 35 },
      },
      evolution: {
        timeToEvolve: 60, // 60 seconds for testing
        requiredAttributes: {
          health: 60,
          happiness: 60,
          hunger: 60,
          energy: 60,
        },
      },
      emoji: "🐣",
      displayName: "Kitten",
    },
    child: {
      decreaseRates: {
        health: { points: 1, seconds: 40 },
        happiness: { points: 2, seconds: 30 },
        hunger: { points: 2, seconds: 25 },
        energy: { points: 2, seconds: 45 },
      },
      evolution: {
        timeToEvolve: 90, // 90 seconds for testing
        requiredAttributes: {
          health: 70,
          happiness: 70,
          hunger: 70,
          energy: 70,
        },
      },
      emoji: "🐱",
      displayName: "Young Cat",
    },
    teen: {
      decreaseRates: {
        health: { points: 1, seconds: 50 },
        happiness: { points: 3, seconds: 35 },
        hunger: { points: 2, seconds: 30 },
        energy: { points: 3, seconds: 40 },
      },
      evolution: {
        timeToEvolve: 120, // 120 seconds for testing
        requiredAttributes: {
          health: 75,
          happiness: 75,
          hunger: 75,
          energy: 75,
        },
      },
      emoji: "😸",
      displayName: "Teen Cat",
    },
    adult: {
      decreaseRates: {
        health: { points: 1, seconds: 60 },
        happiness: { points: 2, seconds: 45 },
        hunger: { points: 2, seconds: 40 },
        energy: { points: 2, seconds: 50 },
      },
      evolution: {
        timeToEvolve: 0, // No further evolution
        requiredAttributes: {
          health: 0,
          happiness: 0,
          hunger: 0,
          energy: 0,
        },
      },
      emoji: "😻",
      displayName: "Adult Cat",
    },
  },

  dog: {
    egg: {
      decreaseRates: {
        health: { points: 1, seconds: 25 },
        happiness: { points: 1, seconds: 45 },
        hunger: { points: 2, seconds: 35 },
        energy: { points: 1, seconds: 55 },
      },
      evolution: {
        timeToEvolve: 30, // 30 seconds for testing
        requiredAttributes: {
          health: 50,
          happiness: 50,
          hunger: 50,
          energy: 50,
        },
      },
      emoji: "🥚",
      displayName: "Dog Egg",
    },
    baby: {
      decreaseRates: {
        health: { points: 1, seconds: 35 },
        happiness: { points: 3, seconds: 20 },
        hunger: { points: 3, seconds: 15 },
        energy: { points: 3, seconds: 30 },
      },
      evolution: {
        timeToEvolve: 60, // 60 seconds for testing
        requiredAttributes: {
          health: 60,
          happiness: 60,
          hunger: 60,
          energy: 60,
        },
      },
      emoji: "🐶",
      displayName: "Puppy",
    },
    child: {
      decreaseRates: {
        health: { points: 1, seconds: 45 },
        happiness: { points: 3, seconds: 25 },
        hunger: { points: 3, seconds: 20 },
        energy: { points: 3, seconds: 35 },
      },
      evolution: {
        timeToEvolve: 90, // 90 seconds for testing
        requiredAttributes: {
          health: 70,
          happiness: 70,
          hunger: 70,
          energy: 70,
        },
      },
      emoji: "🐕",
      displayName: "Young Dog",
    },
    teen: {
      decreaseRates: {
        health: { points: 1, seconds: 55 },
        happiness: { points: 2, seconds: 30 },
        hunger: { points: 3, seconds: 25 },
        energy: { points: 4, seconds: 35 },
      },
      evolution: {
        timeToEvolve: 120, // 120 seconds for testing
        requiredAttributes: {
          health: 75,
          happiness: 75,
          hunger: 75,
          energy: 75,
        },
      },
      emoji: "🐩",
      displayName: "Teen Dog",
    },
    adult: {
      decreaseRates: {
        health: { points: 1, seconds: 65 },
        happiness: { points: 2, seconds: 40 },
        hunger: { points: 3, seconds: 30 },
        energy: { points: 3, seconds: 45 },
      },
      evolution: {
        timeToEvolve: 0, // No further evolution
        requiredAttributes: {
          health: 0,
          happiness: 0,
          hunger: 0,
          energy: 0,
        },
      },
      emoji: "🦮",
      displayName: "Adult Dog",
    },
  },

  bird: {
    egg: {
      decreaseRates: {
        health: { points: 1, seconds: 30 },
        happiness: { points: 1, seconds: 50 },
        hunger: { points: 1, seconds: 40 },
        energy: { points: 1, seconds: 60 },
      },
      evolution: {
        timeToEvolve: 30, // 30 seconds for testing
        requiredAttributes: {
          health: 50,
          happiness: 50,
          hunger: 50,
          energy: 50,
        },
      },
      emoji: "🥚",
      displayName: "Bird Egg",
    },
    baby: {
      decreaseRates: {
        health: { points: 1, seconds: 40 },
        happiness: { points: 2, seconds: 30 },
        hunger: { points: 2, seconds: 25 },
        energy: { points: 1, seconds: 45 },
      },
      evolution: {
        timeToEvolve: 60, // 60 seconds for testing
        requiredAttributes: {
          health: 60,
          happiness: 60,
          hunger: 60,
          energy: 60,
        },
      },
      emoji: "🐤",
      displayName: "Chick",
    },
    child: {
      decreaseRates: {
        health: { points: 1, seconds: 50 },
        happiness: { points: 2, seconds: 35 },
        hunger: { points: 2, seconds: 30 },
        energy: { points: 1, seconds: 55 },
      },
      evolution: {
        timeToEvolve: 90, // 90 seconds for testing
        requiredAttributes: {
          health: 70,
          happiness: 70,
          hunger: 70,
          energy: 70,
        },
      },
      emoji: "🐦",
      displayName: "Young Bird",
    },
    teen: {
      decreaseRates: {
        health: { points: 1, seconds: 60 },
        happiness: { points: 2, seconds: 40 },
        hunger: { points: 2, seconds: 35 },
        energy: { points: 1, seconds: 65 },
      },
      evolution: {
        timeToEvolve: 120, // 120 seconds for testing
        requiredAttributes: {
          health: 75,
          happiness: 75,
          hunger: 75,
          energy: 75,
        },
      },
      emoji: "🦜",
      displayName: "Teen Bird",
    },
    adult: {
      decreaseRates: {
        health: { points: 1, seconds: 70 },
        happiness: { points: 2, seconds: 50 },
        hunger: { points: 2, seconds: 45 },
        energy: { points: 1, seconds: 75 },
      },
      evolution: {
        timeToEvolve: 0, // No further evolution
        requiredAttributes: {
          health: 0,
          happiness: 0,
          hunger: 0,
          energy: 0,
        },
      },
      emoji: "🦅",
      displayName: "Adult Bird",
    },
  },

  dragon: {
    egg: {
      decreaseRates: {
        health: { points: 1, seconds: 40 },
        happiness: { points: 1, seconds: 60 },
        hunger: { points: 1, seconds: 50 },
        energy: { points: 1, seconds: 70 },
      },
      evolution: {
        timeToEvolve: 40, // 40 seconds for testing
        requiredAttributes: {
          health: 50,
          happiness: 50,
          hunger: 50,
          energy: 50,
        },
      },
      emoji: "🥚",
      displayName: "Dragon Egg",
    },
    baby: {
      decreaseRates: {
        health: { points: 1, seconds: 50 },
        happiness: { points: 1, seconds: 45 },
        hunger: { points: 2, seconds: 35 },
        energy: { points: 1, seconds: 60 },
      },
      evolution: {
        timeToEvolve: 70, // 70 seconds for testing
        requiredAttributes: {
          health: 60,
          happiness: 60,
          hunger: 60,
          energy: 60,
        },
      },
      emoji: "🐉",
      displayName: "Baby Dragon",
    },
    child: {
      decreaseRates: {
        health: { points: 1, seconds: 60 },
        happiness: { points: 2, seconds: 50 },
        hunger: { points: 3, seconds: 40 },
        energy: { points: 1, seconds: 70 },
      },
      evolution: {
        timeToEvolve: 100, // 100 seconds for testing
        requiredAttributes: {
          health: 70,
          happiness: 70,
          hunger: 70,
          energy: 70,
        },
      },
      emoji: "🐲",
      displayName: "Young Dragon",
    },
    teen: {
      decreaseRates: {
        health: { points: 1, seconds: 70 },
        happiness: { points: 2, seconds: 55 },
        hunger: { points: 3, seconds: 45 },
        energy: { points: 2, seconds: 75 },
      },
      evolution: {
        timeToEvolve: 130, // 130 seconds for testing
        requiredAttributes: {
          health: 75,
          happiness: 75,
          hunger: 75,
          energy: 75,
        },
      },
      emoji: "🔥",
      displayName: "Teen Dragon",
    },
    adult: {
      decreaseRates: {
        health: { points: 1, seconds: 80 },
        happiness: { points: 2, seconds: 65 },
        hunger: { points: 3, seconds: 55 },
        energy: { points: 2, seconds: 85 },
      },
      evolution: {
        timeToEvolve: 0, // No further evolution
        requiredAttributes: {
          health: 0,
          happiness: 0,
          hunger: 0,
          energy: 0,
        },
      },
      emoji: "🐉",
      displayName: "Adult Dragon",
    },
  },
};

// Helper functions to get settings
export function getPetStageSettings(
  petType: PetType | string,
  stage: PetStage | string
): PetStageSettings {
  // Default to cat if petType is undefined
  const type = petType ? (petType as string) : PetType.CAT;
  const stageKey = stage as keyof PetTypeSettings;
  return PET_SETTINGS[type][stageKey];
}

export function getDecreaseRates(
  petType: PetType | string,
  stage: PetStage | string
): AttributeDecreaseRates {
  // Default to cat if petType is undefined
  const type = petType ? (petType as string) : PetType.CAT;
  const stageKey = stage as keyof PetTypeSettings;
  return PET_SETTINGS[type][stageKey].decreaseRates;
}

export function getEvolutionSettings(
  petType: PetType | string,
  stage: PetStage | string
): EvolutionSettings {
  // Default to cat if petType is undefined
  const type = petType ? (petType as string) : PetType.CAT;
  const stageKey = stage as keyof PetTypeSettings;
  return PET_SETTINGS[type][stageKey].evolution;
}

// Constants for critical thresholds
export const ATTRIBUTE_THRESHOLDS = {
  CRITICAL: 20, // Below this percentage, pet is in critical condition
  LOW: 40, // Below this percentage, pet is in poor condition
  MEDIUM: 70, // Below this percentage, pet is in average condition
  HIGH: 90, // Below this percentage, pet is in good condition
  // Above HIGH percentage, pet is in excellent condition
};
