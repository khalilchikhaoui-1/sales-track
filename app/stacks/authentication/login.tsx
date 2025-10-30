import AuthLayout from "@/AuthLayout";
import { PrimaryButton } from "@/components/elements/Buttons";
import { Input } from "@/components/elements/Inputs";
import { AppleIcon, GoogleIcon } from "@/components/icons/AppIcons";
import { COLORS } from "@/hooks/styles";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const WEB_CLIENT_ID = "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Configure Google Sign-In once
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID, // REQUIRED for Firebase
      // offlineAccess: true, // optional
      // forceCodeForRefreshToken: true, // optional
    });
  }, []);

  const onLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !pwd) {
      Alert.alert("Missing info", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(trimmedEmail, pwd);
      router.replace("/stacks/home");
    } catch (error: any) {
      console.log("Login error:", error);
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

  const onGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      // Ensure Google Play Services (Android)
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Trigger Google sign-in
      const res = await GoogleSignin.signIn();
      if (!res.data?.idToken) {
        Alert.alert("Google Sign-In Failed", "No idToken returned.");
        return;
      }

      // Create Firebase credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(
        res.data.idToken
      );

      // Sign in to Firebase
      await auth().signInWithCredential(googleCredential);

      router.replace("/stacks/home");
    } catch (error: any) {
      console.log("Google sign-in error:", error);
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (error?.code === statusCodes.IN_PROGRESS) return;
      if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          "Google Play Services",
          "Google Play Services is not available or outdated."
        );
        return;
      }
      Alert.alert(
        "Google Sign-In Error",
        error?.message || "Something went wrong"
      );
    } finally {
      setGoogleLoading(false);
    }
  };
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

          {/* Login CTA */}
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

          {/* Social buttons */}
          <View style={styles.socialContainer}>
            <Pressable
              style={styles.socialButton}
              onPress={onGoogleLogin}
              disabled={loading || googleLoading}
            >
              <GoogleIcon size={50} />
            </Pressable>

            {/* Leave Apple button present but not wired here; remove if you don’t need it */}
            <Pressable
              style={styles.socialButton}
              onPress={() =>
                Alert.alert("Coming soon", "Apple Sign-In not set up")
              }
            >
              <AppleIcon size={50} />
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
});
