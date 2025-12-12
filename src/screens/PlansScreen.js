import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Modal, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { COLORS, globalStyles } from '../theme/styles';

const { width } = Dimensions.get('window');

// --- THE GYM DATABASE ---
const WORKOUT_DATABASE = [
  {
    id: 1,
    title: "Lower Body Power",
    duration: "45 mins",
    category: "Lower Body",
    color: COLORS.primary, // Lime
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
    exercises: [
      { name: "Barbell Squats", sets: "4 sets x 8 reps", link: "https://www.youtube.com/results?search_query=how+to+barbell+squat" },
      { name: "Romanian Deadlifts", sets: "3 sets x 10 reps", link: "https://www.youtube.com/results?search_query=how+to+romanian+deadlift" },
      { name: "Leg Press", sets: "3 sets x 12 reps", link: "https://www.youtube.com/results?search_query=how+to+leg+press" },
      { name: "Calf Raises", sets: "4 sets x 15 reps", link: "https://www.youtube.com/results?search_query=standing+calf+raise" }
    ]
  },
  {
    id: 2,
    title: "Upper Body Hypertrophy",
    duration: "60 mins",
    category: "Upper Body",
    color: COLORS.secondary, // Lilac
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
    exercises: [
      { name: "Incline Bench Press", sets: "4 sets x 10 reps", link: "https://www.youtube.com/results?search_query=incline+dumbbell+press" },
      { name: "Lat Pulldowns", sets: "3 sets x 12 reps", link: "https://www.youtube.com/results?search_query=lat+pulldown+form" },
      { name: "Overhead Press", sets: "3 sets x 8 reps", link: "https://www.youtube.com/results?search_query=dumbbell+overhead+press" },
      { name: "Bicep Curls", sets: "3 sets x 12 reps", link: "https://www.youtube.com/results?search_query=dumbbell+bicep+curls" }
    ]
  },
  {
    id: 3,
    title: "HIIT Cardio Blast",
    duration: "20 mins",
    category: "Cardio",
    color: COLORS.accent, // Pink
    image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop",
    exercises: [
      { name: "Burpees", sets: "30 seconds", link: "https://www.youtube.com/results?search_query=how+to+do+burpees" },
      { name: "Mountain Climbers", sets: "45 seconds", link: "https://www.youtube.com/results?search_query=mountain+climbers+exercise" },
      { name: "Jump Squats", sets: "30 seconds", link: "https://www.youtube.com/results?search_query=jump+squats" },
      { name: "High Knees", sets: "45 seconds", link: "https://www.youtube.com/results?search_query=high+knees+exercise" }
    ]
  },
  {
    id: 4,
    title: "Core Crusher",
    duration: "15 mins",
    category: "Abs",
    color: '#00BFFF', // Blue
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
    exercises: [
      { name: "Plank", sets: "3 sets x 60s", link: "https://www.youtube.com/results?search_query=perfect+plank+form" },
      { name: "Russian Twists", sets: "3 sets x 20 reps", link: "https://www.youtube.com/results?search_query=russian+twists" },
      { name: "Leg Raises", sets: "3 sets x 15 reps", link: "https://www.youtube.com/results?search_query=hanging+leg+raises" }
    ]
  }
];

