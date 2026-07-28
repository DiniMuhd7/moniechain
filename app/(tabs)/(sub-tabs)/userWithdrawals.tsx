import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ChainTransaction, getLedger } from '@/services/wallet';

export default function UserWithdrawals() {
  const [items, setItems] = useState<ChainTransaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const load = async () => setItems((await getLedger()).filter((tx) => tx.type === 'withdrawal'));
  useFocusEffect(useCallback(() => { load(); }, []));
  return <View className="flex-1 bg-[#071A2D] p-6"><Text className="text-white text-3xl font-pbold mt-12">Withdrawals</Text><Text className="text-slate-300 mt-2">Track off-ramp settlement requests.</Text><ScrollView className="mt-6" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async()=>{setRefreshing(true); await load(); setRefreshing(false);}}/>}>{items.map(tx => <View key={tx.id} className="bg-white rounded-3xl p-5 mb-4"><Text className="text-[#071A2D] font-pbold">{tx.title}</Text><Text className="text-slate-500 mt-1">{tx.subtitle}</Text><Text className="text-[#00A878] mt-2">{tx.hash} • {tx.status}</Text></View>)}</ScrollView></View>;
}
