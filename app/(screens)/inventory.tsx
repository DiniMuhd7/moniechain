import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import HeaderNavigation from '@/components/HeaderNavigation';
import { icons } from '@/constants';

const vaults = [{ name: 'Flexible USDT Vault', apy: '7.2%', note: 'Withdraw anytime' }, { name: 'Merchant Reserve', apy: '5.8%', note: 'Daily settlement buffer' }, { name: 'Security Bond', apy: '4.1%', note: 'Protected escrow savings' }];
export default function Savings() { return <View className="flex-1 bg-[#071A2D] px-5 pt-10"><HeaderNavigation onLeftPress={() => router.back()} onRightPress={() => null} leftIcon={icons.back} rightIcon={icons.settings} showLeftButton showRightButton={false}/><Text className="text-white text-3xl font-pbold mt-6">USDT savings</Text><Text className="text-slate-300 mt-2">Move stablecoins into transparent vaults without leaving the MonieChain wallet.</Text>{vaults.map(v => <TouchableOpacity key={v.name} className="bg-white rounded-3xl p-5 mt-5"><Text className="text-[#071A2D] text-lg font-pbold">{v.name}</Text><Text className="text-[#00A878] text-3xl font-pbold mt-3">{v.apy}</Text><Text className="text-slate-500 mt-1">{v.note}</Text></TouchableOpacity>)}</View> }
