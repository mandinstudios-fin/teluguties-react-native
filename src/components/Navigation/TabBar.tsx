import { StyleSheet, View, LayoutChangeEvent, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BadgeIndianRupee, HandCoins, Handshake, Heart, House, LayoutDashboard } from 'lucide-react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute, useRoute } from '@react-navigation/native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import TabBarButton from './TabBarButton';

export const icons = {
    HomeStack: (props) => <House strokeWidth={1} {...props} />,
    MatchesStack: (props) => <Heart strokeWidth={1} {...props} />,
    PrimeStack: (props) => <BadgeIndianRupee strokeWidth={1} {...props} />,
    AgentsStack: (props) => <Handshake strokeWidth={1} {...props} />,

    AgentsHomeStack: (props) => <House strokeWidth={1} {...props} />,
    AgentsAssignStack: (props) => <LayoutDashboard strokeWidth={1} {...props} />,
    AgentsEarn: (props) => <HandCoins strokeWidth={1} {...props} />,
};

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const [dimensions, setDimensions] = useState({ height: 60, width: 100 });
    const buttonWidth = dimensions.width / state.routes.length;

    const onTabBarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        });
    };

    const currentRoute = state.routes[state.index];
    console.log(state.routeNames)
    if (currentRoute.params?.hideTabBar) {
        return null; // Hide the tab bar
      }

    const tabPositionX = useSharedValue(buttonWidth * state.index);

    useEffect(() => {
        tabPositionX.value = withSpring(buttonWidth * state.index, {
            damping: 15,
            stiffness: 180,
            mass: 0.5,
            velocity: 20
        });
    }, [state.index, buttonWidth]);

    const animatedStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: tabPositionX.value }] };
    });

    return (
        <View style={styles.tabBar} onLayout={onTabBarLayout}>
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        backgroundColor: '#7b2a38',
                        borderRadius: 30,
                        marginHorizontal: 12,
                        height: dimensions.height - 15,
                        width: buttonWidth - 25,
                        zIndex: 1,
                    },
                    animatedStyle
                ]}
            />
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const title = options.title

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.name,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        tabPositionX.value = withSpring(buttonWidth * index, {
                            damping: 15,
                            stiffness: 180,
                            mass: 0.5,
                            velocity: 20
                        });
                        navigation.navigate(route.name);
                    }
                };

                const IconComponent = icons[route.name];

                return (
                    <TabBarButton
                        key={route.key}
                        onPress={onPress}
                        isFocused={isFocused}
                        routeName={title}
                        color={isFocused ? '#fff' : '#000'}
                        icon={IconComponent}
                        animationSpeed="fast"
                    />
                );
            })}
        </View>
    );
};

export default TabBar;

const styles = StyleSheet.create({
    tabBar: {
        bottom: 10,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 30,
        borderTopWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 12,
        shadowOpacity: 0.2,
        elevation: 10,
        marginHorizontal: 10,
    },
});