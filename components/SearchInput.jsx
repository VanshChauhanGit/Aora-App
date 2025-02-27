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

const SearchInput = ({ initailValue }) => {
  const [query, setQuery] = useState(initailValue || "");
  const pathname = usePathname();
  return (
    <View className="relative w-full h-16 bg-black-100 rounded-2xl items-center  flex-row justify-center">
      <TextInput
        className="flex-1 h-full w-full px-4 rounded-2xl border-black-200 text-white border-2 focus:border-secondary text-xl font-pregular"
        value={query}
        placeholder="Search topic for videos"
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
