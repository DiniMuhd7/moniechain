import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import HeaderNavigation from '@/components/HeaderNavigation';
import { icons } from '@/constants';
import { useLoginContext } from '@/context/LoginProvider';
import { hydrateWalletProfile, normalizePhone } from '@/services/wallet';

export default function SendUsdt() {
  const { user } = useLoginContext();
  const profile = hydrateWalletProfile(user || {});
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const send = () => {
    if (!normalizePhone(phone) || Number(amount) <= 0) return Alert.alert('Check details', 'Enter a recipient phone number and USDT amount.');
    router.push({ pathname: '/(screens)/transactionSuccess', params: { title: 'USDT sent', message: `${amount} USDT is being confirmed on-chain for ${phone}.` } });
  };
  return <View className="flex-1 bg-[#071A2D] px-5 pt-10"><HeaderNavigation onLeftPress={() => router.back()} onRightPress={() => null} leftIcon={icons.back} rightIcon={icons.settings} showLeftButton showRightButton={false}/><Text className="text-white text-3xl font-pbold mt-6">Send USDT</Text><Text className="text-slate-300 mt-2">Send to any MonieChain user with their phone number. Balance: {profile.usdtBalance} USDT</Text><View className="bg-white rounded-[28px] p-5 mt-8"><Text className="text-[#071A2D] font-psemibold">Recipient phone</Text><TextInput className="bg-slate-100 rounded-2xl p-4 mt-2" keyboardType="phone-pad" placeholder="+234 801 000 0000" value={phone} onChangeText={setPhone}/><Text className="text-[#071A2D] font-psemibold mt-5">Amount (USDT)</Text><TextInput className="bg-slate-100 rounded-2xl p-4 mt-2" keyboardType="decimal-pad" placeholder="0.00" value={amount} onChangeText={setAmount}/><TouchableOpacity className="bg-[#00C48C] rounded-2xl p-4 mt-6" onPress={send}><Text className="text-white text-center font-pbold">Confirm transfer</Text></TouchableOpacity></View></View>;
}
