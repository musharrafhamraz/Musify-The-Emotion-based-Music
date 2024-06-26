import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
// import { Player } from 'react-native-audio-toolkit';

const PlaySound = () => {
  const playSound = () => {
    // const player = new Player('../assets/song1.mp3');
    // player.play();
  };

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
      <Button title="Play Sound" onPress={playSound} />
    </View>
  );
};

export default PlaySound;
