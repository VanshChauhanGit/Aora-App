import "../global.css";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import GlobalProvider from "@/context/GlobalProvider";
import { ToastProvider } from "react-native-toast-notifications";
import { Image, Text } from "react-native";
import { icons, images } from "@/constants";
import { View } from "react-native-animatable";

SplashScreen.preventAutoHideAsync();

const SuccessIcon = () => {
  return (
    <Image source={images.success} className="size-8" resizeMode="contain" />
  );
};

const WarningIcon = () => {
  return (
    <Image source={images.warning} className="size-8" resizeMode="contain" />
  );
};

const DangerIcon = () => {
  return (
    <Image source={images.danger} className="size-8" resizeMode="contain" />
  );
};

const InfoIcon = () => {
  return (
    <Image
      source={images.information}
      className="size-8"
      resizeMode="contain"
    />
  );
};

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <ToastProvider
        placement="top"
        duration={3000}
        animationType="zoom-in"
        animationDuration={250}
        successColor="#aaf683"
        dangerColor="#ff9b85"
        warningColor="#f7ee7f"
        normalColor="#d8e2dc"
        successIcon={<SuccessIcon />}
        dangerIcon={<DangerIcon />}
        warningIcon={<WarningIcon />}
        textStyle={{
          fontSize: 14,
          color: "#161622",
          fontFamily: "Poppins-Regular",
          width: "90%",
          marginLeft: 10,
        }}
        offset={50}
        offsetTop={30}
        offsetBottom={40}
        swipeEnabled={true}
      >
        <GlobalProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="search/[query]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="video-view/VideoPlayer"
              options={{ headerShown: false }}
            />
          </Stack>
        </GlobalProvider>
      </ToastProvider>
      <StatusBar style="light" backgroundColor="#161622" />
    </>
  );
}
