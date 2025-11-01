import { getAuth } from "@react-native-firebase/auth";
import axios from "axios";
import { router } from "expo-router";
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
import { useDispatch, useSelector } from "react-redux";

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
import {
    selectSelectedBusiness,
    setSelectedBusiness,
} from "@/redux/slices/businessSlice";
import PhoneInput from "react-native-international-phone-number";

export default function UpdateBusiness() {
  const dispatch = useDispatch();
  const sel = useSelector(selectSelectedBusiness);
  const biz = sel?.business;

  // Guard
  useEffect(() => {
    if (!biz?._id) {
      Alert.alert("Business", "No business selected.");
      router.replace("/stacks/main/home");
    }
  }, [biz?._id]);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // GENERAL
  const [name, setName] = useState(biz?.name ?? "");
  const [email, setEmail] = useState(biz?.email ?? "");
  const [phoneLocal, setPhoneLocal] = useState(biz?.phone ?? "");

  // Dial code from country picker; default DE
  const [dialCode, setDialCode] = useState<string>("49");
  const phoneRef = useRef<any>(null);

  // ADDRESS
  const [street, setStreet] = useState(biz?.address?.street ?? "");
  const [number, setNumber] = useState(biz?.address?.number ?? "");
  const [city, setCity] = useState(biz?.address?.city ?? "");
  const [postalCode, setPostalCode] = useState(biz?.address?.postalCode ?? "");
  const [country, setCountry] = useState(biz?.address?.country ?? "");

  // CURRENCY
  const [currencyCode, setCurrencyCode] = useState(biz?.currency?.code ?? "");
  const [currencySymbol, setCurrencySymbol] = useState(
    biz?.currency?.symbol ?? ""
  );
  const [currencyDecimals, setCurrencyDecimals] = useState(
    String(
      typeof biz?.currency?.decimals === "number" ? biz!.currency!.decimals : 2
    )
  );
  const [currencyDisplay, setCurrencyDisplay] = useState<"symbol" | "code">(
    (biz?.currency?.display as any) || "symbol"
  );
  const [textDirection, setTextDirection] = useState<"ltr" | "rtl">(
    (biz?.currency?.direction as any) || "ltr"
  );

  // Keep symbol/decimals synced when code changes
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

  const formatE164 = (input?: string, code?: string) => {
    if (!input) return "";
    let s = input.trim();
    s = s.replace(/^00/, "+"); // 0049... -> +49...
    s = s.replace(/[^\d+]/g, ""); // keep only digits and +
    if (s.startsWith("+")) {
      return "+" + s.replace(/[^\d]/g, "");
    }
    const digits = s.replace(/[^\d]/g, "");
    return code ? `+${String(code).replace(/[^\d]/g, "")}${digits}` : digits;
  };

  const goNext = () => setStep((s) => (s === 3 ? 3 : ((s + 1) as 1 | 2 | 3)));
  const goBack = () => setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)));

  const onSubmit = async () => {
    const uid = getAuth().currentUser?.uid;
    if (!uid) {
      Alert.alert("Auth", "Please sign in again.");
      router.replace("/stacks/authentication/login");
      return;
    }
    if (!biz?._id) {
      Alert.alert("Business", "No business to update.");
      return;
    }
    if (!name.trim()) {
      Alert.alert("Validation", "Name is required.");
      setStep(1);
      return;
    }
    if (!currencyCode) {
      Alert.alert("Validation", "Please select a currency.");
      setStep(3);
      return;
    }

    const decimals = Math.max(
      0,
      Math.min(6, parseInt(currencyDecimals || "2", 10) || 2)
    );
    const fullPhone = formatE164(phoneLocal, dialCode);

    const payload = {
      id: biz._id,
      uid,
      name: name.trim(),
      email: email.trim() || undefined,
      phone: fullPhone || undefined,
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
        display: currencyDisplay,
        direction: textDirection,
      },
    };

    try {
      setLoading(true);
      const res = await axios.put(
        `${API_URL}/api/businesses/${String(biz._id)}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Server returns membership wrapper like getUserBusinesses
      dispatch(setSelectedBusiness(res.data));
      Alert.alert("Saved", "Business updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update business.";
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
        <BackHeader
          rightComponent={<Text style={styles.title}>Edit Business</Text>}
        />
        <Text style={styles.description}>
          Update your business details. Changes will reflect across invoices,
          products, and more.
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
              onChangeSelectedCountry={(c: any) =>
                setDialCode(
                  Array.isArray(c?.callingCode)
                    ? c.callingCode[0]
                    : c?.callingCode || "49"
                )
              }
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
                label={loading ? "SAVING..." : "SAVE CHANGES"}
                onPress={onSubmit}
                fullWidth={false}
                disabled={loading || !name.trim() || !currencyCode}
                style={{ flex: 1 }}
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
