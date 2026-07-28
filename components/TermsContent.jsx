import React from 'react';
import { View, Text } from 'react-native';

const sections = [
  ['1. Platform', 'MonieChain provides a USDT-first wallet experience where eligible users can create wallets, map a verified phone number to a wallet address, and initiate deposits, withdrawals, peer-to-peer transfers, merchant QR payments, and savings vault movements.'],
  ['2. Blockchain ledger', 'Balances and transfers are designed to be verified against supported USDT networks. Transaction speed, finality, fees, and availability can vary by network conditions and third-party infrastructure.'],
  ['3. Account security', 'You are responsible for protecting your device, credentials, passcodes, and recovery information. MonieChain may require KYC, risk checks, and additional approvals before enabling higher limits.'],
  ['4. Compliance', 'Do not use MonieChain for prohibited, fraudulent, sanctioned, or unlawful transactions. We may restrict features where required by law, compliance obligations, or security controls.'],
  ['5. Risk notice', 'USDT and blockchain transactions involve technology, counterparty, liquidity, and regulatory risks. Confirm recipients before sending because on-chain transfers may be irreversible.'],
];

export default function TermsContent() { return <View>{sections.map(([title, body]) => <View key={title} className="mb-4"><Text className="text-white font-pbold text-lg">{title}</Text><Text className="text-slate-200 mt-1">{body}</Text></View>)}</View>; }
