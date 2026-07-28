import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import HeaderNavigation from '@/components/HeaderNavigation';
import { icons } from '@/constants';
import { useLoginContext } from '@/context/LoginProvider';
import { getStoredBalance, hydrateWalletProfile, submitWalletTransfer } from '@/services/wallet';

export default function SendUsdt() {
  const { user, setUser } = useLoginContext();
  const profile = hydrateWalletProfile(user || {});
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(profile.usdtBalance || 0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getStoredBalance(profile.usdtBalance || 0).then(setBalance);
  }, []);

  const send = async () => {
    setSubmitting(true);
    try {
      const result = await submitWalletTransfer({ amount: Number(amount), recipientPhone: phone, balance });
      setBalance(result.nextBalance);
      setUser({ ...profile, usdtBalance: result.nextBalance });
      router.push({
        pathname: '/(screens)/transactionSuccess',
        params: {
          title: 'USDT transfer submitted',
          message: `${amount} USDT is pending confirmation for ${phone}. Destination wallet: ${result.recipientWallet}`,
        },
      });
    } catch (error: any) {
      Alert.alert('Transfer blocked', error.message || 'Unable to submit this USDT transfer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#071A2D] px-5 pt-10">
      <HeaderNavigation onLeftPress={() => router.back()} onRightPress={() => null} leftIcon={icons.back} rightIcon={icons.settings} showLeftButton showRightButton={false} />
      <Text className="text-white text-3xl font-pbold mt-6">Send USDT</Text>
      <Text className="text-slate-300 mt-2">Resolve a phone number to a MonieChain wallet and submit a USDT transfer.</Text>
      <View className="bg-white rounded-[28px] p-5 mt-8">
        <View className="rounded-2xl bg-[#071A2D] p-4 mb-5">
          <Text className="text-slate-300 text-xs">AVAILABLE BALANCE</Text>
          <Text className="text-white text-2xl font-pbold mt-1">{balance.toFixed(2)} USDT</Text>
        </View>
        <Text className="text-[#071A2D] font-psemibold">Recipient phone</Text>
        <TextInput className="bg-slate-100 rounded-2xl p-4 mt-2" keyboardType="phone-pad" placeholder="+234 801 000 0000" value={phone} onChangeText={setPhone} />
        <Text className="text-[#071A2D] font-psemibold mt-5">Amount (USDT)</Text>
        <TextInput className="bg-slate-100 rounded-2xl p-4 mt-2" keyboardType="decimal-pad" placeholder="0.00" value={amount} onChangeText={setAmount} />
        <View className="bg-slate-50 rounded-2xl p-4 mt-5">
          <Text className="text-slate-500">Network</Text>
          <Text className="text-[#071A2D] font-pbold mt-1">USDT-TRC20 • Estimated fee 0.03 USDT</Text>
        </View>
        <TouchableOpacity className="bg-[#00C48C] rounded-2xl p-4 mt-6" onPress={send} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center font-pbold">Confirm transfer</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}
