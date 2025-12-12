import React, { useState, useCallback, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, TextInput, Modal, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as Haptics from 'expo-haptics';
import { AuthContext } from '../context/AuthContext'; 
import { COLORS, globalStyles } from '../theme/styles';

const { width } = Dimensions.get('window');
const getTodayKey = () => new Date().toISOString().split('T')[0];

export default function ProfileScreen() {
  const { logout } = useContext(AuthContext);
  
  // --- MANUAL INPUTS ---
  const [name, setName] = useState('GUEST');
  const [image, setImage] = useState('https://i.imgur.com/Te04y5V.png');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('MALE');
  const [activityLevel, setActivityLevel] = useState('1.55');

  // --- AUTOMATED DATA ---
  const [bmi, setBmi] = useState('0.0');
  const [bmr, setBmr] = useState('0'); 
  const [tdee, setTdee] = useState('0'); 
  
  const [todaySteps, setTodaySteps] = useState(0);
  const [todayWater, setTodayWater] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayDistance, setTodayDistance] = useState('0.0');

  // --- UI STATE ---
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempWeight, setTempWeight] = useState('');
  const [tempHeight, setTempHeight] = useState('');
  const [tempAge, setTempAge] = useState('');

  // LOAD DATA
  useFocusEffect(
    useCallback(() => {
      loadAllData();
    }, [])
  );

  const loadAllData = async () => {
    try {
      const sName = await AsyncStorage.getItem('userName');
      const sImage = await AsyncStorage.getItem('userImage');
      const sWeight = await AsyncStorage.getItem('userWeight');
      const sHeight = await AsyncStorage.getItem('userHeight');
      const sAge = await AsyncStorage.getItem('userAge');
      const sGender = await AsyncStorage.getItem('userGender');
      const sActivity = await AsyncStorage.getItem('userActivity');

      if (sName) setName(sName);
      if (sImage) setImage(sImage);
      if (sWeight) setWeight(sWeight);
      if (sHeight) setHeight(sHeight);
      if (sAge) setAge(sAge);
      if (sGender) setGender(sGender);
      if (sActivity) setActivityLevel(sActivity);

      const key = `stats_${getTodayKey()}`;
      const savedStats = await AsyncStorage.getItem(key);
      if (savedStats) {
          const parsed = JSON.parse(savedStats);
          const s = parsed.steps || 0;
          setTodaySteps(s);
          setTodayWater(parsed.water || 0);
          setTodayCalories(parsed.calories || 0);
          const dist = (s * 0.0008).toFixed(2);
          setTodayDistance(dist);
      }

      calculateMetrics(sWeight || '70', sHeight || '175', sAge || '25', sGender || 'MALE', sActivity || '1.55');

    } catch (e) { console.log(e); }
  };

  const calculateMetrics = (w, h, a, g, act) => {
      const weightKg = parseInt(w);
      const heightCm = parseInt(h);
      const ageYrs = parseInt(a);
      const activityMultiplier = parseFloat(act);

      if (isNaN(weightKg) || isNaN(heightCm) || isNaN(ageYrs)) return;

      const heightM = heightCm / 100;
      const bmiVal = weightKg / (heightM * heightM);
      setBmi(bmiVal.toFixed(1));

      let bmrVal = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYrs);
      if (g === 'MALE') bmrVal += 5; else bmrVal -= 161;
      setBmr(Math.round(bmrVal).toString());

      const tdeeVal = Math.round(bmrVal * activityMultiplier);
      setTdee(tdeeVal.toString());
      AsyncStorage.setItem('calorieGoal', tdeeVal.toString());
  };

  // EDIT FUNCTIONS
  const openEditModal = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTempName(name);
      setTempWeight(weight);
      setTempHeight(height);
      setTempAge(age);
      setEditModalVisible(true);
  };

  const saveEdit = async () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setName(tempName);
      setWeight(tempWeight);
      setHeight(tempHeight);
      setAge(tempAge);

      await AsyncStorage.setItem('userName', tempName);
      await AsyncStorage.setItem('userWeight', tempWeight);
      await AsyncStorage.setItem('userHeight', tempHeight);
      await AsyncStorage.setItem('userAge', tempAge);
      await AsyncStorage.setItem('userGender', gender);
      await AsyncStorage.setItem('userActivity', activityLevel);

      calculateMetrics(tempWeight, tempHeight, tempAge, gender, activityLevel);
      setEditModalVisible(false);
  };

  const toggleGender = () => setGender(prev => prev === 'MALE' ? 'FEMALE' : 'MALE');
  const toggleActivity = () => {
      if (activityLevel === '1.2') setActivityLevel('1.55');
      else if (activityLevel === '1.55') setActivityLevel('1.9');
      else setActivityLevel('1.2');
  };
  const getActivityLabel = () => {
      if (activityLevel === '1.2') return 'SEDENTARY';
      if (activityLevel === '1.55') return 'MODERATE';
      return 'ATHLETE';
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await AsyncStorage.setItem('userImage', result.assets[0].uri);
    }
  };

  const handleLogout = () => {
      Alert.alert("Sign Out", "Disconnect session?", [{ text: "Cancel", style: "cancel" }, { text: "Disconnect", style: 'destructive', onPress: () => logout() }]);
  };

  const handleReset = () => {
      Alert.alert("Factory Reset", "Wipe all data?", [{ text: "Cancel", style: "cancel" }, { text: "Wipe", style: 'destructive', onPress: async () => { await AsyncStorage.clear(); logout(); }}]);
  };

  return (
    <View style={globalStyles.container}>
      
      {/* HEADER - Updated Text */}
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 20}}>
          <View>
              <Text style={{color: COLORS.textDim, fontSize: 12, fontWeight:'bold', letterSpacing: 1}}>CENTRAL HUB</Text>
              <Text style={globalStyles.headerTitle}>PROFILE</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={{backgroundColor: '#2C2C2E', padding: 10, borderRadius: 15}}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.danger || '#FF3B30'} />
          </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 120}}>
        
        {/* 1. IDENTITY CARD */}
        <View style={styles.identityCard}>
            <TouchableOpacity onPress={pickImage}>
                <Image source={{uri: image}} style={styles.avatar} />
                <View style={styles.camIcon}><Ionicons name="camera" size={14} color="#000" /></View>
            </TouchableOpacity>
            <View style={{marginLeft: 20, flex: 1}}>
                <Text style={{color: '#fff', fontSize: 24, fontWeight: '900', textTransform:'uppercase'}}>{name}</Text>
                <TouchableOpacity onPress={openEditModal} style={{flexDirection:'row', alignItems:'center', marginTop: 5, backgroundColor: 'rgba(212, 255, 0, 0.1)', alignSelf:'flex-start', paddingHorizontal:10, paddingVertical:5, borderRadius:10}}>
                    <Text style={{color: COLORS.primary, fontWeight:'bold', fontSize: 12}}>UPDATE BIO-DATA</Text>
                    <Ionicons name="pencil" size={12} color={COLORS.primary} style={{marginLeft: 5}} />
                </TouchableOpacity>
            </View>
        </View>

        {/* 2. AUTOMATED PERFORMANCE */}
        <Text style={globalStyles.sectionTitle}>Today's Performance (Auto)</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {/* Steps: Changed Icon to 'foot-print' to fix the question mark */}
            <StatBox label="STEPS" value={todaySteps} unit="" icon="foot-print" iconColor="#00FF99" />
            
            {/* Distance */}
            <StatBox label="DISTANCE" value={todayDistance} unit="KM" icon="map-marker-distance" iconColor="#FF9900" />
            
            {/* Calories */}
            <StatBox label="INTAKE" value={todayCalories} unit="KCAL" icon="food-apple" iconColor="#FF0099" />
            
            {/* Water */}
            <StatBox label="HYDRATION" value={todayWater} unit="CUPS" icon="water" iconColor="#00BFFF" />
        </View>

        {/* 3. METABOLIC SCIENCE */}
        <Text style={globalStyles.sectionTitle}>Biological Engine (Calc)</Text>
        <LinearGradient colors={['#1e1e24', '#2a2a35']} style={styles.scienceCard}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 15}}>
                <View>
                    <Text style={{color:'#888', fontSize:10, fontWeight:'bold'}}>MAINTENANCE (TDEE)</Text>
                    <Text style={{color: COLORS.white, fontSize: 36, fontWeight:'900', letterSpacing:-1}}>{tdee}</Text>
                </View>
                <View>
                    <Text style={{color:'#888', fontSize:10, fontWeight:'bold', textAlign:'right'}}>BASE RATE (BMR)</Text>
                    <Text style={{color: COLORS.secondary, fontSize: 36, fontWeight:'900', textAlign:'right', letterSpacing:-1}}>{bmr}</Text>
                </View>
            </View>
            <View style={{height: 1, backgroundColor: '#333', marginBottom: 15}} />
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <Text style={{color:'#888', fontSize: 12}}>BMI Score: <Text style={{color: '#fff', fontWeight:'bold'}}>{bmi}</Text></Text>
                <View style={{backgroundColor: parseFloat(bmi) < 25 ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5}}>
                    <Text style={{color: parseFloat(bmi) < 25 ? '#0aff0a' : '#ff3b30', fontSize: 10, fontWeight:'bold'}}>
                        {parseFloat(bmi) < 18.5 ? "UNDERWEIGHT" : parseFloat(bmi) < 25 ? "HEALTHY" : "OVERWEIGHT"}
                    </Text>
                </View>
            </View>
        </LinearGradient>

        {/* 4. MANUAL BIO-DATA */}
        <Text style={globalStyles.sectionTitle}>Manual Bio-Data</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            <StatBox label="Weight" value={weight} unit="KG" icon="scale-bathroom" iconColor="#40E0D0" />
            <StatBox label="Height" value={height} unit="CM" icon="human-male-height" iconColor="#C4A9FF" />
            <StatBox label="Age" value={age} unit="YRS" icon="calendar-account" iconColor="#FFD700" />
            <StatBox label="Gender" value={gender} unit="" icon="gender-male-female" iconColor="#87CEEB" />
        </View>

        <TouchableOpacity onPress={handleReset} style={{marginTop: 20, alignSelf:'center', padding: 20, marginBottom: 50}}>
            <Text style={{color: '#444', fontWeight:'bold', fontSize: 12}}>FACTORY RESET</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* --- EDIT MODAL --- */}
      <Modal visible={editModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContent}>
                  <Text style={[globalStyles.title, {marginBottom: 20, textAlign:'center'}]}>UPDATE INTEL</Text>
                  
                  <Text style={styles.label}>CODENAME</Text>
                  <TextInput style={styles.input} value={tempName} onChangeText={setTempName} />

                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                      <View style={{width:'48%'}}><Text style={styles.label}>WEIGHT (KG)</Text><TextInput style={styles.input} value={tempWeight} onChangeText={setTempWeight} keyboardType="numeric" /></View>
                      <View style={{width:'48%'}}><Text style={styles.label}>HEIGHT (CM)</Text><TextInput style={styles.input} value={tempHeight} onChangeText={setTempHeight} keyboardType="numeric" /></View>
                  </View>

                  <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 15}}>
                      <View style={{width:'30%'}}><Text style={styles.label}>AGE</Text><TextInput style={styles.input} value={tempAge} onChangeText={setTempAge} keyboardType="numeric" /></View>
                      <View style={{width:'65%'}}>
                          <Text style={styles.label}>GENDER</Text>
                          <TouchableOpacity onPress={toggleGender} style={styles.toggleBtn}><Text style={{color:'#fff', fontWeight:'bold'}}>{gender}</Text></TouchableOpacity>
                      </View>
                  </View>

                  <Text style={styles.label}>ACTIVITY LEVEL</Text>
                  <TouchableOpacity onPress={toggleActivity} style={[styles.toggleBtn, {backgroundColor: COLORS.surface, marginBottom: 25}]}>
                      <Text style={{color: COLORS.primary, fontWeight:'bold', fontSize: 16}}>{getActivityLabel()}</Text>
                      <Text style={{color: '#666', fontSize: 10, marginTop: 2}}>Tap to change</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={saveEdit} style={styles.saveBtn}><Text style={{color:'#000', fontWeight:'900', fontSize:16}}>SAVE & RECALCULATE</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{marginTop: 20, alignSelf:'center'}}><Text style={{color: '#666', fontWeight:'bold'}}>Cancel</Text></TouchableOpacity>
              </KeyboardAvoidingView>
          </View>
      </Modal>

    </View>
  );
}

