import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { icons } from '@/constants';
import { router } from 'expo-router';
import HeaderNavigation from '@/components/HeaderNavigation';
import { useLoginContext } from '@/context/LoginProvider';
import { useFramedAvatarArray } from '@/hooks/useAvatarArray';
import { getStoredBalance, hydrateWalletProfile, maskWallet } from '@/services/wallet';

const settings = [
  { label: 'Two-factor authentication', value: 'Enabled' },
  { label: 'Device passkey', value: 'Active' },
  { label: 'Daily transfer limit', value: '10,000 USDT' },
  { label: 'KYC verification', value: 'Verified' },
];

export default function Profile() {
  const { user } = useLoginContext();
  const profile = hydrateWalletProfile(user || {});
  const [balance, setBalance] = useState(profile.usdtBalance || 0);

  useEffect(() => {
    getStoredBalance(profile.usdtBalance || 0).then(setBalance);
  }, []);

  return (
    <View className="flex-1 bg-[#071A2D] px-5 pt-10">
      <HeaderNavigation onLeftPress={() => router.push('/(tabs)/home')} onRightPress={() => router.push('/(tabs)/(sub-tabs)/settings')} leftIcon={icons.back} rightIcon={icons.settings} showLeftButton showRightButton />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="items-center mt-6">
          <Image source={useFramedAvatarArray(profile.avatar || 0)} resizeMode="contain" className="w-[96px] h-[96px] rounded-full" />
          <Text className="text-white text-2xl font-pbold mt-3">{profile.fullName || 'MonieChain user'}</Text>
          <Text className="text-slate-300">{profile.email}</Text>
        </View>
        <View className="bg-white rounded-[28px] p-5 mt-8">
          <Text className="text-[#071A2D] text-lg font-pbold">USDT wallet identity</Text>
          <Text className="text-slate-500 mt-2">Your unique phone number resolves to this wallet address for seamless transfers.</Text>
          <View className="bg-slate-100 rounded-2xl p-4 mt-4"><Text className="text-slate-500 text-xs">PHONE NUMBER</Text><Text className="text-[#071A2D] font-pbold mt-1">{profile.phoneNumber}</Text></View>
          <View className="bg-slate-100 rounded-2xl p-4 mt-3"><Text className="text-slate-500 text-xs">USDT ADDRESS</Text><Text className="text-[#071A2D] font-pbold mt-1">{maskWallet(profile.walletAddress)}</Text></View>
          <View className="bg-[#071A2D] rounded-2xl p-4 mt-3"><Text className="text-slate-300 text-xs">CURRENT BALANCE</Text><Text className="text-white font-pbold text-2xl mt-1">{balance.toFixed(2)} USDT</Text></View>
        </View>
        <View className="mt-6">
          <Text className="text-white text-xl font-pbold mb-3">Security & account</Text>
          {settings.map((item) => <TouchableOpacity key={item.label} className="bg-white/10 border border-white/10 rounded-2xl p-4 mb-3 flex-row justify-between"><Text className="text-white">{item.label}</Text><Text className="text-[#00C48C]">{item.value}</Text></TouchableOpacity>)}
        </View>
      </ScrollView>
    </View>
  );
}
