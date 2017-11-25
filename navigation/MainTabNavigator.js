import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import TobuyListScreen from '../screens/TobuyListScreen';
import RankScreen from '../screens/RankScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default TabNavigator(
  {
    TobuyList: { screen: TobuyListScreen },
    Rank: { screen: RankScreen },
    Home: { screen: HomeScreen },
    Search: { screen: SearchScreen },
    Settings: { screen: SettingsScreen }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Home':
            iconName =
              Platform.OS === 'ios'
                ? `ios-information-circle${focused ? '' : '-outline'}`
                : 'md-information-circle';
            break;
          case 'TobuyList':
            iconName = Platform.OS === 'ios' ? `ios-cart${focused ? '' : '-outline'}` : 'md-cart';
            break;
          case 'Rank':
            iconName = Platform.OS === 'ios' ? `ios-stats${focused ? '' : '-outline'}` : 'md-stats';
            break;
          case 'Search':
            iconName = Platform.OS === 'ios' ? `ios-search${focused ? '' : '-outline'}` : 'md-search';
            break;
          case 'Settings':
            iconName =
              Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options';
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    initialRouteName: 'Home',
    tabBarOptions: {
      showLabel: false
    },
    animationEnabled: false,
    swipeEnabled: true,
  }
);
