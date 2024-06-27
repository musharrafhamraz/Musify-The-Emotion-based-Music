import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import SplashScreen from './screens/SplashScreen';
// import WalkthroughScreen from './screens/wlkthr';
import MusicPlayer from './screens/hello_screen';
import OfflineClassifierV2 from './screens/OfflinePredV2';

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      {/* <Stack.Screen name="Walkthrough" component={WalkthroughScreen} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Model" component={OfflineClassifierV2} options={{ headerShown: false }} />
      <Stack.Screen name="hello" component={MusicPlayer} options={{
            headerShown: true,
            title: 'Songs',
            headerStyle: {
              backgroundColor: '#4DB129', // Background color
            },
            headerTintColor: '#fff', // Text color
            headerTitleStyle: {
              fontWeight: 'bold', // Title text style
            },  
          }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;


