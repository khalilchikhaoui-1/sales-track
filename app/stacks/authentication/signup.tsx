import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import AuthLayout from "@/AuthLayout";
import { PrimaryButton } from "@/components/elements/Buttons";
import { Input } from "@/components/elements/Inputs";
import auth from "@react-native-firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);
  const pwdMatch = useMemo(
    () => confirm.length === 0 || pwd === confirm,
    [pwd, confirm]
  );
  const canSubmit =
    name.trim().length > 1 && emailValid && pwd.length >= 6 && pwd === confirm;

  const onSignUp = async () => {
    if (!canSubmit) return;
    setLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const userCredential = await auth().createUserWithEmailAndPassword(
        trimmedEmail,
        pwd
      );
      const user = userCredential.user;

      if (name.trim().length > 0) {
        await user.updateProfile({ displayName: name.trim() });
      }
    } catch (error: any) {
      console.log("Signup error:", error);
      let msg = "Something went wrong. Please try again.";
      if (error.code === "auth/email-already-in-use")
        msg = "This email is already registered.";
      else if (error.code === "auth/invalid-email")
        msg = "Please enter a valid email address.";
      else if (error.code === "auth/weak-password")
        msg = "Password should be at least 6 characters.";

      Alert.alert("Sign Up Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign Up" description="Please sign up to get started">
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        enableAutomaticScroll
        extraHeight={50}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.form}>
          <Input
            label="NAME"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect
          />

          <Input
            label="EMAIL"
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            error={
              email.length > 0 && !emailValid
                ? "Enter a valid email"
                : undefined
            }
          />

          <Input
            label="PASSWORD"
            placeholder="••••••••"
            passwordToggle
            value={pwd}
            onChangeText={setPwd}
          />

          <Input
            label="RE-TYPE PASSWORD"
            placeholder="••••••••"
            passwordToggle
            value={confirm}
            onChangeText={setConfirm}
            error={!pwdMatch ? "Passwords do not match" : undefined}
          />

          <PrimaryButton
            label={loading ? "Creating..." : "SIGN UP"}
            onPress={onSignUp}
            fullWidth
            style={{ marginTop: 16, opacity: canSubmit ? 1 : 0.6 }}
            disabled={!canSubmit || loading}
          />
        </View>
      </KeyboardAwareScrollView>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
});
