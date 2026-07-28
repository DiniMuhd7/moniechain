import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { playSound } from '@/utils/audio';

const tap = (path: string) => {
  router.push(path as any);
  playSound(require('@/assets/sounds/click.mp3'), 0.05);
};

const tabs = [
  { label: 'Wallet', path: '/(tabs)/profile', icon: '◎' },
  { label: 'Home', path: '/(tabs)/home', icon: '₮', primary: true },
  { label: 'Activity', path: '/(tabs)/leaderboard', icon: '↔' },
];

export default function CustomBottomTab() {
  return (
    <View className="absolute bottom-4 w-full px-6">
      <View className="h-20 rounded-[28px] bg-[#071A2D]/95 border border-white/10 flex-row justify-between items-center px-7 shadow-lg">
        {tabs.map((item) => (
          <Pressable key={item.label} className="items-center justify-center" onPress={() => tap(item.path)}>
            <View className={`${item.primary ? 'w-16 h-16 -mt-8 bg-[#00C48C]' : 'w-12 h-12 bg-white/10'} rounded-2xl items-center justify-center border border-white/10`}>
              <Text className="text-white text-2xl font-pbold">{item.icon}</Text>
            </View>
            <Text className="text-white text-[11px] mt-1">{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
