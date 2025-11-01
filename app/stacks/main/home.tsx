import { API_URL } from "@/hooks/constants";
import { COLORS, GlobalSyles } from "@/hooks/styles";
import { selectSelectedBusiness, setSelectedBusiness } from "@/redux/slices/businessSlice";
import { getAuth, onAuthStateChanged, reload } from "@react-native-firebase/auth";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const selectedBusiness = useSelector(selectSelectedBusiness)
  const baseUrl = useMemo(() => {
    if (API_URL.includes("localhost") && Platform.OS === "android") {
      return API_URL.replace("localhost", "10.0.2.2");
    }
    return API_URL;
  }, []);

  useEffect(() => {
    if(selectedBusiness){
         setLoading(false);
      return
    }
    const unsub = onAuthStateChanged(getAuth(), async (u) => {
      if (!u) {
        router.replace("/stacks/authentication/login");
        return;
      }

      await reload(u);
      const fresh = getAuth().currentUser;

      if (!fresh?.displayName || !fresh.displayName.trim()) {
        setLoading(false);
        router.replace("/stacks/authentication/complete-profile");
        return;
      }

      try {
        const url = `${baseUrl}/api/businesses/user?uid=${encodeURIComponent(fresh.uid)}`;
        const res = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });

        if (!res.ok) {
          const text = await res.text();
          console.warn("Failed to fetch businesses:", res.status, text);
          setBusinesses([]);
        } else {
          const items = await res.json(); 
          
          setBusinesses(items);

          if (items.length === 0) {
            router.replace("/stacks/business/create-business");
            return;
          }
          if (items.length > 1) {
            router.replace("/stacks/business/select-business");
            return;
          }
          //  exactly 1 business , stay on Home on select business
        dispatch(setSelectedBusiness(items[0]));
        }
      } catch (err) {
        console.warn("Fetch error:", err);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, [baseUrl,selectedBusiness]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.PRIMARY} size={50}/>
      </View>
    );
  }

  return (
    <View style={GlobalSyles.screen}>
      <Text>HOME</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.WHITE },
 
});
