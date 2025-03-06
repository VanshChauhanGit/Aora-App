import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import { icons } from "@/constants";
import { getUserPosts, signOut } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import InfoBox from "@/components/InfoBox";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";

const Profile = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const { user, setUser, isLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

  //   {
  //     title: "Get inspired to code",
  //     thumbnail: "https://i.ibb.co/tJBcX20/Appwrite-video.png",
  //     video: require("@/assets/videos/Video1.mp4"),
  //     prompt:
  //       "Create a motivating AI driven video aimed at inspiring coding enthusiasts with simple language",
  //     creator: {
  //       username: "Vansh1411r",
  //       avatar: require("@/assets/images/profile.png"),
  //     },
  //   },
  //   {
  //     title: "How AI Shapes Coding Future",
  //     thumbnail: "https://i.ibb.co/Xkgk7DY/Video.png",
  //     video: require("@/assets/videos/Video2.mp4"),
  //     prompt: "Picture the future of coding with AI. Show AR VR",
  //     creator: {
  //       username: "Vansh1411r",
  //       avatar: require("@/assets/images/logo-small.png"),
  //     },
  //   },
  //   {
  //     title: "Dalmatian's journey through Italy",
  //     thumbnail: "https://i.ibb.co/CBYzyKh/Video-1.png",
  //     video: require("@/assets/videos/Video3.mp4"),
  //     prompt:
  //       "Create a heartwarming video following the travels of dalmatian dog exploring beautiful Italy",
  //     creator: {
  //       username: "Vansh1411r",
  //       avatar: require("@/assets/images/logo.png"),
  //     },
  //   },
  //   {
  //     title: "Meet small AI friends",
  //     thumbnail: "https://i.ibb.co/7XqVPVT/Photo-1677756119517.png",
  //     video: require("@/assets/videos/Video4.mp4"),
  //     prompt:
  //       "Make a video about a small blue AI robot blinking its eyes and looking at the screen",
  //     creator: {
  //       username: "Vansh1411r",
  //       avatar: require("@/assets/images/empty.png"),
  //     },
  //   },
  //   {
  //     title: "Find inspiration in Every Line",
  //     thumbnail: "https://i.ibb.co/mGfCYJY/Video-2.png",
  //     video: require("@/assets/videos/Video5.mp4"),
  //     prompt:
  //       "A buy working on his laptop that sparks excitement for coding, emphasizing the endless possibilities and personal growth it offers",
  //     creator: {
  //       username: "Vansh1411r",
  //       avatar: require("@/assets/images/logo-small.png"),
  //     },
  //   },
  // ];

  const logout = async () => {
    await signOut();
    setUser(null);
    isLoggedIn(false);

    router.replace("/sign-in");
  };

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
          <View className="items-center justify-center w-full px-4 my-10">
            <TouchableOpacity
              className="items-end w-full mb-2"
              onPress={logout}
            >
              <Image
                source={icons.logout}
                className="size-8"
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View className="items-center justify-center border rounded-lg size-20 border-secondary">
              <Image
                source={{ uri: user?.avatar }}
                className="w-full h-full rounded-lg"
                resizeMode="contain"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles={"mt-5"}
              titleStyles={"text-3xl"}
              subtitle={user?.email}
            />

            <View className="flex-row mt-5">
              <InfoBox
                title={posts?.length || 0}
                containerStyles={"mr-10"}
                titleStyles={"text-xl"}
                subtitle={"Posts"}
              />
              <InfoBox
                title={"1.2k"}
                titleStyles={"text-xl"}
                subtitle={"Followers"}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No videos created yet"}
            subtitle="Upload your first video!"
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
