import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
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
  const {
    data: posts,
    refetch,
    isLoading,
  } = useAppwrite(() => getUserBookmarkSavedPosts(user.$id));

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading || !posts) {
    return (
      <SafeAreaView className="items-center justify-center min-h-full bg-primary">
        <ActivityIndicator size={"large"} color={"#FFA001"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="min-h-full bg-primary">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
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
