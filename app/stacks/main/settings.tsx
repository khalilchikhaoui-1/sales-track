import { COLORS, GlobalSyles } from "@/hooks/styles";
import { selectSelectedBusiness } from "@/redux/slices/businessSlice";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from "@react-native-firebase/auth";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function Settings() {
  const biz = useSelector(selectSelectedBusiness);
  console.log("biz", biz);

  const logout = async () => {
    await signOut(getAuth());
    router.replace("/stacks/authentication/login");
  };

  const initials = (name?: string) => {
    if (!name) return "?";
    const parts = String(name).trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("");
  };

  const businessName = biz?.business?.name || " ";
  const businessEmail = biz?.business?.email || " ";
  const businessPhone = biz?.business?.phone || " ";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.WHITE }}
      edges={Platform.OS === "ios" ? [] : ["top"]}
    >
      <ScrollView
        style={GlobalSyles.screen}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        {/* Current Business */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="briefcase" size={22} color={COLORS.TEXT_DARK} />
            <Text style={styles.cardTitle}>Current Business</Text>
          </View>

          <View style={styles.bizRow}>
            {/* Avatar initials */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {initials(biz?.business?.name)}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.businessName}>{businessName}</Text>
              <Text style={styles.muted}>{businessEmail}</Text>
              <Text style={styles.muted}>{businessPhone}</Text>
            </View>
          </View>

          {/* Actions (no navigation wired) */}
          <View style={{ marginTop: 15 }}>
            <RowLink
              icon="repeat"
              label="Switch Business"
              onPress={() =>
                router.navigate({
                  pathname: "/stacks/business/select-business",
                  params: { showBack: "1" },
                })
              }
            />
            <RowLink
              icon="create-outline"
              label="Edit Business"
              onPress={() => router.navigate("/stacks/business/update-business")}
            />
            <RowLink
              icon="add-circle-outline"
              label="Create Business"
              onPress={() =>
                router.navigate({
                  pathname: "/stacks/business/create-business",
                  params: { showBack: "1" },
                })
              }
            />
          </View>
        </View>

        {/* 1) Brand & Layout */}
        <SectionCard icon="color-palette" title="Brand & Layout">
          <RowLink
            icon="images"
            label="Logo"
            onPress={logout}
            right={<RightStatus text="Not set" />}
          />
          <RowLink
            icon="document-text"
            label="Invoice Template"
            onPress={() => {}}
            right={<RightStatus text="Classic" />}
          />
          <RowLink
            icon="list"
            label="Invoice Columns (show/hide)"
            onPress={() => {}}
          />
        </SectionCard>

        {/* 2) Money & Locale */}
        <SectionCard icon="globe-outline" title="Money & Locale">
          <RowLink
            icon="cash-outline"
            label="Currency & Formatting"
            onPress={() => {}}
            right={<RightStatus text="EUR" />}
          />
          <RowLink
            icon="time"
            label="Language, Time & Region"
            onPress={() => {}}
          />
        </SectionCard>

        {/* 3) Numbering & Defaults */}
        <SectionCard icon="options" title="Numbering & Defaults">
          <RowLink
            icon="pricetags-outline"
            label="Default Discount"
            onPress={() => {}}
            right={<RightStatus text="Off" />}
          />
          <RowLink
            icon="receipt-outline"
            label="Default Tax"
            onPress={() => {}}
            right={<RightStatus text="19%" />}
          />
          <RowLink
            icon="reader-outline"
            label="Invoice Footer"
            onPress={() => {}}
          />
        </SectionCard>

        {/* 4) About & Legal */}
        <SectionCard icon="information-circle" title="About & Legal">
          <RowLink
            icon="chatbubbles-outline"
            label="Contact Us"
            onPress={() => {}}
          />
          <RowLink
            icon="document-lock-outline"
            label="Privacy Policy"
            onPress={() => {}}
          />
          <RowStatic icon="alert-circle-outline" label="App Version 1.0.0" />
        </SectionCard>
        <SectionCard icon="person" title="Account">
          <RowLink
            icon="log-out-outline"
            label="Logout"
            onPress={logout}
          />
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color={COLORS.TEXT_DARK} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function RowLink({
  icon,
  label,
  onPress,
  right,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <Pressable onPress={onPress} style={styles.rowItem}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={COLORS.TEXT_DARK} />
        <View style={{ gap: 2 }}>
          <Text style={styles.rowLabel}>{label}</Text>
        </View>
      </View>
      <View style={styles.rowRightSide}>
        {right}
        <Ionicons name="chevron-forward" size={18} color={COLORS.TEXT_DARK} />
      </View>
    </Pressable>
  );
}

function RowStatic({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
}) {
  return (
    <View style={styles.rowItem}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={COLORS.TEXT_DARK} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
    </View>
  );
}

function RightStatus({ text }: { text: string }) {
  return <Text style={styles.rightStatus}>{text}</Text>;
}

/* styles (unchanged) */
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: "San-Bold",
    marginBottom: 16,
    color: COLORS.TEXT_DARK,
    marginTop: 20,
  },

  card: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "San-SemiBold",
    color: COLORS.TEXT_DARK,
  },

  // Business header
  bizRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: COLORS.GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
  },
  avatarText: { fontFamily: "San-SemiBold", color: COLORS.PRIMARY },
  businessName: {
    fontSize: 16,
    fontFamily: "San-Bold",
    color: COLORS.TEXT_DARK,
    marginBottom: 2,
  },
  muted: { color: COLORS.GRAY, fontFamily: "San-Medium", fontSize: 12 },

  // Generic rows
  rowItem: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  rowRightSide: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowLabel: {
    fontSize: 15,
    color: COLORS.TEXT_DARK,
    fontFamily: "San-Medium",
  },
  rightStatus: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    fontFamily: "San-SemiBold",
  },

  // Logo variant (unused but kept for design parity)
  avatarLogoWrap: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    overflow: "hidden",
  },
  avatarLogo: {
    width: "90%",
    height: "90%",
  },
});
