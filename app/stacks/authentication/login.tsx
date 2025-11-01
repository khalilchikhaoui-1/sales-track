import { PrimaryButton } from "@/components/elements/Buttons";
import { Input } from "@/components/elements/Inputs";
import { AppleIcon, GoogleIcon } from "@/components/icons/AppIcons";
import { COLORS } from "@/hooks/styles";
import AuthLayout from "@/layouts/AuthLayout";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("khalilchikhaoui8@gmail.com");
  const [pwd, setPwd] = useState("21459708Az*");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !pwd) {
      Alert.alert("Missing info", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(getAuth(), trimmedEmail, pwd);
      router.replace("/stacks/main/home");
    } catch (error: any) {
      let msg = "Something went wrong. Please try again.";
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          msg = "Invalid email or password.";
          break;
        case "auth/user-not-found":
          msg = "No account found with this email.";
          break;
        case "auth/invalid-email":
          msg = "Please enter a valid email address.";
          break;
        case "auth/too-many-requests":
          msg = "Too many attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          msg = "Network error. Check your connection and try again.";
          break;
      }
      Alert.alert("Login failed", msg);
    } finally {
      setLoading(false);
    }
  };

  //TODO
  const onGoogleLogin = async () => {};
  const onAppleLogin = async () => {};

  return (
    <AuthLayout
      title="Log In"
      description="Please sign in to your existing account"
      showBackButton={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View style={styles.form}>
          {/* EMAIL */}
          <Input
            label="EMAIL"
            placeholder="example@gmail.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          {/* PASSWORD */}
          <Input
            label="PASSWORD"
            placeholder="••••••••"
            passwordToggle
            value={pwd}
            onChangeText={setPwd}
          />

          {/* Forgot password */}
          <View style={styles.rowEnd}>
            <Pressable
              onPress={() =>
                router.navigate("/stacks/authentication/forgot-password")
              }
            >
              <Text style={styles.forgotText}>Forgot Password</Text>
            </Pressable>
          </View>

          {/* Login  */}
          <PrimaryButton
            label={loading ? "Logging in..." : "LOG IN"}
            onPress={onLogin}
            fullWidth
            style={{ marginTop: 8, opacity: loading ? 0.8 : 1 }}
            disabled={loading}
          />
          {/* Signup link */}
          <View className="signupRow" style={styles.signupRow}>
            <Text style={styles.muted}>Don’t have an account? </Text>
            <Pressable
              onPress={() => router.push("/stacks/authentication/signup")}
            >
              <Text style={styles.signup}>SIGN UP</Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={{ fontFamily: "San-Medium", color: COLORS.GRAY }}>
              OR
            </Text>
            <View style={styles.divider} />
          </View>

          {/** Phone */}
          <Pressable
            onPress={() => router.push("/stacks/authentication/phone-login")}
            style={styles.phoneContainer}
          >
            <Text style={styles.phone}>Continue with phone</Text>
          </Pressable>

          {/* Social buttons */}
          <View style={styles.socialContainer}>
            <Pressable
              style={styles.socialButton}
              onPress={onGoogleLogin}
              disabled={loading}
            >
              <GoogleIcon size={40} />
            </Pressable>

            {/* Leave Apple button present but not wired here; remove if you don’t need it */}
            <Pressable style={styles.socialButton} onPress={onAppleLogin}>
              <AppleIcon size={40} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  rowEnd: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signupRow: {
    alignSelf: "center",
    flexDirection: "row",
    marginTop: 18,
  },
  muted: {
    fontFamily: "Sen-Regular",
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
  },
  signup: {
    fontFamily: "Sen-Bold",
    color: COLORS.PRIMARY,
    fontSize: 16,
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  socialButton: {
    padding: 10,
    borderRadius: 40,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  divider: { height: 1, backgroundColor: COLORS.GRAY, flex: 1 },
  forgotText: {
    color: COLORS.PRIMARY,
    fontFamily: "San-Regular",
    fontSize: 15,
  },
  phoneContainer: {
    alignSelf: "center",
    padding: 4,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderColor: COLORS.TEXT_DARK,
  },
  phone: { fontFamily: "San-Medium", color: COLORS.TEXT_DARK, fontSize: 16 },
});
