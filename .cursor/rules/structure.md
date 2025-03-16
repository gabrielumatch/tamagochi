# Tamagotchi App Architecture

## Overview

This document outlines the architecture of our Tamagotchi mobile application built with Expo 52 and React Router 4. The architecture follows modern best practices for React Native development, emphasizing maintainability, performance, and developer experience.

## Technology Stack

### Core Technologies

- **Expo SDK 52**: Provides a managed workflow for React Native development
- **React 18.3.1**: Utilizes the latest React features including concurrent rendering
- **React Native 0.76.7**: The foundation of our cross-platform mobile application
- **TypeScript**: For type safety and improved developer experience
- **Expo Router 4**: File-based routing system built on top of React Navigation 7

### Key Dependencies

- **Expo Modules**:

  - `expo-constants`: For accessing device and app constants
  - `expo-linking`: For deep linking capabilities
  - `expo-notifications`: For local and push notifications
  - `expo-splash-screen`: For customizing the splash screen
  - `expo-status-bar`: For managing the status bar appearance
  - `expo-haptics`: For haptic feedback
  - `expo-blur`: For UI blur effects
  - `expo-font`: For custom font loading
  - `expo-web-browser`: For opening web links

- **UI and Animation**:
  - `react-native-reanimated`: For fluid animations
  - `react-native-gesture-handler`: For advanced gesture handling
  - `@expo/vector-icons`: For icon sets

## Project Structure

```
tamagotchi/
├── app/                   # Main application code using file-based routing
│   ├── (tabs)/            # Tab-based navigation routes
│   │   ├── home.tsx       # Home screen with pet display
│   │   ├── care.tsx       # Care interactions screen
│   │   ├── play.tsx       # Games and activities screen
│   │   ├── shop.tsx       # In-game store screen
│   │   └── settings.tsx   # App settings screen
│   ├── _layout.tsx        # Root layout component
│   ├── index.tsx          # Entry point redirect
│   └── +not-found.tsx     # 404 page
├── components/            # Reusable UI components
│   ├── ui/                # Basic UI elements
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── pet/               # Pet-related components
│   │   ├── PetDisplay.tsx
│   │   ├── StatusBars.tsx
│   │   └── ...
│   └── ...
├── hooks/                 # Custom React hooks
│   ├── usePetState.ts
│   ├── useNotifications.ts
│   └── ...
├── constants/             # App constants and configuration
│   ├── Colors.ts
│   ├── Layout.ts
│   └── PetAttributes.ts
├── contexts/              # React contexts for state management
│   ├── PetContext.tsx
│   └── UserContext.tsx
├── services/              # Business logic and API services
│   ├── petEvolution.ts
│   ├── timeManager.ts
│   └── storage.ts
├── utils/                 # Utility functions
│   ├── timeUtils.ts
│   └── attributeCalculator.ts
├── assets/                # Static assets
│   ├── images/
│   ├── animations/
│   └── sounds/
├── app.json               # Expo configuration
└── package.json           # Dependencies and scripts
```

## Architecture Patterns

### File-Based Routing with Expo Router 4

- Routes are defined by the file structure in the `app/` directory
- Nested routes use directory nesting
- Special files like `_layout.tsx` define shared layouts
- Dynamic routes use `[param].tsx` naming convention

### State Management

- **Local Component State**: For UI-specific state
- **React Context**: For shared state across components
- **AsyncStorage**: For persistent local storage
- **Zustand** (optional): For more complex state management needs

### Data Flow

1. **User Interactions**: Captured by UI components
2. **State Updates**: Processed through context providers or local state
3. **Business Logic**: Handled by service modules
4. **Persistence**: Managed by storage services
5. **UI Updates**: Reflected back to the user through reactive components

## Key Architectural Decisions

### Offline-First Approach

- The app functions fully offline with local storage
- Optional cloud synchronization for backup and multi-device support

### Performance Optimizations

- Memoization of expensive components with `React.memo`
- Virtualized lists for performance with `FlatList`
- Optimized animations with `react-native-reanimated`
- Asset preloading for smooth transitions

### Code Organization

- Feature-based organization within the app directory
- Shared components in the components directory
- Business logic separated into service modules

## Deployment Pipeline

- **Development**: Local Expo development server
- **Testing**: Expo EAS Update for QA builds
- **Production**: Native builds via EAS Build for App Store and Google Play

## Best Practices Implementation

### Expo 52 Best Practices

- Using the new Expo Router 4 for file-based routing
- Leveraging Expo's development client for faster iteration
- Implementing proper splash screen and icon handling
- Using Expo's notification system for engagement

### React Router 4 (via Expo Router) Best Practices

- Implementing nested layouts for consistent UI
- Using route groups for logical separation
- Implementing proper error boundaries and fallbacks
- Utilizing route params for dynamic content

### React Native Best Practices

- Proper component composition and reusability
- Consistent styling patterns
- Performance optimization for animations and lists
- Accessibility considerations throughout the app

## Future Architectural Considerations

- Migration path to Expo SDK 53+ when available
- Potential implementation of server components when supported
- Exploration of React Native New Architecture benefits

---

_This architecture document is a living document and will be updated as the application evolves._
