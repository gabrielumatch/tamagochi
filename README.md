# Tamagotchi App

A virtual pet game built with React Native and Expo, where you can raise and care for your digital pet. Experience the joy and responsibility of pet ownership in a fun, digital format!

## Game Overview

In this Tamagotchi app, you'll take care of a virtual pet through its entire lifecycle:

1. **Birth**: Start with an egg that hatches into a baby pet
2. **Growth**: Watch your pet evolve through baby, child, teen, and adult stages
3. **Care**: Maintain your pet's health, happiness, hunger, and energy levels
4. **Play**: Engage with your pet through mini-games to increase happiness
5. **Shop**: Purchase items to enhance your pet's life

Your pet's well-being depends on your regular care and attention. Neglect can lead to illness or your pet running away, while proper care leads to a happy, healthy pet that evolves into more advanced stages.

## Game Mechanics

### Pet Attributes

- **Health**: Overall physical condition (0-100%)
- **Happiness**: Emotional well-being (0-100%)
- **Hunger**: Satiation level (0-100%, where 100% means full)
- **Energy**: Rest and activity level (0-100%)
- **Age**: Measured in days since hatching

### Attribute Decrease Rates

Your pet's attributes naturally decrease over time, even when you're not playing:

- **Hunger**: Decreases by 5 points per hour
- **Happiness**: Decreases by 3 points per hour
- **Energy**: Decreases by 2 points per hour when awake
- **Health**: Decreases if other attributes remain low for extended periods

When any attribute falls below 20%, your pet will become sad and may develop health issues.

### Care Actions

- **Feeding**: Provide regular food, treats, or healthy food to maintain hunger levels
- **Cleaning**: Keep your pet clean to prevent illness and maintain health
- **Sleep**: Put your pet to sleep to restore energy
- **Play**: Engage in games to increase happiness

### Evolution

Your pet will evolve through different stages based on age and care:

- Egg → Baby (after hatching)
- Baby → Child (after 2 days)
- Child → Teen (after 5 days)
- Teen → Adult (after 10 days)

### Economy & Coins

- **Starting Balance**: 100 coins when you create a new pet
- **Earning Coins**:

  - Completing mini-games: 10-50 coins depending on performance
  - Daily login bonus: 20 coins
  - Pet milestone achievements: 50-100 coins
  - Taking good care of your pet: 5 coins per day when all attributes stay above 70%

- **Shop Prices**:
  - Basic items: 50-100 coins
  - Premium items: 150-300 coins
  - Special/Rare items: 500+ coins

## Features

- **Pet Creation**: Choose from different pet types and give your pet a name
- **Pet Care**: Feed, clean, and put your pet to sleep to maintain its health
- **Play Games**: Engage with your pet through various mini-games
- **Shop**: Purchase items for your pet using coins earned through gameplay
- **Pet Evolution**: Watch your pet grow through different life stages
- **Settings**: Customize app preferences and manage notifications

## Screenshots

