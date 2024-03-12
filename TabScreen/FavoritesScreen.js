import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        const response = await fetch('http://10.24.4.133:3000/api/favorites');
        if (!response.ok) {
          throw new Error(`Lỗi khi truy xuất danh sách yêu thích: ${response.status}`);
        }

        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error.message);
      }
    };

    fetchFavoriteProducts();
  }, [forceUpdate]);

  const handleDeleteItem = async (item) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa sản phẩm khỏi danh sách yêu thích?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              const response = await fetch(`http://10.24.4.133:3000/api/favorites/${item.id}`, {
                method: 'DELETE',
              });
  
              if (!response.ok) {
                throw new Error('Xóa không thành công');
              }
  
              setFavorites((prevFavorites) => 
                prevFavorites.filter((favoriteItem) => favoriteItem.id !== item.id)
              );
              forceUpdate();
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

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>Giá: {item.price}</Text>
      </View>
      <TouchableOpacity style={{backgroundColor:'#533a3d',width:40,height:30,justifyContent:'center',alignItems:'center',right:10}} onPress={() => handleDeleteItem(item)}>
        <Text style={styles.deleteButton}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSeparator = () => (
    <View style={styles.separator} />
  );

  function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
  }
  
  return (
    <View style={styles.container}>
      <Text style={{fontSize:19,fontWeight:'bold',left:10,color:'#533a3d'}}>-----------------Danh Sách Yêu Thích-----------------</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFavoriteItem}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffb5c5',
    top:20,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#533a3d',
  },
  separator: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  deleteButton: {
    color: '#fff',
  },
});

export default FavoritesScreen;
