# Tamagotchi App Rules

## Overview

This document outlines the rules and gameplay mechanics of our Tamagotchi mobile application built with Expo 52 and React Router 4. The app simulates a virtual pet experience where users care for their digital companion through various interactions.

## Core Gameplay

### Pet Lifecycle

1. **Birth**: Each Tamagotchi begins as an egg that hatches after initial setup
2. **Growth Stages**: Pets evolve through multiple stages with specific timeframes:
   - Egg → Baby (after hatching)
   - Baby → Child (after 2 days)
   - Child → Teen (after 5 days)
   - Teen → Adult (after 10 days)
3. **Lifespan**: A Tamagotchi's life duration depends on how well it's cared for

### Pet Attributes

- **Health**: Overall physical condition (0-100%)
- **Happiness**: Emotional well-being (0-100%)
- **Hunger**: Satiation level (0-100%, where 100% means full)
- **Energy**: Rest and activity level (0-100%)
- **Age**: Measured in days since hatching

### Attribute Decrease Rates

- **Hunger**: Decreases by 5 points per hour
- **Happiness**: Decreases by 3 points per hour
- **Energy**: Decreases by 2 points per hour when awake
- **Health**: Decreases if other attributes remain low for extended periods

## User Interactions

### Feeding

- Regular meals must be provided to maintain hunger levels
- Different food types affect attributes differently:
  - Regular food: +20 Hunger
  - Treats: +10 Hunger, +15 Happiness
  - Healthy food: +15 Hunger, +10 Health
  - Premium Food: +30 Hunger, +5 Happiness
  - Gourmet Treat: +15 Hunger, +25 Happiness
  - Vitamin Supplement: +10 Hunger, +20 Health

### Playing

- Games and activities increase happiness
- Each play session:
  - +20 Happiness
  - -10 Energy
  - -5 Hunger
- Game rewards:
  - Catch Game: 10-30 coins
  - Memory Game: 15-40 coins
  - Dance Game: 20-50 coins
- Daily limit: 5 games per day

### Cleaning

- Maintaining cleanliness prevents illness
- Cleaning adds +15 Health

### Sleep

- Putting your Tamagotchi to sleep restores energy
- Sleep cycle: +50 Energy, -5 Hunger

## Economy System

### Coins

- **Starting Balance**: 100 coins when creating a new pet
- **Earning Methods**:
  - Mini-games: 10-50 coins based on performance
  - Daily login: 20 coins
  - Milestones: 50-100 coins
  - Attribute maintenance: 5 coins daily when all attributes above 70%

### Shop Items

- **Food Items** (50-100 coins):
  - Premium Food: +30 Hunger, +5 Happiness
  - Gourmet Treat: +15 Hunger, +25 Happiness
  - Vitamin Supplement: +10 Hunger, +20 Health
- **Toys** (100-200 coins):
  - Basic Toy: +25 Happiness
  - Interactive Toy: +40 Happiness, -15 Energy
  - Educational Toy: +30 Happiness, +5 Health
- **Decorations** (150-300 coins):
  - Pet Bed: +10% Energy recovery
  - Play Area: +15% happiness gain from playing
  - Grooming Station: +20% cleaning effectiveness
- **Special Items** (500+ coins):
  - Evolution Boost: -1 day from evolution timer
  - Attribute Potion: +30 to all attributes
  - Rare Costume: Unique appearance

## Time Mechanics

### Real-time Progression

- Attributes decrease over real time even when the app is closed
- Hunger: -5 per hour
- Happiness: -3 per hour
- Energy: -2 per hour when awake

### Evolution Timer

- Each stage has a specific duration before evolution is possible
- Evolution timer is visible to the user
- Timer continues to count down even when app is closed
- Evolution requires all attributes to be above 40% when timer reaches zero
- If conditions aren't met, evolution is delayed until attributes improve

### Notifications

- The app sends notifications when your pet needs attention
- Critical alerts when attributes fall below 20%
- Evolution notifications when your pet is ready to evolve

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
