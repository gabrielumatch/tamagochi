import { MMKV } from "react-native-mmkv";

// Create a default MMKV instance
const storage = new MMKV();

// In-memory cache for faster reads (though MMKV is already very fast)
const memoryCache: Record<string, any> = {};

// Helper functions for common operations with memory caching
export const getItem = <T>(key: string): T | null => {
  try {
    // Check memory cache first for instant retrieval
    if (memoryCache[key] !== undefined) {
      return memoryCache[key] as T;
    }

    // Get from MMKV
    const value = storage.getString(key);
    if (!value) return null;

    const parsedValue = JSON.parse(value) as T;
    // Store in memory cache for future reads
    memoryCache[key] = parsedValue;

    return parsedValue;
  } catch (error) {
    console.error(`Error retrieving stored value for key "${key}":`, error);
    return null;
  }
};

export const setItem = <T>(key: string, value: T): void => {
  try {
    // Update memory cache immediately
    memoryCache[key] = value;

    // Then persist to MMKV
    storage.set(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing value for key "${key}":`, error);
  }
};

export const removeItem = (key: string): void => {
  try {
    // Remove from memory cache
    delete memoryCache[key];

    // Remove from MMKV
    storage.delete(key);
  } catch (error) {
    console.error(`Error removing value for key "${key}":`, error);
  }
};

export const clearAll = (): void => {
  try {
    // Clear memory cache
    Object.keys(memoryCache).forEach((key) => {
      delete memoryCache[key];
    });

    // Clear MMKV
    storage.clearAll();
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

// Export the MMKV instance for direct access if needed
export { storage };
