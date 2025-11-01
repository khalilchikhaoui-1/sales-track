import { COLORS } from "@/hooks/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type BackHeaderProps = {
  rightComponent?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function BackHeader({ rightComponent, style }: BackHeaderProps) {
  const router = useRouter();

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
      </Pressable>

      <View style={styles.spacer} />

      <View>{rightComponent}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 6,
  },
  spacer: {
    flex: 1,
  },
});
