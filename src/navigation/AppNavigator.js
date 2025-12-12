import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import PlansScreen from '../screens/PlansScreen';
import TrackerScreen from '../screens/TrackerScreen';
import AiCoachScreen from '../screens/AiCoachScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../theme/styles';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused }) => {
            let iconName;
            let IconLib = Ionicons;

            // Icon Mapping
            if (route.name === 'Home') iconName = focused ? 'grid' : 'grid-outline';
            else if (route.name === 'Plans') { IconLib = MaterialCommunityIcons; iconName = focused ? 'dumbbell' : 'dumbbell'; }
            else if (route.name === 'AI') iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
            else if (route.name === 'Tracker') iconName = focused ? 'navigate-circle' : 'navigate-circle-outline';
            else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

            return (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <IconLib 
                    name={iconName} 
                    size={26} // Increased size for visibility
                    color={focused ? COLORS.black : COLORS.gray} 
                />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Plans" component={PlansScreen} />
        <Tab.Screen name="AI" component={AiCoachScreen} />
        <Tab.Screen name="Tracker" component={TrackerScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#1c1c1e',
    borderRadius: 35,
    height: 75,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconActive: {
    backgroundColor: COLORS.white,
    transform: [{ scale: 1.1 }], // Subtle pop effect
  }
});