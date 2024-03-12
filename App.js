import React, { useState,useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigator  from './Navigation/navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';


const App = () => {
  const [isLoggedIn,setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
        const currentAccount = await AsyncStorage.getItem('currentAccount');
        setLoggedIn(!!currentAccount);
    };
    checkLoginStatus();
  },[]);
  return (
    <NavigationContainer>
      {isLoggedIn ? <Navigator.MainTabs/> : <Navigator.AuthStack />}
    </NavigationContainer>
  );
};

export default App;
