import { PrimaryButton } from "@/components/elements/Buttons";
import { Input } from "@/components/elements/Inputs";
import AuthLayout from "@/layouts/AuthLayout";
import { getAuth } from "@react-native-firebase/auth";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CompleteProfile() {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => name.trim().length > 1, [name]);

  const onSave = async () => {
    if (!canSubmit) return;

    const user = getAuth().currentUser;
    if (!user) {
      Alert.alert("Session expired", "Please log in again.");
      router.replace("/stacks/authentication/login");
      return;
    }

    try {
      setSaving(true);
      await user.updateProfile({ displayName: name.trim() });
      await user.reload(); // make sure Home sees the change
      router.replace("/stacks/main/home");
    } catch (e: any) {
      Alert.alert("Update failed", e?.message ?? "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthLayout
      title="Complete your profile"
      description="Add your name to finish setting up your account"
      showBackButton={false}
    >
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

          <PrimaryButton
            label={saving ? "Saving..." : "SAVE"}
            onPress={onSave}
            fullWidth
            disabled={!canSubmit || saving}
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
