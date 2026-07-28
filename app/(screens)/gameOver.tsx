import React from 'react';
import { View, Text } from 'react-native';
export default function TransactionDeclined(){return <View className="flex-1 bg-[#071A2D] p-6 justify-center"><Text className="text-white text-3xl font-pbold">Transaction declined</Text><Text className="text-slate-300 mt-3">We could not submit this transfer. Review wallet balance, limits, and network status.</Text></View>}
