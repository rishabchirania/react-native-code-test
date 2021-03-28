import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableHighlight,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import blogs from "../src/data/blogData.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
//item Card which is a repeatble placeholder for all blogs with title and image

const Item = ({ title, image }) => (
  <View style={styles.item}>
    <Image
      style={{ width: 320, height: 220 }}
      source={{
        uri: { image }.image,
      }}
    />
    <Text style={styles.title}>{title}</Text>
  </View>
);

//wait timeout to function to show and stop animation
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      userLoggedIn: false,
      showloading: true,
    };
    //creating a data object with all the fields of blog which will be later passed to BlogPage Screen
    for (var i = 0; i < blogs.blogs.length; i++) {
      this.state.data[i] = {
        image: blogs.blogs[i].imageUrl,
        title: blogs.blogs[i].title,
        content: blogs.blogs[i].content,

        author: blogs.blogs[i].author,

        datePublished: blogs.blogs[i].datePublished,
        views: blogs.blogs[i].views,
      };
    }
  }

  componentDidMount() {
    //to play animation as soon as screen is loaded
    this.animation.play();

    this.checkloggedin();

    wait(5000).then(() => {
      this.animation.reset();
      this.setState({ showloading: false });
    });
  }

  //funciton to check if user is logged in
  checkloggedin = async () => {
    try {
      const value = await AsyncStorage.getItem("loggedin");
      if (value !== null) {
        if (value == "true") {
          this.setState({ userLoggedIn: true });
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  render() {
    const renderItem = ({ item }) => (
      <TouchableHighlight
        onPress={() => {
          //if the user is logged in navigate to BlogPage while passing details of the blog otherwise show an alert for the user to login
          if (this.state.userLoggedIn) {
            this.props.navigation.navigate("BlogPage", {
              item: item,
            });
          } else {
            Alert.alert(
              "You are not logged in",
              "To access blogs the user needs to be logged in",
              [
                {
                  text: "Log in",
                  onPress: () => {
                    this.props.navigation.navigate("LoginPage");
                  },
                },
              ],
              { cancelable: true }
            );
          }
        }}
      >
        <Item title={item.title} image={item.image} />
      </TouchableHighlight>
    );

    //show the bloglist if the animation is not playing
    if (!this.state.showloading) {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {/* Showing a animation in json format using  LottieView*/}
          <LottieView
            ref={(animation) => {
              this.animation = animation;
            }}
            style={{
              width: 380,
              height: 400,
              backgroundColor: "#4e88ed",
            }}
            source={require("../assets/gradientBall.json")}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  label: {
    color: "white",
    margin: 20,
    marginLeft: 0,
  },

  item: {
    backgroundColor: "#4e88ed",
    padding: 20,
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    marginTop: 40,
    color: "white",
    height: 40,
    backgroundColor: "#ec5990",
    borderRadius: 4,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    backgroundColor: "#0e101c",
  },
});
