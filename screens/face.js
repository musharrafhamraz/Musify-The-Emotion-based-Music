import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Svg, Rect, Ellipse, Defs, Mask } from 'react-native-svg';

const FaceOverlay = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg viewBox="0 0 100 130">
        <Defs >
          <Mask id="mask" x="0" y="0" width="100%" height="100%">
            <Rect x="0" y="0" width="100%" height="100%" fill="white" />
            <Ellipse cx="50" cy="65" rx="35" ry="50" fill="black" />
          </Mask>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.5)"
          mask="url(#mask)"
        />
        <Ellipse
          cx="50"
          cy="65"
          rx="35"
          ry="50"
          fill="none"
          stroke="white"
          strokeWidth="3"
        />
      </Svg>
    </View>
  );
};

export default FaceOverlay;
