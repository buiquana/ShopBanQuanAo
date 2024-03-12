import { StyleSheet, Text, View,Image} from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen1 from '../TabScreen/HomeScreen1';
import ContactScreen from '../TabScreen/ContactScreen';
import FavoritesScreen from '../TabScreen/FavoritesScreen';
import CartScreen from '../TabScreen/CartScreen';


const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen name=  'Homee' component={HomeScreen1} options={{ headerShown:false,tabBarIcon: ({color,size}) => (<Image source={require('../assets/hm.png')} style = {{width:25,height:25}} />)}}/>
        <Tab.Screen name = "Cart" component={CartScreen} options={{headerShown:false,tabBarIcon: ({color,size}) => (<Image source={require('../assets/grocery-store.png')} style = {{width:25,height:25}} />)}} />
        <Tab.Screen name = "Favorites" component={FavoritesScreen} options={{headerShown:false,tabBarIcon: ({color,size}) => (<Image source={require('../assets/heart.png')} style = {{width:25,height:25,top:2}} />)}}/>
        <Tab.Screen name = "Contact" component={ContactScreen} options={{headerShown:false,tabBarIcon: ({color,size}) => (<Image source={require('../assets/customer-service.png')} style = {{width:28,height:28}} />)}} />
    </Tab.Navigator>
  
  )
}

export default HomeScreen

const styles = StyleSheet.create({})