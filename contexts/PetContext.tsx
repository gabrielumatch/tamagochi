import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Define pet interface
export interface Pet {
  name: string;
  stage: PetStage;
  attributes: PetAttributes;
  birthDate: number;
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

    // Calculate attribute decreases based on time
    const hungerDecrease = Math.min(pet.attributes.hunger, 5 * hoursPassed);
    const happinessDecrease = Math.min(
      pet.attributes.happiness,
      3 * hoursPassed
    );
    const energyDecrease = Math.min(pet.attributes.energy, 2 * hoursPassed);

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

      if (daysSinceBirth >= 10 && stage === PetStage.TEEN) {
        stage = PetStage.ADULT;
      } else if (daysSinceBirth >= 5 && stage === PetStage.CHILD) {
        stage = PetStage.TEEN;
      } else if (daysSinceBirth >= 2 && stage === PetStage.BABY) {
        stage = PetStage.CHILD;
      } else if (daysSinceBirth >= 0.5 && stage === PetStage.EGG) {
        stage = PetStage.BABY;
      }

      return {
        ...prevPet,
        stage,
        attributes: updatedAttributes,
        // Increment age if a day has passed
        attributes: {
          ...updatedAttributes,
          age: Math.floor(daysSinceBirth),
        },
      };
    });
  };

  // Create a new pet
  const createPet = (name: string) => {
    const newPet: Pet = {
      name,
      stage: PetStage.EGG,
      attributes: {
        health: 100,
        happiness: 100,
        hunger: 100,
        energy: 100,
        age: 0,
        lastUpdated: Date.now(),
      },
      birthDate: Date.now(),
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
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

// Custom hook to use the pet context
export const usePet = () => useContext(PetContext);
