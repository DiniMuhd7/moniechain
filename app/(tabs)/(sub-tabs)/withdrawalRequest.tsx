import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import HeaderNavigation from '@/components/HeaderNavigation';
import { icons } from '@/constants';

export default function WithdrawalRequest() {
  return <View className="flex-1 bg-[#071A2D] px-5 pt-10"><HeaderNavigation onLeftPress={() => router.back()} onRightPress={() => null} leftIcon={icons.back} rightIcon={icons.settings} showLeftButton showRightButton={false}/><Text className="text-white text-3xl font-pbold mt-6">Withdraw USDT</Text><Text className="text-slate-300 mt-2">Create an off-ramp request to a verified settlement destination.</Text><View className="bg-white rounded-3xl p-5 mt-8"><TextInput className="bg-slate-100 rounded-2xl p-4" placeholder="Destination bank or wallet"/><TextInput className="bg-slate-100 rounded-2xl p-4 mt-4" placeholder="Amount in USDT" keyboardType="decimal-pad"/><TouchableOpacity className="bg-[#00C48C] rounded-2xl p-4 mt-6" onPress={() => router.push('/(tabs)/(sub-tabs)/requestReceived')}><Text className="text-white text-center font-pbold">Submit withdrawal request</Text></TouchableOpacity></View></View>;
}
