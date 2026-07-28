import { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import HeaderNavigation from '@/components/HeaderNavigation';
import { icons } from '@/constants';
import { router, useFocusEffect } from 'expo-router';
import { ChainTransaction, getLedger } from '@/services/wallet';

export default function Activity() {
  const [ledger, setLedger] = useState<ChainTransaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const load = async () => setLedger(await getLedger());

  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-[#071A2D] px-5 pt-10">
      <HeaderNavigation onLeftPress={() => router.push('/(tabs)/home')} onRightPress={() => null} leftIcon={icons.back} rightIcon={icons.settings} showLeftButton showRightButton={false} />
      <Text className="text-white text-3xl font-pbold mt-4">On-chain activity</Text>
      <Text className="text-slate-300 mt-2">Every wallet movement is anchored to the USDT ledger with a verifiable transaction hash.</Text>
      <ScrollView className="mt-6" contentContainerStyle={{ paddingBottom: 120 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00C48C" />}>
        {ledger.map((tx) => (
          <View key={tx.id} className="bg-white rounded-3xl p-5 mb-4">
            <View className="flex-row justify-between gap-3">
              <View className="flex-1"><Text className="text-[#071A2D] text-lg font-pbold">{tx.title}</Text><Text className="text-slate-500 mt-1">{tx.subtitle}</Text></View>
              <Text className={tx.amount > 0 ? 'text-[#00A878] font-pbold' : 'text-[#071A2D] font-pbold'}>{tx.amount > 0 ? '+' : ''}{tx.amount} USDT</Text>
            </View>
            <View className="mt-4 pt-4 border-t border-slate-100">
              <Text className="text-slate-500">{tx.createdAt} • {tx.network} • fee {tx.fee} USDT</Text>
              <Text className="text-[#00A878] mt-1">{tx.hash} • {tx.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
