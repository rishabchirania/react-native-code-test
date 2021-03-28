import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Vibration,
  Platform,
  Image,
} from "react-native";
import Constants from "expo-constants";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

export default class BlogPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.route.params.item,
      expoPushToken: "",
      notification: {},
      shouldSendNotification: true,
    };
  }

  //registering permission from suer to send push notifications and then taking token for expo
  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      this.setState({ expoPushToken: token });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  componentDidMount() {
    this.registerForPushNotificationsAsync();

    //adding a notification listener
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = (notification) => {
    Vibration.vibrate();
    console.log(notification);
    this.setState({ notification: notification });
  };

  //scheduling notification
  sendPushNotification = async () => {
    let notificationId = Notifications.scheduleLocalNotificationAsync(
      {
        title: "You have to not read the complete article",
        body: "Click to get back to the application",
      },
      {
        repeat: "hour",
        time: new Date().getTime() + 1800000,
      }
    );
  };

  //remove the notification if user reads the entire article
  removePushNotification = async () => {
    Notifications.cancelAllScheduledNotificationsAsync();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <ScrollView
            onScroll={(event) => {
              // layouttotaly is total scrollable height
              var layouttotaly =
                event.nativeEvent.contentSize.height -
                event.nativeEvent.layoutMeasurement.height;
              //layoutscrolled is the amount of height actually scrolled by user

              var layoutscrolled = event.nativeEvent.contentOffset.y;

              // if the user scrolls more than 70% of the article consider it read
              if (layoutscrolled > 0.7 * layouttotaly) {
                console.log("Article Read");
                this.setState({ shouldSendNotification: false });
                this.removePushNotification();
              } else {
                console.log("Article Not Read");
                this.sendPushNotification();
              }
            }}
          >
            <Text style={styles.title}>{this.state.item.title}</Text>
            <Image
              style={{
                width: 400,

                height: 300,
              }}
              source={{
                uri: this.state.item.image,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={styles.subhighlight}>
                  By: {this.state.item.author}
                </Text>
              </View>
              <View>
                <Text style={styles.subhighlight}>
                  Date: {this.state.item.datePublished}
                </Text>
              </View>
              <View>
                <Text style={styles.subhighlight}>
                  Views: {this.state.item.views}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 50 }}>
              <Text style={styles.contentblog}>
              {this.state.item.content}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    color: "white",
    margin: 20,
    marginLeft: 0,
  },
  container: {},
  item: {
    backgroundColor: "#4e88ed",
    padding: 20,
    marginVertical: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
  },
  subhighlight: {
    fontSize: 11,
    color: "white",
  },
  contentblog: {
    fontSize: 18,
    color: "white",
  },
  button: {
    marginTop: 40,
    color: "white",
    height: 40,
    backgroundColor: "#4e88ed",
    borderRadius: 4,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    backgroundColor: "#0e101c",
  },
  input: {
    backgroundColor: "white",
    // borderColor: 'none',
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
});
