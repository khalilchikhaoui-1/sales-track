import { getAuth } from "@react-native-firebase/auth";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { PrimaryButton } from "@/components/elements/Buttons";
import CurrencySelectInput from "@/components/elements/CurrencySelectInput";
import { BackHeader } from "@/components/elements/Headers";
import { Input } from "@/components/elements/Inputs";
import { API_URL } from "@/hooks/constants";
import { CURRENCIES } from "@/hooks/currencies";
import {
  COLORS,
  GlobalSyles,
  modalStyles,
  phoneInputStyles,
} from "@/hooks/styles";
import { setSelectedBusiness } from "@/redux/slices/businessSlice";
import PhoneInput from "react-native-international-phone-number";
import { useDispatch } from "react-redux";

export default function CreateBusiness() {
  const { showBack } = useLocalSearchParams<{ showBack?: string }>();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [phone, setPhone] = useState("");

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Currency state (symbol/decimals are derived)
  const [currencyCode, setCurrencyCode] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [currencyDecimals, setCurrencyDecimals] = useState("2");
  const [currencyDisplay, setCurrencyDisplay] = useState<"symbol" | "code">(
    "symbol"
  );
  const [textDirection, setTextDirection] = useState<"ltr" | "rtl">("ltr");

  const phoneRef = useRef(null);

  useEffect(() => {
    if (!currencyCode) {
      setCurrencySymbol("");
      setCurrencyDecimals("2");
      return;
    }
    const found = CURRENCIES.find((c) => c.code === currencyCode);
    if (found) {
      setCurrencySymbol(found.symbol || "");
      setCurrencyDecimals(String(found.decimals ?? 2));
    }
  }, [currencyCode]);

  const goNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        Alert.alert("Validation", "Business name is required.");
        return;
      }
      setPhone(phoneLocal.trim()); // store raw phone as-is
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const goBack = () => setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)));

  const onSubmit = async () => {
    const uid = getAuth().currentUser?.uid;
    if (!uid) {
      Alert.alert("Auth", "Please sign in again.");
      router.replace("/stacks/authentication/login");
      return;
    }
    if (!name.trim()) {
      Alert.alert("Validation", "Name is required.");
      return;
    }
    if (!currencyCode) {
      Alert.alert("Validation", "Please select a currency.");
      return;
    }

    const decimals = Math.max(
      0,
      Math.min(6, parseInt(currencyDecimals || "2", 10) || 2)
    );

    const payload = {
      uid,
      name: name.trim(),
      email: email.trim() || undefined,
      phoneLocal,
      phone: phone.trim() || undefined,
      image: undefined, 
      address: {
        street: street.trim() || "",
        number: number.trim() || "",
        city: city.trim() || "",
        postalCode: postalCode.trim() || "",
        country: country.trim() || "",
      },
      currency: {
        code: currencyCode.trim(),
        symbol: currencySymbol,
        decimals,
        display: currencyDisplay, // "symbol" | "code"
        direction: textDirection, // "ltr" (left) | "rtl" (right)
      },
    };

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/api/businesses/create-business`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(setSelectedBusiness(res.data));

      router.replace("/stacks/main/home");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create business.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const StepHeader = () => (
    <View style={styles.stepHeader}>
      {[1, 2, 3].map((n) => (
        <View
          key={n}
          style={[
            styles.stepDot,
            { backgroundColor: step === n ? COLORS.PRIMARY : "#E5E7EB" },
          ]}
        />
      ))}
      <Text style={styles.stepText}>
        {step === 1 && "General"}
        {step === 2 && "Address"}
        {step === 3 && "Currency"}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.WHITE }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        bounces={false}
        style={GlobalSyles.screen}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {showBack ? (
          <BackHeader
            rightComponent={<Text style={styles.title}>Create Business</Text>}
          />
        ) : (
          <Text style={[styles.title,{marginTop:10}]}>Create Business</Text>
        )}
        <Text style={styles.description}>
          Create your business and start managing your products, services,
          invoices, view reports, and more.
        </Text>

        <StepHeader />

        {/* STEP 1 — GENERAL */}
        {step === 1 && (
          <View style={styles.section}>
            <Input
              label="NAME"
              required
              placeholder="Business name"
              value={name}
              onChangeText={setName}
            />
            <Input
              label="EMAIL"
              placeholder="example@domain.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.phoneLabel}>PHONE</Text>
            <PhoneInput
              ref={phoneRef}
              phoneInputStyles={phoneInputStyles}
              modalNotFoundCountryMessage="No Result ❌"
              modalStyles={modalStyles}
              placeholder="Phone number"
              defaultCountry="DE"
              value={phoneLocal}
              onChangePhoneNumber={setPhoneLocal}
            />

            <PrimaryButton
              label="NEXT"
              onPress={goNext}
              fullWidth
              disabled={!name.trim() || loading}
              style={{ marginTop: 8 }}
            />
          </View>
        )}

        {/* STEP 2 — ADDRESS */}
        {step === 2 && (
          <View style={styles.section}>
            <Input
              label="STREET"
              placeholder="Street"
              value={street}
              onChangeText={setStreet}
            />
            <Input
              label="NUMBER"
              placeholder="12B"
              value={number}
              onChangeText={setNumber}
            />
            <Input
              label="CITY"
              placeholder="Berlin"
              value={city}
              onChangeText={setCity}
            />
            <Input
              label="POSTAL CODE"
              placeholder="10179"
              keyboardType="number-pad"
              value={postalCode}
              onChangeText={setPostalCode}
            />
            <Input
              label="COUNTRY"
              placeholder="DE"
              autoCapitalize="characters"
              value={country}
              onChangeText={setCountry}
            />

            <View style={styles.row}>
              <PrimaryButton
                label="BACK"
                onPress={goBack}
                fullWidth={false}
                style={{ flex: 1, marginRight: 8 }}
              />
              <PrimaryButton
                label="NEXT"
                onPress={goNext}
                fullWidth={false}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </View>
        )}

        {/* STEP 3 — CURRENCY */}
        {step === 3 && (
          <View style={styles.section}>
            <CurrencySelectInput
              value={currencyCode}
              onChange={setCurrencyCode}
              display={currencyDisplay}
              onChangeDisplay={setCurrencyDisplay}
              direction={textDirection}
              onChangeDirection={setTextDirection}
            />

            <View style={styles.row}>
              <PrimaryButton
                label="BACK"
                onPress={goBack}
                fullWidth={false}
                style={{ flex: 1, marginRight: 8 }}
              />
              <PrimaryButton
                label={loading ? "CREATING..." : "CREATE BUSINESS"}
                onPress={onSubmit}
                fullWidth={false}
                disabled={loading || !name.trim() || !currencyCode}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40, gap: 14 },
  section: { gap: 12 },
  row: { flexDirection: "row", alignItems: "center" },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 6,
  },
  stepDot: { width: 10, height: 10, borderRadius: 12 },
  stepText: {
    marginLeft: 4,
    color: COLORS.TEXT_DARK,
    fontFamily: "San-SemiBold",
    fontSize: 20,
  },
  title: {
    color: COLORS.TEXT_DARK,
    fontSize: 22,
    fontFamily: "San-SemiBold",
  },
  description: { color: "#6B7280", fontFamily: "San-Medium", fontSize: 16 },
  phoneLabel: {
    fontFamily: "San-Medium",
    color: COLORS.TEXT_DARK,
    fontSize: 13,
    marginTop: 6,
  },
});
