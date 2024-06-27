import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Image, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import * as jpeg from 'jpeg-js';
import { useNavigation } from '@react-navigation/native';
import FaceOverlay from './face'

const OfflineClassifierV2 = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [label, setLabel] = useState();
  const cameraRef = useRef(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const class_names = [
    "Angry",
    "Sad",
    "Happy",
    "Disgust",
    "Fearful",
    "Neutral",
    "Surprised"
  ];

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    const loadModel = async () => {
      try {
        await tf.ready();
        const modelJSON = require("../assets/models/modelnew.json");
        const modelWeights = require("../assets/models/group1-shard1of1new.bin");
        const model = await tf.loadLayersModel(bundleResourceIO(modelJSON, modelWeights));
        setModel(model);
      } catch (error) {
        console.error('Error loading model:', error);
      } finally {
        setLoading(false);
      }
    };

    requestPermissions();
    loadModel();

    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    spinAnimation.start();
  }, [spinValue]);

  const takePicture = async () => {
    if (cameraRef.current && model) {
      setLoading(true);
      try {
        const data = await cameraRef.current.takePictureAsync();
        classifyImage(data.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        setLoading(false);
      }
    }
  };
  
  const classifyImage = async (imageUri) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 48, height: 48 } }],
        { compress: 0.5 }
      );
  
      const base64Data = await FileSystem.readAsStringAsync(resizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const uint8Array = Buffer.from(base64Data, 'base64');
      const imageTensor = imageToTensor(uint8Array);
      const normalized = imageTensor.toFloat().div(tf.scalar(255));
      const reshapedImage = tf.reshape(normalized, [-1, 48, 48, 1]);
  
      const predictions = await model.predict(reshapedImage).data();
      const predictedClass = tf.argMax(predictions).dataSync()[0];
      const predictedClassName = class_names[predictedClass];
      setLabel(predictedClassName);
  
      // Navigate to the "hello" screen with the label
      if (predictedClassName){
        navigation.navigate('hello', { label: predictedClassName });
      }
      // navigation.navigate('hello', { label: predictedClassName });
    } catch (error) {
      console.error('Error while classifying image:', error);
    } finally {
      setLoading(false);
    }
  };

  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    const buffer = new Uint8Array(width * height);
    let offset = 0;
    for (let i = 0; i < buffer.length; i++) {
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      buffer[i] = 0.299 * r + 0.587 * g + 0.114 * b;
      offset += 3;
    }
    return tf.tensor3d(buffer, [height, width, 1]);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (hasPermission === null) {
    return <Text>Requesting Camera Permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Camera Permission Denied.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', top: -30 }}>
        <Image style={{ width: 70, height: 70, marginRight: 12 }} source={require('../assets/Icons/music.png')} />
        <Text style={{ alignSelf: 'center', fontSize: 30, fontWeight: '700' }}>Enjoy Your Music</Text>
      </View>
      <View style={styles.cameraWrapper}>
        
          <Camera ref={cameraRef} type={type} style={styles.camera}>
            <View style={styles.buttonContainer1}>
              <FaceOverlay/>
              {/* <TouchableOpacity style={styles.button} onPress={takePicture} disabled={loading}>
                <AntDesign name="camerao" size={24} color="white" />
              </TouchableOpacity> */}
            </View>
          </Camera>
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
      {/* {label ? (
        <Text style={styles.labelText}>The Predicted Label is {label}</Text>
      ) : (
        <Text style={styles.labelText}></Text>
      )} */}
      
    </View>
  );
};

export default OfflineClassifierV2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    bottom: -50,
  },
  buttonContainer1: {
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
  },
  buttonDisabled: {
    backgroundColor: '#fff',
    opacity: 0.5,
  },
  text: {
    bottom: -60,
    opacity: 0.5,
  },
  labelText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    top:40
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  }
});
