import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar, StyleSheet } from "react-native";
import FlashMessage from "react-native-flash-message";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { COLORS } from "../hooks/styles";
import { store } from "../redux/store";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "San-Regular": require("../assets/fonts/Sen-Regular.ttf"),
    "San-Medium": require("../assets/fonts/Sen-Medium.ttf"),
    "San-SemiBold": require("../assets/fonts/Sen-SemiBold.ttf"),
    "San-Bold": require("../assets/fonts/Sen-Bold.ttf"),
    "San-ExtraBold": require("../assets/fonts/Sen-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={DefaultTheme}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <StatusBar 
            barStyle="light-content"
          />

          <Stack screenOptions={{ headerShown: false, animation: "fade" }} />

          <FlashMessage
            position="top"
            titleStyle={{ fontFamily: "San-SemiBold", }}
            textStyle={{ fontFamily: "Inter" }}
          />
        </SafeAreaView>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: Platform.OS === "ios" ? 60 : StatusBar.currentHeight ?? 24,
    backgroundColor: COLORS.PRIMARY,
  },
});
