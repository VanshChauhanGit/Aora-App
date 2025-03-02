import { View, Text } from "react-native";
import React from "react";

const InfoBox = ({ title, containerStyles, titleStyles, subtitle }) => {
  return (
    <View className={`${containerStyles}`}>
      <Text className={`${titleStyles} text-white text-center font-psemibold`}>
        {title}
      </Text>
      <Text className="text-sm text-center text-gray-100 font-pregular">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
