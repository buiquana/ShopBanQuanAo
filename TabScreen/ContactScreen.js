import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const navigation = useNavigation();

  const handleSendRequest = () => {
    // Kiểm tra điều kiện nhập
    if (!name || !email || !message) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Thông báo', 'Email không đúng định dạng.');
      return;
    }

    // Kiểm tra độ dài của tin nhắn
    if (message.length < 5 || message.length > 300) {
      Alert.alert('Thông báo', 'Tin nhắn phải có từ 5 đến 300 ký tự.');
      return;
    }

    setName('');
    setEmail('');
    setMessage('');

    // Thông báo gửi thành công hoặc điều chỉnh theo nhu cầu của bạn
    Alert.alert('Thông báo', 'Yêu cầu của bạn đã được gửi thành công.');
  };

  const handleLogout = () => {
    // Thực hiện các bước đăng xuất ở đây (xoá token, reset state, vv.)
    
    // Sau khi đăng xuất, chuyển hướng về màn hình Login
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Liên hệ Cửa Hàng</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Họ và Tên"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.messageInput}
        placeholder="Tin nhắn"
        value={message}
        onChangeText={(text) => setMessage(text)}
        multiline
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}>
        <Text style={styles.sendButtonText}>Gửi yêu cầu</Text>
      </TouchableOpacity>
      <View style={{backgroundColor:'pink',flex:1,borderRadius:5,top:10}}>
        <Text style={{fontSize:26,fontWeight:'bold',top:10,left:18,color:'#fff'}}>Thông Tin Liên Hệ</Text>
        <View style={{ borderBottomWidth: 8, borderBottomColor: '#fff',width:'60%',top:18,left:20 }}></View>
        <Text style={{fontSize:23,fontWeight:'bold',color:'#fff',top:30,left:20}}>(+84) 889 490 288</Text>
        <Text style={{fontSize:23,fontWeight:'bold',color:'#fff',top:35,left:20}}>20 Hồ Tùng Mậu, Cầu Giấy, Hà Nội</Text>
        <Text style={{fontSize:23,fontWeight:'bold',color:'#fff',top:40,left:20}}>Email: cinsclothes@gmail.com</Text>
        <Text style={{fontSize:23,fontWeight:'bold',color:'#fff',top:45,left:20}}>8:00 sáng - 16:30, Thứ 2 - Thứ 7</Text>
        <Text style={{fontSize:26,fontWeight:'bold',top:50,left:18,color:'#fff'}}>Hỗ Trợ Khách Hàng</Text>
        <View style={{ borderBottomWidth: 8, borderBottomColor: '#fff',width:'60%',top:58,left:20 }}></View>
        <Text style={{fontSize:23,fontWeight:'bold',color:'#fff',top:65,left:20}}>Chính sách đổi trả</Text>
        <Text style={{fontSize:23,fontWeight:'bold',color:'#fff',top:70,left:20}}>Yêu cầu hỗ trợ</Text>
        <Text style={{fontSize:23,fontWeight:'bold',color:'#fff',top:75,left:20}}>Hướng dẫn cài đặt</Text>
        <Text style={{fontSize:23,fontWeight:'bold',color:'#fff',top:80,left:20}}>Phương thức vận chuyển</Text>
        <View style={{ borderBottomWidth: 8, borderBottomColor: '#fff',width:'60%',top:110,left:90 }}></View>
          <Image style={{width:50,height:50,top:120,left:95}} source={require('../Image/fb.webp')}/>
          <Image style={{width:48,height:48,top:72,left:165}} source={require('../Image/ins.webp')}/>
          <Image style={{width:48,height:48,top:24,left:232}} source={require('../Image/tik-tok.png')}/>
          <Image style={{width:50,height:50,bottom:26,left:300}} source={require('../Image/twitter.png')}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    top: 30,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  messageInput: {
    height: 120,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    width:95,
    height:50,
    alignItems: 'center',
    left:343,
    bottom:50
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ContactScreen;
