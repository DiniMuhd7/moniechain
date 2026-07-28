import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Image, BackHandler, ToastAndroid, Platform, TouchableOpacity, Modal, Text, Dimensions, ScrollView, Alert } from 'react-native';
import { icons } from '../../constants';
import { router, useFocusEffect } from 'expo-router';
import { useLoginContext } from '../../context/LoginProvider';
import { BlurView } from 'expo-blur';
import { useFramedAvatarArray } from '../../hooks/useAvatarArray';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { API_BASE } from '@/config/client';
import { notifyNewAppNotifications, registerPushToken } from '@/utils/notifications';
import analytics from '@react-native-firebase/analytics';
import { hydrateWalletProfile, merchantInsights, transactions, walletActions } from '@/services/wallet';

const { height } = Dimensions.get('window');

export default function Home() {
  const { user, setUser } = useLoginContext();
  if (!user) router.replace('/');
  const profile = hydrateWalletProfile(user || {});
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const timeoutRef = useRef(null);

  const fetchNotification = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/notification/all/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      });
      const json = await res.json();
      setNotifications(json.notifications || []);
      notifyNewAppNotifications(json.notifications || []);
    } catch (err) {
      console.error('notifications fetch error:', err);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchNotification();
    analytics().logEvent('screen_view', { screen_name: 'MonieChainHome', screen_class: 'MonieChainHome' });
    Audio.setIsEnabledAsync(false).then(() => Audio.setIsEnabledAsync(true)).catch(() => {});
    if (Platform.OS !== 'android') return undefined;
    const onBackPress = () => {
      if (backPressedOnce) { BackHandler.exitApp(); return true; }
      setBackPressedOnce(true);
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      timeoutRef.current = setTimeout(() => setBackPressedOnce(false), 2000);
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => { backHandler.remove(); if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [backPressedOnce]));

  useEffect(() => { registerPushToken(); if (user && !user.walletAddress) setUser(profile); }, []);

  const maskedWallet = `${profile.walletAddress?.slice(0, 8)}…${profile.walletAddress?.slice(-6)}`;

  return (
    <View className="flex-1 bg-[#071A2D] px-5 pt-10">
      <View className="absolute inset-0 bg-[#071A2D]" />
      <View className="absolute -top-20 -right-24 w-72 h-72 rounded-full bg-[#00C48C]/20" />
      <View className="absolute top-40 -left-20 w-64 h-64 rounded-full bg-[#3B82F6]/10" />

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Image source={useFramedAvatarArray(profile.avatar || 0)} className="w-14 h-14 rounded-full" />
          <View className="ml-3">
            <Text className="text-white text-lg font-psemibold">Hi, {profile.fullName || 'MonieChain user'}</Text>
            <Text className="text-slate-300 text-xs">{profile.phoneNumber} • KYC {profile.kycStatus}</Text>
          </View>
        </View>
        <TouchableOpacity className="bg-white/10 w-12 h-12 items-center justify-center rounded-full border border-white/10" onPress={() => setShowNotification(!showNotification)}>
          <Image source={icons.bell} className="w-6 h-6" style={{ tintColor: '#fff' }} />
        </TouchableOpacity>
      </View>

      <View className="mt-8 rounded-[32px] p-6 bg-[#102A43] border border-white/10">
        <Text className="text-slate-300 text-sm">Total USDT balance</Text>
        <Text className="text-white text-4xl font-pbold mt-2">₮ {Number(profile.usdtBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        <View className="mt-5 p-4 rounded-2xl bg-[#071A2D] border border-[#00C48C]/30">
          <Text className="text-[#00C48C] text-xs font-psemibold">ON-CHAIN WALLET</Text>
          <Text className="text-white mt-1">{maskedWallet}</Text>
          <Text className="text-slate-400 text-xs mt-1">Permanently mapped to your phone number for simple USDT transfers.</Text>
        </View>
      </View>

      <View className="flex-row justify-between mt-6">
        {walletActions.map((action) => (
          <TouchableOpacity key={action.label} className="items-center" onPress={() => router.push(action.route)}>
            <View className="w-16 h-16 rounded-2xl bg-[#00C48C] items-center justify-center"><Text className="text-white text-2xl">{action.icon}</Text></View>
            <Text className="text-white text-xs mt-2">{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="mt-7 rounded-3xl bg-white p-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-[#071A2D] text-lg font-pbold">Recent on-chain activity</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/leaderboard')}><Text className="text-[#00A878] font-psemibold">View all</Text></TouchableOpacity>
        </View>
        {transactions.slice(0, 3).map((tx) => (
          <View key={tx.id} className="flex-row justify-between items-center py-3 border-b border-slate-100">
            <View><Text className="text-[#102A43] font-psemibold">{tx.title}</Text><Text className="text-slate-500 text-xs">{tx.subtitle}</Text></View>
            <View className="items-end"><Text className={tx.amount > 0 ? 'text-[#00A878] font-pbold' : 'text-[#102A43] font-pbold'}>{tx.amount > 0 ? '+' : ''}{tx.amount} USDT</Text><Text className="text-slate-400 text-xs">{tx.status}</Text></View>
          </View>
        ))}
      </View>

      <View className="flex-row gap-3 mt-5">
        {merchantInsights.map((item) => <View key={item.label} className="flex-1 rounded-2xl bg-white/10 p-3"><Text className="text-slate-300 text-xs">{item.label}</Text><Text className="text-white font-pbold mt-1">{item.value}</Text></View>)}
      </View>

      <Modal transparent visible={showNotification} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-start' }}>
          <BlurView intensity={50} tint="dark" style={{ alignSelf: 'flex-end', marginTop: 40, marginRight: 20, width: '82%', borderRadius: 20, overflow: 'hidden', maxHeight: height * 0.45 }}>
            <View className="p-4"><TouchableOpacity onPress={() => setShowNotification(false)} className="self-end"><Text className="text-white text-xl">✕</Text></TouchableOpacity><ScrollView>{(notifications.length ? notifications : [{ message: 'Your USDT wallet is active and verified on-chain.', createdAt: new Date() }]).map((n, i) => <View key={i} className="bg-white/10 rounded-xl p-3 mb-2"><Text className="text-white">{n.message}</Text><Text className="text-[#00C48C] text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</Text></View>)}</ScrollView></View>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
}
