import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

const ModelBox = ({ visible, onClose, onLogout }) => {
  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.6}
      animationIn="slideInRight"
      animationOut="slideOutLeft"
      animationInTiming={500}
      animationOutTiming={500}
    >
      <View className="p-6 mx-auto rounded-lg shadow-lg bg-primary w-80">
        {/* Close Button */}
        <TouchableOpacity
          className="absolute p-2 top-2 right-2"
          onPress={onClose}
        >
          <Text className="text-lg text-gray-400">✖</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-xl font-bold text-center text-white">
          Are you sure?
        </Text>

        {/* Description */}
        <Text className="mt-2 text-center text-gray-300">
          Do you really want to log out?
        </Text>

        {/* Buttons */}
        <View className="flex-row justify-between mt-5">
          <TouchableOpacity
            className="px-4 py-2 bg-gray-700 rounded-md"
            onPress={onClose}
          >
            <Text className="text-gray-300">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-4 py-2 bg-red-600 rounded-md"
            onPress={onLogout}
          >
            <Text className="text-white">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModelBox;
