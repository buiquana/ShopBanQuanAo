import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import SaleProducts from '../Products/SaleProducts';
import RecommendProducts from '../Products/RecommendProducts';

const TopTab = createMaterialTopTabNavigator();

const AllProducts = () => {
  const navigation = useNavigation();
  const [productData,setProductData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        // const response = await fetch('http://192.168.0.105:3000/api/products/'); // ip ở nhà
        const response = await fetch('http://10.24.4.133:3000/api/products/'); // ip ở trường
        const data = await response.json();
        const productArray = Object.values(data).flat();
        setProductData(productArray);
      }catch (error){
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  },[]);

  return (
    <View style={styles.container}>
      <FlatList
        style={{ marginBottom: 10 }}
        data={productData}
        keyExtractor={(item)=>item.id.toString()}
        renderItem={({item}) => (
        <TouchableOpacity onPress={() => navigation.navigate('Chi tiết sản phẩm',{productId:item.id})}>
          <View style={styles.productContainer}>
            <View style={styles.productItem}>
              <View style={styles.productImageContainer}>
                <Image source={{uri:item.image}} style = {styles.productsImage} />
              </View>
            <View style={styles.productDetails}>
              <Text style={styles.productsName}>{item.name}</Text>
              <Text style={styles.productsPrice}>{item.price} VND</Text> 
            </View>
            
          </View>   
          </View>
          </TouchableOpacity>
        )}
        horizontal={true}
        />

<TopTab.Navigator
  style={{ marginTop: -300,bottom:40 }}
  screenOptions={{
    tabBarActiveTintColor: '#FF90BC',
    tabBarInactiveTintColor: '#666',
    tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
    tabBarItemStyle: { width: 100 },
    tabBarIndicatorStyle: { backgroundColor: '#FF90BC' },
    tabBarStyle: { backgroundColor: '#fff' },
  }}
  tabBar={({ state, descriptors, navigation }) => (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              borderBottomWidth: isFocused ? 2 : 0, 
              borderBottomColor: '#FF90BC', 
            }}
          >
            <Text style={{ color: isFocused ? '#FF90BC' : '#666', fontWeight: 'bold', fontSize: 16 }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  )}
>
  <TopTab.Screen name="Sản Phẩm đang Sale" component={SaleProducts} />
  <TopTab.Screen name="Sản Phẩm bán chạy" component={RecommendProducts} />
</TopTab.Navigator>

    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
  },
  productContainer: {
    backgroundColor: '#ffb5c5',
    borderRadius: 10,
    overflow: 'hidden',
    height:230,
    width:200,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
 
  productImageContainer: {
    width: 150,
    height: 150,
    marginLeft:25,
    borderRadius: 8,
    overflow: 'hidden',
  },
 
  productsImage:{
    width:'100%',
    height:'100%',
    borderRadius:8
  
  },
  productDetails:{
    justifyContent:'center',
    alignItems:'center'
  },
  productsName:{
    fontSize:18,
    marginLeft:25,
    fontWeight:'bold',
    color:'#fff'
  },
  productsPrice:{
    fontSize:18,
    marginLeft:45,
    fontWeight:'bold',
    top:5,
    color:'#fff',
  },
  
});

export default AllProducts;