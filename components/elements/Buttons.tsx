import { COLORS } from "@/hooks/styles";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type BaseProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  testID?: string;
};

/** Filled primary button (orange) */
export const PrimaryButton: React.FC<BaseProps> = ({
  label,
  onPress,
  disabled,
  loading,
  fullWidth = true,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  testID,
}) => {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primary,
        fullWidth && styles.fullWidth,
        { opacity: isDisabled ? 0.6 : pressed ? 0.9 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          <Text style={[styles.primaryText, textStyle]}>{label}</Text>
          {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
};

/** Text-only button for light actions like “Skip” */
export const TextButton: React.FC<
  Omit<BaseProps, "loading" | "leftIcon" | "rightIcon">
> = ({ label, onPress, disabled, fullWidth, style, textStyle, testID }) => {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [
        styles.textBtn,
        fullWidth && styles.fullWidth,
        { opacity: disabled ? 0.5 : pressed ? 0.6 : 1 },
        style,
      ]}
    >
      <Text style={[styles.textBtnText, textStyle]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fullWidth: { alignSelf: "stretch" },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  icon: { alignSelf: "center" },
  primary: {
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryText: {
    fontFamily: "Sen-Bold",
    fontSize: 14,
    color: "#fff",
  },
  textBtn: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textBtnText: {
    fontFamily: "Sen-Regular",
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
  },
});
