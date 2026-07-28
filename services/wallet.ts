import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export type KycStatus = 'not_started' | 'pending' | 'verified';
export type TransactionStatus = 'Confirmed' | 'Pending' | 'Failed';
export type TransactionType = 'received' | 'sent' | 'merchant' | 'deposit' | 'withdrawal' | 'savings' | 'security';

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
  kycStatus?: KycStatus;
  avatar?: number;
  isPremium?: boolean;
};

export type ChainTransaction = {
  id: string;
  type: TransactionType;
  title: string;
  subtitle: string;
  counterparty?: string;
  amount: number;
  status: TransactionStatus;
  hash: string;
  createdAt: string;
  network: 'USDT-TRC20' | 'USDT-ERC20' | 'USDT-Polygon';
  fee: number;
};

export type WalletProfile = Required<Pick<MonieChainUser, 'phoneNumber' | 'walletAddress' | 'kycStatus'>> & MonieChainUser;

const WALLET_LEDGER_KEY = 'moniechain-ledger-v1';
const WALLET_BALANCE_KEY = 'moniechain-balance-v1';
const PHONE_DIRECTORY_KEY = 'moniechain-phone-directory-v1';

const shortId = () => String(uuid.v4()).replace(/-/g, '').slice(0, 10);
const nowLabel = () => new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export const normalizePhone = (phone?: string) => (phone || '').replace(/\D/g, '');

export const deriveUsdtWallet = (phone?: string, seed?: string) => {
  const basis = `${normalizePhone(phone)}${seed || 'moniechain'}`;
  let hash = 0;
  for (let i = 0; i < basis.length; i += 1) {
    hash = (hash * 31 + basis.charCodeAt(i)) >>> 0;
  }
  return `0x${hash.toString(16).padStart(8, '0')}${shortId()}${shortId()}`.slice(0, 42);
};

export const maskWallet = (wallet?: string) => (wallet ? `${wallet.slice(0, 8)}…${wallet.slice(-6)}` : 'Pending wallet');

export const hydrateWalletProfile = (user: MonieChainUser = {}) => {
  const phoneNumber = user.phoneNumber || user.phone || '+234 801 000 0000';
  return {
    ...user,
    phoneNumber,
    walletAddress: user.walletAddress || deriveUsdtWallet(phoneNumber, user.email),
    usdtBalance: Number(user.usdtBalance ?? user.usdBalance ?? user.score ?? 2480.75),
    kycStatus: user.kycStatus || 'verified',
  } as WalletProfile;
};

export const walletActions = [
  { label: 'Send', route: '/(screens)/plantScreen', icon: '↗' },
  { label: 'Receive', route: '/(screens)/harvest', icon: '↙' },
  { label: 'Pay QR', route: '/(screens)/selectSeed', icon: '▣' },
  { label: 'Save', route: '/(screens)/inventory', icon: '◎' },
];

export const defaultTransactions: ChainTransaction[] = [
  { id: 'seed-1', type: 'received', title: 'USDT received', subtitle: 'From +234 802 456 2190', counterparty: '+234 802 456 2190', amount: 300, status: 'Confirmed', hash: '0x9bc1a41081fe', createdAt: 'Today, 09:42', network: 'USDT-TRC20', fee: 0.03 },
  { id: 'seed-2', type: 'merchant', title: 'Merchant payment', subtitle: 'Lekki Foods POS • QR', counterparty: 'Lekki Foods POS', amount: -42.5, status: 'Confirmed', hash: '0x41da89277a10', createdAt: 'Yesterday, 18:10', network: 'USDT-TRC20', fee: 0.02 },
  { id: 'seed-3', type: 'savings', title: 'Vault auto-save', subtitle: '7.2% flexible USDT vault', counterparty: 'Flexible vault', amount: -125, status: 'Confirmed', hash: '0xa1146bd22d77', createdAt: 'Jul 26, 2026', network: 'USDT-Polygon', fee: 0.01 },
  { id: 'seed-4', type: 'withdrawal', title: 'Off-ramp withdrawal', subtitle: 'Bank settlement requested', counterparty: 'Bank settlement', amount: -250, status: 'Pending', hash: '0x7cb30472441e', createdAt: 'Jul 25, 2026', network: 'USDT-TRC20', fee: 0.04 },
];

