import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import HeaderNavigation from '@/components/HeaderNavigation';
import { icons } from '@/constants';

export default function QRPayment() { return <View className="flex-1 bg-[#071A2D] px-5 pt-10"><HeaderNavigation onLeftPress={() => router.back()} onRightPress={() => null} leftIcon={icons.back} rightIcon={icons.settings} showLeftButton showRightButton={false}/><Text className="text-white text-3xl font-pbold mt-6">QR merchant pay</Text><Text className="text-slate-300 mt-2">Scan a merchant code to approve a USDT payment with instant on-chain verification.</Text><View className="bg-white rounded-[28px] p-8 mt-8 items-center"><View className="w-56 h-56 rounded-[32px] bg-slate-100 items-center justify-center"><Text className="text-7xl">▣</Text></View><TouchableOpacity className="bg-[#00C48C] rounded-2xl p-4 mt-8 w-full" onPress={() => router.push('/(screens)/transactionSuccess')}><Text className="text-center text-white font-pbold">Open scanner</Text></TouchableOpacity></View></View> }
