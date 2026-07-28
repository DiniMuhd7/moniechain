import React from 'react';
import { View, Text } from 'react-native';
import TermsContent from '@/components/TermsContent';

export default function WithdrawalCompleted() { return <View className="flex-1 bg-[#071A2D] p-6"><Text className="text-white text-3xl font-pbold mt-12 mb-6">Terms & risk disclosure</Text><TermsContent /></View>; }
