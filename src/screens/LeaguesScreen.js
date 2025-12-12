import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { COLORS, globalStyles } from '../theme/styles';
import { Ionicons } from '@expo/vector-icons';

export default function LeaguesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null);

  const list = [
    { id: 1, name: 'Neon Night Run', reward: 'Cyber Badge', players: 124 },
    { id: 2, name: 'Office Step War', reward: '$50 Pot', players: 8 },
    { id: 3, name: 'Marathon Prep', reward: 'Gold Skin', players: 4500 },
  ];

  // Fake Leaderboard Data
  const leaderboardData = [
    { id: '1', name: 'SpeedDemon', score: '12,400', rank: 1 },
    { id: '2', name: 'SarahConnor', score: '11,200', rank: 2 },
    { id: '3', name: 'CyberRunner (You)', score: '9,800', rank: 3, isMe: true }, // This is you
    { id: '4', name: 'SlowPoke', score: '5,000', rank: 4 },
  ];

  const openLeaderboard = (league) => {
    setSelectedLeague(league);
    setModalVisible(true);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>ACTIVE LEAGUES</Text>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {list.map((item) => (
          <View key={item.id} style={globalStyles.card}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: COLORS.primary, fontSize: 20, fontWeight: 'bold'}}>{item.name}</Text>
                <Text style={{color: '#888'}}>{item.players} Runners</Text>
            </View>
            <Text style={{color: '#ccc', marginVertical: 10}}>Reward: {item.reward}</Text>
            
            <TouchableOpacity 
              onPress={() => openLeaderboard(item)}
              style={{backgroundColor: COLORS.cardBg, borderColor: COLORS.primary, borderWidth: 1, padding: 12, borderRadius: 8, alignItems: 'center'}}
            >
              <Text style={{color: COLORS.primary, fontWeight: '900'}}>VIEW LEADERBOARD</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* THE LEADERBOARD POP-UP (MODAL) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end'}}>
            <View style={{height: '80%', backgroundColor: '#151515', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20}}>
                
                {/* Modal Header */}
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 20}}>
                    <Text style={{color: '#fff', fontSize: 22, fontWeight:'bold'}}>{selectedLeague?.name}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Ionicons name="close-circle" size={30} color={COLORS.secondary} />
                    </TouchableOpacity>
                </View>

                {/* The List of Players */}
                <Text style={{color: '#888', marginBottom: 10}}>TOP RUNNERS</Text>
                <FlatList
                    data={leaderboardData}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={{
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            backgroundColor: item.isMe ? 'rgba(0, 242, 255, 0.1)' : COLORS.cardBg, 
                            padding: 15, 
                            borderRadius: 10, 
                            marginBottom: 10,
                            borderColor: item.isMe ? COLORS.primary : 'transparent',
                            borderWidth: 1
                        }}>
                            <Text style={{color: item.isMe ? COLORS.primary : '#fff', fontWeight: 'bold', fontSize: 18, width: 30}}>#{item.rank}</Text>
                            <View style={{flex: 1, marginLeft: 10}}>
                                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>{item.name}</Text>
                            </View>
                            <Text style={{color: COLORS.secondary, fontWeight: 'bold'}}>{item.score} pts</Text>
                        </View>
                    )}
                />

                <TouchableOpacity style={{backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10}}>
                    <Text style={{color: '#000', fontWeight:'900'}}>JOIN COMPETITION</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  );
}