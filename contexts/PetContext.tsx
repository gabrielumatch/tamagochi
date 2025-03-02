import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EVOLUTION,
  ATTRIBUTE_DECREASE,
  CARE_ACTIONS,
} from "../constants/GameRules";
import {
  getEvolutionSettings,
  getDecreaseRates,
  ATTRIBUTE_THRESHOLDS,
} from "../constants/PetSettings";
import { PetType, PetStage, PetAttributes, Pet } from "../constants/PetTypes";

// Helper function to generate a unique ID
const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Minimum time between updates in milliseconds (5 seconds)
const MIN_UPDATE_INTERVAL = 5000;

// Define context interface
interface PetContextType {
  pet: Pet | null;
  setPet: React.Dispatch<React.SetStateAction<Pet | null>>;
  isLoading: boolean;
  createPet: (name: string, petType?: PetType) => void;
  feedPet: (foodType: "regular" | "treat" | "healthy") => void;
  playWithPet: () => void;
  cleanPet: () => void;
  putPetToSleep: () => void;
  updatePetAttributes: () => void;
  evolvePet: () => void;
  // New function to check if pet can evolve
  canPetEvolve: () => boolean;
}

// Create context with default values
const PetContext = createContext<PetContextType>({
  pet: null,
  setPet: () => {},
  isLoading: true,
  createPet: () => {},
  feedPet: () => {},
  playWithPet: () => {},
  cleanPet: () => {},
  putPetToSleep: () => {},
  updatePetAttributes: () => {},
  evolvePet: () => {},
  canPetEvolve: () => false,
});

