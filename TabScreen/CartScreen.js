import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Alert,Modal, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const CartScreen = ({ onIncrease, onDecrease }) => {
  const navigation = useNavigation();
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [cartItemsVisible, setCartItemsVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCheckedVisa, setIsCheckedVisa] = useState('');
  const [isCheckedBank, setIsCheckedBank] = useState('');
  const [isCheckedCOD, setIsCheckedCOD] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePressVisa = () => {
    setIsCheckedVisa(true);
    setIsCheckedBank(false);
    setIsCheckedCOD(false);
  };
  
  const handlePressBank = () => {
    setIsCheckedVisa(false);
    setIsCheckedBank(true);
    setIsCheckedCOD(false);
  };
  
  const handlePressCOD = () => {
    setIsCheckedVisa(false);
    setIsCheckedBank(false);
    setIsCheckedCOD(true);
  };

  useEffect(() => {
    fetchData();
  }, []);
 // GET DATA
  const fetchData = async () => {
    try {
      const response = await fetch('http://10.24.4.133:3000/api/cart');
      const data = await response.json();
      const filteredData = data.filter(item => item !== null);
      const formattedData = filteredData.map(item => ({
        ...item,
        size: item.size?.size || 'Unknown Size',
        color: item.color?.na || 'Unknown Color',
      }));
      setCartData(formattedData);
      const total = formattedData.reduce((acc, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        console.log(`Item: ${item.name}, Price: ${itemPrice}`);
        return acc + itemPrice;
      }, 0);
      
      console.log('Total:', total.toFixed(3));
      setTotalPrice(total);
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  const handlePlaceOrder = () => {
    if (!fullName || !city || !district || !ward || !address || !phoneNumber) {
      if (!fullName) {
        alert('Vui lòng nhập Họ và Tên.');
        return;
      }
  
      if (!city) {
        alert('Vui lòng nhập Tỉnh/Thành Phố.');
        return;
      }
  
      if (!district) {
        alert('Vui lòng nhập Quận/Huyện.');
        return;
      }
  
      if (!ward) {
        alert('Vui lòng nhập Phường/Xã.');
        return;
      }
  
      if (!address) {
        alert('Vui lòng nhập Địa chỉ cụ thể.');
        return;
      }
  
      if (!/^[0-9]+$/.test(phoneNumber)) {
        alert('Số điện thoại chỉ được chứa các ký tự số.');
        return;
      }
    }
    if (!isCheckedVisa && !isCheckedBank && !isCheckedCOD) {
      alert('Vui lòng chọn phương thức thanh toán.');
      return;
    }
    alert('Đặt hàng thành công!');
    setOrderPlaced(true);  // Đặt trạng thái orderPlaced thành true
    setModalVisible(true);
    navigation.navigate('Homee');
  }
  useEffect(() => {
    // Sử dụng useEffect để theo dõi thay đổi trạng thái
    if (orderPlaced) {
      setModalVisible(true);
    }
  }, [orderPlaced]);
  // GET SIZE VÀ MÀU
  const getItemClassification = (item) => {
    const size = item.size?.size || 'Unknown Size';
    const color = item.color?.na || 'Unknown Color';
    return `${size}, ${color}`;
  };

  const CartItem = ({ item }) => {
    if (!item) {
      return null;
    }

    const [itemQuantity, setItemQuantity] = useState(item.quantity || 1);
    // TĂNG SỐ LƯỢNG
    const handleIncrease = () => {
      setItemQuantity(itemQuantity + 1);
      onIncrease && onIncrease(item.id);
    };
    // GIẢM SỐ LƯỢNG
    const handleDecrease = () => {
      if (itemQuantity > 1) {
        setItemQuantity(itemQuantity - 1);
        onDecrease && onDecrease(item.id);
      }
    };

    // DELETE
    const handleDeleteItem = async (item) => {
      Alert.alert(
        'Xác nhận',
        'Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xóa',
            onPress: async () => {
              try {
                const response = await fetch(`http://10.24.4.133:3000/api/cart/${item.id}`, {
                  method: 'DELETE',
                });
  
                if (!response.ok) {
                  throw new Error('Xóa không thành công');
                }
  
                // Cập nhật danh sách giỏ hàng sau khi xóa
                fetchData();
              } catch (error) {
                console.error('Lỗi khi xóa:', error);
                Alert.alert('Lỗi', 'Không thể xóa. Vui lòng thử lại.');
              }
            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    };

    return (
      <View style={styles.cartItem}>
        {item.image ? (
          <Image style={styles.productImage} source={{ uri: item.image }} />
        ) : (
          <View style={styles.productImagePlaceholder} />
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productClassification}>
            {`Phân Loại: ${getItemClassification(item)}`}
          </Text>
          <Text style={styles.productPrice}>{`Giá: ${item.price || 'Unknown Price'}`}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={handleDecrease}>
              <Text style={styles.quantityButton}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{itemQuantity}</Text>
            <TouchableOpacity onPress={handleIncrease}>
              <Text style={styles.quantityButton}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => handleDeleteItem(item)} style={{ height: 5 }}>
            <Image style={{ left: 300, bottom: 25 }} source={require('../Image/remove.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <CartItem item={item} />
  );

  //MODAL
  const handleCheckout = () => {
    setModalVisible(true);
  };


  const renderCartItem = ({ item }) => {
    return (
      <View style={{backgroundColor:'#fff',flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center',padding: 10,borderWidth: 1,borderColor: '#ddd',borderRadius: 10}}>
        <View>
          <Text style={{ fontSize: 20 }}>{item.name}</Text>
          <Text style={{ fontSize: 16, color: '#777' }}>{`Size: ${item.size.size}, Color: ${item.color.na}`}</Text>
      </View>
          <Text style={{fontSize:20,color:'red'}}>{item.price}đ</Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: '#e7abab', top: 23, height: 25, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>CINS CLOTHES LÀM ĐẸP MỌI LÚC MỌI NƠI !</Text>
      </View>
      <View style={styles.banner}>
        <Image style={{ width: 25, height: 25, top: 18, left: 10 }} source={require('../Image/menu.png')} />
        <Image style={{ width: 32, height: 32, bottom: 10, left: 440 }} source={require('../Image/cart.png')} />
        <Image style={{ width: 100, height: 65, bottom: 57, left: 190 }} source={require('../assets/cinlogo.png')} />
      </View>
      <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', width: '100%', marginVertical: 10, top: 2 }}></View>
      <Text style={{ fontSize: 28, left: 130, top: 20 }}>SHOPPING CART</Text>
      <View style={{ flex: 1,marginBottom:100 }}>
        <FlatList
          style={{ top: 40 }}
          data={cartData}
          keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
          renderItem={renderItem}
          extraData={cartData}
        />
      </View>

      <Text style={styles.totalPriceText}>{`Tổng tiền: ${totalPrice.toFixed(3).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace(/\u200E/g, '')}đ`}</Text>

      <TouchableOpacity style={styles.checkoutButton} onPress={() => handleCheckout()}>
        <Text style={styles.checkoutButtonText}>Mua ngay</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible && !orderPlaced}
        onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <Text style={styles.modalText}>Chi tiết đặt hàng</Text>
    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
      <Text style={styles.closeButtonText}>Đóng</Text>
    </TouchableOpacity>
    <View style={{ borderBottomWidth: 2, borderBottomColor: 'green',width:'100%',bottom:100 }}></View>

    <TouchableOpacity onPress={() => setCartItemsVisible(!cartItemsVisible)} style={{ height: 50, justifyContent: 'center',width:479,bottom:90 }}>
      <Text style={{ left: 10, fontSize: 25,top:8 }}>Sản Phẩm</Text>
      <Image style={{ width: 20, height: 20, left: 440, bottom: 18 }} source={require('../Image/mt.png')} />
    </TouchableOpacity>
    {cartItemsVisible && (
            <FlatList
              style={{height:150,borderRadius: 10,bottom:100,width:'100%'}}
              data={cartData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCartItem}
            />
          )}

    <View style={{ borderBottomWidth: 2, borderBottomColor: 'green', marginVertical: 10,width:'100%',bottom:90 }}></View>

    <Text style={{ right: 158, fontSize: 24, bottom: 85 }}>Add Discount</Text>
    <TextInput
      style={{ backgroundColor: '#fff', width: 190, height: 38, left: 20, bottom: 116 }}
      placeholder='Enter Code'
    />

    <TouchableOpacity style={{ backgroundColor: 'green', width: 100, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', left: 180, bottom: 154 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Áp Dụng</Text>
    </TouchableOpacity>

    <View style={{ borderBottomWidth: 2, borderBottomColor: 'green',width:'100%',bottom:135}}></View>

    <Text style={{ fontSize: 25, bottom: 118, right: 115, fontWeight: 'bold',color:'red' }}>{`Tổng tiền: ${totalPrice.toFixed(3).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace(/\u200E/g, '')}đ`}</Text>

    <View style={{ borderBottomWidth: 2, borderBottomColor: 'green',bottom:100,width:'100%' }}></View>

    <Text style={{ fontSize: 25, fontWeight: 'bold', right: 113, bottom: 90 }}>1.Địa chỉ thanh toán</Text>

    <TextInput
      style={{ backgroundColor: '#fff', width: 450, height: 40, borderRadius: 15, marginBottom: 10,bottom:80 }}
      placeholder='Họ và Tên'
      value={fullName}
      onChangeText={(text) => setFullName(text)}
    />
    <TextInput
      style={{ backgroundColor: '#fff', width: 450, height: 40, borderRadius: 15, marginBottom: 10,bottom:70 }}
      placeholder='Tỉnh/Thành Phố'
      value={city}
      onChangeText={(text) => setCity(text)}
    />
    <TextInput
      style={{ backgroundColor: '#fff', width: 450, height: 40, borderRadius: 15, marginBottom: 10,bottom:60 }}
      placeholder='Quận/Huyện'
      value={district}
      onChangeText={(text) => setDistrict(text)}
    />
    <TextInput
      style={{ backgroundColor: '#fff', width: 450, height: 40, borderRadius: 15, marginBottom: 10,bottom:50 }}
      placeholder='Phường/Xã'
      value={ward}
      onChangeText={(text) => setWard(text)}
    />
    <TextInput
      style={{ backgroundColor: '#fff', width: 450, height: 40, borderRadius: 15, marginBottom: 10,bottom:40 }}
      placeholder='Địa chỉ cụ thể'
      value={address}
      onChangeText={(text) => setAddress(text)}
    />
    <TextInput
      style={{ backgroundColor: '#fff', width: 450, height: 40, borderRadius: 15, marginBottom: 10,bottom:30 }}
      placeholder='Số điện thoại'
      value={phoneNumber}
      onChangeText={(text) => {
        if (/^\d+$/.test(text) || text === '') {
          setPhoneNumber(text);
        } else {
          alert('Số điện thoại chỉ được chứa các ký tự số.');
        }
      }}
    />
    <Text style={{fontSize: 25, fontWeight: 'bold',right:95,bottom:35}}>2.Tùy chọn thanh toán</Text>
    <TouchableOpacity style={{bottom:30,height:40,bottom:17}} onPress={handlePressVisa}>
      <Image style={{width:45,height:45,right:60}} source={require('../Image/visa.jpg')}/>
      <Text style={{fontSize:20,fontWeight:'bold',bottom:36}}>Thanh toán bằng VISA/CARD</Text>
      <View style={{ width: 24, height: 24, borderWidth: 2, borderColor: 'black', alignItems: 'center', justifyContent: 'center',borderRadius:20,left:305,bottom:60 }}>
          {isCheckedVisa && <View style={{ width: 12, height: 12, backgroundColor: 'black',borderRadius:20 }} />}
      </View>
    </TouchableOpacity>
    <TouchableOpacity style={{bottom:20,height:40,left:14,top:5}} onPress={handlePressBank}>
      <Image style={{width:45,height:45,right:60}} source={require('../Image/bank.png')}/>
      <Text style={{fontSize:20,fontWeight:'bold',bottom:36}}>Thanh toán bằng APP BANKING</Text>
      <View style={{ width: 24, height: 24, borderWidth: 2, borderColor: 'black', alignItems: 'center', justifyContent: 'center',borderRadius:20,left:305,bottom:60 }}>
          {isCheckedBank && <View style={{ width: 12, height: 12, backgroundColor: 'black',borderRadius:20 }} />}
      </View>
    </TouchableOpacity>
    <TouchableOpacity style={{bottom:10,height:40,left:6,top:30}} onPress={handlePressCOD}>
      <Image style={{width:70,height:45,right:85}} source={require('../Image/shipcode.jpg')}/>
      <Text style={{fontSize:20,fontWeight:'bold',bottom:36}}>Thanh toán sau khi nhận hàng</Text>
      <View style={{ width: 24, height: 24, borderWidth: 2, borderColor: 'black', alignItems: 'center', justifyContent: 'center',borderRadius:20,left:305,bottom:60 }}>
          {isCheckedCOD && <View style={{ width: 12, height: 12, backgroundColor: 'black',borderRadius:20 }} />}
      </View>
    </TouchableOpacity>
    <TouchableOpacity style={{top:48,width:'100%',backgroundColor:'#4CAF50',height:50,borderRadius:10,alignItems:'center',justifyContent:'center'}} onPress={handlePlaceOrder}>
      <Text style={{fontSize:25,color:'#fff',fontWeight:'bold'}}>Đặt Hàng</Text>
    </TouchableOpacity>
  </View>
</Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  banner: {
    width: 480,
    height: 70,
    top: 23
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'pink',
    borderRadius: 10,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 5,
    marginRight: 10,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    padding: 6,
    top: 10
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productClassification: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    color: '#e44d26',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    width: 80,
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: 'gray',
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  totalPriceText: {
    color: 'red',
    fontSize: 24,
    fontWeight: 'bold',
    bottom:65,
    left:10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  modalText: {
    fontSize: 35,
    fontWeight: 'bold',
    bottom:50,
    color: 'black',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    bottom:115,
    right:210
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
