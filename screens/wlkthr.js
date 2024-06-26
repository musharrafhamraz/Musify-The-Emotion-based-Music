// src/screens/WalkthroughScreen.js
import React from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

const WalkthroughScreen = ({ navigation }) => {
  return (
    <Swiper loop={false} showsPagination={true} dotColor="#bbb" activeDotColor="#1e90ff" style={styles.main}>

      <View style={styles.slide}>
        <Image style={{
          width: '80%', height: '70%', borderRadius: 12, marginBottom: 22
        }} source={require('../assets/images/gitar.jpg')} />
        <Text style={styles.text}>Your Musical Journey</Text>

      </View>

      <View style={styles.slide}>
        <Image style={{
          width: '80%', height: '70%', borderRadius: 12, marginBottom: 22
        }} source={require('../assets/images/mic.jpg')} />
        <Text style={styles.text}>Your Musical Journey</Text>
      </View>



      <View style={styles.slide}>
        <Image style={{
          width: '80%', height: '70%', borderRadius: 12, marginBottom: 22
        }} source={require('../assets/images/voilin.jpg')} />

        <Text style={styles.text}>Your Musical Journey</Text>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.replace('Home')}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Finish</Text>
        </TouchableOpacity>
        {/* <Button title="Finish" onPress={() => navigation.replace('Home')} /> */}
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#05051C',
  },
  slide1: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: '#05051C',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  btn: {
    top: 65,
    left: 140,
    backgroundColor: '#05051C',
  }
});

export default WalkthroughScreen;
