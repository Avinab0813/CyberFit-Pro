import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, globalStyles } from '../theme/styles';

export default function AiCoachScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: "Coach here. I'm ready to help with your training, nutrition, or recovery. What's on your mind?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef();

  // --- THE BRAIN (FREE & UNLIMITED) ---
  const fetchAIResponse = async (userQuery) => {
    try {
      // PROMPT ENGINEERING: Professional Coach Persona
      const systemContext = "You are an elite Sports Performance Coach inside a fitness app. You are encouraging, scientific, and direct. You help users with workout plans, diet advice, and injury prevention. Do not use markdown symbols like ** or #. Keep answers concise and actionable.";
      
      const fullPrompt = `${systemContext}\n\nUser: ${userQuery}\nCoach:`;
      const encodedPrompt = encodeURIComponent(fullPrompt);
      
      // Using Pollinations AI (Free Gateway)
      const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=openai`);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const text = await response.text();
      return text.trim();
    } catch (error) {
      return "I'm having trouble connecting to the network. Please try again.";
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // 1. Add User Message
    const userMsg = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Scroll Down
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);

    // 2. Fetch Answer
    const aiReply = await fetchAIResponse(userMsg.text);

    // 3. Add Bot Message
    const botMsg = { id: (Date.now() + 1).toString(), text: aiReply, sender: 'bot' };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const renderItem = ({ item }) => (
    <View style={{
        alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: item.sender === 'user' ? COLORS.primary : '#2C2C2E',
        padding: 15,
        borderRadius: 20,
        borderBottomRightRadius: item.sender === 'user' ? 2 : 20,
        borderTopLeftRadius: item.sender === 'bot' ? 2 : 20,
        marginBottom: 10,
        maxWidth: '85%',
    }}>
        <Text style={{
            color: item.sender === 'user' ? COLORS.black : COLORS.white, 
            fontWeight: item.sender === 'user' ? 'bold' : 'normal',
            fontSize: 15,
            lineHeight: 22
        }}>
            {item.text}
        </Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      
      {/* HEADER */}
      <View style={{flexDirection:'row', alignItems:'center', marginBottom: 10, justifyContent: 'space-between'}}>
          <Text style={globalStyles.headerTitle}>FitCoach AI</Text>
          <View style={{backgroundColor: '#2C2C2E', padding: 8, borderRadius: 25, flexDirection:'row', alignItems:'center'}}>
            <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: '#00FF99', marginRight: 6}} />
            <Text style={{color: COLORS.white, fontSize: 10, fontWeight: 'bold'}}>ONLINE</Text>
          </View>
      </View>

      {/* KEYBOARD HANDLING */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0} 
        style={{flex: 1}}
      >
          {/* CHAT LIST */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20}}
          />

          {/* LOADING INDICATOR */}
          {isLoading && (
              <View style={{flexDirection:'row', alignItems:'center', marginBottom: 10, marginLeft: 10}}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={{color: COLORS.textDim, fontSize: 12, marginLeft: 10, fontStyle:'italic'}}>Coach is typing...</Text>
              </View>
          )}

          {/* INPUT BAR */}
          <View style={{
              flexDirection: 'row', 
              alignItems: 'center', 
              backgroundColor: '#18181b', 
              borderRadius: 30, 
              paddingHorizontal: 5, 
              paddingVertical: 5, 
              marginBottom: 110, // Clears the floating bottom menu
              borderWidth: 1, 
              borderColor: '#333'
          }}>
              <TextInput 
                  style={{flex: 1, color: '#fff', fontSize: 16, paddingHorizontal: 15, height: 50}}
                  placeholder="Ask Coach..."
                  placeholderTextColor="#666"
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={sendMessage}
              />
              <TouchableOpacity onPress={sendMessage} disabled={isLoading} style={{backgroundColor: isLoading ? '#333' : COLORS.primary, width: 44, height: 44, borderRadius: 22, justifyContent:'center', alignItems:'center'}}>
                  <Ionicons name="arrow-up" size={24} color={isLoading ? '#666' : '#000'} />
              </TouchableOpacity>
          </View>

      </KeyboardAvoidingView>
    </View>
  );
}