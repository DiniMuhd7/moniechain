import uuid from 'react-native-uuid';

export type MonieChainUser = {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  walletAddress?: string;
  usdtBalance?: number;
  usdBalance?: number;
  score?: number | string;
  phone?: string;
  kycStatus?: 'not_started' | 'pending' | 'verified';
  avatar?: number;
  isPremium?: boolean;
};

export type ChainTransaction = {
  id: string;
  type: 'received' | 'sent' | 'merchant' | 'deposit' | 'withdrawal' | 'savings';
  title: string;
  subtitle: string;
  amount: number;
  status: 'Confirmed' | 'Pending';
  hash: string;
  createdAt: string;
};

const shortId = () => String(uuid.v4()).replace(/-/g, '').slice(0, 10);

export const normalizePhone = (phone?: string) => (phone || '').replace(/\D/g, '');

export const deriveUsdtWallet = (phone?: string, seed?: string) => {
  const basis = `${normalizePhone(phone)}${seed || 'moniechain'}`;
  let hash = 0;
  for (let i = 0; i < basis.length; i += 1) {
    hash = (hash * 31 + basis.charCodeAt(i)) >>> 0;
  }
  return `0x${hash.toString(16).padStart(8, '0')}${shortId()}${shortId()}`.slice(0, 42);
};

export const hydrateWalletProfile = (user: MonieChainUser = {}) => {
  const phoneNumber = user.phoneNumber || user.phone || '+234 801 000 0000';
  return {
    ...user,
    phoneNumber,
    walletAddress: user.walletAddress || deriveUsdtWallet(phoneNumber, user.email),
    usdtBalance: Number(user.usdtBalance ?? user.usdBalance ?? user.score ?? 2480.75),
    kycStatus: user.kycStatus || 'verified',
  } as MonieChainUser;
};

export const walletActions = [
  { label: 'Send', route: '/(screens)/plantScreen', icon: '↗' },
  { label: 'Receive', route: '/(screens)/harvest', icon: '↙' },
  { label: 'Pay QR', route: '/(screens)/selectSeed', icon: '▣' },
  { label: 'Save', route: '/(screens)/inventory', icon: '◎' },
];

export const transactions: ChainTransaction[] = [
  { id: '1', type: 'received', title: 'USDT received', subtitle: 'From +234 802 456 2190', amount: 300, status: 'Confirmed', hash: '0x9bc1…81fe', createdAt: 'Today, 09:42' },
  { id: '2', type: 'merchant', title: 'Merchant payment', subtitle: 'Lekki Foods POS • QR', amount: -42.5, status: 'Confirmed', hash: '0x41da…7a10', createdAt: 'Yesterday, 18:10' },
  { id: '3', type: 'savings', title: 'Vault auto-save', subtitle: '7.2% flexible USDT vault', amount: -125, status: 'Confirmed', hash: '0xa114…2d77', createdAt: 'Jul 26, 2026' },
  { id: '4', type: 'withdrawal', title: 'Off-ramp withdrawal', subtitle: 'Bank settlement requested', amount: -250, status: 'Pending', hash: '0x7cb3…441e', createdAt: 'Jul 25, 2026' },
];

export const merchantInsights = [
  { label: 'QR volume', value: '18,420 USDT' },
  { label: 'Settlements', value: 'Instant' },
  { label: 'On-chain fees', value: '0.04 USDT avg' },
];
