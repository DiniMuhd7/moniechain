import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

export default function NoNetworkModal({ visible = false, onRetry = () => {} }) {
  return <Modal transparent visible={visible} animationType="fade"><View className="flex-1 bg-black/50 items-center justify-center p-6"><View className="bg-[#071A2D] rounded-3xl p-6 border border-white/10"><Text className="text-white text-2xl font-pbold">Connection unavailable</Text><Text className="text-slate-300 mt-3">MonieChain needs a network connection to verify wallet balances and on-chain transactions.</Text><TouchableOpacity className="bg-[#00C48C] rounded-2xl p-4 mt-6" onPress={onRetry}><Text className="text-white text-center font-pbold">Retry</Text></TouchableOpacity></View></View></Modal>;
}