// Updated StatBox with Icon Color Support
const StatBox = ({ label, value, unit, icon, iconColor }) => (
    <View style={styles.statBox}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.statLabel}>{label}</Text>
            <MaterialCommunityIcons name={icon} size={20} color={iconColor || COLORS.white} />
        </View>
        <Text style={styles.statValue}>{value} <Text style={styles.statUnit}>{unit}</Text></Text>
    </View>
);

const styles = {
    identityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1c1c1e', padding: 20, borderRadius: 30, marginBottom: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: COLORS.primary },
    camIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#1c1c1e' },
    scienceCard: { padding: 25, borderRadius: 30, borderWidth: 1, borderColor: '#333', marginBottom: 20 },
    statBox: { width: '48%', backgroundColor: '#1c1c1e', padding: 20, borderRadius: 25, marginBottom: 15 },
    statLabel: { fontWeight:'bold', color: '#555', fontSize:12, textTransform:'uppercase' },
    statValue: { fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginTop: 10 },
    statUnit: { fontSize: 12, color: '#555' },
    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#151515', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: COLORS.primary },
    label: { color: COLORS.secondary, fontSize: 10, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
    input: { backgroundColor: '#222', color: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16, fontWeight: 'bold', borderWidth: 1, borderColor: '#333' },
    toggleBtn: { backgroundColor: '#222', padding: 15, borderRadius: 12, alignItems: 'center', justifyContent:'center', borderWidth: 1, borderColor: '#333' },
    saveBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 }
};