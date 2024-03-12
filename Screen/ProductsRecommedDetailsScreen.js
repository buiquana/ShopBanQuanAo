import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, Modal,Alert } from 'react-native';

const ProductsRecommedDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [productDetails, setProductDetails] = useState(null);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [productSizes, setProductSizes] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [productData,setProductData] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // const response = await fetch(`http://192.168.0.105:3000/recommedproducts/${productId}`);
        const response = await fetch(`http://10.24.4.133:3000/products/${productId}`);
        if (response.status === 404) {
          console.error('Sản phẩm không tồn tại');
          setError('Sản phẩm không tồn tại');
          return;
        }

        if (!response.ok) {
          console.error('Lỗi khi truy xuất chi tiết sản phẩm:', response.status);
          setError('Lỗi khi truy xuất chi tiết sản phẩm');
          return;
        }

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data) {
            setProductDetails(data);
            setProductSizes(data.sizes || []);
            if (data.colors && data.colors.length > 0) {
              setSelectedColor(data.colors[0]);
            }
            if (data.price) {
              setTotalPrice(parseFloat(data.price.replace(/\D/g,'')));
            }
          }
        } else {
          console.error('Response is not JSON:', contentType);
          setError('Dữ liệu không hợp lệ');
        }
      } catch (error) {
        console.error('Lỗi khi truy xuất chi tiết sản phẩm:', error);
        setError('Đã xảy ra lỗi');
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddtoFavorite = (productId) => {
    const selectedProduct = productData.find((product) => product.id === productId);
  
    if (selectedProduct) {
      const isProductInFavorite = favoriteProducts.some((product) => product.id === productId);
  
      if (isProductInFavorite) {
        const updatedFavoriteProducts = favoriteProducts.filter((product) => product.id !== productId);
        setFavoriteProducts(updatedFavoriteProducts);
      } else {
        const updatedFavoriteProducts = [...favoriteProducts, selectedProduct];
        setFavoriteProducts(updatedFavoriteProducts);
        
      }
      const updatedProductData = productData.map((product) => {
        if (product.id === productId) {
          return { ...product, isFavorite: !isProductInFavorite };
        }
        return product;
      });
      setProductData(updatedProductData);
    }
    Alert.alert(
      'Thông báo',
      'Sản phẩm đã được thêm vào danh sách yêu thích.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  };

  const handleColorPress = (color,index) => {
    setSelectedColor(color);
    setSelectedColorIndex(index);
  };

  const handleSizePress = (size,index) => {
    setSelectedSize(size);
    setSelectedSizeIndex(index)
  };
  
  const handlePlaceOrder = () => {
    if (!selectedColor || !selectedSize) {
      alert("Vui lòng chọn màu và size");
      return;
    }
    setOrderSuccess(true);
    alert("Đặt hàng thành công. Vui lòng vào giỏ hàng để thanh toán.");
  };

  const handleCloseInsideModal = () => {
    setVisibleModal(false);
    setSelectedSize(null);
    setSelectedColorIndex(-1);
    setSelectedSizeIndex(-1);
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{'< Quay lại'}</Text>
      </TouchableOpacity>
      <ScrollView>
        <Image source={{ uri: selectedColor ? selectedColor.image : null }} style={styles.productImage} />
        <View style={{    justifyContent:'center',alignItems:'center'}}>
        {productDetails && productDetails.colors && productDetails.colors.length > 1 && (
          <FlatList
            contentContainerStyle={styles.colorList}
            horizontal
            data={productDetails.colors}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleColorPress(item)}>
                <View style={styles.colorImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.colorImage} />
                  <Text style={styles.colorName}>{item.na}</Text>
                 </View>
              </TouchableOpacity>
            )}
          />
        )}
        </View>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{productDetails?.nme}</Text>
        <TouchableOpacity 
          onPress={() => handleAddtoFavorite(productId)}
          style={[
            styles.addToFavoriteBtn,
            { backgroundColor: productDetails?.isFavorite ? '#ff0000' : '#fff' },
           ]}>
            <Text style={styles.addToFavoritebtnText}>♥</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20,color: "#533a3d",bottom:25,textDecorationLine:'line-through', }}>đ{productDetails?.priceC}</Text>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: "red",bottom:60,left:90 }}>đ{productDetails?.priceM}</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold',bottom:60 }}> - Mô tả</Text>
        <Text style={{ fontSize: 16, left: 10,bottom:60 }}>{productDetails?.mota}</Text>
        <TouchableOpacity onPress={() => {setVisibleModal(true);}} style={{ backgroundColor: 'red', width: 200, height: 45, borderRadius: 20, justifyContent: 'center', alignItems: 'center', left: 130,bottom:30 }}>
          <View style={styles.buyNowButton}>
            <Text style={{ color: '#fff', fontSize: 25, fontWeight: 'bold' }}>Mua Hàng</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <Modal transparent={true} visible={visibleModal} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#AFD3E2',
              padding: 20,
              width: 400,
              height: 500,
              borderRadius:20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize:20,fontWeight:'bold',top:27}}>Chọn Màu</Text>
            {productDetails && productDetails.colors && productDetails.colors.length > 1 && (
              <FlatList
                contentContainerStyle={{justifyContent: 'center',alignItems: 'center',top:10,padding: 5}}
                horizontal
                data={productDetails.colors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item,index }) => (
                  <TouchableOpacity onPress={() => handleColorPress(item,index)}
                  style={[
                    styles.colorImageContainer,
                    selectedColorIndex === index && styles.selectedColorImageContainer, 
                  ]}>
                    <Image source={{ uri: item.image }} style={[styles.colorImage, selectedColorIndex === index && styles.selectedColorImage]} />
                  </TouchableOpacity>
                )}
              />
            )}
      <View style={{top:110}}>
        <View style={{alignItems:'center',justifyContent:'center',bottom:100}}>
          <Text style={styles.modalTitle}>Chọn Size</Text>
          <TouchableOpacity style={[
            styles.sizeItem,
            selectedSizeIndex === 0 && selectedSize && styles.selectedSizeItem,
            {right:100,borderWidth:2,width:50,height:40,borderRadius:15,justifyContent:'center',alignItems:'center'}
            ]}
            onPress={() => handleSizePress(productDetails.sizes[0],0)}>
            <Text style={{fontSize:20,fontWeight:'bold'}}>S</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[
            styles.sizeItem,
            selectedSizeIndex === 1 && styles.selectedSizeItem,
            {bottom:40,right:30,borderWidth:2,width:50,height:40,borderRadius:15,justifyContent:'center',alignItems:'center'}
            ]}
            onPress={() => handleSizePress(productDetails.sizes[1], 1)}>
            <Text style={{fontSize:20,fontWeight:'bold'}}>M</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[
            styles.sizeItem,
            selectedSizeIndex === 2 && styles.selectedSizeItem,
            {bottom:80,left:43,borderWidth:2,width:50,height:40,borderRadius:15,justifyContent:'center',alignItems:'center'}
            ]}
            onPress={() => handleSizePress(productDetails.sizes[2], 2)}>
            <Text style={{fontSize:20,fontWeight:'bold'}}>L</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[
            styles.sizeItem,
            selectedSizeIndex === 3 && styles.selectedSizeItem,
            {bottom:120,left:115,borderWidth:2,width:50,height:40,borderRadius:15,justifyContent:'center',alignItems:'center'}
            ]}
            onPress={() => handleSizePress(productDetails.sizes[3], 3)}>
            <Text style={{fontSize:20,fontWeight:'bold'}}>XL</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{bottom:80,left:5,fontSize:25,fontWeight:'bold',color:'#533a3d',justifyContent:'center',alignItems:'center'}}>Tổng Tiền: {productDetails?.priceM}đ</Text>
          <TouchableOpacity onPress={handlePlaceOrder} style={{bottom:40,backgroundColor:'#533a3d',width:150,height:40,borderRadius:15,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:25,color:'#fff',fontWeight:'bold'}}>Đặt Hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={{ position: 'absolute', top: 10, right: 10, padding: 10 }}
              onPress={handleCloseInsideModal}>
              <Text style={{ fontSize: 18, color: '#533a3d' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor:'#eac1c9',
  },
  selectedSizeItem: {
    borderColor: 'green',
    borderWidth: 2,
  },
  colorName: {
    textAlign: 'center',
    marginTop: 5,
    color:'#533a3d',
    fontSize:15,
    fontWeight:'bold',
  },

  selectedColorImageContainer: {
    borderColor: 'green', 
    borderWidth: 2,  
  },
  colorImageContainer: {
    borderRadius: 30,

    margin: 5,
  },

  productImage: {
    width: '100%',
    height: 500,
    borderRadius: 8,
    marginTop: 10,
  },
  colorList: {

    left: 5,
    top: 5,
    padding: 5
  },
  colorImage: {
    width: 90,
    height: 90,
    borderRadius: 30,
    margin: 5,
  },
  buyNowButton: {
    backgroundColor: '#533a3d',
    width: 200,
    height: 45,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    bottom:7,
  },

  confirmButton: {
    backgroundColor: 'green',
    width: '100%',
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  cancelButton: {
    backgroundColor: 'red',
    width: '100%',
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  addToFavoriteBtn: {
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 20,
    bottom:10,
    left:420,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToFavoritebtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
  },
  backButton: {

    top: 10,
    left: 5,
    padding: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: '#533a3d',
    fontWeight:'bold'
  },
});

export default ProductsRecommedDetailsScreen;