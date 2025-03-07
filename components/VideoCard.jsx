import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "@/constants";
import { useVideoPlayer, VideoView } from "expo-video";
import { savePostToBookmark } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const VideoCard = ({
  video,
  isActive,
  setActiveVideo,
  isLocalStorage = false,
}) => {
  const [menuOpened, setMenuOpened] = useState(false);

  const navigation = useNavigation();
  const router = useRouter();

  const { user } = useGlobalContext();

  const handleSavePost = async () => {
    setMenuOpened(false);
    await savePostToBookmark(video.$id, user.$id);
    return;
  };

  return (
    <View className="flex-col items-center px-4 mb-12">
      {/* {isActive ? (
        <View className="items-center justify-center w-full mb-3 rounded-xl h-60">
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%" }}
            className="border rounded-xl border-secondary"
            allowsFullscreen
            allowsPictureInPicture
            startsPictureInPictureAutomatically
            contentFit="contain"
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setActiveVideo(title)}
          activeOpacity={0.7}
          className="relative items-center justify-center w-full mb-3 rounded-xl h-60"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full border rounded-xl border-secondary/10"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="absolute size-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )} */}

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/video-view/VideoPlayer",
            params: { videoData: JSON.stringify(video) },
          })
        }
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
              source={isLocalStorage ? avatar : { uri: video.creator.avatar }}
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
            <View className="absolute z-50 bg-black-100 rounded-lg right-3 top-10 w-[111px] border border-black-200 flex-col pl-4 justify-evenly">
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
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default VideoCard;
