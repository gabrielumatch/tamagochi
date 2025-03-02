import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Switch,
  Alert,
} from "react-native";
import { usePet } from "../../contexts/PetContext";
import { useUser } from "../../contexts/UserContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import Layout from "../../constants/Layout";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const { pet, setPet } = usePet();
  const { user, toggleNotifications, toggleSound, toggleVibration, setTheme } =
    useUser();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  // If no user data, show a loading message
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading settings...</Text>
      </View>
    );
  }

  // Reset pet data (for debugging/testing)
  const handleResetPet = () => {
    Alert.alert(
      "Reset Pet",
      "Are you sure you want to reset your pet? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("pet");
              setPet(null);
              Alert.alert("Success", "Your pet has been reset.");
            } catch (error) {
              console.error("Failed to reset pet:", error);
              Alert.alert("Error", "Failed to reset pet. Please try again.");
            }
          },
        },
      ]
    );
  };

  // Handle theme change
  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setTheme(theme);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* App Settings */}
      <Card style={styles.settingsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          App Settings
        </Text>

        {/* Notifications */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <FontAwesome5
              name="bell"
              size={18}
              color={colors.primary}
              style={styles.settingIcon}
            />
            <Text style={[styles.settingText, { color: colors.text }]}>
              Notifications
            </Text>
          </View>
          <Switch
            value={user.settings.notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={
              user.settings.notificationsEnabled ? colors.primary : "#f4f3f4"
            }
          />
        </View>

        {/* Sound */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <FontAwesome5
              name="volume-up"
              size={18}
              color={colors.primary}
              style={styles.settingIcon}
            />
            <Text style={[styles.settingText, { color: colors.text }]}>
              Sound Effects
            </Text>
          </View>
          <Switch
            value={user.settings.soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={user.settings.soundEnabled ? colors.primary : "#f4f3f4"}
          />
        </View>

        {/* Vibration */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <FontAwesome5
              name="mobile-alt"
              size={18}
              color={colors.primary}
              style={styles.settingIcon}
            />
            <Text style={[styles.settingText, { color: colors.text }]}>
              Vibration
            </Text>
          </View>
          <Switch
            value={user.settings.vibrationEnabled}
            onValueChange={toggleVibration}
            trackColor={{ false: "#767577", true: colors.primary + "80" }}
            thumbColor={
              user.settings.vibrationEnabled ? colors.primary : "#f4f3f4"
            }
          />
        </View>
      </Card>

      {/* Theme Settings */}
      <Card style={styles.settingsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>

        <View style={styles.themeButtons}>
          <Button
            title="Light"
            onPress={() => handleThemeChange("light")}
            type={user.settings.theme === "light" ? "primary" : "outline"}
            style={styles.themeButton}
          />
          <Button
            title="Dark"
            onPress={() => handleThemeChange("dark")}
            type={user.settings.theme === "dark" ? "primary" : "outline"}
            style={styles.themeButton}
          />
          <Button
            title="System"
            onPress={() => handleThemeChange("system")}
            type={user.settings.theme === "system" ? "primary" : "outline"}
            style={styles.themeButton}
          />
        </View>
      </Card>

      {/* About */}
      <Card style={styles.settingsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>

        <Text style={[styles.aboutText, { color: colors.text + "99" }]}>
          Tamagotchi App v1.0.0
        </Text>
        <Text style={[styles.aboutText, { color: colors.text + "99" }]}>
          A virtual pet game built with Expo and React Native.
        </Text>
        <Text
          style={[
            styles.aboutText,
            { color: colors.text + "99", marginBottom: Layout.spacing.md },
          ]}
        >
          Take care of your digital pet and watch it grow!
        </Text>

        <View style={styles.linksContainer}>
          <Button
            title="Privacy Policy"
            onPress={() => {}}
            type="outline"
            style={styles.linkButton}
          />
          <Button
            title="Terms of Service"
            onPress={() => {}}
            type="outline"
            style={styles.linkButton}
          />
        </View>
      </Card>

      {/* Debug Options */}
      <Card style={styles.settingsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Debug Options
        </Text>

        <Button
          title="Reset Pet Data"
          onPress={handleResetPet}
          type="danger"
          style={styles.dangerButton}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
  },
  settingsCard: {
    padding: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: Layout.spacing.md,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#00000010",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: Layout.spacing.sm,
    width: 24,
    textAlign: "center",
  },
  settingText: {
    fontSize: 16,
  },
  themeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  themeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  linkButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  dangerButton: {
    marginTop: Layout.spacing.sm,
  },
});
