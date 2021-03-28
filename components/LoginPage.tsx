import React from "react";
import { StyleSheet, Text, TextInput, View, Button, Alert } from "react-native";
import * as firebase from "firebase";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
  apiKey: "AIzaSyDrLPfdyzZtl5Grkha9apK6tylC4TN5AtU",
  authDomain: "stayr-3a68f.firebaseapp.com",
  databaseURL: "https://stayr-3a68f-default-rtdb.firebaseio.com",
  projectId: "stayr-3a68f",
  storageBucket: "stayr-3a68f.appspot.com",
  messagingSenderId: "267726435220",
  appId: "1:267726435220:web:1390d64e326470cded5581",
  measurementId: "G-JGR9SCWJR9",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default ({ navigation }) => {
  const {
  
    handleSubmit,
    control,
 
  } = useForm();
  const onSubmit = (data) => {
    handleLogin(data);
  };

  //declaring schema type to check data type of input as email
  let schema = yup.object().shape({
    email: yup.string().email(),
  });
  //func to get text from input
  const onChange = (arg) => {
    return {
      value: arg.nativeEvent.text,
    };
  };
// to check if the input data type is right,and then authenticate using firebase
  const handleLogin = (data) => {
    schema
      .isValid({
        email: data.email,
      })
      .then(function (valid) {
        valid;
        if (valid) {
          firebase
            .auth()
            .signInWithEmailAndPassword(data.email, data.password)
            .then(async () => {
              //if the user is auth then store it in async storage and navigate to homescrenn
              await AsyncStorage.setItem("loggedin", "true");
              navigation.navigate("HomePage");
            })
            .catch((error) => {
              //show alert of the if the auth process failed
              Alert.alert(
                "Login Failed",
                "Please try again with email and password",
                [{ text: "Try Again", onPress: () => {} }],
                { cancelable: false }
              );
            });
        } else {
          //conveying to the user that email id data type is wrong
          Alert.alert(
            "Invalid Email Address",
            "Please enter a valid email address",
            [{ text: "Try Again", onPress: () => {} }],
            { cancelable: false }
          );
        }
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="email"
        placeholder="Enter your password"
        defaultValue="appforstayr@gmail.com"
        rules={{ required: true }}
      />
      <Text style={styles.label}>Password</Text>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            secureTextEntry={true}
          />
        )}
        name="password"
        placeholder="Enter your password"
        rules={{ required: true }}
      />

      <View style={styles.button}>
        <Button color="white" title="Log In" onPress={handleSubmit(onSubmit)} />
      </View>
      <View style={styles.button}>
        <Button
          color="white"
          title="Visit Home Page"
          onPress={() => {
            navigation.navigate("HomePage");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "#4e88ed",
    margin: 20,
    marginLeft: 0,
  },
  button: {
    marginTop: 20,
    color: "white",
    height: 40,
    backgroundColor: "#4e88ed",
    borderRadius: 4,
  },
  container: {
    flex: 1,

    padding: 8,
    backgroundColor: "#0e101c",
  },
  input: {
    backgroundColor: "white",
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
});
