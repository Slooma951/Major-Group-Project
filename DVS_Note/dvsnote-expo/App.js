import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
      <View style={styles.container}>
        <WebView source={{ uri: 'https://major-group-project-teal.vercel.app/register' }} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});