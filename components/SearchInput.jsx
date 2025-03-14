import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({ initialValue, placeholder }) => {
  const [query, setQuery] = useState(initialValue || "");
  const pathname = usePathname();
  return (
    <View className="relative flex-row items-center justify-center w-full h-16 bg-black-100 rounded-2xl">
      <TextInput
        className="flex-1 w-full h-full px-4 text-xl text-white border-2 rounded-2xl border-black-200 focus:border-secondary font-pregular"
        value={query}
        placeholder={placeholder}
        onChangeText={setQuery}
        placeholderTextColor="#CDCDE0"
      />

      <TouchableOpacity
        className="absolute right-4"
        onPress={() => {
          if (!query) {
            Alert.alert(
              "Missing Query",
              "Please enter something to search results!"
            );
          }

          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} className="size-7" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
