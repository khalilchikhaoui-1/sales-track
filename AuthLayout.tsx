import { ArrowLeftIcon, AuthBackground } from "@/components/icons/AppIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { ReactNode } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { COLORS } from "./hooks/styles";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
  showBackButton?: boolean;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
  showBackButton = true,
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <View style={{ paddingHorizontal: 20 }}>
            {showBackButton ? (
              <Pressable
                onPress={() => router.back()}
                hitSlop={10}
                style={styles.backButton}
              >
                <ArrowLeftIcon color={COLORS.SECONDARY} size={24} />
              </Pressable>
            ) : (
              <View style={{ marginTop: 20, height: 50 }} />
            )}

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={{ position: "absolute" }}>
            <AuthBackground />
          </View>
        </View>
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.7)",
            "rgba(0,0,0,0.1)",
            "transparent",
            "transparent",
            "transparent",
          ]}
          style={styles.lGContainer}
        />
        {/* ===== MAIN ===== */}
        <View style={styles.main}>{children}</View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  header: {
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 20,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: 25,
    alignSelf: "flex-start",
    zIndex: 5,
  },
  title: {
    fontFamily: "San-Medium",
    fontSize: 30,
    color: COLORS.WHITE,
    marginBottom: 8,
    marginTop: 30,
    textAlign: "center",
    zIndex: 5,
  },
  description: {
    fontFamily: "San-Regular",
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    lineHeight: 26,
    textAlign: "center",
    zIndex: 5,
  },
  main: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 5,
  },
  lGContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
});
