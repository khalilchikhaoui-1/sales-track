import { PrimaryButton } from "@/components/elements/Buttons";
import { Input } from "@/components/elements/Inputs";
import AuthLayout from "@/layouts/AuthLayout";
import { getAuth } from "@react-native-firebase/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onReset = async () => {
    const trimmed = email.trim();
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await getAuth().sendPasswordResetEmail(trimmed);
      Alert.alert("Email sent", "Check your inbox for reset instructions.");
      router.back();
    } catch (e: any) {
      let msg = "Could not send reset email. Try again.";
      if (e.code === "auth/user-not-found")
        msg = "No account found with this email.";
      if (e.code === "auth/invalid-email") msg = "Please enter a valid email.";
      Alert.alert("Reset failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      description="We’ll email you a reset link"
    >
      <View style={styles.wrap}>
        <Input
          label="EMAIL"
          placeholder="example@gmail.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <PrimaryButton
          label={loading ? "Sending..." : "SEND RESET LINK"}
          onPress={onReset}
          fullWidth
          disabled={loading}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
});
