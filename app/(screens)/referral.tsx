import React from 'react';
import { Share, TouchableOpacity, View, Text } from 'react-native';
import { useLoginContext } from '@/context/LoginProvider';
import { hydrateWalletProfile } from '@/services/wallet';

export default function Referral() {
  const { user } = useLoginContext();
  const profile = hydrateWalletProfile(user || {});
  const invite = () => Share.share({ message: `Join me on MonieChain. Send and receive USDT with my phone alias: ${profile.phoneNumber}` });
  return <View className="flex-1 bg-[#071A2D] p-6 justify-center"><Text className="text-white text-3xl font-pbold">Invite contacts</Text><Text className="text-slate-300 mt-3">Let trusted contacts find your USDT wallet through your verified phone alias.</Text><TouchableOpacity className="bg-[#00C48C] rounded-2xl p-4 mt-8" onPress={invite}><Text className="text-white text-center font-pbold">Share MonieChain invite</Text></TouchableOpacity></View>;
}
