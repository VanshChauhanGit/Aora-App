import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { images } from "@/constants";
import { getUserBookmarkSavedPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";

const Saved = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const { user, setUser, isLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() =>
    getUserBookmarkSavedPosts(user.$id)
  );

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
        data={posts}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            isActive={activeVideo === item.title}
            setActiveVideo={setActiveVideo}
            isLocalStorage={false}
          />
        )}
        ListHeaderComponent={() => (
          <View className="gap-6 px-4 my-6">
            <Text className="text-2xl text-white font-psemibold">
              Saved Videos
            </Text>

            {/* <SearchInput placeholder={"Search your saved videos"} /> */}
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No Saved Videos Yet"}
            subtitle="Your saved videos will appear here"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Saved;
