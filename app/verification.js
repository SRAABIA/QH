import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import axios from "axios";

const VerificationPage = () => {
  const [loading, setLoading] = useState(false);
  const frontImage = useSelector((state) => state.cnic.frontImage);
  const backImage = useSelector((state) => state.cnic.backImage);
  const cnicDetails = useSelector((state) => state.user.cnic);
  const router = useRouter();

  const handleCNICVerification = async () => {
    if (!backImage) {
      Alert.alert("Error", "Please upload the CNIC Back image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: backImage,
        name: "cnic_back.jpg",
        type: "image/jpeg",
      });

      // Send the image to the OCR server
      const response = await axios.post(
        "https://api.api-ninjas.com/v1/imagetotext", // OCR API endpoint
        formData,
        {
          headers: {
            "X-Api-Key": "k2UT2akAUcGEm/Hv9QAwxQ==WlIWF9QqzyOMHJzR", // API Key
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const normalizeCNIC = (cnic) => {
        return cnic.replace(/[^0-9]/g, "");
      };

      const normalizedCNICDetails = normalizeCNIC(cnicDetails);
      const normalizedExtractedCNIC = response.data
        .map((item) => normalizeCNIC(item.text))
        .join("");

      const isContinuousMatch = normalizedExtractedCNIC.includes(
        normalizedCNICDetails
      );
      if (isContinuousMatch) {
        Alert.alert("Verification Successful", "CNIC details match.");
        router.push("./home");
      } else {
        Alert.alert(
          "Verification Failed",
          "CNIC details do not match. Please Upload Back Image Again"
        );
      }
    } catch (error) {
      console.error("Verification Error:", error.message);
      Alert.alert("Error", "Failed to verify CNIC. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your CNIC</Text>

      {/* Show loader when loading is true */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleCNICVerification}
        >
          <Text style={styles.buttonText}>Verify CNIC</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
});

export default VerificationPage;
