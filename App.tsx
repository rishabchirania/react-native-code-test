import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Text } from "@ui-kitten/components";
import mapping from "./mapping.json";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import BlogPage from "./components/BlogPage";


//Creating a stacknavigation to assign routes to component
const Stack = createStackNavigator();
const App = () => {
  const [loaded, error] = useFonts({
    Roboto: require("./assets/fonts/Roboto/Roboto.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto/Roboto-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ApplicationProvider
      {...eva}
      theme={eva.light}
      customMapping={{ ...eva.mapping, ...mapping }}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginPage">
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="HomePage" component={HomePage} />

          <Stack.Screen name="BlogPage" component={BlogPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  );
};

export default App;
