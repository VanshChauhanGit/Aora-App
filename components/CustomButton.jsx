import { TouchableOpacity, Text } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  containerStyles,
  handlePress,
  textStyles = "",
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`bg-secondary-200 min-h-[50px] items-center justify-center rounded-xl ${containerStyles}${
        isLoading ? " opacity-50" : ""
      }`}
      disabled={isLoading}
      activeOpacity={0.5}
    >
      <Text className={`text-lg text-primary font-psemibold ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