// Create provider component
export const PetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for throttling and optimization
  const lastUpdateTimeRef = useRef<number>(0);
  const pendingSaveRef = useRef<NodeJS.Timeout | null>(null);
  const evolutionCheckCacheRef = useRef<{
    lastChecked: number;
    canEvolve: boolean;
    timeToEvolve: number;
  } | null>(null);

  // Load pet data from storage on mount
  useEffect(() => {
    const loadPet = async () => {
      try {
        const petData = await AsyncStorage.getItem("pet");
        if (petData) {
          setPet(JSON.parse(petData));
        }
      } catch (error) {
        console.error("Failed to load pet data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPet();
  }, []);

  // Save pet data to storage with debouncing
  useEffect(() => {
    if (!pet) return;

    console.log("Pet state changed:", {
      stage: pet.stage,
      age: pet.age,
      attributes: {
        health: pet.attributes.health.toFixed(2),
        happiness: pet.attributes.happiness.toFixed(2),
        hunger: pet.attributes.hunger.toFixed(2),
        energy: pet.attributes.energy.toFixed(2),
        lastUpdated: new Date(pet.attributes.lastUpdated).toLocaleTimeString(),
      },
    });

    // Clear any pending save
    if (pendingSaveRef.current) {
      clearTimeout(pendingSaveRef.current);
    }

    // Schedule a new save after 2 seconds of inactivity
    pendingSaveRef.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem("pet", JSON.stringify(pet));
        console.log("Pet data saved to storage");
      } catch (error) {
        console.error("Failed to save pet data:", error);
      }
      pendingSaveRef.current = null;
    }, 2000);

    // Clean up on unmount
    return () => {
      if (pendingSaveRef.current) {
        clearTimeout(pendingSaveRef.current);
      }
    };
  }, [pet]);

  // Memoized function to check if pet can evolve
  const canPetEvolve = useCallback(() => {
    if (!pet) return false;

    const now = Date.now();

    // Use cached result if it's recent (within last 5 seconds)
    if (
      evolutionCheckCacheRef.current &&
      now - evolutionCheckCacheRef.current.lastChecked < 5000
    ) {
      return evolutionCheckCacheRef.current.canEvolve;
    }

    const petType = pet.type as PetType;
    const petStage = pet.stage as PetStage;

    // Get evolution settings for this pet type and stage
    const evolutionSettings = getEvolutionSettings(petType, petStage);

    // If already at max stage, can't evolve
    if (petStage === PetStage.ADULT) {
      evolutionCheckCacheRef.current = {
        lastChecked: now,
        canEvolve: false,
        timeToEvolve: 0,
      };
      return false;
    }

    // Check if attributes are good enough for evolution
    const canEvolve =
      pet.attributes.hunger > evolutionSettings.requiredAttributes.hunger &&
      pet.attributes.happiness >
        evolutionSettings.requiredAttributes.happiness &&
      pet.attributes.health > evolutionSettings.requiredAttributes.health &&
      pet.attributes.energy > evolutionSettings.requiredAttributes.energy;

    // For testing, we'll use seconds instead of days
    const secondsSinceLastEvolution =
      (now - pet.birthDate) / 1000 - pet.lastEvolutionAge;

    const result =
      canEvolve && secondsSinceLastEvolution >= evolutionSettings.timeToEvolve;

    // Cache the result
    evolutionCheckCacheRef.current = {
      lastChecked: now,
      canEvolve: result,
      timeToEvolve: evolutionSettings.timeToEvolve,
    };

    return result;
  }, [pet]);

  // Update pet attributes based on time passed - with throttling
  const updatePetAttributes = useCallback(() => {
    if (!pet) return;

    const now = Date.now();

    // Throttle updates - only update if enough time has passed since last update
    if (now - lastUpdateTimeRef.current < MIN_UPDATE_INTERVAL) {
      console.log(
        "Update throttled, skipping (last update was",
        (now - lastUpdateTimeRef.current) / 1000,
        "seconds ago)"
      );
      return;
    }

    lastUpdateTimeRef.current = now;

    const hoursPassed = (now - pet.attributes.lastUpdated) / (1000 * 60 * 60);
    const petType = pet.type as PetType;
    const petStage = pet.stage as PetStage;

    console.log("===== PET UPDATE =====");
    console.log(
      "Last updated:",
      new Date(pet.attributes.lastUpdated).toLocaleTimeString()
    );
    console.log("Current time:", new Date(now).toLocaleTimeString());
    console.log("Hours passed:", hoursPassed);
    console.log("Pet type:", petType, "Pet stage:", petStage);

    if (hoursPassed < 0.001) {
      console.log("Not enough time passed, skipping update");
      return; // Only update if at least 3.6 seconds have passed
    }

    // Get the decrease rates for this pet type and stage
    const decreaseRates = getDecreaseRates(petType, petStage);

    // Calculate attribute decreases based on time using pet-specific settings
    // For real-time updates, we'll convert the seconds-based rates to hourly rates
    const hungerPointsPerHour =
      (3600 / decreaseRates.hunger.seconds) * decreaseRates.hunger.points;
    const happinessPointsPerHour =
      (3600 / decreaseRates.happiness.seconds) * decreaseRates.happiness.points;
    const energyPointsPerHour =
      (3600 / decreaseRates.energy.seconds) * decreaseRates.energy.points;
    const healthPointsPerHour =
      (3600 / decreaseRates.health.seconds) * decreaseRates.health.points;

    const hungerDecrease = Math.min(
      pet.attributes.hunger,
      hungerPointsPerHour * hoursPassed
    );
    const happinessDecrease = Math.min(
      pet.attributes.happiness,
      happinessPointsPerHour * hoursPassed
    );
    const energyDecrease = Math.min(
      pet.attributes.energy,
      energyPointsPerHour * hoursPassed
    );

    // Health decreases only if other attributes are critical
    let healthDecrease = 0;
    if (
      pet.attributes.hunger <= ATTRIBUTE_THRESHOLDS.CRITICAL ||
      pet.attributes.happiness <= ATTRIBUTE_THRESHOLDS.CRITICAL ||
      pet.attributes.energy <= ATTRIBUTE_THRESHOLDS.CRITICAL
    ) {
      healthDecrease = Math.min(
        pet.attributes.health,
        healthPointsPerHour * hoursPassed
      );
    }

    console.log("Attribute decreases:");
    console.log(
      "- Hunger:",
      hungerDecrease.toFixed(2),
      `(${hungerPointsPerHour.toFixed(2)} points/hour)`
    );
    console.log(
      "- Happiness:",
      happinessDecrease.toFixed(2),
      `(${happinessPointsPerHour.toFixed(2)} points/hour)`
    );
    console.log(
      "- Energy:",
      energyDecrease.toFixed(2),
      `(${energyPointsPerHour.toFixed(2)} points/hour)`
    );
    console.log(
      "- Health:",
      healthDecrease.toFixed(2),
      `(${healthPointsPerHour.toFixed(2)} points/hour)`
    );

    // Update pet attributes
    setPet((prevPet) => {
      if (!prevPet) return null;

      const updatedAttributes = {
        ...prevPet.attributes,
        hunger: Math.max(0, prevPet.attributes.hunger - hungerDecrease),
        happiness: Math.max(
          0,
          prevPet.attributes.happiness - happinessDecrease
        ),
        energy: Math.max(0, prevPet.attributes.energy - energyDecrease),
        health: Math.max(0, prevPet.attributes.health - healthDecrease),
        lastUpdated: now,
      };

      console.log("Updated attributes:");
      console.log("- Hunger:", updatedAttributes.hunger.toFixed(2));
      console.log("- Happiness:", updatedAttributes.happiness.toFixed(2));
      console.log("- Energy:", updatedAttributes.energy.toFixed(2));
      console.log("- Health:", updatedAttributes.health.toFixed(2));

      // Check if pet should evolve based on age and settings
      const daysSinceBirth = (now - prevPet.birthDate) / (1000 * 60 * 60 * 24);
      let stage = prevPet.stage;
      let lastEvolutionAge = prevPet.lastEvolutionAge;
      const age = Math.floor(daysSinceBirth);

      // Only check evolution if we haven't recently checked or if attributes have changed significantly
      const shouldCheckEvolution =
        !evolutionCheckCacheRef.current ||
        now - evolutionCheckCacheRef.current.lastChecked > 5000;

      if (shouldCheckEvolution) {
        // Get evolution settings for this pet type and stage
        const evolutionSettings = getEvolutionSettings(
          petType as PetType,
          petStage as PetStage
        );

        // Check if attributes are good enough for evolution
        const canEvolve =
          updatedAttributes.hunger >
            evolutionSettings.requiredAttributes.hunger &&
          updatedAttributes.happiness >
            evolutionSettings.requiredAttributes.happiness &&
          updatedAttributes.health >
            evolutionSettings.requiredAttributes.health &&
          updatedAttributes.energy >
            evolutionSettings.requiredAttributes.energy;

        // For testing, we'll use seconds instead of days
        const secondsSinceLastEvolution =
          (now - prevPet.birthDate) / 1000 - prevPet.lastEvolutionAge;

        console.log("Evolution check:");
        console.log("- Current stage:", stage);
        console.log(
          "- Seconds since last evolution:",
          secondsSinceLastEvolution
        );
        console.log("- Time needed to evolve:", evolutionSettings.timeToEvolve);
        console.log("- Can evolve based on attributes:", canEvolve);

        // Update evolution cache
        evolutionCheckCacheRef.current = {
          lastChecked: now,
          canEvolve:
            canEvolve &&
            secondsSinceLastEvolution >= evolutionSettings.timeToEvolve,
          timeToEvolve: evolutionSettings.timeToEvolve,
        };

        // Only evolve if attributes are good enough and enough time has passed
        if (
          canEvolve &&
          secondsSinceLastEvolution >= evolutionSettings.timeToEvolve
        ) {
          if (stage === PetStage.TEEN) {
            stage = PetStage.ADULT;
            lastEvolutionAge = secondsSinceLastEvolution;
            console.log("Pet evolved to ADULT!");
          } else if (stage === PetStage.CHILD) {
            stage = PetStage.TEEN;
            lastEvolutionAge = secondsSinceLastEvolution;
            console.log("Pet evolved to TEEN!");
          } else if (stage === PetStage.BABY) {
            stage = PetStage.CHILD;
            lastEvolutionAge = secondsSinceLastEvolution;
            console.log("Pet evolved to CHILD!");
          } else if (stage === PetStage.EGG) {
            stage = PetStage.BABY;
            lastEvolutionAge = secondsSinceLastEvolution;
            console.log("Egg hatched to BABY!");
          }
        }
      }

      // Update attributes with age
      const finalAttributes = {
        ...updatedAttributes,
        age: age,
      };

      return {
        ...prevPet,
        stage,
        age,
        lastEvolutionAge,
        attributes: finalAttributes,
      };
    });
  }, [pet]);

  // Create a new pet
  const createPet = (name: string, petType: PetType = PetType.CAT) => {
    const now = Date.now();

    const newPet: Pet = {
      id: generateId(),
      name,
      type: petType.toString(),
      stage: PetStage.EGG,
      attributes: {
        health: 100,
        happiness: 100,
        hunger: 100,
        energy: 100,
        age: 0,
        lastUpdated: now,
      },
      birthDate: now,
      lastEvolutionAge: 0,
      age: 0,
      createdAt: now,
      lastInteraction: now,
    };

    setPet(newPet);
    console.log("New pet created:", newPet);
  };

  // Feed the pet
  const feedPet = (foodType: "regular" | "treat" | "healthy") => {
    if (!pet) return;

    setPet((prevPet) => {
      if (!prevPet) return null;

      let hungerIncrease = 0;
      let happinessIncrease = 0;
      let healthIncrease = 0;

      switch (foodType) {
        case "regular":
          hungerIncrease = 20;
          break;
        case "treat":
          hungerIncrease = 10;
          happinessIncrease = 15;
          break;
        case "healthy":
          hungerIncrease = 15;
          healthIncrease = 10;
          break;
      }

      return {
        ...prevPet,
        attributes: {
          ...prevPet.attributes,
          hunger: Math.min(100, prevPet.attributes.hunger + hungerIncrease),
          happiness: Math.min(
            100,
            prevPet.attributes.happiness + happinessIncrease
          ),
          health: Math.min(100, prevPet.attributes.health + healthIncrease),
          lastUpdated: Date.now(),
        },
      };
    });
  };

  // Play with the pet
  const playWithPet = () => {
    if (!pet) return;

    setPet((prevPet) => {
      if (!prevPet) return null;

      return {
        ...prevPet,
        attributes: {
          ...prevPet.attributes,
          happiness: Math.min(100, prevPet.attributes.happiness + 20),
          energy: Math.max(0, prevPet.attributes.energy - 10),
          hunger: Math.max(0, prevPet.attributes.hunger - 5),
          lastUpdated: Date.now(),
        },
      };
    });
  };

  // Clean the pet
  const cleanPet = () => {
    if (!pet) return;

    setPet((prevPet) => {
      if (!prevPet) return null;

      return {
        ...prevPet,
        attributes: {
          ...prevPet.attributes,
          health: Math.min(100, prevPet.attributes.health + 15),
          lastUpdated: Date.now(),
        },
      };
    });
  };

  // Put the pet to sleep
  const putPetToSleep = () => {
    if (!pet) return;

    setPet((prevPet) => {
      if (!prevPet) return null;

      return {
        ...prevPet,
        attributes: {
          ...prevPet.attributes,
          energy: Math.min(100, prevPet.attributes.energy + 50),
          hunger: Math.max(0, prevPet.attributes.hunger - 5),
          lastUpdated: Date.now(),
        },
      };
    });
  };

  // Manually evolve the pet (for testing or when triggered by UI)
  const evolvePet = () => {
    if (!pet) return;

    const petType = pet.type as PetType;
    const petStage = pet.stage as PetStage;

    // Get evolution settings for this pet type and stage
    const evolutionSettings = getEvolutionSettings(petType, petStage);

    // Check if attributes are good enough for evolution
    const canEvolve =
      pet.attributes.hunger > evolutionSettings.requiredAttributes.hunger &&
      pet.attributes.happiness >
        evolutionSettings.requiredAttributes.happiness &&
      pet.attributes.health > evolutionSettings.requiredAttributes.health &&
      pet.attributes.energy > evolutionSettings.requiredAttributes.energy;

    // Only evolve if attributes are good enough or if it's an egg (eggs always evolve)
    if (canEvolve || pet.stage === PetStage.EGG) {
      let nextStage = pet.stage;

      // Determine the next stage
      switch (pet.stage) {
        case PetStage.EGG:
          nextStage = PetStage.BABY;
          break;
        case PetStage.BABY:
          nextStage = PetStage.CHILD;
          break;
        case PetStage.CHILD:
          nextStage = PetStage.TEEN;
          break;
        case PetStage.TEEN:
          nextStage = PetStage.ADULT;
          break;
        case PetStage.ADULT:
          // Already at max evolution
          console.log("Pet is already at max evolution");
          return;
      }

      // Update the pet with the new stage
      const now = Date.now();
      const secondsSinceBirth = (now - pet.birthDate) / 1000;

      setPet((prevPet) => {
        if (!prevPet) return null;

        console.log(`Pet evolved from ${prevPet.stage} to ${nextStage}!`);

        return {
          ...prevPet,
          stage: nextStage,
          lastEvolutionAge: secondsSinceBirth,
        };
      });
    } else {
      console.log("Pet cannot evolve yet - attributes are too low");
    }
  };

  return (
    <PetContext.Provider
      value={{
        pet,
        setPet,
        isLoading,
        createPet,
        feedPet,
        playWithPet,
        cleanPet,
        putPetToSleep,
        updatePetAttributes,
        evolvePet,
        canPetEvolve,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

// Custom hook to use the pet context
export const usePet = () => useContext(PetContext);
