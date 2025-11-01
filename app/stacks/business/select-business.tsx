import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useDispatch } from "react-redux";

import { BackHeader } from "@/components/elements/Headers";
import { Input } from "@/components/elements/Inputs";
import { API_URL } from "@/hooks/constants";
import { COLORS, GlobalSyles } from "@/hooks/styles";
import {
    SelectedBusiness,
    setSelectedBusiness,
} from "@/redux/slices/businessSlice";

export default function SelectBusiness() {
  const dispatch = useDispatch();
  const { showBack } = useLocalSearchParams<{ showBack?: string }>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [memberships, setMemberships] = useState<SelectedBusiness[]>([]);
  const [search, setSearch] = useState("");

  const fetchBusinesses = useCallback(async () => {
    const uid = getAuth().currentUser?.uid;
    if (!uid) {
      Alert.alert("Auth", "Please sign in again.");
      router.replace("/stacks/authentication/login");
      return [];
    }

    const url = `${API_URL}/api/businesses/user?uid=${encodeURIComponent(uid)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      console.warn("Failed to fetch businesses:", res.status, text);
      return [];
    }
    const items = await res.json();
    return Array.isArray(items) ? items : [];
  }, [API_URL]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const items = await fetchBusinesses();
      setMemberships(items);
    } catch (e) {
      console.warn(e);
      setMemberships([]);
    } finally {
      setLoading(false);
    }
  }, [fetchBusinesses]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const items = await fetchBusinesses();
      setMemberships(items);
    } catch (e) {
      console.warn(e);
    } finally {
      setRefreshing(false);
    }
  }, [fetchBusinesses]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return memberships;
    return memberships.filter((m) =>
      m.business?.name?.toLowerCase?.().includes(q)
    );
  }, [memberships, search]);

  const handleSelect = (membership: SelectedBusiness) => {
    dispatch(setSelectedBusiness(membership));
    router.replace("/stacks/main/home");
  };

  const renderItem = ({ item }: { item: SelectedBusiness }) => {
    const name = item?.business?.name || "—";
    const currencyCode = item?.business?.currency?.code;
    const subtitle = currencyCode ? `Currency: ${currencyCode}` : "—";
    return (
      <Pressable
        onPress={() => handleSelect(item)}
        style={({ pressed }) => [
          styles.card,
          pressed && { transform: [{ scale: 0.995 }], opacity: 0.9 },
        ]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(name)}</Text>
        </View>

        <View style={styles.cardBody}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text numberOfLines={1} style={styles.sub}>
            {subtitle}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color={COLORS.GRAY} />
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={[GlobalSyles.screen, styles.center]}>
        <ActivityIndicator color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={[GlobalSyles.screen, { paddingBottom: 20 }]}>
      {showBack ? (
        <BackHeader
          rightComponent={<Text style={styles.title}>Select a Business</Text>}
        />
      ) : (
        <Text style={styles.title}>Select a Business</Text>
      )}

      {/* Search */}
      <View style={styles.searchWrap}>
        <Input
          placeholder="Search"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it, idx) =>
          // prefer membershipId, then business._id, then index
          (it.membershipId as any) || it.business?._id || String(idx)
        }
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.PRIMARY}
          />
        }
        ListEmptyComponent={
          <View style={[styles.center, { marginTop: 30 }]}>
            <Text style={styles.emptyTitle}>
              {search ? "No matches" : "No businesses"}
            </Text>
            <Text style={styles.emptyNote}>
              {search
                ? "Try a different search."
                : "Create your first business to get started."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

/* utils */
const initials = (name?: string) => {
  if (!name) return "?";
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
};

/* styles */
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: "San-SemiBold",
    marginTop: 20,
    marginBottom: 14,
    color: COLORS.TEXT_DARK,
  },
  searchWrap: {
    position: "relative",
    marginBottom: 12,
  },
  searchIcon: { position: "absolute", left: 12, top: 12 },
  clearBtn: { position: "absolute", right: 10, top: 10 },
  searchInput: {
    height: 42,
    paddingLeft: 34,
    paddingRight: 36,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: 10,
    fontSize: 15,
    fontFamily: "San-Medium",
    color: COLORS.TEXT_DARK,
    backgroundColor: COLORS.WHITE,
  },
  card: {
    minHeight: 66,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EDF6F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
  },
  avatarText: { fontFamily: "San-SemiBold", color: COLORS.PRIMARY },
  cardBody: { flex: 1 },
  name: { fontSize: 16, fontFamily: "San-SemiBold", color: COLORS.TEXT_DARK },
  sub: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.TEXT_DARK,
    fontFamily: "San-Medium",
  },

  // Empty / loading
  center: { alignItems: "center", justifyContent: "center" },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "San-SemiBold",
    color: COLORS.TEXT_DARK,
  },
  emptyNote: { marginTop: 4, fontSize: 13, color: COLORS.GRAY },
});
