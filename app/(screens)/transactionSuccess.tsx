import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function TransactionSuccess() {
  const { title, message } = useLocalSearchParams<{ title?: string; message?: string }>();
  return <View className="flex-1 bg-[#071A2D] px-6 items-center justify-center"><View className="w-24 h-24 rounded-full bg-[#00C48C] items-center justify-center"><Text className="text-white text-5xl">✓</Text></View><Text className="text-white text-3xl font-pbold mt-8 text-center">{title || 'Transaction submitted'}</Text><Text className="text-slate-300 text-center mt-3">{message || 'Your USDT transaction has been signed and submitted for on-chain confirmation.'}</Text><TouchableOpacity className="bg-[#00C48C] rounded-2xl p-4 mt-10 w-full" onPress={() => router.replace('/(tabs)/home')}><Text className="text-white text-center font-pbold">Back to wallet</Text></TouchableOpacity></View>;
}
