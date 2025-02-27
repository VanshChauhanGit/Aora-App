import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import { images } from "@/constants";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";

const Profile = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const { user, setUser, isLoggedIn } = useGlobalContext();

  const localVideos = [
    {
      title: "Get inspired to code",
      thumbnail: "https://i.ibb.co/tJBcX20/Appwrite-video.png",
      video: require("@/assets/videos/Video1.mp4"),
      prompt:
        "Create a motivating AI driven video aimed at inspiring coding enthusiasts with simple language",
      creator: {
        username: "Vansh1411r",
        avatar: require("@/assets/images/profile.png"),
      },
    },
    {
      title: "How AI Shapes Coding Future",
      thumbnail: "https://i.ibb.co/Xkgk7DY/Video.png",
      video: require("@/assets/videos/Video2.mp4"),
      prompt: "Picture the future of coding with AI. Show AR VR",
      creator: {
        username: "Vansh1411r",
        avatar: require("@/assets/images/logo-small.png"),
      },
    },
    {
      title: "Dalmatian's journey through Italy",
      thumbnail: "https://i.ibb.co/CBYzyKh/Video-1.png",
      video: require("@/assets/videos/Video3.mp4"),
      prompt:
        "Create a heartwarming video following the travels of dalmatian dog exploring beautiful Italy",
      creator: {
        username: "Vansh1411r",
        avatar: require("@/assets/images/logo.png"),
      },
    },
    {
      title: "Meet small AI friends",
      thumbnail: "https://i.ibb.co/7XqVPVT/Photo-1677756119517.png",
      video: require("@/assets/videos/Video4.mp4"),
      prompt:
        "Make a video about a small blue AI robot blinking its eyes and looking at the screen",
      creator: {
        username: "Vansh1411r",
        avatar: require("@/assets/images/empty.png"),
      },
    },
    {
      title: "Find inspiration in Every Line",
      thumbnail: "https://i.ibb.co/mGfCYJY/Video-2.png",
      video: require("@/assets/videos/Video5.mp4"),
      prompt:
        "A buy working on his laptop that sparks excitement for coding, emphasizing the endless possibilities and personal growth it offers",
      creator: {
        username: "Vansh1411r",
        avatar: require("@/assets/images/logo-small.png"),
      },
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="min-h-full bg-primary">
      <FlatList
        data={localVideos}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            isActive={activeVideo === item.title}
            setActiveVideo={setActiveVideo}
            isLocalStorage={true}
          />
        )}
        ListHeaderComponent={() => (
          <View className="px-4 my-6 space-y-6">
            <View className="flex-row items-start justify-between mb-6">
              <View>
                <Text className="text-sm text-gray-100 font-pmedium">
                  Welcome back,
                </Text>
                <Text className="text-2xl text-white font-psemibold">
                  Vansh
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="h-10 w-9"
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No Videos Found"}
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
