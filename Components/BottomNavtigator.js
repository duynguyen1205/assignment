import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import Home from "./Home";
import Favorite from "./Favorite";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import COLORS from "../consts/colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {View} from 'react-native';

export default function BottomTabNavigator () {
    const Tab = createBottomTabNavigator();
    return (
      <Tab.Navigator
      screenOptions={{ 
          style: {
            height: 55,
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: COLORS.primary,
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={Home}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="home-filled" color={color} size={28} />
            ), headerShown: false
          }}
        />
        <Tab.Screen
          name="Search"
          component={Home}
          options={{
            tabBarIcon: ({color}) => (
              <View
                style={styles.searchIcon}>
                <Icon name="search" color={COLORS.primary} size={28} />
              </View>
            ),headerShown: false
          }}
        />
        <Tab.Screen
          name="Favorite"
          component={Favorite}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="favorite" color={color} size={28} />
            ),headerShown: false
          }}
        />
      </Tab.Navigator>
    );
}
const styles = StyleSheet.create({
    searchIcon: {
      height: 60,
      width: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      borderColor: COLORS.primary,
      borderWidth: 2,
      borderRadius: 30,
      top: -25,
      elevation: 5,
    },
  });