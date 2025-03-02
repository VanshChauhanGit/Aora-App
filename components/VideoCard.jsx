import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "@/constants";
import { useVideoPlayer, VideoView } from "expo-video";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
  isActive,
  setActiveVideo,
  isLocalStorage = false,
}) => {
  const player = useVideoPlayer(video, (player) => {
    player.play();
    player.staysActiveInBackground = true;
    player.allowsExternalPlayback = true;
    player.allowsPictureInPicturePlayback = true;
  });

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
          <Image source={icons.menu} className="size-5" resizeMode="contain" />
        </View>
      </View>
    </View>
  );
};

export default VideoCard;
