import { GlobalSyles } from "@/hooks/styles";
import { getApp } from "@react-native-firebase/app";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function Index() {
  useEffect(() => {
    const app = getApp();
    const auth = getAuth(app);
    onAuthStateChanged(auth, (u) => {
      if (u) {
        router.replace("/stacks/main/home");
      } else {
        router.replace("/stacks/authentication/boarding");
      }
    });
  }, []);

  return <View style={GlobalSyles.screen} />;
}
