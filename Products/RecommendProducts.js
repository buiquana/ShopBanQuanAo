import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const RecommendProducts = () => {
  const navigation = useNavigation();
  const [recommendProductData,setRecommendProductData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        // const response = await fetch('http://192.168.0.105:3000/api/recommedproducts'); //ip ở nhà
        const response = await fetch('http://10.24.4.133:3000/api/recommedproducts');       // ip ở trường
        const data = await response.json();
        const productArray = Object.values(data).flat();
        setRecommendProductData(productArray);
      }catch (error){
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  },[]);

  const handleAddtoCart = (productId) => {
    console.log(`Product ${productId} added to cart`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recommendProductData}
        key={(item) => item.id.toString()}
        renderItem={({item}) =>(
          <TouchableOpacity onPress={() => navigation.navigate('Chi tiết sản phẩm2',{productId:item.id})}>
          <View style={styles.productContainer}>
            <View style={styles.recommendContainer}>
               <TouchableOpacity style={styles.rcm}> 
                  <Text style={{color:'#fff',fontWeight:'bold'}}>RECOMMEND</Text>
               </TouchableOpacity>
            </View>
            <View style={styles.productItem}>
              <View style={styles.productImageContainer}>
              <Image source={{uri:item.image}} style = {styles.productsImage} />
              </View>
              <View style={styles.productDetails}>
                <Text style={styles.productsName}>{item.name}</Text>
                <Text style={styles.productsPriceM}>{item.priceM} VND</Text>
              </View>
            </View>
          </View>
          </TouchableOpacity>
        )}
        horizontal={true}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
  },
  productContainer: {
    position: 'relative',
    backgroundColor: '#ffb5c5',
    borderRadius: 10,
    overflow: 'hidden',
    height:250,
    width:200,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendContainer: {
    position: 'absolute',
    top:2,
    marginLeft:50,
    zIndex: 1,
  },
  productDetails:{
    justifyContent:'center',
    alignItems:'center',
  },
  rcm:{
    backgroundColor:'red',
    borderRadius:5,
  },
  productImageContainer: {
    width: 150,
    height: 150,
    marginLeft:20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productsImage:{
    width:'100%',
    height:'100%',
    borderRadius:8
  },
  productsName:{
    fontSize:18,
    marginLeft:20,
    fontWeight:'bold',
    color:'#fff'
  },
  productsPriceM:{
    fontSize:17,
    marginLeft:20,
    fontWeight:'bold',
    top:10,
    color:'#fff',
  },
  addToCartContainer: {
    position: 'absolute',
    bottom:12,
    right: 25,
  },
  addToCartBtn:{
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartbtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffb5c5',
  },
})

export default RecommendProducts;