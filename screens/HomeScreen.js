import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet,Button, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation, useNavigationFocus } from '@react-navigation/native';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';
import FaceOverlay from './face';  // Adjust the path as necessary

const HomeScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  // Reference to the animated value
  const spinValue = useRef(new Animated.Value(0)).current;
  const isFocused = useNavigationFocus();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
  
    requestPermissions();
    // Define the spinning animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000, // Duration of one complete spin in milliseconds
        easing: Easing.linear,
        useNativeDriver: true, // Use native driver for better performance
      })
    );

    // Start the animation
    spinAnimation.start();
  }, [spinValue]);

  // Interpolate the spin value to rotation degree
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const takePicture = async () => {
    // Your logic for capturing and processing the picture goes here
    if (cameraRef.current) {
      setLoading(true);
      const data = await cameraRef.current.takePictureAsync();
      // ... process data
      compressImage(data)
      setLoading(false);
      navigation.navigate('hello', { prediction: data.class }); // Assuming 'hello' screen handles processing
    }
  };

  const compressImage = async (photo) => {
    try {
      const compressedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }], // You can adjust the width as needed
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      getPrediction(compressedPhoto);
    } catch (error) {
      console.error('Error compressing image:', error);
      setLoading(false);
    }
  };

  const getPrediction = async (photo) => {
    try {
      if (!photo || !photo.uri) {
        console.error('Invalid image data:', photo);
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await axios.post(
        'https://cnn-model-api-deployment-ac2b40fcf26d.herokuapp.com/predict',
        formData,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'access-control-allow-credentials': true,
          },
        }
      );

      const { data } = response;

      if (data && data.class) {
        navigation.navigate('hello', { prediction: data.class });
      } else {
        console.error('Failed to predict');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting Camera Permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Camera Permission Denied.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style ={{flexDirection:'row', top:-30}}>

      <Image style={{width:70, height:70, marginRight:12} } source={require('../assets/Icons/music.png')}/>
      <Text style={{alignSelf:'center', fontSize:30, fontWeight:'700'}}>Enjoy Your Music</Text>
      </View>
      <View style={styles.cameraWrapper}>
      {isFocused && ( // Render camera only when screen is focused
        <Camera ref={cameraRef} style={styles.camera} type={type}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <AntDesign name="camerao" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      )}
      </View>
      <TouchableOpacity onPress={takePicture} disabled={loading}>
        <View style={[styles.buttonContainer, loading && styles.buttonDisabled]}>
          {loading ? (
            <Animated.Image
              source={require('../assets/images/head1.png')}
              style={[styles.image, { transform: [{ rotate: spin }] }]}
            />
          ) : (
            <Image style={{ height: '100%', width: '100%', borderRadius: 50 }} source={require('../assets/images/head.jpg')} />
          )}
        </View>
      </TouchableOpacity>
      <Text style={styles.text}>Be aware of mistakes. Check important info</Text>
      <Button title='next' onPress={()=>{navigation.navigate('hello')}}/>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'#402E7A'
  },
  cameraWrapper: {
    height: '57%',
    width: '95%',
    marginBottom: 0,
    overflow: 'hidden',
    borderRadius: 50,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    height: 80,
    width: 80,
    backgroundColor: '#fff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -30,
  },
  buttonDisabled: {
    backgroundColor: '#fff',
  },
  text: {
    bottom: -60,
    opacity: 0.5,
  },
  titleText: {
    fontSize: 30,
    fontWeight: '500',
    
    opacity: 0.7,
  },
  image: {
    width: "100%", // Adjust the width as needed
    height: "100%", // Adjust the height as needed
    borderRadius: 50, // Adjust to match the desired roundness
  },
});
