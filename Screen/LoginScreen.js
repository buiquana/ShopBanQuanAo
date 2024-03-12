import { Image, StyleSheet, Text, TextInput, View,TouchableOpacity } from 'react-native'
import React,{ useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({navigation}) => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');


    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // biểu thức chính quy
      return regex.test(email);
    };

    const handleLogin = async () => {
      try {
        // Kiểm tra định dạng email trước khi thực hiện đăng nhập
        if (!validateEmail(email)) {
          setEmailError('Email không đúng định dạng');
          return;
        } else {
          setEmailError('');
        }

        const userData = require('../register-api/user.json');
        const user = userData.find((user) => user.email === email && user.password === password);

        if (user) {
          navigation.navigate('Home');
        }else{
          setPasswordError('Email hoặc mật khẩu không đúng. Vui lòng thử lại');
        }
 
    }catch (error){
      console.error('Error during login:', error);
      Alert.alert('Error', 'Đã xảy ra lỗi khi đăng nhập.', [{ text: 'OK' }]);
    }
   };
  return (
    <View style={styles.container}>
      <Image source={require('../assets/cin.jpg')} style={styles.logo} />
      <Text style={styles.tet}>Login to your account</Text>
      <TextInput placeholder='Email'value={email} onChangeText={(text) => setEmail(text)} style={styles.input}/>
      {emailError ? <Text style = {styles.errorText}>{emailError}</Text> : null}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={!showPassword}
        style={styles.input}
      />
      {passwordError ? <Text style = {styles.errorText}>{passwordError}</Text> : null}
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️'}</Text>
      </TouchableOpacity>

      <TouchableOpacity  
        onPress={handleLogin}
        style={styles.btn}
        >
            <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity  
        onPress={navigation.navigate('Home')}
        style={styles.bn}
        >
            <Text style={styles.buttonT}>Sign in with Google</Text>
        </TouchableOpacity>
      <Text style={styles.text2} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register Here
      </Text><Text style={styles.tet1} onPress={() => navigation.navigate('Register')}>
        Forget Password? 
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eac1c9',
      },
      errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
      },
      text1:{
        color:'#ffffff',
        fontSize: 20,
        paddingBottom: 20,
      },
      tet:{
        color:'#533a3d',
        fontSize: 30,
        paddingBottom: 20,
        fontWeight:'bold',
      },
      bn:{
        backgroundColor:'#533a3d',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        width: 410,
        alignItems: 'center',
      },
      
      buttonT:{
        color: '#fff',
        fontSize: 16,
        fontWeight:'bold',
      },
      eyeIcon: {
        fontSize: 20,
        color: 'white',
        bottom:50,
        left:180,
      },
      tet1:{
        color:"#533a3d",
        margin:12,
        fontSize:17,
        fontWeight:'bold',
      },
      text2:{
        color:"#533a3d",
        margin:12,
        fontSize:20,
        fontWeight:'bold',
      },
      logo:{
        width:800,
        height:200,
        margin: 30,
        marginBottom:60,
      },
      btn: {
        backgroundColor: '#533a3d',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        width: 410,
        alignItems: 'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight:'bold',
      },
      input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 3,
        margin: 10,
        padding: 8,
        backgroundColor:'#ffff',
        width: 410,
      },
});

export default LoginScreen;