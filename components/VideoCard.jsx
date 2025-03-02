import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "@/constants";
import { useVideoPlayer, VideoView } from "expo-video";
import { savePostToBookmark } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const VideoCard = ({
  video: {
    title,
    $id: videoId,
    thumbnail,
    video: videoUrl,
    creator: { username, avatar },
  },
  isActive,
  setActiveVideo,
  isLocalStorage = false,
}) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const player = useVideoPlayer(videoUrl, (player) => {
    player.allowsExternalPlayback = true;
    player.allowsPictureInPicturePlayback = true;
  });

  const { user } = useGlobalContext();

  const handleSavePost = async () => {
    setMenuOpened(false);
    await savePostToBookmark(videoId, user.$id);
    return;
  };

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive]);

  return (
    <View className="flex-col items-center px-4 mb-12">
      {isActive ? (
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
      )}
      <View className="flex-row">
        <View className="flex-row items-center justify-center flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={isLocalStorage ? avatar : { uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-sm text-white font-psemibold"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
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
              {/* <TouchableOpacity>
                <View className="flex-row items-center gap-x-2">
                  <Image
                    source={icons.eye}
                    className="size-3"
                    resizeMode="contain"
                  />
                  <Text className="text-white">Save</Text>
                </View>
              </TouchableOpacity> */}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default VideoCard;
