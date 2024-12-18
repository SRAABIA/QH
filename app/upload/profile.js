import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { setProfileImage } from "../../src/store/profileSlice";
import { useRouter } from "expo-router";
const { width } = Dimensions.get("window");
import { useTranslation } from "react-i18next";
import { colors } from "../../constants/Colors";
const ProfilePictureScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const profileImage = useSelector((state) => state.profile.profileImage);

  // Function to save the image locally
  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const fileUri = URL.createObjectURL(file);
      dispatch(setProfileImage(fileUri));
      Alert.alert("Success", "Image uploaded successfully!");
    }
  };
  const saveImageLocally = async (imageUri) => {
    try {
      const fileName = imageUri.split("/").pop();
      const localUri = `${FileSystem.documentDirectory}${fileName}`;

      // Move the image to the local file system
      await FileSystem.moveAsync({
        from: imageUri,
        to: localUri,
      });

      dispatch(setProfileImage(localUri));

      Alert.alert("Success", "Image saved successfully!");
    } catch (error) {
      console.error("File save error:", error);
      Alert.alert("Error", "Failed to save the image.");
    }
  };

  // Function to handle image pick (either from gallery or camera)
  const handleImagePick = async (isCamera = false) => {
    try {
      let result;

      if (isCamera) {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
      }

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        await saveImageLocally(uri);
      }
    } catch (error) {
      console.error("ImagePicker Error:", error);
      Alert.alert("Error", "Failed to pick the image.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t("uploadProfilePicture")}</Text>
      <Text style={styles.title}>{t("uploadProfilePictureUrdu")}</Text>

      {/* Profile Picture */}
      <View style={styles.uploadContainer}>
        <Text style={styles.heading}>Profile Picture</Text>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => handleImagePick(false)} // Open gallery on tap
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.icon}>📷</Text> // Show camera icon if no image selected
          )}
        </TouchableOpacity>
        <Text style={styles.text}>{t("tapToUpload")}</Text>
        <Text style={styles.text}>{t("tapToUploadUrdu")}</Text>
        <TouchableOpacity
          style={styles.obutton}
          onPress={() => handleImagePick(true)} // Open camera to take a photo
        >
          <Text style={styles.buttonText}>{t("takePhoto")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("verification");
          }}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  obutton: {
    backgroundColor: colors.primary,
    marginTop: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  uploadContainer: {
    width: width - 40,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75, // Make the container circular
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Make the image circular
  },
  icon: {
    fontSize: 40,
  },
  text: {
    fontSize: 16,
    color: "black",
    marginBottom: 20,
  },
});

export default ProfilePictureScreen;
