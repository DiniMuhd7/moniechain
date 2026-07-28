import { View, Text, ScrollView } from 'react-native';
import HeaderNavigation from '@/components/HeaderNavigation';
import { icons } from '@/constants';
import { router } from 'expo-router';
import { transactions } from '@/services/wallet';

export default function Activity() {
  return (
    <View className="flex-1 bg-[#071A2D] px-5 pt-10">
      <HeaderNavigation onLeftPress={() => router.push('/(tabs)/home')} onRightPress={() => null} leftIcon={icons.back} rightIcon={icons.settings} showLeftButton showRightButton={false} />
      <Text className="text-white text-3xl font-pbold mt-4">On-chain activity</Text>
      <Text className="text-slate-300 mt-2">Every wallet movement is anchored to the USDT ledger with a verifiable transaction hash.</Text>
      <ScrollView className="mt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        {transactions.map((tx) => (
          <View key={tx.id} className="bg-white rounded-3xl p-5 mb-4">
            <View className="flex-row justify-between">
              <View><Text className="text-[#071A2D] text-lg font-pbold">{tx.title}</Text><Text className="text-slate-500 mt-1">{tx.subtitle}</Text></View>
              <Text className={tx.amount > 0 ? 'text-[#00A878] font-pbold' : 'text-[#071A2D] font-pbold'}>{tx.amount > 0 ? '+' : ''}{tx.amount} USDT</Text>
            </View>
            <View className="flex-row justify-between mt-4 pt-4 border-t border-slate-100"><Text className="text-slate-500">{tx.createdAt}</Text><Text className="text-[#00A878]">{tx.hash} • {tx.status}</Text></View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
