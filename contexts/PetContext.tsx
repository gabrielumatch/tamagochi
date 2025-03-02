import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EVOLUTION,
  ATTRIBUTE_DECREASE,
  CARE_ACTIONS,
} from "../constants/GameRules";

// Define pet growth stages
export enum PetStage {
  EGG = "egg",
  BABY = "baby",
  CHILD = "child",
  TEEN = "teen",
  ADULT = "adult",
}

// Define pet attributes interface
export interface PetAttributes {
  health: number;
  happiness: number;
  hunger: number;
  energy: number;
  age: number;
  lastUpdated: number;
}

// Helper function to generate a unique ID
const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Define pet interface
export interface Pet {
  id: string;
  name: string;
  type: string;
  stage: string;
  attributes: PetAttributes;
  birthDate: number;
  lastEvolutionAge: number;
  age: number;
  createdAt: number;
  lastInteraction: number;
}

// Define context interface
interface PetContextType {
  pet: Pet | null;
  setPet: React.Dispatch<React.SetStateAction<Pet | null>>;
  isLoading: boolean;
  createPet: (name: string) => void;
  feedPet: (foodType: "regular" | "treat" | "healthy") => void;
  playWithPet: () => void;
  cleanPet: () => void;
  putPetToSleep: () => void;
  updatePetAttributes: () => void;
  evolvePet: () => void;
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
});

// Create provider component
export const PetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Save pet data to storage whenever it changes
  useEffect(() => {
    const savePet = async () => {
      if (pet) {
        try {
          await AsyncStorage.setItem("pet", JSON.stringify(pet));
        } catch (error) {
          console.error("Failed to save pet data:", error);
        }
      }
    };

    savePet();
  }, [pet]);

  // Update pet attributes based on time passed
  const updatePetAttributes = () => {
    if (!pet) return;

    const now = Date.now();
    const hoursPassed = (now - pet.attributes.lastUpdated) / (1000 * 60 * 60);

    if (hoursPassed < 0.01) return; // Only update if at least 36 seconds have passed

    // Calculate attribute decreases based on time using constants
    const hungerDecrease = Math.min(
      pet.attributes.hunger,
      ATTRIBUTE_DECREASE.HUNGER * hoursPassed
    );
    const happinessDecrease = Math.min(
      pet.attributes.happiness,
      ATTRIBUTE_DECREASE.HAPPINESS * hoursPassed
    );
    const energyDecrease = Math.min(
      pet.attributes.energy,
      ATTRIBUTE_DECREASE.ENERGY * hoursPassed
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
        lastUpdated: now,
      };

      // Check if pet should evolve based on age
      const daysSinceBirth = (now - prevPet.birthDate) / (1000 * 60 * 60 * 24);
      let stage = prevPet.stage;
      let lastEvolutionAge = prevPet.lastEvolutionAge;
      const age = Math.floor(daysSinceBirth);

      // Check if attributes are good enough for evolution
      const canEvolve =
        updatedAttributes.hunger >
          EVOLUTION.REQUIREMENTS.MIN_ATTRIBUTE_PERCENTAGE &&
        updatedAttributes.happiness >
          EVOLUTION.REQUIREMENTS.MIN_ATTRIBUTE_PERCENTAGE &&
        updatedAttributes.health >
          EVOLUTION.REQUIREMENTS.MIN_ATTRIBUTE_PERCENTAGE &&
        updatedAttributes.energy >
          EVOLUTION.REQUIREMENTS.MIN_ATTRIBUTE_PERCENTAGE;

      // Only evolve if attributes are good enough
      if (canEvolve) {
        if (
          age >= EVOLUTION.DAYS_TO_EVOLVE.TEEN_TO_ADULT &&
          stage === PetStage.TEEN
        ) {
          stage = PetStage.ADULT;
          lastEvolutionAge = age;
        } else if (
          age >= EVOLUTION.DAYS_TO_EVOLVE.CHILD_TO_TEEN &&
          stage === PetStage.CHILD
        ) {
          stage = PetStage.TEEN;
          lastEvolutionAge = age;
        } else if (
          age >= EVOLUTION.DAYS_TO_EVOLVE.BABY_TO_CHILD &&
          stage === PetStage.BABY
        ) {
          stage = PetStage.CHILD;
          lastEvolutionAge = age;
        }
      }

      // Egg always evolves to baby after half a day, regardless of attributes
      if (age >= 0.5 && stage === PetStage.EGG) {
        stage = PetStage.BABY;
        lastEvolutionAge = age;
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
  };

  // Create a new pet
  const createPet = (name: string) => {
    const now = Date.now();
    const newPet: Pet = {
      id: generateId(),
      name,
      type: "default",
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

  // Function to manually evolve the pet (for testing)
  const evolvePet = () => {
    if (!pet) return;

    setPet((prevPet) => {
      if (!prevPet) return null;

      let newStage = prevPet.stage;

      switch (prevPet.stage) {
        case PetStage.EGG:
          newStage = PetStage.BABY;
          break;
        case PetStage.BABY:
          newStage = PetStage.CHILD;
          break;
        case PetStage.CHILD:
          newStage = PetStage.TEEN;
          break;
        case PetStage.TEEN:
          newStage = PetStage.ADULT;
          break;
        case PetStage.ADULT:
          // Already at max evolution
          return prevPet;
      }

      return {
        ...prevPet,
        stage: newStage,
        lastEvolutionAge: prevPet.age,
      };
    });
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
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

// Custom hook to use the pet context
export const usePet = () => useContext(PetContext);
