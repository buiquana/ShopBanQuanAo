import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AllProducts from '../Products/AllProducts';
import ShirtProducts from '../Products/ShirtProducts';
import PantsProducts from '../Products/PantsProducts';
import DressProdutcs from '../Products/DressProdutcs';
import HatProducts from '../Products/HatProducts';


const TopTab = createMaterialTopTabNavigator();

const HomeScreen1 = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchText);
  }

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.banner} source={require('../Image/baner.png')} />
      <View style={styles.search}>
        <TextInput
          style={styles.searchInput}
          placeholder='Sản phẩm cần tìm...'
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Image style={styles.searchIcon} source={require('../Image/search.png')}/>
        </TouchableOpacity>
      </View>
        <TopTab.Navigator
          style={{bottom:1}}
          screenOptions={{
            tabBarActiveTintColor: '#ffb5c5',
            tabBarInactiveTintColor: '#666',
            tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
            tabBarItemStyle: { width: 100 },
            tabBarIndicatorStyle: { backgroundColor: '#eac0c9' },
            tabBarStyle: { backgroundColor: '#fff' },
          }}>
          <TopTab.Screen name="ALL" component={AllProducts} />
          <TopTab.Screen name="Áo" component={ShirtProducts} />
          <TopTab.Screen name="Quần" component={PantsProducts} />
          <TopTab.Screen name="Váy" component={DressProdutcs} />
          <TopTab.Screen name="Mũ" component={HatProducts} />
        </TopTab.Navigator>
       
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    top:50,
  },
  banner:{
    width:'100%',
    height:225,
    resizeMode:'cover'
  },
  search: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    bottom:1
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ffb5c5',
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
  },
  searchButton: {
    padding: 10,
    borderRadius: 5,
    right:8,
  },
  searchIcon: {
    width: 25,
    height: 25,
  },
  categories: {
    flexDirection: 'row',
  },
  categoryButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  categoryText: {
    fontWeight: 'bold',
  },
});

export default HomeScreen1;
