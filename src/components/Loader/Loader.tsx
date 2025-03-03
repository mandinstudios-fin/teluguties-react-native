import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const Loader = () => {
  const dots = Array.from({ length: 9 }, () => useRef(new Animated.Value(1)).current);

  useEffect(() => {
    dots.forEach((dot, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1.5,
            duration: [1500, 1300, 1700, 1100, 900, 700, 500, 1300, 1500][index],
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 1,
            duration: [1500, 1300, 1700, 1100, 900, 700, 500, 1300, 1500][index],
            useNativeDriver: true,
          })
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.loader}>
      {dots.map((dot, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              transform: [{ scale: dot }],
              opacity: dot.interpolate({
                inputRange: [1, 1.5],
                outputRange: [0.6, 1],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    width: 70,
    flexWrap: "wrap",
    justifyContent: "center",
    flexDirection: "row",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#a52a2a",
    margin: 4,
  },
});

export default Loader;
