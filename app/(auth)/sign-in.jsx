import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";
import { getCurrentUser, SignIn as SignInUSer } from "@/lib/appwrite";
import { images } from "@/constants";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { isLoading, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill all fields!");
    }

    setIsSubmiting(true);

    try {
      await SignInUSer(form.email, form.password);
      const res = await getCurrentUser();
      setUser(res);
      setIsLoggedIn(true);

      router.replace("/home");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmiting(false);
    }
  };
  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView contentContainerStyle={{ height: "90%" }}>
        <View className="justify-center items-center w-full h-full px-4 my-6">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Text className="text-white text-2xl font-semibold font-psemibold mt-10">
            Log in to Aora
          </Text>
          <FormField
            title={"Email"}
            value={form.email}
            placeholder="Enter your email"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
            otherStyles="mt-7"
          />
          <FormField
            title={"Password"}
            value={form.password}
            placeholder="Enter your password"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            isLoading={isSubmiting}
            containerStyles="mt-7 w-full"
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-gray-100 text-lg font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-secondary text-lg font-psemibold"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
