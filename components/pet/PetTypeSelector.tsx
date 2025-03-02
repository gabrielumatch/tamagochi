import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { usePet } from "../../contexts/PetContext";
import { PetType } from "../../constants/PetTypes";

/**
 * A component that allows selecting different pet types for testing.
 */
const PetTypeSelector: React.FC = () => {
  const { pet, setPet } = usePet();

  const changePetType = (newType: PetType) => {
    if (!pet || !setPet) return;

    setPet((prevPet) => {
      if (!prevPet) return null;

      console.log(`Changing pet type from ${prevPet.type} to ${newType}`);

      return {
        ...prevPet,
        type: newType,
      };
    });
  };

  if (!pet) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Type:</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            pet.type === PetType.CAT && styles.activeButton,
          ]}
          onPress={() => changePetType(PetType.CAT)}
        >
          <Text style={styles.buttonText}>🐱 Cat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            pet.type === PetType.DOG && styles.activeButton,
          ]}
          onPress={() => changePetType(PetType.DOG)}
        >
          <Text style={styles.buttonText}>🐶 Dog</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            pet.type === PetType.BIRD && styles.activeButton,
          ]}
          onPress={() => changePetType(PetType.BIRD)}
        >
          <Text style={styles.buttonText}>🐦 Bird</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            pet.type === PetType.DRAGON && styles.activeButton,
          ]}
          onPress={() => changePetType(PetType.DRAGON)}
        >
          <Text style={styles.buttonText}>🐉 Dragon</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    padding: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 80,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#a0d0ff",
  },
  buttonText: {
    fontSize: 14,
  },
});

export default PetTypeSelector;
