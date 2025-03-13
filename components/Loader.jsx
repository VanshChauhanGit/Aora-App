import { View, ActivityIndicator } from "react-native";

const Loader = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50 items-center justify-center h-full bg-black/40">
      <View className="items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl">
        <ActivityIndicator size="large" color="#FF9C01" />
      </View>
    </View>
  );
};

export default Loader;
