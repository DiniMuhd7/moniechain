import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const tools = ['Static merchant QR', 'Dynamic invoice links', 'Instant USDT settlement', 'CSV reconciliation export'];

export default function MerchantTools() {
  return <View className="flex-1 bg-[#071A2D] p-6"><Text className="text-white text-3xl font-pbold mt-12">Merchant tools</Text><Text className="text-slate-300 mt-3">Accept stablecoin payments with a simple MonieChain checkout layer.</Text><ScrollView className="mt-6">{tools.map(tool => <View key={tool} className="bg-white/10 border border-white/10 rounded-3xl p-5 mb-4"><Text className="text-white font-pbold text-lg">{tool}</Text><Text className="text-slate-300 mt-2">Designed for fast customer checkout and transparent USDT settlement records.</Text></View>)}</ScrollView></View>;
}
