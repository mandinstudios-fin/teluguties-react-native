import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Text,
} from "react-native";
import ImageSlider from "react-native-image-slider";

const Slider = ({images}) => {
  const { width, height: screenHeight } = Dimensions.get("window");
  const height = screenHeight * 0.5;
  const [active, setActive] = useState(0);
  const onScrollChange = ({ nativeEvent }) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );
    if (slide !== active) {
      setActive(slide);
    }
  };
  return (
    <View>
      <ScrollView
        pagingEnabled
        horizontal
        onScroll={onScrollChange}
        showsHorizontalScrollIndicator={false}
        style={{ width, height, backgroundColor: "#fff" }}
        contentContainerStyle={{ paddingHorizontal: 15, }}
      >
        {images.map((image, index) => (
          <View key={index} style={{ width: width - 30,  }}>
            <Image
            key={index}
            source={{ uri: image }}
            style={{  width: "100%", height, resizeMode: "cover",borderRadius: 10  }}
          />
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((i, k) => (
          <Text key={k} style={k == active ? styles.activeDot : styles.dot}>
            •
          </Text>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: -15,
    alignSelf: "center",
  },
  dot: {
    color: "#888",
    fontSize: 50,
  },
  activeDot: {
    color: "#FFF",
    fontSize: 50,
  },
});
export default Slider;