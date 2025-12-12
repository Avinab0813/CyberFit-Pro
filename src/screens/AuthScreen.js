import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../theme/styles';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const { login } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  // Check Biometrics Support
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible && enrolled);
    })();
  }, []);

  // --- ACTIONS ---

  const handleBiometricAuth = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    const storedEmail = await AsyncStorage.getItem('userEmail');
    if (!storedEmail) {
        Alert.alert("Unknown Operative", "No identity found. Create an account manually first.");
        return;
    }

    const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'VERIFY IDENTITY',
        fallbackLabel: 'Enter Passcode',
        disableDeviceFallback: false,
    });

    if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        login();
    } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleSignUp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!email || !password || !username) { Alert.alert("Error", "Fill all fields."); return; }
    
    setLoading(true);
    try {
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPassword', password);
      await AsyncStorage.setItem('userName', username);
      setTimeout(() => { setLoading(false); login(); }, 1500);
    } catch (e) { setLoading(false); }
  };

  const handleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!email || !password) { Alert.alert("Error", "Enter credentials."); return; }
    
    setLoading(true);
    try {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      const storedPass = await AsyncStorage.getItem('userPassword');
      if (email.toLowerCase() === storedEmail?.toLowerCase() && password === storedPass) {
         setTimeout(() => { setLoading(false); login(); }, 1500);
      } else {
         setLoading(false); Alert.alert("Access Denied", "Invalid Credentials.");
      }
    } catch (e) { setLoading(false); }
  };

  const toggleMode = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsLogin(!isLogin);
  };

  return (
    <View style={styles.container}>
        
        {/* BACKGROUND ACCENTS */}
        <View style={styles.glowTop} />
        
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1, justifyContent:'center'}}>
            <View style={{padding: 30}}>
                
                {/* 1. BRANDING */}
                <View style={{alignItems:'center', marginBottom: 40}}>
                    <Image source={{uri: 'https://i.imgur.com/Te04y5V.png'}} style={styles.logo} />
                    <Text style={styles.brandTitle}>CYBER<Text style={{color: COLORS.primary}}>FIT</Text></Text>
                    <Text style={styles.brandSubtitle}>ELITE PERFORMANCE TRACKING</Text>
                </View>

                {/* 2. THE FORM CARD */}
                <View style={styles.card}>
                    
                    {/* Username (Signup Only) */}
                    {!isLogin && (
                        <View style={styles.inputWrapper}>
                            {/* ICON IS NOW LIME GREEN */}
                            <Ionicons name="person" size={20} color={COLORS.primary} style={styles.inputIcon} />
                            <TextInput 
                                placeholder="CODENAME" placeholderTextColor="#888" 
                                style={styles.input} value={username} onChangeText={setUsername} 
                            />
                        </View>
                    )}

                    {/* Email */}
                    <View style={styles.inputWrapper}>
                        {/* ICON IS NOW LIME GREEN */}
                        <Ionicons name="mail" size={20} color={COLORS.primary} style={styles.inputIcon} />
                        <TextInput 
                            placeholder="EMAIL ADDRESS" placeholderTextColor="#888" 
                            style={styles.input} keyboardType="email-address" autoCapitalize="none" 
                            value={email} onChangeText={setEmail} 
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputWrapper}>
                        {/* ICON IS NOW LIME GREEN */}
                        <Ionicons name="lock-closed" size={20} color={COLORS.primary} style={styles.inputIcon} />
                        <TextInput 
                            placeholder="PASSWORD" placeholderTextColor="#888" 
                            style={styles.input} secureTextEntry 
                            value={password} onChangeText={setPassword} 
                        />
                    </View>

                    {/* MAIN BUTTON */}
                    <TouchableOpacity onPress={isLogin ? handleLogin : handleSignUp} disabled={loading} style={{marginTop: 10}}>
                        <LinearGradient 
                            colors={loading ? ['#333', '#333'] : [COLORS.primary, '#99cc00']} 
                            start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
                            style={styles.mainBtn}
                        >
                            <Text style={styles.btnText}>
                                {loading ? "PROCESSING..." : (isLogin ? "INITIATE LOGIN" : "CREATE IDENTITY")}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </View>

                {/* 3. BIOMETRICS ZONE */}
                {isLogin && isBiometricSupported && (
                    <TouchableOpacity onPress={handleBiometricAuth} style={styles.bioBtn}>
                        <MaterialCommunityIcons name="fingerprint" size={40} color={COLORS.primary} />
                        <Text style={styles.bioText}>TAP TO SCAN</Text>
                    </TouchableOpacity>
                )}

                {/* 4. TOGGLE FOOTER */}
                <TouchableOpacity onPress={toggleMode} style={{marginTop: 30, alignItems:'center'}}>
                    <Text style={{color: '#666', fontSize: 12}}>
                        {isLogin ? "NEW OPERATIVE? " : "ALREADY REGISTERED? "}
                        <Text style={{color: '#fff', fontWeight: 'bold'}}>
                            {isLogin ? "JOIN THE SQUAD" : "ACCESS TERMINAL"}
                        </Text>
                    </Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505', // Deep Black
    },
    glowTop: {
        position: 'absolute', top: -100, left: 0, right: 0,
        height: 300,
        backgroundColor: COLORS.primary,
        opacity: 0.1,
        transform: [{ scaleX: 1.5 }],
        borderRadius: 1000, 
    },
    logo: {
        width: 80, height: 80, borderRadius: 40,
        borderWidth: 2, borderColor: COLORS.primary,
        marginBottom: 15
    },
    brandTitle: {
        color: '#fff', fontSize: 36, fontWeight: '900', letterSpacing: 2
    },
    brandSubtitle: {
        color: COLORS.textDim, fontSize: 10, letterSpacing: 4, marginTop: 5
    },
    card: {
        backgroundColor: '#1A1A1A', // Graphite Card
        padding: 25, borderRadius: 30,
        shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10
    },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#0F0F0F', // Darker inset for inputs
        borderRadius: 15, paddingHorizontal: 15, height: 60, marginBottom: 15,
        borderWidth: 1, borderColor: '#333'
    },
    inputIcon: { marginRight: 15 },
    input: {
        flex: 1, color: '#fff', fontWeight: 'bold', fontSize: 14
    },
    mainBtn: {
        height: 60, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center',
        shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5
    },
    btnText: {
        color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1
    },
    bioBtn: {
        marginTop: 30, alignItems:'center', justifyContent:'center',
        alignSelf: 'center',
        width: 80, height: 80, borderRadius: 25,
        backgroundColor: '#1A1A1A',
        borderWidth: 1, borderColor: COLORS.primary // Lime Border
    },
    bioText: {
        color: COLORS.primary, fontSize: 10, marginTop: 5, fontWeight:'bold'
    }
});