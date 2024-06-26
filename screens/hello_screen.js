import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useRoute } from '@react-navigation/native'; // Import useRoute
import Icon from 'react-native-vector-icons/FontAwesome';

const MusicPlayer = () => {
  const route = useRoute(); // Use useRoute to get the navigation parameters
  const { label } = route.params; // Extract the label parameter

  const [sound, setSound] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadAndPlayAudio = async () => {
      try {
        const { sound: loadedSound } = await Audio.Sound.createAsync(
          require('../assets/song1.mp3'),
          { shouldPlay: true, isLooping: isLooping }
        );
        setSound(loadedSound);
        loadedSound.setOnPlaybackStatusUpdate(setStatus);
      } catch (error) {
        console.error('Error loading or playing audio', error);
      }
    };

    loadAndPlayAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [isLooping]);

  const togglePlayPause = async () => {
    if (sound) {
      if (status.isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
    }
  };

  const toggleLoop = async () => {
    if (sound) {
      setIsLooping(!isLooping);
      await sound.setIsLoopingAsync(!isLooping);
    }
  };

  useEffect(() => {
    if (status) {
      setProgress(status.positionMillis / status.durationMillis);
    }
  }, [status]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muhabbat ab main na karonga kisi ko</Text>
      <Text style={styles.label}>Predicted Label:{label}</Text> {/* Display the passed label */}
      <Image
        source={require('../assets/Icons/music1.png')}
        style={styles.image}
      />
      <View style={styles.controls}>
        <TouchableOpacity onPress={stopAudio}>
          <Icon name="stop" size={40} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause}>
          <Icon name={status?.isPlaying ? "pause" : "play"} size={40} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleLoop}>
          <Icon name="repeat" size={40} color={isLooping ? "#1EB1FC" : "#000"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default MusicPlayer;
