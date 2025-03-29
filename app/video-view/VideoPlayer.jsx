import {
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { useLocalSearchParams } from "expo-router";
import {
  getSameUserPostsWithoutPlayingPost,
  isFollowingUser,
  followUser,
  unfollowUser,
  getFollowers,
  getVideoLikes,
  isVideoLikedByUser,
  likeVideo,
  unlikeVideo,
} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/utils";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useToast } from "react-native-toast-notifications";
import Icon from "react-native-vector-icons/FontAwesome";

const VideoPlayer = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const { videoData } = useLocalSearchParams();
  const video = JSON.parse(videoData);
  const { data: posts, refetch } = useAppwrite(() =>
    getSameUserPostsWithoutPlayingPost(video.creator.$id, video.$id)
  );

  const { user, setUser, isLoggedIn } = useGlobalContext();

  const videoUrl = require("@/assets/Video5.mp4");
  const toast = useToast();

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

  const { data: isFollowing, refetch: refetchFollowing } = useAppwrite(() =>
    isFollowingUser(user.$id, video.creator.$id)
  );

  const { data: followers, refetch: refetchFollowers } = useAppwrite(() =>
    getFollowers(video.creator.$id)
  );

  const { data: likes, refetch: refetchLikes } = useAppwrite(() =>
    getVideoLikes(video.$id)
  );

  const { data: isVideoLiked, refetch: refetchIsVideoLiked } = useAppwrite(
    async () => await isVideoLikedByUser(video.$id, user.$id)
  );

  const follow = async () => {
    setIsFollowLoading(true);
    try {
      const response = await followUser(user.$id, video.creator.$id);
      if (response.success) {
        // toast.show("Followed successfully!", { type: "success" });
        await refetchFollowing();
        await refetchFollowers();
      }
    } catch (error) {
      console.error("Error following user:", error);
      toast.show("Failed to follow user", { type: "danger" });
    } finally {
      setIsFollowLoading(false);
    }
  };

  const unfollow = async () => {
    setIsFollowLoading(true);
    try {
      const response = await unfollowUser(user.$id, video.creator.$id);
      if (response.success) {
        // toast.show("Unfollowed successfully!", { type: "success" });
        await refetchFollowing();
        await refetchFollowers();
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast.show("Failed to unfollow user", { type: "danger" });
    } finally {
      setIsFollowLoading(false);
    }
  };

  const like = async () => {
    setIsLikeLoading(true);
    try {
      const response = await likeVideo(video.$id, user.$id);
      if (response.success === true) {
        toast.show("Liked successfully!", { type: "success" });
        await refetchIsVideoLiked();
        await refetchLikes();
      }
    } catch (error) {
      console.error("Error to like the video:", error);
      toast.show("Failed to like video", { type: "danger" });
    } finally {
      setIsLikeLoading(false);
    }
  };

  const unlike = async () => {
    setIsLikeLoading(true);
    try {
      const response = await unlikeVideo(video.$id, user.$id);
      if (response.success === true) {
        toast.show("Unliked successfully!", { type: "success" });
        await refetchIsVideoLiked();
        await refetchLikes();
      }
    } catch (error) {
      console.error("Error to unlike the video:", error);
      toast.show("Failed to unlike video", { type: "danger" });
    } finally {
      setIsLikeLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await refetch();
      setIsLoading(false);
    };

    fetchData();
  }, [videoData]);

  return (
    <SafeAreaView className="h-full gap-2 bg-primary">
      <View className="items-center justify-center w-full rounded-xl h-60">
        <VideoView
          player={player}
          style={{ width: "100%", height: "100%" }}
          allowsFullscreen
          contentFit="cover"
        />
      </View>

      <View className="gap-2 pb-2 mx-4 border-b border-gray-100/50">
        <View className="">
          <Text className="text-2xl text-white font-pregular" numberOfLines={2}>
            {video.title}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-x-2">
            <Image
              source={require("@/assets/icons/eye.png")}
              className="w-5 h-5"
            />
            <Text className="text-sm text-gray-100 font-pregular">
              69 views
            </Text>
          </View>
          <View className="bg-white size-0.5" />
          <Text className="text-sm text-gray-100 font-pregular">
            {timeAgo(video.$createdAt)}
          </Text>
        </View>

        <View className="flex-row items-center gap-x-2">
          <TouchableOpacity
            onPress={isVideoLiked ? unlike : like}
            disabled={isLikeLoading}
            className={`flex-row items-center justify-center p-2 px-4 rounded-full bg-gray-100/20 align-center ${
              isLikeLoading ? "opacity-50" : ""
            }`}
          >
            <Icon
              name={isVideoLiked ? "heart" : "heart-o"}
              size={20}
              color={isVideoLiked ? "#FF9C01" : "white"}
              style={{ marginRight: 7 }}
            />
            <Text className="text-lg text-white">{likes.length}</Text>
          </TouchableOpacity>
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
              <Text
                className="text-sm text-gray-100 font-pregular"
                numberOfLines={1}
              >
                {followers.length} Followers
              </Text>
            </View>

            {isFollowing ? (
              <TouchableOpacity
                onPress={unfollow}
                disabled={isFollowLoading}
                className={`items-center justify-center p-2 px-5 border rounded-lg bg-black-200 border-secondary ${
                  isFollowLoading ? "opacity-50" : ""
                }`}
              >
                <Text className="text-lg text-white font-pregular">
                  Following
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={follow}
                disabled={isFollowLoading}
                className={`items-center justify-center p-2 px-5 border rounded-lg bg-secondary-100 border-black-200 ${
                  isFollowLoading ? "opacity-50" : ""
                }`}
              >
                <Text className="text-lg text-primary font-pregular">
                  Follow
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {isLoading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size={"large"} color="#FF9C01" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <VideoCard video={item} isLocalStorage={false} />
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title={"No Videos"}
              subtitle="This user not uploaded other videos"
              isBtn={false}
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
