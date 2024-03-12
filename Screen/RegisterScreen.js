import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // biểu thức chính quy
    return regex.test(email);
  };

  const handleRegister = async () => {
    try {
      const storedAccounts =
        JSON.parse(await AsyncStorage.getItem("accounts")) || [];

      // Kiểm tra xem email đã tồn tại trong danh sách hay chưa
      const accountExists = storedAccounts.some((acc) => acc.email === email);

      if (accountExists) {
        setErrorMessage("Email đã được đăng ký trước đó.");
        return;
      }

       if (!name || !email || !password || !confirmPassword) {
         setErrorMessage("Vui lòng điền đầy đủ thông tin");
         return;
       }

       if (!validateEmail(email)) {
         setErrorMessage("Email không đúng định dạng");
         return;
       }

       // Kiểm tra mật khẩu nhập lại
       if (password !== confirmPassword) {
         setErrorMessage("Nhập lại mật khẩu không khớp.");
         return;
      }

      // Thêm tài khoản mới vào danh sách
      const newAccount = { email, password, confirmPassword };
      storedAccounts.push(newAccount);
      await AsyncStorage.setItem("accounts", JSON.stringify(storedAccounts));
      
        const response = await fetch('http://10.24.4.133:3000/api/register',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email,password}),
          
        });
        // console.log('Response from API:', response);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error from API:', errorData);
          setErrorMessage(errorData.error || 'Đã xảy ra lỗi khi đăng ký.');
          return;
        }
      //Xóa trắng dữ liêu trên input
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrorMessage("");

      Alert.alert("Success", "Đăng ký thành công", [{ text: "OK" }]);

      navigation.navigate("Login");
    } catch (error) {
      console.error("Error saving registration data:", error);
      Alert.alert("Error", "Đã xảy ra lỗi khi đăng ký.", [{ text: "OK" }]);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/cin.jpg")} style={styles.logo} />
      <Text style={styles.tet}>Create New Account</Text>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Nhập lại mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.text2} onPress={() => navigation.navigate("Login")}>
        You have an account? Login Here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eac1c9",
  },
  logo:{
    width:800,
    height:200,
    margin: 30,
    marginBottom:60,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  text1: {
    color: "#ffffff",
    fontSize: 20,
    paddingBottom: 20,
  },
  tet: {
    color:'#533a3d',
        fontSize: 30,
        paddingBottom: 20,
        fontWeight:'bold',
  },
  text2: {
    color: "#533a3d",
    margin: 12,
    fontSize: 17,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#533a3d",
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: 410,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 3,
    margin: 10,
    padding: 8,
    backgroundColor: "#ffff",
    width: 410,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default RegisterScreen;
