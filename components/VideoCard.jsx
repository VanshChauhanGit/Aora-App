import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import {
  savePostToBookmark,
  removePostFromBookmark,
  deletePost,
} from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";

const VideoCard = ({ video, refetch, isEditing }) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const router = useRouter();

  const { user } = useGlobalContext();
  const toast = useToast();

  const isSaved = video.saved?.some((savedUser) => savedUser.$id === user.$id);

  const handleSavePost = async () => {
    setMenuOpened(false);
    try {
      await savePostToBookmark(video.$id, user.$id);
      refetch();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleRemovePost = async () => {
    setMenuOpened(false);
    try {
      await removePostFromBookmark(video.$id, user.$id);
      refetch();
    } catch (error) {
      console.error("Error removing post:", error);
    }
  };

  const handleDeletePost = async () => {
    setMenuOpened(false);
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
          <TouchableOpacity onPress={() => setMenuOpened(!menuOpened)}>
            <Image
              source={icons.menu}
              className="size-6"
              resizeMode="contain"
            />
          </TouchableOpacity>

          {menuOpened && (
            <View className="absolute z-50 bg-black-100 rounded-lg right-3 top-10 w-[111px] border border-black-200 flex-col pl-4 justify-evenly py-2">
              {isSaved ? (
                <TouchableOpacity
                  className="flex-row items-center py-2 gap-x-2"
                  onPress={handleRemovePost}
                >
                  <Image
                    source={icons.bookmark}
                    className="size-4"
                    resizeMode="contain"
                  />
                  <Text className="text-white">Remove</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="flex-row items-center py-2 gap-x-2"
                  onPress={handleSavePost}
                >
                  <Image
                    source={icons.bookmark}
                    className="size-4"
                    resizeMode="contain"
                  />
                  <Text className="text-white">Save</Text>
                </TouchableOpacity>
              )}
              {isEditing && (
                <TouchableOpacity
                  className="flex-row items-center py-2 gap-x-2"
                  onPress={handleDeletePost}
                >
                  <Image
                    source={icons.trash}
                    className="size-5"
                    resizeMode="contain"
                  />

                  <Text className="text-white">Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default VideoCard;
