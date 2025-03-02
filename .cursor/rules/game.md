# Tamagotchi App Rules

## Overview

This document outlines the rules and gameplay mechanics of our Tamagotchi mobile application built with Expo 52 and React Router 4. The app simulates a virtual pet experience where users care for their digital companion through various interactions.

## Core Gameplay

### Pet Lifecycle

1. **Birth**: Each Tamagotchi begins as an egg that hatches after initial setup
2. **Growth Stages**: Pets evolve through multiple stages (baby, child, teen, adult)
3. **Lifespan**: A Tamagotchi's life duration depends on how well it's cared for

### Pet Attributes

- **Health**: Overall physical condition (0-100%)
- **Happiness**: Emotional well-being (0-100%)
- **Hunger**: Satiation level (0-100%, where 100% means full)
- **Energy**: Rest and activity level (0-100%)
- **Age**: Measured in days since hatching

## User Interactions

### Feeding

- Regular meals must be provided to maintain hunger levels
- Different food types affect attributes differently:
  - Regular food: +20 Hunger
  - Treats: +10 Hunger, +15 Happiness
  - Healthy food: +15 Hunger, +10 Health

### Playing

- Games and activities increase happiness
- Each play session:
  - +20 Happiness
  - -10 Energy
  - -5 Hunger

### Cleaning

- Maintaining cleanliness prevents illness
- Cleaning adds +15 Health

### Sleep

- Putting your Tamagotchi to sleep restores energy
- Sleep cycle: +50 Energy, -5 Hunger

## Time Mechanics

### Real-time Progression

- Attributes decrease over real time even when the app is closed
- Hunger: -5 per hour
- Happiness: -3 per hour
- Energy: -2 per hour when awake

### Notifications

- The app sends notifications when your pet needs attention
- Critical alerts when attributes fall below 20%

## Consequences

### Neglect

- Extended periods of neglect lead to illness
- Severe neglect can result in your Tamagotchi running away or passing away

### Rewards

- Proper care unlocks:
  - New pet evolution paths
  - Customization options
  - Special items and environments

## App Navigation

- **Home**: View your Tamagotchi and its status
- **Care**: Access feeding, cleaning, and sleep options
- **Play**: Games and activities
- **Shop**: Purchase items with in-game currency
- **Settings**: Adjust notification preferences and app settings

## Saving & Progress

- Progress is automatically saved locally
- Optional cloud sync for cross-device play (premium feature)

## Accessibility

- The app includes accessibility features for all users
- High contrast mode and screen reader support
- Customizable interaction timings

---

_These rules are subject to updates and enhancements as the app evolves. Check the in-app help section for the most current information._
