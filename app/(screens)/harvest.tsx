import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import HeaderNavigation from '@/components/HeaderNavigation';
import { icons } from '@/constants';
import { useLoginContext } from '@/context/LoginProvider';
import { hydrateWalletProfile } from '@/services/wallet';

export default function ReceiveUsdt() { const { user } = useLoginContext(); const p = hydrateWalletProfile(user || {}); return <View className="flex-1 bg-[#071A2D] px-5 pt-10"><HeaderNavigation onLeftPress={() => router.back()} onRightPress={() => null} leftIcon={icons.back} rightIcon={icons.settings} showLeftButton showRightButton={false}/><Text className="text-white text-3xl font-pbold mt-6">Receive USDT</Text><Text className="text-slate-300 mt-2">Share your phone number or wallet address to receive verified USDT deposits.</Text><View className="bg-white rounded-[28px] p-6 mt-8 items-center"><View className="w-48 h-48 bg-slate-100 rounded-3xl items-center justify-center"><Text className="text-6xl">▣</Text><Text className="text-slate-500 mt-2">QR PAY</Text></View><Text className="text-[#071A2D] font-pbold mt-6">{p.phoneNumber}</Text><Text className="text-slate-500 text-center mt-2">{p.walletAddress}</Text></View></View> }
