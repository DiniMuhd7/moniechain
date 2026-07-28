import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import PrivacyContent from '@/components/PrivacyContent';

export default function PrivacyDisclosure() { return <View className="flex-1 bg-[#071A2D] p-6"><Text className="text-white text-3xl font-pbold mt-12 mb-6">Privacy policy</Text><ScrollView><PrivacyContent /></ScrollView></View>; }
