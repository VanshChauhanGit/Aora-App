import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { icons } from "@/constants";
import {
  savePostToBookmark,
  removePostFromBookmark,
  deletePost,
} from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import RBSheet from "react-native-raw-bottom-sheet";

const VideoCard = ({ video, refetch, isEditing }) => {
  const router = useRouter();

  const { user } = useGlobalContext();
  const toast = useToast();

  const refRBSheet = useRef();

  const isSaved = video.saved?.some((savedUser) => savedUser.$id === user.$id);

  const handleSavePost = async () => {
    refRBSheet.current.close();
    try {
      await savePostToBookmark(video.$id, user.$id);
      refetch();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleRemovePost = async () => {
    refRBSheet.current.close();
    try {
      await removePostFromBookmark(video.$id, user.$id);
      refetch();
    } catch (error) {
      console.error("Error removing post:", error);
    }
  };

  const handleDeletePost = async () => {
    refRBSheet.current.close();
    try {
      await deletePost(video.$id);
      refetch();
      toast.show("Post deleted successfully!", {
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-12">
      <TouchableOpacity
        onPress={() => {
          setMenuOpened(false);
          router.push({
            pathname: "/video-view/VideoPlayer",
            params: { videoData: JSON.stringify(video) },
          });
        }}
        activeOpacity={0.7}
        className="relative items-center justify-center w-full mb-3 rounded-xl h-60"
      >
        <Image
          source={{ uri: video.thumbnail }}
          className="w-full h-full border rounded-xl border-secondary/10"
          resizeMode="cover"
        />

        <Image
          source={icons.play}
          className="absolute size-12"
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View className="flex-row">
        <View className="flex-row items-center justify-center flex-1">
          <View className="w-[46px] h-[46px] rounded-full border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: video.creator.avatar }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-sm text-white font-psemibold"
              numberOfLines={1}
            >
              {video.title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {video.creator.username}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <TouchableOpacity onPress={() => refRBSheet.current.open()}>
            <Image
              source={icons.menu}
              className="size-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <RBSheet
            ref={refRBSheet}
            useNativeDriver={false}
            draggable={true}
            customStyles={{
              draggableIcon: {
                backgroundColor: "#fff",
              },
              container: {
                width: "95%",
                height: "auto",
                borderRadius: 7,
                alignSelf: "center",
                backgroundColor: "#1E1E2D",
                marginBottom: 10,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              },
            }}
            customModalProps={{
              animationType: "slide",
              statusBarTranslucent: true,
            }}
            customAvoidingViewProps={{
              enabled: false,
            }}
          >
            <View className="z-50 flex-col items-center justify-center w-full gap-2 rounded-lg bg-black-100">
              <TouchableOpacity
                className="flex-row items-center w-full px-5 py-3 border border-white rounded-md gap-x-5"
                onPress={isSaved ? handleRemovePost : handleSavePost}
              >
                <Image
                  source={icons.bookmark}
                  className="size-4"
                  resizeMode="contain"
                />
                <Text className="text-xl text-white">
                  {isSaved ? "Unsave" : "Save"}
                </Text>
              </TouchableOpacity>

              {isEditing && (
                <TouchableOpacity
                  className="flex-row items-center w-full px-5 py-3 border border-white rounded-md gap-x-5"
                  onPress={handleDeletePost}
                >
                  <Image
                    source={icons.trash}
                    className="size-5"
                    resizeMode="contain"
                  />

                  <Text className="text-xl text-white">Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </RBSheet>
        </View>
      </View>
    </View>
  );
};

export default VideoCard;