(Screenshots will be added here)

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tamagotchi-app.git
cd tamagotchi-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npx expo start --clear
```

4. Run on your device or emulator:
   - Scan the QR code with the Expo Go app (Android) or Camera app (iOS)
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator

### Troubleshooting

If you encounter bundling issues:

- Clear the cache with `npx expo start --clear`
- Ensure all dependencies are properly installed
- Check that your environment variables are set correctly

## Game Tutorial

### Creating Your Pet

1. When you first launch the app, you'll be directed to the pet creation screen
2. Choose a pet type (Cat, Dog, or Bird) - each has different characteristics
3. Name your pet
4. Tap "Create Pet" to begin your journey

### Home Screen

The home screen displays:

- Your pet and its current mood
- Status bars showing health, happiness, hunger, and energy levels
- Quick action buttons for feeding, playing, and shopping
- Pet stats including stage, age, and coins

### Caring for Your Pet

#### Feeding

1. Navigate to the "Care" tab
2. Choose from three food types:
   - Regular Food: +20 Hunger
   - Treat: +10 Hunger, +15 Happiness
   - Healthy Food: +15 Hunger, +10 Health

#### Cleaning

1. Navigate to the "Care" tab
2. Tap "Clean Pet" to increase health by 15 points

#### Sleeping

1. Navigate to the "Care" tab
2. Tap "Put to Sleep" to restore 50 energy points

### Playing Games

1. Navigate to the "Play" tab
2. Choose from available mini-games:
   - Catch Game: Tap to catch falling items (earn 10-30 coins)
   - Memory Game: Match pairs of cards (earn 15-40 coins)
   - Dance Game: Follow the rhythm pattern (earn 20-50 coins)
3. Complete games to increase happiness and earn coins
4. Each game increases your pet's happiness by 20 points
5. Playing also decreases energy by 10 points and hunger by 5 points
6. You can play up to 5 games per day

### Shopping

1. Navigate to the "Shop" tab
2. Browse items by category:
   - **Food Items** (50-100 coins):
     - Premium Food: +30 Hunger, +5 Happiness
     - Gourmet Treat: +15 Hunger, +25 Happiness
     - Vitamin Supplement: +10 Hunger, +20 Health
   - **Toys** (100-200 coins):
     - Basic Toy: +25 Happiness
     - Interactive Toy: +40 Happiness, -15 Energy
     - Educational Toy: +30 Happiness, +5 Health
   - **Decorations** (150-300 coins):
     - Pet Bed: Improves sleep quality (+10% Energy recovery)
     - Play Area: Increases happiness gain from playing (+15%)
     - Grooming Station: Improves cleaning effectiveness (+20%)
   - **Special Items** (500+ coins):
     - Evolution Boost: Speeds up evolution by 1 day
     - Attribute Potion: Instantly raises all attributes by 30 points
     - Rare Costume: Unique appearance for your pet
3. Purchase items using coins earned through gameplay
4. Items will appear in your inventory for use with your pet
5. Some items are consumable (one-time use), while others are permanent

## Advanced Tips

- **Balance care activities**: Don't focus solely on one attribute
- **Regular check-ins**: Pet attributes decrease over time, even when the app is closed
- **Evolution timing**: Plan your care to ensure your pet is healthy when reaching evolution milestones
- **Coin management**: Save coins for special items that provide multiple benefits
- **Attribute thresholds**: Keep attributes above 50% for optimal growth and evolution
- **Energy management**: Put your pet to sleep when energy falls below 30% to prevent health issues
- **Illness prevention**: Clean your pet regularly and maintain health above 40% to prevent illness

### Recommended Daily Routine

For optimal pet care, follow this daily routine:

**Morning:**

1. Feed your pet (Regular Food or Healthy Food)
2. Clean your pet if health is below 80%
3. Play one game to boost happiness

**Afternoon:**

1. Check hunger levels and feed if below 50%
2. Play another game if energy allows
3. Purchase any needed items from the shop

**Evening:**

1. Feed your pet one last time (Treat for extra happiness)
2. Clean your pet again if needed
3. Put your pet to sleep to restore energy overnight

This routine ensures all attributes remain balanced while maximizing your pet's growth and happiness.

## Project Structure

```
tamagotchi-app/
├── app/                    # App screens and navigation
│   ├── (tabs)/             # Tab-based screens
│   ├── (create)/           # Pet creation screens
│   └── index.tsx           # Entry point/splash screen
├── assets/                 # Static assets
│   └── fonts/              # Custom fonts
├── components/             # Reusable components
│   ├── pet/                # Pet-specific components
│   └── ui/                 # UI components
├── constants/              # App constants
├── contexts/               # React contexts
└── README.md               # Project documentation
```

## Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development platform
- **TypeScript**: Type-safe JavaScript
- **Expo Router 4**: File-based navigation
- **AsyncStorage**: Local data persistence

## Features to Add

- More pet types and customization options
- Additional mini-games
- Social features to interact with friends' pets
- Achievements and rewards system
- More detailed pet statistics and history

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the classic Tamagotchi virtual pets from the 1990s
- Built with modern React Native and Expo technologies
