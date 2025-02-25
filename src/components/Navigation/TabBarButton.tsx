import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  interpolate 
} from 'react-native-reanimated';

const TabBarButton = ({ onPress, isFocused, routeName, color, animationSpeed, icon: Icon }) => {
  const scale = useSharedValue(isFocused ? 1 : 0);
  
  useEffect(() => {
    const config = animationSpeed === "fast" 
      ? { 
          damping: 12, 
          stiffness: 180,
          mass: 0.6,
          velocity: 15
        } 
      : {
          damping: 10, 
          stiffness: 100
        };
    
    scale.value = withSpring(isFocused ? 1 : 0, config);
  }, [scale, isFocused, animationSpeed]);
  
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return { opacity };
  });
  
  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const translateY = interpolate(scale.value, [0, 1], [0, 9]);
    
    return {
      transform: [
        { scale: scaleValue },
        { translateY }
      ]
    };
  });
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabButton}
      activeOpacity={0.7}
    >
      <Animated.View style={animatedIconStyle}>
        {Icon && <Icon color={color} size={20} />}
      </Animated.View>
      <Animated.Text style={[styles.tabText, { color }, animatedTextStyle]}>
        {routeName.replace('Stack', '')}
      </Animated.Text>
    </TouchableOpacity>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 2
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});