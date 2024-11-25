import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Alert } from "react-native";
import tw from 'twrnc';
import * as Clipboard from 'expo-clipboard';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'system';
}

function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        if (inputText.trim().length === 0) return;

        const newMessage: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        setTimeout(() => {
            const replyMessage: Message = { id: Date.now().toString(), text: "Hello user, this is an automated reply", sender: 'system' };
            setMessages(prev => [...prev, replyMessage]);
        }, 1000);
    };

    const clearMessages = () => {
        Alert.alert(
            "Clear All Messages",
            "Are you sure you want to clear all messages?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", onPress: () => setMessages([]), style: "destructive" }
            ]
        );
    };

    const copyMessage = async (text: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert("Copied to Clipboard", `"${text}" has been copied!`);
    };

    const pasteMessage = async () => {
        const text = await Clipboard.getStringAsync();
        setInputText(prev => prev + text);
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <TouchableOpacity
            onLongPress={() => copyMessage(item.text)}
            className={`my-1 p-2 rounded-lg max-w-3/4 ${item.sender === 'user' ? 'bg-blue-500 self-end' : 'bg-gray-300 self-start'}`}
        >
            <Text className={`${item.sender === 'user' ? 'text-white' : 'text-black'}`}>{item.text}</Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView behavior="padding" style={tw`flex-1`}>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                className={`p-4 flex-1`}
                contentContainerStyle={tw`justify-end`}
            />
            <View className={`flex-row items-center border-t border-gray-300 p-2`}>
                <TextInput
                    className={`flex-1 border border-gray-400 rounded-lg px-4 py-2`}
                    placeholder="Type a message"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity onPress={pasteMessage} style={tw`ml-2 bg-gray-500 p-3 rounded-full`}>
                    <Text className={`text-white`}>Paste</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={sendMessage} style={tw`ml-2 bg-blue-500 p-3 rounded-full`}>
                    <Text className={`text-white`}>Send</Text>
                </TouchableOpacity>
            </View>
            <View style={tw`flex-row justify-end p-2`}>
                <TouchableOpacity onPress={clearMessages} className={`bg-red-500 p-3 rounded-lg`}>
                    <Text className={`text-white`}>Clear Messages</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

export default App;
