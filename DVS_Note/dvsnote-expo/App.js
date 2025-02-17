import { StyleSheet } from 'react-native';
import React from 'react';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
      <WebView
          source={{ uri: 'https://major-group-project-oi494visp-salems-projects-9acafb47.vercel.app/register' }}
      />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
