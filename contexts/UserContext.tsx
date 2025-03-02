import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define user interface
export interface User {
  coins: number;
  items: string[];
  settings: {
    notificationsEnabled: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    theme: "light" | "dark" | "system";
  };
  achievements: {
    [key: string]: boolean;
  };
}

// Define context interface
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addItem: (itemId: string) => void;
  useItem: (itemId: string) => boolean;
  toggleNotifications: () => void;
  toggleSound: () => void;
  toggleVibration: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  unlockAchievement: (achievementId: string) => void;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  addCoins: () => {},
  spendCoins: () => false,
  addItem: () => {},
  useItem: () => false,
  toggleNotifications: () => {},
  toggleSound: () => {},
  toggleVibration: () => {},
  setTheme: () => {},
  unlockAchievement: () => {},
});

// Create provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // Create default user if none exists
          const defaultUser: User = {
            coins: 100,
            items: [],
            settings: {
              notificationsEnabled: true,
              soundEnabled: true,
              vibrationEnabled: true,
              theme: "system",
            },
            achievements: {},
          };
          setUser(defaultUser);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user data to storage whenever it changes
  useEffect(() => {
    const saveUser = async () => {
      if (user) {
        try {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
          console.error("Failed to save user data:", error);
        }
      }
    };

    saveUser();
  }, [user]);

  // Add coins to user's balance
  const addCoins = (amount: number) => {
    if (!user) return;
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        coins: prevUser.coins + amount,
      };
    });
  };

  // Spend coins from user's balance
  const spendCoins = (amount: number): boolean => {
    if (!user) return false;
    if (user.coins < amount) return false;

    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        coins: prevUser.coins - amount,
      };
    });
    return true;
  };

  // Add an item to user's inventory
  const addItem = (itemId: string) => {
    if (!user) return;
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        items: [...prevUser.items, itemId],
      };
    });
  };

  // Use an item from user's inventory
  const useItem = (itemId: string): boolean => {
    if (!user) return false;
    if (!user.items.includes(itemId)) return false;

    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        items: prevUser.items.filter((id) => id !== itemId),
      };
    });
    return true;
  };

  // Toggle notification settings
  const toggleNotifications = () => {
    if (!user) return;
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        settings: {
          ...prevUser.settings,
          notificationsEnabled: !prevUser.settings.notificationsEnabled,
        },
      };
    });
  };

  // Toggle sound settings
  const toggleSound = () => {
    if (!user) return;
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        settings: {
          ...prevUser.settings,
          soundEnabled: !prevUser.settings.soundEnabled,
        },
      };
    });
  };

  // Toggle vibration settings
  const toggleVibration = () => {
    if (!user) return;
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        settings: {
          ...prevUser.settings,
          vibrationEnabled: !prevUser.settings.vibrationEnabled,
        },
      };
    });
  };

  // Set theme
  const setTheme = (theme: "light" | "dark" | "system") => {
    if (!user) return;
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        settings: {
          ...prevUser.settings,
          theme,
        },
      };
    });
  };

  // Unlock an achievement
  const unlockAchievement = (achievementId: string) => {
    if (!user) return;
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        achievements: {
          ...prevUser.achievements,
          [achievementId]: true,
        },
      };
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        addCoins,
        spendCoins,
        addItem,
        useItem,
        toggleNotifications,
        toggleSound,
        toggleVibration,
        setTheme,
        unlockAchievement,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
