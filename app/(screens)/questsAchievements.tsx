import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const checks = [
  ['Identity document', 'Verified'],
  ['Selfie match', 'Verified'],
  ['Sanctions screening', 'Clear'],
  ['Daily transfer limit', '10,000 USDT'],
];

export default function ComplianceHub() {
  return (
    <View className="flex-1 bg-[#071A2D] p-6">
      <Text className="text-white text-3xl font-pbold mt-12">KYC & trust center</Text>
      <Text className="text-slate-300 mt-3">Complete identity checks, review limits, and monitor account protections for your USDT wallet.</Text>
      <ScrollView className="mt-6">
        {checks.map(([label, value]) => <View key={label} className="bg-white rounded-3xl p-5 mb-4 flex-row justify-between"><Text className="text-[#071A2D] font-pbold">{label}</Text><Text className="text-[#00A878]">{value}</Text></View>)}
      </ScrollView>
    </View>
  );
}
