import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SplashScreen, Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PetProvider } from "../contexts/PetContext";
import { UserProvider } from "../contexts/UserContext";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded or if there was an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // If the fonts haven't loaded and there's no error, return null to keep the splash screen
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // If there was an error loading the fonts, still render the app
  return (
    <UserProvider>
      <PetProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </PetProvider>
    </UserProvider>
  );
}
