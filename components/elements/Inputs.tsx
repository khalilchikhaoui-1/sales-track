import { CheckIcon, EyeIcon, EyeOffIcon } from "@/components/icons/AppIcons";
import { COLORS } from "@/hooks/styles";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

/* ============================
 *  Input Component
 * ============================ */

type InputProps = {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;

  leftIcon?: React.ReactNode;
  onLeftIconPress?: () => void;

  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;

  passwordToggle?: boolean;
  placeholderColor?: string;
} & TextInputProps;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  leftIcon,
  onLeftIconPress,
  rightIcon,
  onRightIconPress,
  passwordToggle = false,
  placeholderColor = COLORS.TEXT_LIGHT,
  secureTextEntry,
  ...rest
}) => {
  const [secure, setSecure] = useState<boolean>(
    !!(passwordToggle || secureTextEntry)
  );

  const showRightEye = useMemo(
    () => passwordToggle && !rightIcon,
    [passwordToggle, rightIcon]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={styles.inputWrap}>
        <TextInput
          placeholderTextColor={placeholderColor}
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeft : undefined,
            showRightEye || !!rightIcon ? styles.inputWithRight : undefined,
            inputStyle,
          ]}
          secureTextEntry={showRightEye ? secure : secureTextEntry}
          {...rest}
        />

        {leftIcon ? (
          <Pressable
            hitSlop={10}
            onPress={onLeftIconPress}
            style={styles.leftAction}
          >
            {leftIcon}
          </Pressable>
        ) : null}

        {showRightEye ? (
          <Pressable
            hitSlop={10}
            onPress={() => setSecure((s) => !s)}
            style={styles.rightAction}
          >
            {secure ? (
              <EyeIcon color={COLORS.GRAY} size={22} />
            ) : (
              <EyeOffIcon color={COLORS.GRAY} size={22} />
            )}
          </Pressable>
        ) : rightIcon ? (
          <Pressable
            hitSlop={10}
            onPress={onRightIconPress}
            style={styles.rightAction}
          >
            {rightIcon}
          </Pressable>
        ) : null}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

/* ============================
 *  Checkbox Component
 * ============================ */

type CheckboxProps = {
  label?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  style?: ViewStyle;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  style,
}) => {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      hitSlop={10}
      style={[styles.checkboxRow, style]}
    >
      <View
        style={[
          styles.checkboxBox,
          checked && {
            backgroundColor: COLORS.PRIMARY,
            borderColor: COLORS.PRIMARY,
          },
        ]}
      >
        {checked && <CheckIcon color={COLORS.WHITE} size={20} />}
      </View>
      {label && <Text style={styles.checkboxLabel}>{label}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: {
    fontFamily: "Sen-Regular",
    color: COLORS.SECONDARY,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  inputWrap: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    color: COLORS.TEXT_DARK,
    fontFamily: "Sen-Regular",
    fontSize: 15,
  },
  inputWithLeft: {
    paddingLeft: 44,
  },
  inputWithRight: {
    paddingRight: 44,
  },
  leftAction: {
    position: "absolute",
    left: 12,
    height: 56,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  rightAction: {
    position: "absolute",
    right: 12,
    height: 56,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: COLORS.ERROR,
    fontFamily: "Sen-Medium",
    fontSize: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.GRAY_LIGHT,
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxLabel: {
    fontFamily: "Sen-Regular",
    color: COLORS.TEXT_LIGHT,
    fontSize: 14,
  },
});
