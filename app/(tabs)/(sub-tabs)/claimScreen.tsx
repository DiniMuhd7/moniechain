import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import HeaderNavigation from '@/components/HeaderNavigation';
import { icons } from '@/constants';
import { getStoredBalance, hydrateWalletProfile, recordDeposit } from '@/services/wallet';
import { useLoginContext } from '@/context/LoginProvider';

export default function DepositScreen() {
  const { user, setUser } = useLoginContext();
  const profile = hydrateWalletProfile(user || {});
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(profile.usdtBalance || 0);
  useEffect(() => { getStoredBalance(profile.usdtBalance || 0).then(setBalance); }, []);
  const deposit = async () => {
    try {
      const result = await recordDeposit(Number(amount), balance);
      setUser({ ...profile, usdtBalance: result.nextBalance });
      router.push({ pathname: '/(screens)/transactionSuccess', params: { title: 'Deposit confirmed', message: `${amount} USDT was credited to your MonieChain wallet.` } });
    } catch (error: any) { Alert.alert('Deposit failed', error.message); }
  };
  return <View className="flex-1 bg-[#071A2D] px-5 pt-10"><HeaderNavigation onLeftPress={() => router.back()} onRightPress={() => null} leftIcon={icons.back} rightIcon={icons.settings} showLeftButton showRightButton={false}/><Text className="text-white text-3xl font-pbold mt-6">Deposit USDT</Text><Text className="text-slate-300 mt-2">Credit this wallet after an external on-chain deposit is detected.</Text><View className="bg-white rounded-3xl p-5 mt-8"><Text className="text-slate-500">Current balance</Text><Text className="text-[#071A2D] text-2xl font-pbold">{balance.toFixed(2)} USDT</Text><TextInput className="bg-slate-100 rounded-2xl p-4 mt-5" keyboardType="decimal-pad" placeholder="Amount" value={amount} onChangeText={setAmount}/><TouchableOpacity className="bg-[#00C48C] rounded-2xl p-4 mt-6" onPress={deposit}><Text className="text-white text-center font-pbold">Record deposit</Text></TouchableOpacity></View></View>;
}
