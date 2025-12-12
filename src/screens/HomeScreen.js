import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Modal, TextInput, Alert, Vibration } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Pedometer } from 'expo-sensors';
import { ProgressChart } from 'react-native-chart-kit';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { COLORS, globalStyles } from '../theme/styles';

const { width } = Dimensions.get('window');
const getTodayKey = () => new Date().toISOString().split('T')[0];

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('GUEST');
  const [avatar, setAvatar] = useState('https://i.imgur.com/Te04y5V.png');
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [water, setWater] = useState(0);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2500);
  
  const [macroModalVisible, setMacroModalVisible] = useState(false);
  const [inputCals, setInputCals] = useState('');
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    const today = new Date();
    const days = [];
    for (let i = -3; i <= 3; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push({
            day: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
            date: d.getDate(),
            active: i === 0
        });
    }
    setWeekDays(days);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
        const savedName = await AsyncStorage.getItem('userName');
        const savedImage = await AsyncStorage.getItem('userImage');
        const savedGoal = await AsyncStorage.getItem('calorieGoal');
        
        if (savedName) setName(savedName);
        if (savedImage) setAvatar(savedImage);
        if (savedGoal) setDailyCalorieGoal(parseInt(savedGoal));

        const key = `stats_${getTodayKey()}`;
        const savedStats = await AsyncStorage.getItem(key);
        if (savedStats) {
            const parsed = JSON.parse(savedStats);
            if (parsed.calories) setCalories(parsed.calories);
            if (parsed.water) setWater(parsed.water);
            if (parsed.steps) setSteps(parsed.steps);
        }
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    let sub;
    const startTracking = async () => {
        const isAvailable = await Pedometer.isAvailableAsync();
        if (isAvailable) {
            sub = Pedometer.watchStepCount(result => { setSteps(prev => prev + result.steps); });
        }
    };
    startTracking();
    return () => sub && sub.remove();
  }, []);

  useEffect(() => {
      const saveData = async () => {
          const key = `stats_${getTodayKey()}`;
          const data = { calories, water, steps };
          await AsyncStorage.setItem(key, JSON.stringify(data));
      };
      saveData();
  }, [calories, water, steps]);

  const addWater = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setWater(w => w + 1); };
  const manualAddSteps = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSteps(s => s + 50); };
  const submitMacros = () => { const c = parseInt(inputCals); if (!isNaN(c)) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); setCalories(prev => prev + c); setMacroModalVisible(false); setInputCals(''); }};

  const progress = Math.min(calories / dailyCalorieGoal, 1);
  const stepProgress = Math.min(steps / 10000, 1);

  return (
    <View style={globalStyles.container}>
      
      {/* HEADER - Cleaned up text */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
        <View>
            <Text style={{color: COLORS.gray, fontSize: 12, fontWeight:'700', letterSpacing: 1, marginBottom: 4}}>DAILY OVERVIEW</Text>
            <Text style={globalStyles.headerTitle}>HELLO, {name}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{borderWidth:1, borderColor: COLORS.primary, borderRadius: 25, padding:2}}>
            <Image source={{uri: avatar}} style={{width: 46, height: 46, borderRadius: 23}} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 120}}>

        {/* CALENDAR */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, paddingHorizontal: 5}}>
            {weekDays.map((item, index) => (
                <View key={index} style={{alignItems: 'center'}}>
                    <Text style={{color: COLORS.gray, fontSize: 12, marginBottom: 8, fontWeight:'600'}}>{item.day}</Text>
                    <View style={{width: 40, height: 40, borderRadius: 20, backgroundColor: item.active ? COLORS.primary : '#1c1c1e', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: item.active ? COLORS.black : COLORS.white, fontWeight: 'bold'}}>{item.date}</Text>
                    </View>
                </View>
            ))}
        </View>

        {/* HERO CARD - Cleaned up text */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Tracker')} style={[globalStyles.card, {backgroundColor: COLORS.primary, height: 180, flexDirection: 'row', padding: 0, marginBottom: 25}]}>
            <View style={{padding: 24, flex: 1, justifyContent: 'center', zIndex: 10}}>
                <Text style={{fontSize: 18, fontWeight: '900', color: COLORS.black, marginBottom: 5}}>Today's Activity</Text>
                <Text style={{fontSize: 13, color: '#333', fontWeight:'500', marginBottom: 20}}>Go for a 5K Run</Text>
                <View style={{backgroundColor: COLORS.black, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100}}>
                    <Text style={{color: COLORS.white, fontSize: 11, fontWeight: 'bold'}}>START RUN</Text>
                </View>
            </View>
            <Image source={{uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop'}} style={{width: 160, height: '100%', position:'absolute', right:0}} />
        </TouchableOpacity>

        {/* QUICK ACTIONS */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
            <TouchableOpacity onPress={() => navigation.navigate('Plans')} style={styles.actionBtn}>
                <MaterialCommunityIcons name="dumbbell" size={24} color={COLORS.primary} />
                <Text style={styles.actionText}>Gym</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addWater} style={styles.actionBtn}>
                <Ionicons name="water" size={24} color="#00BFFF" />
                <Text style={styles.actionText}>{water} Cups</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMacroModalVisible(true)} style={styles.actionBtn}>
                <MaterialCommunityIcons name="food-apple" size={24} color={COLORS.accent} />
                <Text style={styles.actionText}>Food</Text>
            </TouchableOpacity>
        </View>

        {/* BENTO GRID */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
            <TouchableOpacity onPress={manualAddSteps} activeOpacity={0.8} style={[globalStyles.card, {backgroundColor: COLORS.secondary, width: '48%', height: 170, justifyContent: 'space-between'}]}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', color: COLORS.black}}>Steps</Text>
                    <FontAwesome5 name="shoe-prints" size={18} color={COLORS.black} />
                </View>
                <View>
                    <Text style={{fontSize: 36, fontWeight: '900', color: COLORS.black, letterSpacing: -1}}>{steps}</Text>
                    <Text style={{fontSize: 12, color: '#444', fontWeight: '600'}}>/ 10,000</Text>
                </View>
                <View style={{height: 6, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 3, marginTop: 10}}>
                    <View style={{height: 6, backgroundColor: '#000', width: `${stepProgress * 100}%`, borderRadius: 3}} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMacroModalVisible(true)} style={[globalStyles.card, {backgroundColor: COLORS.surface, width: '48%', height: 170, alignItems: 'center', justifyContent: 'center'}]}>
                <ProgressChart data={{ data: [progress] }} width={width * 0.4} height={120} strokeWidth={14} radius={35} chartConfig={{ backgroundGradientFrom: COLORS.surface, backgroundGradientTo: COLORS.surface, color: (opacity = 1) => `rgba(212, 255, 0, ${opacity})`, backgroundGradientFromOpacity: 0, backgroundGradientToOpacity: 0 }} hideLegend={true} />
                <View style={{position: 'absolute', alignItems:'center'}}>
                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>{calories}</Text>
                    <Text style={{color: COLORS.gray, fontSize: 10}}>/{dailyCalorieGoal}</Text>
                </View>
            </TouchableOpacity>
        </View>

        <View style={[globalStyles.card, {backgroundColor: '#222', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10}]}>
            <View>
                <Text style={{color: COLORS.white, fontWeight: 'bold', fontSize: 16}}>Weekly Status</Text>
                <Text style={{color: COLORS.gray, fontSize: 12, marginTop: 4}}>{progress > 0.8 ? "Excellent work!" : "Keep pushing!"}</Text>
            </View>
            <View style={{backgroundColor: progress > 0.5 ? COLORS.primary : '#333', padding: 10, borderRadius: 50}}>
                <Ionicons name="trending-up" size={24} color={COLORS.black} />
            </View>
        </View>
      </ScrollView>

      <Modal visible={macroModalVisible} transparent={true} animationType="slide" onRequestClose={() => setMacroModalVisible(false)}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20}}>
              <View style={{backgroundColor: '#1c1c1e', borderRadius: 30, padding: 30, alignItems: 'center'}}>
                  <Text style={{color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 20}}>ADD MEAL</Text>
                  <TextInput keyboardType='numeric' style={{backgroundColor: '#000', width: '100%', color: '#fff', padding: 20, borderRadius: 15, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#333'}} placeholder="Calories (e.g. 500)" placeholderTextColor="#555" value={inputCals} onChangeText={setInputCals} autoFocus={true} />
                  <TouchableOpacity onPress={submitMacros} style={{backgroundColor: COLORS.primary, width: '100%', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 15}}><Text style={{color: '#000', fontWeight:'900', fontSize: 16}}>LOG CALORIES</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => setMacroModalVisible(false)}><Text style={{color: '#666', fontWeight:'bold'}}>Cancel</Text></TouchableOpacity>
              </View>
          </View>
      </Modal>
    </View>
  );
}

const styles = {
    actionBtn: { backgroundColor: '#1c1c1e', width: '31%', height: 80, borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
    actionText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 8 }
};