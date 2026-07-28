import React from 'react';
import { View, Text } from 'react-native';

const sections = [
  ['Information we collect', 'MonieChain collects account details such as name, email, phone number, KYC information, device signals, wallet address mappings, transaction metadata, and notification preferences.'],
  ['How we use data', 'We use information to create wallets, map phone numbers to USDT addresses, verify on-chain activity, prevent fraud, provide support, meet compliance obligations, and improve product reliability.'],
  ['Blockchain transparency', 'Public blockchain transactions may reveal wallet addresses, timestamps, amounts, and hashes. MonieChain simplifies this experience, but public ledger data cannot be deleted by us.'],
  ['Security', 'We use reasonable technical and organizational safeguards for application data and encourage device passcodes, biometric unlock, and two-factor authentication.'],
  ['Your choices', 'You can update account information, notification preferences, and eligible privacy requests through support or in-app account settings.'],
];

export default function PrivacyContent() { return <View>{sections.map(([title, body]) => <View key={title} className="mb-4"><Text className="text-white font-pbold text-lg">{title}</Text><Text className="text-slate-200 mt-1">{body}</Text></View>)}</View>; }
