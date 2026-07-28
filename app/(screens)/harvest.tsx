import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import HeaderNavigation from '@/components/HeaderNavigation';
import { icons } from '@/constants';
import { useLoginContext } from '@/context/LoginProvider';
import { hydrateWalletProfile, registerPhoneAlias } from '@/services/wallet';

export default function ReceiveUsdt() {
  const { user } = useLoginContext();
  const profile = hydrateWalletProfile(user || {});

  useEffect(() => {
    registerPhoneAlias(profile.phoneNumber, profile.walletAddress);
  }, []);

  return (
    <View className="flex-1 bg-[#071A2D] px-5 pt-10">
      <HeaderNavigation onLeftPress={() => router.back()} onRightPress={() => null} leftIcon={icons.back} rightIcon={icons.settings} showLeftButton showRightButton={false} />
      <Text className="text-white text-3xl font-pbold mt-6">Receive USDT</Text>
      <Text className="text-slate-300 mt-2">Share your phone number or wallet address to receive verified USDT deposits.</Text>
      <View className="bg-white rounded-[28px] p-6 mt-8 items-center">
        <View className="w-56 h-56 bg-slate-100 rounded-3xl items-center justify-center border border-slate-200">
          <Text className="text-7xl">▣</Text>
          <Text className="text-slate-500 mt-2">MONIECHAIN QR</Text>
        </View>
        <Text className="text-[#071A2D] font-pbold mt-6 text-lg">{profile.phoneNumber}</Text>
        <Text className="text-slate-500 text-center mt-2">{profile.walletAddress}</Text>
        <TouchableOpacity className="bg-[#00C48C] rounded-2xl p-4 mt-6 w-full" onPress={() => router.push('/(screens)/transactionSuccess')}>
          <Text className="text-white text-center font-pbold">Simulate received deposit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
