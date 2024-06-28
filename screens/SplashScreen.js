// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from "expo-font";

const SplashScreenComponent = ({ navigation }) => {
      useEffect(() => {
      
        setTimeout(() => {
          navigation.replace('Model');
        }, 6000);
      }, [navigation]);
    const [fontsLoaded] = useFonts({
        "Merriweather-Bold": require("../assets/fonts/Merriweather-Bold.ttf"),
        "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
        "RobotoMono-Medium": require("../assets/fonts/RobotoMono-Medium.ttf"),
        "OpenSans": require("../assets/fonts/OpenSans-Regular.ttf"),
    });

      if (!fontsLoaded) {
        return <Text>Loading...</Text>;
      }

    return (

        <SafeAreaView style={styles.safearea}>
            <ImageBackground
                source={require('../assets/images/splash.jpg')}
                style={styles.backgroundImage}
            >
                <Text style={styles.headtext}>Musify</Text>
                <Text style={styles.text}>Listen to Your Mood</Text>
                {/* <View style={styles.bottomcontainer}>
                    <Text>Meri Jaan tune mujhe ko pagal hai kiya mera lagda na jiya tere bagair tu maan meri jaan</Text>
                </View> */}
            </ImageBackground>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'left',
    },
    bottomcontainer: {
        height: 200,
        width: '100%',
        backgroundColor: '#fff',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        bottom: -500,
        justifyContent:'center',
        alignItems:'center',
        padding: 20
    },
    headtext: {
        marginHorizontal: 30,
        marginVertical: 20,
        fontSize: 55,
        fontFamily: "Montserrat-Bold",
        color: '#fff'
    },
    text: {
        marginHorizontal: 30,
        fontFamily: "RobotoMono-Medium",
        fontSize: 25,
        color:'#fff'

    }
});

export default SplashScreenComponent;
