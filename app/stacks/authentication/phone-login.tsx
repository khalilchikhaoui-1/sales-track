import { PrimaryButton } from "@/components/elements/Buttons";
import { PhoneIcon } from "@/components/icons/AppIcons";
import {
  COLORS,
  modalStyles,
  otpStyles,
  phoneInputStyles,
} from "@/hooks/styles";
import AuthLayout from "@/layouts/AuthLayout";
import {
  FirebaseAuthTypes,
  getAuth,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import PhoneInput, {
  ICountry,
  isValidPhoneNumber,
} from "react-native-international-phone-number";
import { OtpInput } from "react-native-otp-entry";

const PhoneSignIn: React.FC = () => {
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [inputValue, setInputValue] = useState<string>("");

  function handleInputValue(phoneNumber: string) {
    setInputValue(phoneNumber);
  }

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  const handleSignInWithPhoneNumber = useCallback(async () => {
    try {
      if (!selectedCountry) {
        Alert.alert("Pick a country");
        return;
      }
      // Build calling code: root ("+") + first suffix ("49")
      const callingCode = `${selectedCountry.idd?.root ?? ""}${
        selectedCountry.idd?.suffixes?.[0] ?? ""
      }`;
      // Keep only digits from the local input
      const nationalDigits = inputValue.replace(/[^\d]/g, "");
      // For DE, strip trunk "0" if present (common for many countries)
      const nationalNoTrunk = nationalDigits.replace(/^0+/, "");
      // Compose E.164
      const e164 = `${callingCode}${nationalNoTrunk}`;
      // quick sanity checks
      if (!/^\+\d{6,15}$/.test(e164)) {
        Alert.alert("Invalid number", `Number looks wrong: ${e164}`);
        return;
      }
      //  Call Firebase
      setLoading(true);
      const confirmation = await signInWithPhoneNumber(getAuth(), e164);
      setConfirm(confirmation);
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "SMS Error",
        error?.message ?? "Failed to send the SMS code."
      );
    } finally {
      setLoading(false);
    }
  }, [inputValue, selectedCountry]);

  // Confirm OTP
  const confirmCode = useCallback(
    async (code: string) => {
      if (!confirm) return;
      try {
        setLoading(true);
        await confirm.confirm(code);
        // On success, onAuthStateChanged will fire
      } catch (error: any) {
        Alert.alert("Invalid code", "Please check the code and try again.");
      } finally {
        setLoading(false);
      }
    },
    [confirm]
  );

  return (
    <AuthLayout
      title="Sign In"
      description="Verify your identity using your phone number."
      showBackButton={true}
    >
      <View style={styles.noteContainer}>
        <PhoneIcon size={40} color={COLORS.TEXT_LIGHT} />
        <Text style={styles.note}>
          {confirm
            ? "Enter the 6-digit code we sent to your phone."
            : "Enter your number. We’ll text you a 6-digit verification code."}
        </Text>
      </View>

      {!confirm ? (
        <View>
          <PhoneInput
            phoneInputStyles={phoneInputStyles}
            modalNotFoundCountryMessage="No Result ❌"
            modalStyles={modalStyles}
            placeholder="Phone number"
            placeholderTextColor={COLORS.PLACEHOLDER}
            defaultCountry="DE"
            value={inputValue}
            onChangePhoneNumber={handleInputValue}
            selectedCountry={selectedCountry}
            onChangeSelectedCountry={handleSelectedCountry}
          />
          <PrimaryButton
            label={loading ? "Loading..." : "Verify"}
            onPress={handleSignInWithPhoneNumber}
            fullWidth
            style={{ marginTop: 10 }}
            disabled={
              loading ||
              !(
                selectedCountry &&
                isValidPhoneNumber(inputValue, selectedCountry)
              )
            }
          />
        </View>
      ) : (
        <View>
          <OtpInput
            numberOfDigits={6}
            focusColor={COLORS.PRIMARY}
            autoFocus={true}
            placeholder="XXXXXX"
            blurOnFilled={true}
            type="numeric"
            focusStickBlinkingDuration={500}
            onFilled={(text) => confirmCode(text)}
            textInputProps={{
              accessibilityLabel: "One-Time Password",
            }}
            textProps={{
              accessibilityRole: "text",
              accessibilityLabel: "OTP digit",
              allowFontScaling: false,
            }}
            theme={otpStyles}
          />
        </View>
      )}
    </AuthLayout>
  );
};

export default PhoneSignIn;

export const styles = StyleSheet.create({
  noteContainer: { alignItems: "center" },
  note: {
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "San-Medium",
    color: COLORS.TEXT_LIGHT,
    fontSize: 17,
    maxWidth: 300,
    lineHeight: 24,
    marginBottom: 10,
  },
});