export default function PlansScreen() {
  const [name, setName] = useState('OPERATIVE');
  const [avatar, setAvatar] = useState('https://i.imgur.com/Te04y5V.png');
  const [activeFilter, setActiveFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const savedName = await AsyncStorage.getItem('userName');
          const savedImage = await AsyncStorage.getItem('userImage');
          if (savedName) setName(savedName);
          if (savedImage) setAvatar(savedImage);
        } catch (e) {}
      };
      loadProfile();
    }, [])
  );

  const openWorkout = (workout) => {
      setSelectedWorkout(workout);
      setModalVisible(true);
  };

  const watchVideo = (url) => {
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const filteredData = activeFilter === 'All' 
    ? WORKOUT_DATABASE 
    : WORKOUT_DATABASE.filter(item => item.category.includes(activeFilter));

  return (
    <View style={globalStyles.container}>
      
      {/* 1. HEADER */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image 
                source={{uri: avatar}} 
                style={{width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: COLORS.primary}} 
            />
            <View style={{marginLeft: 10}}>
                <Text style={{color: '#888', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase'}}>FITNESS FREAK</Text>
                <Text style={{color: COLORS.white, fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase'}}>HI {name}</Text>
            </View>
        </View>
        <View style={{backgroundColor: '#2C2C2E', padding: 10, borderRadius: 25}}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.white} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 120}}>
        
        {/* 2. PROGRESS CARD (FIXED IMAGE) */}
        <TouchableOpacity 
            onPress={() => openWorkout(WORKOUT_DATABASE[0])} 
            activeOpacity={0.9}
            style={[globalStyles.card, {backgroundColor: COLORS.primary, height: 200, padding: 0, flexDirection: 'row', marginBottom: 30}]}
        >
            {/* Text Section - Left Side */}
            <View style={{flex: 1, padding: 24, justifyContent: 'center', zIndex: 10}}>
                <View style={{marginBottom: 10}}>
                    <Text style={{fontSize: 12, fontWeight: 'bold', marginBottom: 5, color: COLORS.black}}>Recommend</Text>
                    <Text style={{fontSize: 28, fontWeight: '900', color: COLORS.black}}>Lower Body</Text>
                    <Text style={{fontSize: 13, marginTop: 5, color: '#333', fontWeight:'600'}}>45 Mins • Intense</Text>
                </View>
                <View style={{backgroundColor: COLORS.black, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, alignSelf: 'flex-start'}}>
                    <Text style={{color: COLORS.white, fontWeight: 'bold', fontSize: 12}}>START NOW</Text>
                </View>
            </View>

            {/* Image Section - Right Side (FIXED) */}
            <View style={{width: '45%', height: '100%', overflow:'hidden', borderTopRightRadius: 32, borderBottomRightRadius: 32}}>
                <Image 
                    source={{uri: WORKOUT_DATABASE[0].image}} 
                    style={{width: '100%', height: '100%'}} 
                    resizeMode="cover"
                />
            </View>
        </TouchableOpacity>

        {/* 3. FILTERS */}
        <Text style={globalStyles.sectionTitle}>Explore Plans</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 20}}>
            {['All', 'Upper Body', 'Lower Body', 'Cardio', 'Abs'].map((filter) => (
                <TouchableOpacity 
                    key={filter}
                    onPress={() => setActiveFilter(filter)}
                    style={{
                        backgroundColor: activeFilter === filter ? COLORS.white : '#2C2C2E',
                        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10
                    }}
                >
                    <Text style={{color: activeFilter === filter ? COLORS.black : COLORS.white, fontWeight: 'bold', fontSize: 12}}>{filter}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* 4. WORKOUT LIST */}
        {filteredData.map((workout) => (
            <WorkoutCard 
                key={workout.id}
                data={workout}
                onPress={() => openWorkout(workout)}
            />
        ))}

      </ScrollView>

      {/* 5. MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
          <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.9)', justifyContent:'flex-end'}}>
              <View style={{height:'85%', backgroundColor:'#18181b', borderTopLeftRadius:30, borderTopRightRadius:30, padding: 25}}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                      <Text style={{color:'#fff', fontSize:24, fontWeight:'900', width:'80%'}}>{selectedWorkout?.title}</Text>
                      <TouchableOpacity onPress={() => setModalVisible(false)} style={{backgroundColor:'#333', padding:5, borderRadius:20}}>
                          <Ionicons name="close" size={24} color="#fff" />
                      </TouchableOpacity>
                  </View>
                  <View style={{flexDirection:'row', marginBottom: 20}}>
                      <View style={{backgroundColor: selectedWorkout?.color, paddingHorizontal:10, paddingVertical:5, borderRadius:10, marginRight:10}}>
                          <Text style={{fontWeight:'bold', color:'#000'}}>{selectedWorkout?.duration}</Text>
                      </View>
                      <View style={{backgroundColor:'#333', paddingHorizontal:10, paddingVertical:5, borderRadius:10}}>
                          <Text style={{fontWeight:'bold', color:'#fff'}}>{selectedWorkout?.category}</Text>
                      </View>
                  </View>
                  <Text style={{color:'#888', marginBottom:15, fontSize:12, fontWeight:'bold', letterSpacing:1}}>EXERCISE LIST</Text>
                  <ScrollView showsVerticalScrollIndicator={false}>
                      {selectedWorkout?.exercises.map((ex, index) => (
                          <TouchableOpacity 
                            key={index} 
                            onPress={() => watchVideo(ex.link)}
                            style={{flexDirection:'row', alignItems:'center', backgroundColor:'#222', padding:15, borderRadius:15, marginBottom:10}}
                          >
                              <View style={{width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,0,0,0.2)', justifyContent:'center', alignItems:'center', marginRight:15}}>
                                  <FontAwesome5 name="youtube" size={20} color="#FF0000" />
                              </View>
                              <View style={{flex:1}}>
                                  <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>{ex.name}</Text>
                                  <Text style={{color:'#888', fontSize:12}}>{ex.sets}</Text>
                              </View>
                              <Ionicons name="chevron-forward" size={20} color="#555" />
                          </TouchableOpacity>
                      ))}
                      <View style={{height:50}}/>
                  </ScrollView>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={{backgroundColor: COLORS.primary, padding:18, borderRadius:20, alignItems:'center', marginBottom:10}}>
                      <Text style={{color:'#000', fontWeight:'900', fontSize:16}}>START WORKOUT</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

    </View>
  );
}

const WorkoutCard = ({ data, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[globalStyles.card, {backgroundColor: data.color, height: 140, flexDirection: 'row', marginBottom: 20, padding: 0}]}>
        <View style={{padding: 24, flex: 1, justifyContent: 'center'}}>
            <Text style={{fontSize: 20, fontWeight: '800', color: COLORS.black, marginBottom: 5}}>{data.title}</Text>
            <Text style={{fontSize: 13, fontWeight: '600', color: '#333'}}>{data.duration} • {data.exercises.length} Exercises</Text>
            <View style={{marginTop: 15, backgroundColor: 'rgba(255,255,255,0.4)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons name="play" size={20} color={COLORS.black} />
            </View>
        </View>
        <Image source={{uri: data.image}} style={{width: 140, height: '100%'}} resizeMode="cover" />
    </TouchableOpacity>
);