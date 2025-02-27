import { useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";
import { useVideoPlayer, VideoView } from "expo-video";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useVideoPlayer(
    "",
    (player) => {
      player.loop = true;
      player.staysActiveInBackground = true;
      AbortController
      // player.play();
    }
  );

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {isPlaying ? (
        <View>
          <VideoView
            player={player}
            style={{ width: Dimensions.get("window").width, height: 300 }}
            allowsFullscreen
            allowsPictureInPicture
            className="rounded-[35px] w-52 h-72 overflow-hidden my-2 shadow-lg shadow-black/40"
            resizeMode="cover"
          />
        </View>
      ) : (
        <TouchableOpacity
          className="relative items-center justify-center"
          activeOpacity={0.7}
          onPress={togglePlay()}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="rounded-[35px] w-52 h-72 overflow-hidden my-2 shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="absolute size-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
      contentOffset={{ x: 105 }}
      horizontal
    />
  );
};

export default Trending;
