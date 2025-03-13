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
// import Trending from "@/components/Trending";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, refetch, isLoading } = useAppwrite(getAllPosts);
  const { user, setUser, isLoggedIn } = useGlobalContext();

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
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => <VideoCard video={item} refetch={refetch} />}
        ListHeaderComponent={() => (
          <View className="px-4 my-6 space-y-6">
            <View className="flex-row items-start justify-between mb-6">
              <View>
                <Text className="text-sm text-gray-100 font-pmedium">
                  Welcome,
                </Text>
                <Text className="text-2xl text-white font-psemibold">
                  {user?.username}
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

            <SearchInput placeholder={"Search topic for videos"} />

            {/* <View className="flex-1 w-full pt-5 pb-8">
              <Text className="mb-3 text-lg text-gray-100 font-pregular">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View> */}
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

export default Home;
