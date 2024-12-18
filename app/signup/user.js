import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { updateField, saveUserData } from "../../src/store/userSlice";
import { colors } from "../../constants/Colors";
import { useTranslation } from "react-i18next"; // Localization
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function SignupScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showGenderModal, setShowGenderModal] = useState(false);

  const handleInputChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const previousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const date = selectedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      handleInputChange("dob", date);
    }
  };

  const handleSubmit = async () => {
    try {
      // Save form data to AsyncStorage
      await AsyncStorage.setItem("userFormData", JSON.stringify(user));
      alert("Form Submitted Successfully!");
      router.push("/upload/cnic");
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  const getSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem("userFormData");
      if (savedData !== null) {
        const parsedData = JSON.parse(savedData);
        console.log(parsedData);
        // Use this data to populate your form
      }
    } catch (error) {
      console.error("Error retrieving data", error);
    }
  };

  console.log(getSavedData());
  const clearData = async () => {
    try {
      await AsyncStorage.removeItem("userFormData");
    } catch (error) {
      console.error("Error clearing data", error);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressStep,
            step >= 1 ? styles.progressStepActive : null,
          ]}
        />
        <View
          style={[
            styles.progressStep,
            step >= 2 ? styles.progressStepActive : null,
          ]}
        />
      </View>
      {/* Step 1: Basic Information */}
      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.title}>{t("basicInfoTitle")}</Text>
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelLeft}>{t("nameLabel")}</Text>
              <Text style={styles.labelRight}>{t("nameLabelUrdu")}</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder={t("namePlaceholder")}
              value={user.name}
              onChangeText={(text) => handleInputChange("name", text)}
              textContentType="name"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelLeft}>{t("fatherNameLabel")}</Text>
              <Text style={styles.labelRight}>{t("fatherNameLabelUrdu")}</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder={t("fatherNamePlaceholder")}
              value={user.fatherName}
              onChangeText={(text) => handleInputChange("fatherName", text)}
              textContentType="name"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelLeft}>{t("cnicLabel")}</Text>
              <Text style={styles.labelRight}>{t("cnicLabelUrdu")}</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder={t("cnicPlaceholder")}
              value={user.cnic}
              onChangeText={(text) => handleInputChange("cnic", text)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelLeft}>{t("dob")}</Text>
              <Text style={styles.labelRight}>{t("dobLabelUrdu")}</Text>
            </View>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {user.dob || t("dobPlaceholder")}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={user.dob ? new Date(user.dob) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()} // No future dates
              />
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={nextStep}>
            <Text style={styles.buttonText}>{t("nextButton")}</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Step 2: Additional Details */}
      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.title}>{t("additionalDetailsTitle")}</Text>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelLeft}>{t("genderLabel")}</Text>
              <Text style={styles.labelRight}>{t("genderLabelUrdu")}</Text>
            </View>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowGenderModal(true)}
            >
              <Text style={styles.inputText}>
                {user.gender || t("genderPlaceholder")}
              </Text>
            </TouchableOpacity>

            {/* Gender Selection Modal */}
            {showGenderModal && (
              <Modal
                transparent={true}
                animationType="slide"
                visible={showGenderModal}
                onRequestClose={() => setShowGenderModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{t("selectGender")}</Text>
                    {["Male", "Female", "Other"].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.modalOption}
                        onPress={() => {
                          handleInputChange("gender", option);
                          setShowGenderModal(false);
                        }}
                      >
                        <Text style={styles.modalOptionText}>{t(option)}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={styles.modalCancel}
                      onPress={() => setShowGenderModal(false)}
                    >
                      <Text style={styles.modalCancelText}>{t("cancel")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelLeft}>{t("countryLabel")}</Text>
              <Text style={styles.labelRight}>{t("countryLabelUrdu")}</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder={t("countryPlaceholder")}
              value={user.country}
              onChangeText={(text) => handleInputChange("country", text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelLeft}>{t("temporaryAddressLabel")}</Text>
              <Text style={styles.labelRight}>
                {t("temporaryAddressLabelUrdu")}
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder={t("temporaryAddressPlaceholder")}
              value={user.temporaryAddress}
              onChangeText={(text) =>
                handleInputChange("temporaryAddress", text)
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelLeft}>{t("permanentAddressLabel")}</Text>
              <Text style={styles.labelRight}>
                {t("permanentAddressLabelUrdu")}
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder={t("permanentAddressPlaceholder")}
              value={user.permanentAddress}
              onChangeText={(text) =>
                handleInputChange("permanentAddress", text)
              }
            />
          </View>

          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.button} onPress={previousStep}>
              <Text style={styles.buttonText}>{t("backButton")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{t("submitButton")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  progressStep: {
    width: "48%",
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
  },
  progressStepActive: {
    backgroundColor: colors.primary,
  },
  card: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textColor,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  labelLeft: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textColor,
    flex: 1,
    textAlign: "left",
  },
  labelRight: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textColor,
    flex: 1,
    textAlign: "right",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  inputText: {
    fontSize: 16,
    color: colors.textColor,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalOption: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    width: "100%",
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.textColor,
  },
  modalCancel: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ff5757",
    borderRadius: 5,
  },
  modalCancelText: {
    color: "#fff",
    fontSize: 16,
  },
  datePicker: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    fontSize: 16,
    color: colors.textColor,
  },
  button: {
    backgroundColor: colors.primary,
    height: 50,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});