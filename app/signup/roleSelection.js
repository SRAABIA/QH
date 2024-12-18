import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors } from "../../constants/Colors";
export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState(null);
  const { t } = useTranslation();
  const router = useRouter();

  // Function to handle role selection
  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    if (role === "user") {
      router.push("/signup/user");
    } else if (role === "employee") {
      router.push("/signup/user");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("roleSelectionTitle")}</Text>
      <Text style={styles.title}>{t("roleSelectionTitleUrdu")}</Text>

      {/* User Role Container */}
      <TouchableOpacity
        style={[
          styles.roleContainer,
          selectedRole === "user" && styles.selectedContainer, // Highlight selected container
        ]}
        onPress={() => handleRoleSelection("user")}
      >
        {/* Icon Container */}
        <View
          style={[
            styles.iconContainer,
            selectedRole === "user" && styles.selectedIconContainer,
          ]}
        >
          <Ionicons
            name={selectedRole === "user" ? "person" : "person-outline"}
            size={30}
            color={selectedRole === "user" ? "#ffffff" : "#000"}
          />
        </View>

        {/* Text Container */}
        <View style={styles.textContainer}>
          <Text style={styles.roleText}>{t("userRole")}</Text>
          <Text style={styles.roleText}>{t("userRoleUrdu")}</Text>
        </View>

        {selectedRole === "user" && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={colors.primary}
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>

      {/* Employee Role Container */}
      <TouchableOpacity
        style={[
          styles.roleContainer,
          selectedRole === "employee" && styles.selectedContainer, // Highlight selected container
        ]}
        onPress={() => handleRoleSelection("employee")}
      >
        {/* Icon Container */}
        <View
          style={[
            styles.iconContainer,
            selectedRole === "employee" && styles.selectedIconContainer,
          ]}
        >
          <Ionicons
            name={
              selectedRole === "employee" ? "briefcase" : "briefcase-outline"
            }
            size={30}
            color={selectedRole === "employee" ? "#ffffff" : "#000"}
          />
        </View>

        {/* Text Container */}
        <View style={styles.textContainer}>
          <Text style={styles.roleText}>{t("employeeRole")}</Text>
          <Text style={styles.roleText}>{t("employeeRoleUrdu")}</Text>
        </View>

        {selectedRole === "employee" && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={colors.primary}
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.white, // Using white from colors
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    color: colors.textColor, // Using black text color
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white, // Using white for the background
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary, // Using primary color for the border
    width: "80%",
    justifyContent: "space-between",
  },
  selectedContainer: {
    borderColor: colors.primary, // Highlight with primary color
    borderWidth: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Neutral background for the icon
    borderRadius: 8,
    marginRight: 15,
  },
  selectedIconContainer: {
    backgroundColor: colors.primary, // Bright purple for selected icons
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  roleText: {
    fontSize: 18,
    color: colors.textColor, // Using black for text
  },
  checkIcon: {
    marginLeft: 10,
    tintColor: colors.primary, // Optional: primary color for the check icon
  },
});
