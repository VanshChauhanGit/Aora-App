import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { VideoView, useVideoPlayer } from "expo-video";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { createPost } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useToast } from "react-native-toast-notifications";
import Loader from "@/components/Loader";

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const { user } = useGlobalContext();
  const toast = useToast();

  const player = useVideoPlayer(form?.video?.uri, (player) => {
    player.loop = true;
  });

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "video"
          ? ["video/mp4", "video/gif"]
          : ["image/png", "image/jpg", "image/jpeg"],
    });

    if (!result.canceled) {
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }

      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    setUploading(true);

    try {
      await createPost({ ...form, userId: user.$id });
      toast.show("Post uploaded successfully!", {
        type: "success",
      });
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setUploading(false);
    }
  };

  return (
    <>
      <Loader visible={uploading} />

      <SafeAreaView className="h-full bg-primary">
        <ScrollView className="px-4 mt-5">
          <Text className="text-2xl text-white font-psemibold">
            Upload Video
          </Text>
          <FormField
            title="Video Title"
            value={form.title}
            placeholder="Give your video a catchy title!"
            handleChangeText={(e) => setForm({ ...form, title: e })}
            otherStyles={"mt-10"}
            disable={uploading}
            numberOfLines={5}
          />

          <View className="w-full gap-2 mt-7">
            <Text className="text-base text-gray-100 font-pmedium">
              Upload Video
            </Text>

            <TouchableOpacity onPress={() => openPicker("video")}>
              {form.video ? (
                <View className="items-center justify-center w-full mb-3 border h-60 border-secondary/20 rounded-xl">
                  <VideoView
                    player={player}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                    nativeControls={false}
                    contentFit="cover"
                  />
                </View>
              ) : (
                <View className="items-center justify-center w-full h-40 px-4 bg-black-100 rounded-2xl">
                  <View className="items-center justify-center border border-dashed size-14 border-secondary-100">
                    <Image
                      source={icons.upload}
                      className="w-1/2 h-1/2 "
                      resizeMode="contain"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="gap-2 mt-7">
            <Text className="text-base text-gray-100 font-pmedium">
              Thumbnail Image
            </Text>

            <TouchableOpacity onPress={() => openPicker("image")}>
              {form.thumbnail ? (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  className="w-full h-60 rounded-2xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex-row items-center justify-center w-full h-16 gap-2 px-4 border-2 bg-black-100 rounded-2xl border-black-200">
                  <Image
                    source={icons.upload}
                    className="size-7"
                    resizeMode="contain"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <FormField
            title="AI Prompt"
            value={form.prompt}
            placeholder="The prompt you used to create this video"
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
            otherStyles={"mt-7"}
            disable={uploading}
          />

          <CustomButton
            title="Upload Video"
            containerStyles={"my-7"}
            isLoading={uploading}
            handlePress={submit}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Create;
