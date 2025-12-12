import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview'; // <--- The Crash-Proof Map
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/styles';

export default function TrackerScreen() {
  const [location, setLocation] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // 1. Get Location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Allow location access.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  // 2. Stopwatch
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // 3. THE HTML MAP (Cyberpunk Dark Theme)
  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; background-color: #000; }
        #map { width: 100%; height: 100vh; }
        .leaflet-control-attribution { display: none; } /* Clean look */
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Initialize Map
        var map = L.map('map', {zoomControl: false}).setView([${location?.latitude || 40.7128}, ${location?.longitude || -74.0060}], 16);
        
        // Dark Matter Tiles (The Cyber Look)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19
        }).addTo(map);

        // Neon Marker
        var icon = L.divIcon({
          className: 'custom-div-icon',
          html: "<div style='background-color:#D4FF00; width:15px; height:15px; border-radius:50%; box-shadow:0 0 10px #D4FF00; border: 2px solid white;'></div>",
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        L.marker([${location?.latitude || 40.7128}, ${location?.longitude || -74.0060}], {icon: icon}).addTo(map);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{flex: 1, backgroundColor: COLORS.background}}>
      
      {/* THE MAP */}
      {location ? (
          <WebView
            originWhitelist={['*']}
            source={{ html: mapHTML }}
            style={{ flex: 1, backgroundColor: '#000' }}
          />
      ) : (
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Text style={{color: COLORS.primary, fontWeight:'bold'}}>LOCATING SATELLITES...</Text>
          </View>
      )}

      {/* MUSIC WIDGET */}
      <View style={styles.musicWidget}>
          <View style={{flexDirection:'row', alignItems:'flex-end', height: 15, marginBottom: 10, gap: 3}}>
              <View style={{width: 3, height: 8, backgroundColor: COLORS.primary}} />
              <View style={{width: 3, height: 14, backgroundColor: COLORS.secondary}} />
              <View style={{width: 3, height: 10, backgroundColor: COLORS.primary}} />
              <View style={{width: 3, height: 5, backgroundColor: COLORS.secondary}} />
          </View>
          <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} style={{marginBottom: 10}}>
             <Ionicons name="play-skip-back" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} style={{marginBottom: 10}}>
             <Ionicons name="play-circle" size={34} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
             <Ionicons name="play-skip-forward" size={20} color="#fff" />
          </TouchableOpacity>
      </View>

      {/* HUD */}
      <View style={styles.hudContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
             <View>
                 <Text style={{color: '#888', fontSize: 10, letterSpacing: 1, fontWeight:'bold'}}>DURATION</Text>
                 <Text style={{color: '#fff', fontSize: 32, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto'}}>{formatTime(seconds)}</Text>
             </View>
             <View style={{alignItems: 'flex-end'}}>
                 <Text style={{color: '#888', fontSize: 10, letterSpacing: 1, fontWeight:'bold'}}>PACE</Text>
                 <Text style={{color: COLORS.primary, fontSize: 32, fontWeight: '900'}}>5'30"<Text style={{fontSize:14, color:'#666'}}>/km</Text></Text>
             </View>
          </View>

          <TouchableOpacity 
            onPress={() => { setIsRunning(!isRunning); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); }}
            activeOpacity={0.8}
            style={{
                backgroundColor: isRunning ? (COLORS.danger || '#FF3B30') : COLORS.primary,
                padding: 18, borderRadius: 20, alignItems: 'center',
                shadowColor: isRunning ? '#FF3B30' : COLORS.primary,
                shadowOpacity: 0.4, shadowRadius: 10, elevation: 5
            }}
          >
              <Text style={{color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 0.5}}>
                  {isRunning ? "END WORKOUT" : "START RUN"}
              </Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hudContainer: {
    position: 'absolute', bottom: 120,
    left: 20, right: 20,
    backgroundColor: '#1c1c1e',
    padding: 25, borderRadius: 30,
    borderWidth: 1, borderColor: '#333'
  },
  musicWidget: {
    position: 'absolute', top: 60, right: 20,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 20, paddingVertical: 15, paddingHorizontal: 10,
    width: 60, alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1
  }
});