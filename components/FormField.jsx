import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

const FormField = ({
  title,
  otherStyles,
  value,
  handleChangeText,
  placeholder = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`gap-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full h-16 bg-black-100 rounded-2xl border-2 border-black-200 px-4 items-center focus:border-secondary flex-row justify-center">
        <TextInput
          className="flex-1 text-white font-psemibold text-lg mt-1"
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          placeholderTextColor="#7b7b8b"
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="h-6 w-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
