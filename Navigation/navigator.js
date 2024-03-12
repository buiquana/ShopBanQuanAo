import React, { useEffect, useState } from 'react';
import LoginScreen from '../Screen/LoginScreen';
import RegisterScreen from '../Screen/RegisterScreen';
import HomeScreen from '../Screen/HomeScreen';
import ProductsDetailsScreen from '../Screen/ProductsDetailsScreen';
import ProductsSaleDetailsScreen from '../Screen/ProductsSaleDetailsScreen';
import ProductsRecommedDetailsScreen from '../Screen/ProductsRecommedDetailsScreen';
import CartScreen from '../TabScreen/CartScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  export const AuthStack = () => {
    const [isLoggedIn,setLoggedIn] = useState(false);

    useEffect(() => {
      const checkLoginStatus = async () => {
        const currentAccount = await AsyncStorage.getItem('currentAccount');
        setLoggedIn(!!currentAccount);
      };
      checkLoginStatus();
    },[]);

  return (
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen options={{headerShown:false}} name="Home" component={HomeScreen} />
        <Stack.Screen options={{headerShown:false}} name="Chi tiết sản phẩm" component={ProductsDetailsScreen} />
        <Stack.Screen options={{headerShown:false}} name="Chi tiết sản phẩm1" component={ProductsSaleDetailsScreen} />
        <Stack.Screen options={{headerShown:false}} name="Chi tiết sản phẩm2" component={ProductsRecommedDetailsScreen} />
        <Stack.Screen options={{headerShown:false}} name="Cart" component={CartScreen} />
      </Stack.Navigator>
  );
};


export default { AuthStack };