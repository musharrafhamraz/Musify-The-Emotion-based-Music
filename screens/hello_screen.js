import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';

// Emotion folders mapping
const emotions = {
  sad: 'sad',
  happy: 'happy',
  surprised: 'surprised',
  neutral: 'neutral',
  fearful: 'fearful',
  angry: 'angry',
};

// Songs for each emotion
const songs = {
  sad: [
    require('../assets/songs/sad/Lost-Boys.mp3'),
    require('../assets/songs/happy/happy1.mp3'),
    require('../assets/songs/surprised/The-Fever-(Aye-Aye).mp3'),
  ],
  happy: [
    require('../assets/songs/happy/happy1.mp3'),
    require('../assets/songs/fearful/Takyon-(Death-Yon).mp3'),
    require('../assets/songs/angry/No-Love.mp3'),
  ],
  surprised: [
    require('../assets/songs/surprised/The-Fever-(Aye-Aye).mp3'),
    require('../assets/songs/happy/happy1.mp3'),
  ],
  neutral: [
    require('../assets/songs/neutral/Ive-Seen-Footage.mp3'),
    require('../assets/songs/neutral/song1.mp3'),
    require('../assets/songs/angry/No-Love.mp3'),
  ],
  fearful: [
    require('../assets/songs/fearful/Takyon-(Death-Yon).mp3'),
    require('../assets/songs/angry/No-Love.mp3'),
    require('../assets/songs/happy/happy1.mp3'),
    require('../assets/songs/surprised/The-Fever-(Aye-Aye).mp3'),
  ],
  angry: [
    require('../assets/songs/angry/No-Love.mp3'),
    require('../assets/songs/surprised/The-Fever-(Aye-Aye).mp3'),
    require('../assets/songs/fearful/Takyon-(Death-Yon).mp3'),
    require('../assets/songs/happy/happy1.mp3'),
  ],
};

const MusicPlayer = ({ route }) => {
  const { label } = route.params; // Extract the label parameter

  const [sound, setSound] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadAndPlayAudio = async () => {
      try {
        const emotionFolder = emotions[label.toLowerCase()];
        if (!emotionFolder) {
          console.warn(`No song folder found for label: ${label}`);
          return;
        }

        // Get the list of songs for the given emotion
        const songList = songs[emotionFolder];
        if (!songList) {
          console.warn(`No songs available for emotion: ${emotionFolder}`);
          return;
        }

        // Select a random song from the list
        const randomSongIndex = Math.floor(Math.random() * songList.length);
        const randomSong = songList[randomSongIndex];

        // Load and play the selected song
        const { sound: loadedSound } = await Audio.Sound.createAsync(
          randomSong,
          { shouldPlay: true, isLooping: isLooping }
        );
        setSound(loadedSound);
        loadedSound.setOnPlaybackStatusUpdate(setStatus);
      } catch (error) {
        console.error('Error loading or playing audio:', error);
      }
    };

    loadAndPlayAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [label, isLooping]);

  const togglePlayPause = async () => {
    if (sound) {
      if (status?.isPlaying) {
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
      <Text style={styles.title1}>Enjoy Your Mood</Text>
      <Text style={styles.title}>Playing {label} Music</Text>
      <Image source={require('../assets/Icons/music1.png')} style={styles.image} />
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

export default MusicPlayer;

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
  title1: {
    fontSize: 30,
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
    marginVertical:60,
    marginBottom: 20,
    borderRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 50,
  },
});
