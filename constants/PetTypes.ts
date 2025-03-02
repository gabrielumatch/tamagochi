/**
 * PetTypes.ts
 *
 * This file contains shared types and enums used across the application.
 * It helps break circular dependencies between PetContext and PetSettings.
 */

// Define pet growth stages
export enum PetStage {
  EGG = "egg",
  BABY = "baby",
  CHILD = "child",
  TEEN = "teen",
  ADULT = "adult",
  DEAD = "dead",
}

// Pet Types
export enum PetType {
  CAT = "cat",
  DOG = "dog",
  BIRD = "bird",
  DRAGON = "dragon",
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