export const merchantInsights = [
  { label: 'QR volume', value: '18,420 USDT' },
  { label: 'Settlements', value: 'Instant' },
  { label: 'On-chain fees', value: '0.04 USDT avg' },
];

export const getLedger = async (): Promise<ChainTransaction[]> => {
  const raw = await AsyncStorage.getItem(WALLET_LEDGER_KEY);
  if (!raw) {
    await AsyncStorage.setItem(WALLET_LEDGER_KEY, JSON.stringify(defaultTransactions));
    return defaultTransactions;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultTransactions;
  } catch {
    return defaultTransactions;
  }
};

export const getStoredBalance = async (fallback: number) => {
  const raw = await AsyncStorage.getItem(WALLET_BALANCE_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const setStoredBalance = async (balance: number) => {
  await AsyncStorage.setItem(WALLET_BALANCE_KEY, balance.toFixed(2));
};

export const registerPhoneAlias = async (phone: string, walletAddress: string) => {
  const raw = await AsyncStorage.getItem(PHONE_DIRECTORY_KEY);
  const directory = raw ? JSON.parse(raw) : {};
  directory[normalizePhone(phone)] = walletAddress;
  await AsyncStorage.setItem(PHONE_DIRECTORY_KEY, JSON.stringify(directory));
};

export const resolvePhoneAlias = async (phone: string) => {
  const normalized = normalizePhone(phone);
  const raw = await AsyncStorage.getItem(PHONE_DIRECTORY_KEY);
  const directory = raw ? JSON.parse(raw) : {};
  return directory[normalized] || deriveUsdtWallet(normalized);
};

export const createLedgerEntry = async (entry: Omit<ChainTransaction, 'id' | 'hash' | 'createdAt'>) => {
  const tx: ChainTransaction = {
    ...entry,
    id: String(uuid.v4()),
    hash: `0x${shortId()}${shortId()}${shortId()}`,
    createdAt: nowLabel(),
  };
  const ledger = await getLedger();
  await AsyncStorage.setItem(WALLET_LEDGER_KEY, JSON.stringify([tx, ...ledger]));
  return tx;
};

export const submitWalletTransfer = async ({ amount, recipientPhone, balance }: { amount: number; recipientPhone: string; balance: number }) => {
  if (!normalizePhone(recipientPhone)) throw new Error('Enter a valid recipient phone number.');
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter a valid USDT amount.');
  const fee = 0.03;
  if (amount + fee > balance) throw new Error('Insufficient USDT balance for amount and network fee.');
  const recipientWallet = await resolvePhoneAlias(recipientPhone);
  const tx = await createLedgerEntry({
    type: 'sent',
    title: 'USDT sent',
    subtitle: `To ${recipientPhone} • ${maskWallet(recipientWallet)}`,
    counterparty: recipientPhone,
    amount: -amount,
    status: 'Pending',
    network: 'USDT-TRC20',
    fee,
  });
  const nextBalance = Number((balance - amount - fee).toFixed(2));
  await setStoredBalance(nextBalance);
  return { tx, nextBalance, recipientWallet };
};

export const recordDeposit = async (amount: number, balance: number) => {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter a valid deposit amount.');
  const tx = await createLedgerEntry({ type: 'deposit', title: 'USDT deposit', subtitle: 'External wallet deposit', amount, status: 'Confirmed', network: 'USDT-TRC20', fee: 0 });
  const nextBalance = Number((balance + amount).toFixed(2));
  await setStoredBalance(nextBalance);
  return { tx, nextBalance };
};
