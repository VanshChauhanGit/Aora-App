import {
  View,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import { icons } from "@/constants";
import { getFollowers, getUserPosts, signOut } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import InfoBox from "@/components/InfoBox";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import Model from "@/components/Model";
import { useToast } from "react-native-toast-notifications";

const Profile = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { user, setUser, isLoggedIn } = useGlobalContext();
  const toast = useToast();
  const {
    data: posts,
    refetch,
    isLoading,
  } = useAppwrite(() => getUserPosts(user.$id));

  const { data: followers, await: refetchFollowers } = useAppwrite(() =>
    getFollowers(user.$id)
  );

  const logout = async () => {
    await signOut();
    toast.show("Logged out successfully!", { type: "success" });
    router.replace("/sign-in");
    setUser(null);
    isLoggedIn(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await refetchFollowers();
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
        renderItem={({ item }) => (
          <VideoCard video={item} refetch={refetch} isEditing={true} />
        )}
        ListHeaderComponent={() => (
          <View className="items-center justify-center w-full px-4 my-10">
            <TouchableOpacity
              className="items-end w-full mb-2"
              onPress={() => setShowModal(true)}
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
                title={followers?.length}
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
      <Model
        visible={showModal}
        onClose={() => setShowModal(false)}
        onLogout={logout}
      />
    </SafeAreaView>
  );
};

export default Profile;
