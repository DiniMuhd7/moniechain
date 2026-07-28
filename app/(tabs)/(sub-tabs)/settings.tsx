import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import HeaderNavigation from '@/components/HeaderNavigation';
import { icons } from '@/constants';
import { signOut } from '@/services/auth';
import { useLoginContext } from '@/context/LoginProvider';

const settingsOptions = [
  { label: 'Edit profile', description: 'Update your public MonieChain identity.', action: () => router.push('/(tabs)/(sub-tabs)/editProfile') },
  { label: 'KYC & limits', description: 'Verify documents and unlock higher transfer limits.', action: () => router.push('/(screens)/questsAchievements') },
  { label: 'Savings vaults', description: 'Manage flexible USDT vault allocations.', action: () => router.push('/(screens)/inventory') },
  { label: 'Merchant tools', description: 'Create QR codes and payment links.', action: () => router.push('/(screens)/farm') },
  { label: 'Privacy policy', description: 'Review blockchain data and privacy controls.', action: () => router.push('/(tabs)/(sub-tabs)/requestReceived') },
  { label: 'Terms & risk disclosure', description: 'Understand USDT, network fees, and finality.', action: () => router.push('/(tabs)/(sub-tabs)/withdrawalCompleted') },
];

export default function Settings() {
  const { setIsLogged } = useLoginContext();
  const logOut = async () => {
    const ok = await signOut();
    if (!ok) return Alert.alert('Error', 'Error while signing out');
    setIsLogged(false);
    router.replace('/');
  };

  return (
    <View className="flex-1 bg-[#071A2D] px-5 pt-10">
      <HeaderNavigation onLeftPress={() => router.push('/(tabs)/profile')} onRightPress={() => null} leftIcon={icons.back} rightIcon={icons.settings} showLeftButton showRightButton={false} />
      <Text className="text-white text-3xl font-pbold mt-4">Settings</Text>
      <Text className="text-slate-300 mt-2">Manage wallet security, compliance, merchant tools, and account preferences.</Text>
      <ScrollView className="mt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        {settingsOptions.map((item) => (
          <TouchableOpacity key={item.label} className="bg-white/10 border border-white/10 rounded-3xl p-5 mb-4" onPress={item.action}>
            <View className="flex-row justify-between"><Text className="text-white text-lg font-pbold">{item.label}</Text><Text className="text-[#00C48C]">›</Text></View>
            <Text className="text-slate-300 mt-2">{item.description}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity className="bg-red-500/15 border border-red-400/30 rounded-3xl p-5 mb-4" onPress={logOut}>
          <Text className="text-red-300 text-lg font-pbold">Sign out</Text>
          <Text className="text-red-100 mt-2">End this secure MonieChain session on the device.</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
