export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'blocked';

export interface UserProfile {
  uid: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  walletBalance: number;
  totalEarnings: number;
  todayEarnings: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  referralCode: string;
  referredBy?: string;
  totalReferrals: number;
  referralEarnings: number;
  completedTasksCount: number;
  spinsToday: number;
  adsWatchedToday: number;
  lastActiveDate?: string;
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'active' | 'inactive';

export interface TaskItem {
  id: string;
  title: string;
  titleBn?: string;
  description: string;
  rewardAmount: number; // in BDT
  timerDuration: number; // in seconds
  dailyLimit: number;
  totalLimit: number;
  completionsToday?: number;
  totalCompletions?: number;
  status: TaskStatus;
  category: 'visit' | 'video' | 'app' | 'social' | 'survey';
  icon?: string;
  externalUrl?: string;
  adRequired: boolean;
  adDurationSeconds: number; // default 10 seconds mandatory ad
  createdAt: string;
  updatedAt: string;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  rewardAmount: number;
  completedAt: string;
  status: 'completed';
}

export type TransactionType =
  | 'task_reward'
  | 'ad_reward'
  | 'spin_reward'
  | 'referral_reward'
  | 'withdrawal'
  | 'admin_adjustment'
  | 'refund';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'reversed';

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // positive for credit, negative for debit
  status: TransactionStatus;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export type WithdrawalMethod = 'bKash' | 'Nagad';
export type WithdrawalStatus =
  | 'pending'
  | 'processing'
  | 'approved'
  | 'paid'
  | 'rejected'
  | 'cancelled';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  paymentMethod: WithdrawalMethod;
  accountNumber: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: WithdrawalStatus;
  adminNote?: string;
  paymentTxId?: string;
  createdAt: string;
  updatedAt: string;
}

export type AdPlacement =
  | 'banner_top'
  | 'banner_bottom'
  | 'dashboard'
  | 'task_preroll'
  | 'video_ads'
  | 'social_bar'
  | 'popunder';

export interface AdvertisementItem {
  id: string;
  name: string;
  placement: AdPlacement;
  type: 'html_script' | 'image_banner' | 'video';
  adCode: string;
  imageUrl?: string;
  targetUrl?: string;
  status: 'active' | 'inactive';
  durationSeconds?: number;
  rewardAmount?: number;
  createdAt: string;
}

export interface PlatformSettings {
  appName: string;
  currencySymbol: string;
  currencyCode: string;
  minWithdrawal: number;
  maxWithdrawal: number;
  withdrawalFeePercent: number;
  referralCommissionFixed: number;
  referralCommissionPercent: number;
  defaultTaskAdSeconds: number;
  videoAdReward: number;
  videoAdDuration: number;
  videoAdsDailyLimit: number;
  spinDailyLimit: number;
  spinRewards: number[]; // e.g. [0.5, 1, 2, 3, 5, 10, 0, 15]
  maintenanceMode: boolean;
  userWithdrawalEnabled: boolean;
  registrationEnabled: boolean;
  noticeBanner?: string;
}

export interface AdminLogItem {
  id: string;
  adminId: string;
  adminEmail?: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reward' | 'withdrawal' | 'system' | 'referral';
  isRead: boolean;
  createdAt: string;
}
