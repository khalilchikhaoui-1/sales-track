import { PrimaryButton } from "@/components/elements/Buttons";
import { getAuth, signOut } from "@react-native-firebase/auth";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Home = () => {
  const logout = () => {
    signOut(getAuth()).then(() => console.log("User signed out!"));
  };

  const user = getAuth().currentUser;

  return (
    <View>
      <Text>{user?.displayName}</Text>
      <PrimaryButton
        style={{ paddingHorizontal: 20, marginBottom: 20 }}
        onPress={logout}
        label={"Logout"}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
