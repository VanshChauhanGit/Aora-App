import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { useLocalSearchParams } from "expo-router";
import {
  getUserPosts,
  getSameUserPostsWithoutPlayingPost,
} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import { useEffect, useState } from "react";

const VideoPlayer = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { videoData } = useLocalSearchParams();
  const video = JSON.parse(videoData);
  const { data: posts, refetch } = useAppwrite(() =>
    getSameUserPostsWithoutPlayingPost(video.creator.$id, video.$id)
  );

  const videoUrl = require("@/assets/Video5.mp4");

  const player = useVideoPlayer(videoUrl, (player) => {
    player.play();
    player.allowsExternalPlayback = true;
    player.allowsPictureInPicturePlayback = true;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // when click on other videocard then refetch the all posts
  useEffect(() => {
    const fetchData = async () => {
      await refetch();
      setIsLoading(false);
    };

    fetchData();
  }, [posts, refetch, player]);

  return (
    <SafeAreaView className="h-full bg-primary gap-3">
      <View className="items-center justify-center w-full rounded-xl h-60">
        <VideoView
          player={player}
          style={{ width: "100%", height: "100%" }}
          allowsFullscreen
          contentFit="cover"
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl text-white font-psemibold">Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <VideoCard video={item} isLocalStorage={false} />
          )}
          ListHeaderComponent={() => (
            <View className="gap-3 mb-3 mx-4 pb-3 border-b border-gray-100/50">
              <View className="">
                <Text
                  className="text-2xl text-white font-pregular"
                  numberOfLines={2}
                >
                  {video.title}
                </Text>
              </View>

              <View className="flex-row ">
                <View className="flex-row items-center justify-center flex-1">
                  <View className="w-[50px] h-[50px] rounded-lg border border-secondary justify-center items-center">
                    <Image
                      source={{ uri: video.creator.avatar }}
                      className="w-full h-full rounded-lg"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="justify-center flex-1 ml-3 gap-y-1">
                    <Text
                      className="text-xl text-gray-100 font-psemibold"
                      numberOfLines={1}
                    >
                      {video.creator.username}
                    </Text>
                  </View>

                  {/* Follow Button */}
                  {/* <TouchableOpacity className="items-center justify-center p-2 bg-secondary-100 rounded-lg px-5">
                  <Text className="text-lg text-primary font-pregular">Follow</Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title={"No Saved Videos"}
              subtitle="Your saved videos will appear here"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default VideoPlayer;
