import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../constants/Colors";

const SplashScreen = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("./phone/PhoneNumberScreen");
  };

  return (
    <View style={styles.container}>
       
      <Image
        source={require("../assets/images/logof.jpg")}
        style={styles.image}
      />
      <Text style={styles.welcomeText1}>QuickHelp</Text>
      <Text style={styles.welcomeText}>کوئیک ہیلپ - ہر ہنر کے لیے ایک موقع!"</Text>
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={handleGetStarted}
      >
      
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  image: {
    width: 350,
    height: 350,
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 25,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 20,
  },
  welcomeText1: {
    fontSize: 40,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 5,
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SplashScreen;
