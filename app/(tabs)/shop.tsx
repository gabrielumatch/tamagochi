import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
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

// Define shop item types
interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: "food" | "toy" | "decoration" | "special";
  effect?: string;
}

// Shop items data
const SHOP_ITEMS: ShopItem[] = [
  {
    id: "resurrection_stone",
    name: "Resurrection Stone",
    description: "A magical stone that can bring your pet back to life.",
    price: 200,
    icon: "gem",
    category: "special",
    effect: "Revives your pet if it dies",
  },
  {
    id: "evolution_boost",
    name: "Evolution Boost",
    description: "Speeds up your pet's evolution process.",
    price: 150,
    icon: "bolt",
    category: "special",
    effect: "Increases evolution speed by 50%",
  },
  {
    id: "premium_food",
    name: "Premium Food",
    description: "High-quality food that provides better nutrition.",
    price: 50,
    icon: "hamburger",
    category: "food",
    effect: "Increases hunger by 30 and health by 10",
  },
  {
    id: "super_treat",
    name: "Super Treat",
    description: "A special treat that makes your pet very happy.",
    price: 30,
    icon: "ice-cream",
    category: "food",
    effect: "Increases happiness by 25 and hunger by 15",
  },
  {
    id: "ball",
    name: "Bouncy Ball",
    description: "A fun toy for your pet to play with.",
    price: 40,
    icon: "baseball-ball",
    category: "toy",
    effect: "Increases happiness by 20 and decreases energy by 5",
  },
  {
    id: "puzzle",
    name: "Puzzle Toy",
    description: "A challenging toy that stimulates your pet's mind.",
    price: 60,
    icon: "puzzle-piece",
    category: "toy",
    effect: "Increases happiness by 15 and health by 5",
  },
  {
    id: "bed",
    name: "Luxury Bed",
    description: "A comfortable bed for your pet to rest in.",
    price: 100,
    icon: "bed",
    category: "decoration",
    effect: "Increases energy recovery rate by 10%",
  },
  {
    id: "background",
    name: "New Background",
    description: "Change the background of your pet's home.",
    price: 80,
    icon: "image",
    category: "decoration",
    effect: "Purely cosmetic, but looks great!",
  },
];

export default function ShopScreen() {
  const { pet, isLoading } = usePet();
  const { user, spendCoins, addItem } = useUser();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "food" | "toy" | "decoration" | "special"
  >("all");

  // If loading, show a loading message
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  // Filter items by category
  const filteredItems =
    selectedCategory === "all"
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((item) => item.category === selectedCategory);

  // Handle purchase
  const handlePurchase = (item: ShopItem) => {
    if (!user) return;

    // Check if user has enough coins
    if (user.coins < item.price) {
      Alert.alert(
        "Not Enough Coins",
        `You need ${item.price - user.coins} more coins to purchase this item.`,
        [{ text: "OK" }]
      );
      return;
    }

    // Confirm purchase
    Alert.alert(
      "Confirm Purchase",
      `Are you sure you want to purchase ${item.name} for ${item.price} coins?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Buy",
          onPress: () => {
            // Spend coins and add item to inventory
            const success = spendCoins(item.price);
            if (success) {
              addItem(item.id);
              Alert.alert(
                "Purchase Successful",
                `You have purchased ${item.name}!`,
                [{ text: "OK" }]
              );
            }
          },
        },
      ]
    );
  };

  // Check if user already owns an item
  const ownsItem = (itemId: string) => {
    return user?.items.includes(itemId) || false;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Shop Header */}
      <Card style={styles.headerCard}>
        <Text style={[styles.shopTitle, { color: colors.text }]}>Pet Shop</Text>
        <Text style={[styles.shopDescription, { color: colors.text + "99" }]}>
          Buy items for your pet using coins!
        </Text>
        <View style={styles.coinsContainer}>
          <FontAwesome5 name="coins" size={20} color={colors.warning} />
          <Text style={[styles.coinsText, { color: colors.text }]}>
            {user?.coins || 0} Coins
          </Text>
        </View>
      </Card>

      {/* Category Filters */}
      <View style={styles.categoryFilters}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "all" && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedCategory("all")}
        >
          <Text
            style={[
              styles.categoryText,
              { color: selectedCategory === "all" ? "#FFFFFF" : colors.text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "food" && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedCategory("food")}
        >
          <Text
            style={[
              styles.categoryText,
              { color: selectedCategory === "food" ? "#FFFFFF" : colors.text },
            ]}
          >
            Food
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "toy" && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedCategory("toy")}
        >
          <Text
            style={[
              styles.categoryText,
              { color: selectedCategory === "toy" ? "#FFFFFF" : colors.text },
            ]}
          >
            Toys
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "decoration" && {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={() => setSelectedCategory("decoration")}
        >
          <Text
            style={[
              styles.categoryText,
              {
                color:
                  selectedCategory === "decoration" ? "#FFFFFF" : colors.text,
              },
            ]}
          >
            Decor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "special" && {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={() => setSelectedCategory("special")}
        >
          <Text
            style={[
              styles.categoryText,
              {
                color: selectedCategory === "special" ? "#FFFFFF" : colors.text,
              },
            ]}
          >
            Special
          </Text>
        </TouchableOpacity>
      </View>

      {/* Shop Items */}
      <View style={styles.itemsContainer}>
        {filteredItems.map((item) => (
          <Card key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={styles.itemIconContainer}>
                <FontAwesome5
                  name={item.icon}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.itemTitleContainer}>
                <Text style={[styles.itemName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <View style={styles.itemPrice}>
                  <FontAwesome5 name="coins" size={12} color={colors.warning} />
                  <Text style={[styles.priceText, { color: colors.text }]}>
                    {item.price}
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={[styles.itemDescription, { color: colors.text + "99" }]}
            >
              {item.description}
            </Text>

            {item.effect && (
              <Text style={[styles.itemEffect, { color: colors.secondary }]}>
                Effect: {item.effect}
              </Text>
            )}

            <Button
              title={ownsItem(item.id) ? "Owned" : "Purchase"}
              onPress={() => handlePurchase(item)}
              type={ownsItem(item.id) ? "outline" : "primary"}
              disabled={ownsItem(item.id)}
              style={styles.purchaseButton}
            />
          </Card>
        ))}
      </View>
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
  headerCard: {
    padding: Layout.spacing.md,
    alignItems: "center",
  },
  shopTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  shopDescription: {
    fontSize: 16,
    marginTop: Layout.spacing.xs,
  },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Layout.spacing.md,
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: "#00000010",
  },
  coinsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: Layout.spacing.xs,
  },
  categoryFilters: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryButton: {
    flex: 1,
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    alignItems: "center",
    backgroundColor: "#00000010",
    marginHorizontal: 2,
  },
  categoryText: {
    fontWeight: "600",
  },
  itemsContainer: {
    gap: Layout.spacing.md,
  },
  itemCard: {
    padding: Layout.spacing.md,
  },
  itemHeader: {
    flexDirection: "row",
    marginBottom: Layout.spacing.sm,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00000010",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Layout.spacing.sm,
  },
  itemTitleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  priceText: {
    marginLeft: 4,
    fontWeight: "500",
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: Layout.spacing.sm,
  },
  itemEffect: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: Layout.spacing.md,
  },
  purchaseButton: {
    marginTop: Layout.spacing.xs,
  },
});
