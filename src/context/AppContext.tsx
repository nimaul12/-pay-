import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  TaskItem,
  WithdrawalRequest,
  WalletTransaction,
  AdvertisementItem,
  PlatformSettings,
  AppNotification,
  AdminLogItem,
  WithdrawalStatus,
  UserStatus,
  WithdrawalMethod,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_TASKS,
  INITIAL_WITHDRAWALS,
  INITIAL_TRANSACTIONS,
  INITIAL_ADS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMIN_LOGS,
  SUPER_ADMIN_UID,
  ADMIN_NAME,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
} from '../lib/mockData';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AppContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  tasks: TaskItem[];
  withdrawals: WithdrawalRequest[];
  transactions: WalletTransaction[];
  ads: AdvertisementItem[];
  settings: PlatformSettings;
  notifications: AppNotification[];
  adminLogs: AdminLogItem[];
  currentPanel: 'user' | 'admin';
  activeTab: string;
  isFirebaseActive: boolean;
  setPanel: (panel: 'user' | 'admin') => void;
  setActiveTab: (tab: string) => void;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; message: string }>;
  loginAsAdmin: () => void;
  loginAsDemoUser: () => void;
  register: (data: {
    name: string;
    username: string;
    email: string;
    phone: string;
    pass: string;
    refCode?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  completeTask: (taskId: string) => Promise<{ success: boolean; reward: number; message: string }>;
  watchVideoAd: (adId: string) => Promise<{ success: boolean; reward: number; message: string }>;
  spinWheel: () => Promise<{ success: boolean; reward: number; message: string }>;
  requestWithdrawal: (
    method: WithdrawalMethod,
    accountNumber: string,
    amount: number
  ) => Promise<{ success: boolean; message: string }>;
  updateWithdrawalStatus: (
    id: string,
    status: WithdrawalStatus,
    adminNote?: string,
    txId?: string
  ) => Promise<{ success: boolean; message: string }>;
  createTask: (task: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt' | 'completionsToday' | 'totalCompletions'>) => void;
  updateTask: (taskId: string, updates: Partial<TaskItem>) => void;
  deleteTask: (taskId: string) => void;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  adjustUserBalance: (userId: string, amount: number, reason: string) => void;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  saveAd: (ad: AdvertisementItem) => void;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Updated storage keys for clean state initialization
const STORAGE_KEYS = {
  USERS: 'takapay_users_v5',
  TASKS: 'takapay_tasks_v5',
  WITHDRAWALS: 'takapay_withdrawals_v5',
  TRANSACTIONS: 'takapay_transactions_v5',
  ADS: 'takapay_ads_v5',
  SETTINGS: 'takapay_settings_v5',
  LOGS: 'takapay_logs_v5',
  NOTIFICATIONS: 'takapay_notifications_v5',
  AUTH_USER_ID: 'takapay_auth_uid_v5',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_USER_ID) || 'user-rahim-123';
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [ads, setAds] = useState<AdvertisementItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADS);
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [adminLogs, setAdminLogs] = useState<AdminLogItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_LOGS;
  });

  const [currentPanel, setCurrentPanel] = useState<'user' | 'admin'>('user');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(true);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(adminLogs));
  }, [adminLogs]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER_ID);
    }
  }, [currentUserId]);

  const currentUser = allUsers.find((u) => u.uid === currentUserId) || null;

  // Background sync with Firestore if configured
  useEffect(() => {
    const trySyncFirestore = async () => {
      try {
        if (!db) return;
        const testRef = doc(db, 'settings', 'global');
        const snap = await getDoc(testRef);
        if (snap.exists()) {
          const remoteSettings = snap.data() as PlatformSettings;
          setSettings((prev) => ({ ...prev, ...remoteSettings }));
        }
        setIsFirebaseActive(true);
      } catch (err) {
        setIsFirebaseActive(false);
      }
    };
    trySyncFirestore();
  }, []);

  const setPanel = (panel: 'user' | 'admin') => {
    if (panel === 'admin' && currentUser?.role !== 'admin') {
      alert('অ্যাক্সেস অস্বীকার! শুধুমাত্র এডমিন এই প্যানেলে প্রবেশ করতে পারেন।');
      return;
    }
    setCurrentPanel(panel);
    setActiveTab(panel === 'admin' ? 'dashboard' : 'home');
  };

  const login = async (identifier: string, pass: string): Promise<{ success: boolean; message: string }> => {
    const cleanId = identifier.trim().toLowerCase();

    // Check for Niamul Molla (Admin) credentials requested by user
    const isAdminIdentifier =
      cleanId === 'niamul' ||
      cleanId === 'niamul molla' ||
      cleanId === 'niamulmolla' ||
      cleanId === 'admin' ||
      cleanId === 'funnymr976@gmail.com' ||
      cleanId === SUPER_ADMIN_UID.toLowerCase();

    if (isAdminIdentifier && pass === ADMIN_PASSWORD) {
      const admin = allUsers.find((u) => u.uid === SUPER_ADMIN_UID || u.role === 'admin');
      if (admin) {
        setCurrentUserId(admin.uid);
        return { success: true, message: `এডমিন ${ADMIN_NAME} হিসেবে সফলভাবে লগইন হয়েছেন।` };
      }
    }

    // Look for matching user by email, username or phone
    const user = allUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.username.toLowerCase() === cleanId ||
        u.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')
    );

    if (!user) {
      return { success: false, message: 'ইউজার খুঁজে পাওয়া যায়নি। দয়া করে সঠিক তথ্য দিন অথবা রেজিস্ট্রেশন করুন।' };
    }

    if (user.status === 'blocked') {
      return { success: false, message: 'আপনার একাউন্টটি সাময়িকভাবে ব্লক করা হয়েছে। সাপোর্টে যোগাযোগ করুন।' };
    }

    // Check password (for normal users)
    if (user.role === 'admin' && pass !== ADMIN_PASSWORD) {
      return { success: false, message: 'ভুল পাসওয়ার্ড! এডমিন পাসওয়ার্ড দিন।' };
    }

    setCurrentUserId(user.uid);
    return { success: true, message: 'লগইন সফল হয়েছে!' };
  };

  const loginAsAdmin = () => {
    const admin = allUsers.find((u) => u.uid === SUPER_ADMIN_UID || u.role === 'admin') || allUsers[0];
    if (admin) {
      setCurrentUserId(admin.uid);
      setCurrentPanel('admin');
      setActiveTab('dashboard');
    }
  };

  const loginAsDemoUser = () => {
    const regularUser = allUsers.find((u) => u.role === 'user') || allUsers[1];
    if (regularUser) {
      setCurrentUserId(regularUser.uid);
      setCurrentPanel('user');
      setActiveTab('home');
    }
  };

  const register = async (data: {
    name: string;
    username: string;
    email: string;
    phone: string;
    pass: string;
    refCode?: string;
  }): Promise<{ success: boolean; message: string }> => {
    if (!settings.registrationEnabled) {
      return { success: false, message: 'বর্তমানে নতুন রেজিস্ট্রেশন বন্ধ রয়েছে।' };
    }

    const cleanUsername = data.username.trim().toLowerCase();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone.trim();

    if (allUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'এই ইমেইল দিয়ে ইতোমধ্যে একাউন্ট খোলা হয়েছে।' };
    }

    if (allUsers.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, message: 'এই ইউজারনেমটি আগে থেকেই নেওয়া আছে।' };
    }

    const newUid = `user-${Date.now()}`;
    const generatedRefCode = `TKP-${Math.floor(100000 + Math.random() * 900000)}`;

    let referrer = null;
    if (data.refCode && data.refCode.trim()) {
      referrer = allUsers.find((u) => u.referralCode.toUpperCase() === data.refCode?.trim().toUpperCase());
    }

    const newUser: UserProfile = {
      uid: newUid,
      name: data.name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'user',
      status: 'active',
      walletBalance: 10.0, // Welcome signup bonus
      totalEarnings: 10.0,
      todayEarnings: 10.0,
      totalWithdrawn: 0,
      pendingWithdrawals: 0,
      referralCode: generatedRefCode,
      referredBy: referrer?.referralCode,
      totalReferrals: 0,
      referralEarnings: 0,
      completedTasksCount: 0,
      spinsToday: 0,
      adsWatchedToday: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const initialTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: newUid,
      type: 'task_reward',
      amount: 10.0,
      status: 'completed',
      description: 'স্বাগতম বোনাস (Welcome Bonus)',
      createdAt: new Date().toISOString(),
    };

    let updatedUsers = [...allUsers, newUser];

    if (referrer && settings.referralCommissionFixed > 0) {
      const bonus = settings.referralCommissionFixed;
      updatedUsers = updatedUsers.map((u) => {
        if (u.uid === referrer.uid) {
          return {
            ...u,
            walletBalance: u.walletBalance + bonus,
            totalEarnings: u.totalEarnings + bonus,
            todayEarnings: u.todayEarnings + bonus,
            totalReferrals: u.totalReferrals + 1,
            referralEarnings: u.referralEarnings + bonus,
          };
        }
        return u;
      });

      const refTx: WalletTransaction = {
        id: `tx-ref-${Date.now()}`,
        userId: referrer.uid,
        type: 'referral_reward',
        amount: bonus,
        status: 'completed',
        description: `রেফারেল বোনাস (${newUser.name})`,
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [refTx, ...prev]);
    }

    setAllUsers(updatedUsers);
    setTransactions((prev) => [initialTx, ...prev]);
    setCurrentUserId(newUid);

    return { success: true, message: 'রেজিস্ট্রেশন সফল হয়েছে! আপনাকে ১০ টাকা স্বাগতম বোনাস দেওয়া হয়েছে।' };
  };

  const logout = () => {
    setCurrentUserId(null);
    setCurrentPanel('user');
    setActiveTab('home');
  };

  const completeTask = async (taskId: string): Promise<{ success: boolean; reward: number; message: string }> => {
    if (!currentUser) return { success: false, reward: 0, message: 'দয়া করে প্রথমে লগইন করুন।' };
    if (currentUser.status !== 'active') {
      return { success: false, reward: 0, message: 'আপনার একাউন্ট নিষ্ক্রিয় রয়েছে।' };
    }

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, reward: 0, message: 'টাস্কটি খুঁজে পাওয়া যায়নি।' };

    const reward = task.rewardAmount;

    setAllUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.uid === currentUser.uid) {
          return {
            ...u,
            walletBalance: Number((u.walletBalance + reward).toFixed(2)),
            totalEarnings: Number((u.totalEarnings + reward).toFixed(2)),
            todayEarnings: Number((u.todayEarnings + reward).toFixed(2)),
            completedTasksCount: u.completedTasksCount + 1,
            updatedAt: new Date().toISOString(),
          };
        }
        return u;
      })
    );

    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            completionsToday: (t.completionsToday || 0) + 1,
            totalCompletions: (t.totalCompletions || 0) + 1,
          };
        }
        return t;
      })
    );

    const newTx: WalletTransaction = {
      id: `tx-task-${Date.now()}`,
      userId: currentUser.uid,
      type: 'task_reward',
      amount: reward,
      status: 'completed',
      description: `টাস্ক সম্পন্ন: ${task.titleBn || task.title}`,
      referenceId: task.id,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.uid,
      title: 'টাস্ক রিওয়ার্ড যোগ হয়েছে!',
      message: `অভিনন্দন! আপনি "${task.titleBn || task.title}" টাস্কটি সম্পন্ন করে ৳${reward.toFixed(2)} আয় করেছেন।`,
      type: 'reward',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return { success: true, reward, message: `টাস্ক সফলভাবে সম্পন্ন হয়েছে! ৳${reward.toFixed(2)} ব্যালেন্সে যুক্ত হয়েছে।` };
  };

  const watchVideoAd = async (adId: string): Promise<{ success: boolean; reward: number; message: string }> => {
    if (!currentUser) return { success: false, reward: 0, message: 'দয়া করে লগইন করুন।' };
    if (currentUser.status !== 'active') return { success: false, reward: 0, message: 'আপনার একাউন্ট নিষ্ক্রিয় রয়েছে।' };

    if (currentUser.adsWatchedToday >= settings.videoAdsDailyLimit) {
      return { success: false, reward: 0, message: 'আজকের ভিডিও অ্যাড দেখার সীমা শেষ হয়েছে। আগামীকাল আবার চেষ্টা করুন।' };
    }

    const reward = settings.videoAdReward;

    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.uid === currentUser.uid) {
          return {
            ...u,
            walletBalance: Number((u.walletBalance + reward).toFixed(2)),
            totalEarnings: Number((u.totalEarnings + reward).toFixed(2)),
            todayEarnings: Number((u.todayEarnings + reward).toFixed(2)),
            adsWatchedToday: u.adsWatchedToday + 1,
            updatedAt: new Date().toISOString(),
          };
        }
        return u;
      })
    );

    const newTx: WalletTransaction = {
      id: `tx-ad-${Date.now()}`,
      userId: currentUser.uid,
      type: 'ad_reward',
      amount: reward,
      status: 'completed',
      description: 'ভিডিও বিজ্ঞাপন দেখার রিওয়ার্ড',
      referenceId: adId,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    return { success: true, reward, message: `বিজ্ঞাপন দেখার জন্য ৳${reward.toFixed(2)} ব্যালেন্সে যুক্ত হয়েছে!` };
  };

  const spinWheel = async (): Promise<{ success: boolean; reward: number; message: string }> => {
    if (!currentUser) return { success: false, reward: 0, message: 'দয়া করে লগইন করুন।' };
    if (currentUser.status !== 'active') return { success: false, reward: 0, message: 'আপনার একাউন্ট নিষ্ক্রিয় রয়েছে।' };

    if (currentUser.spinsToday >= settings.spinDailyLimit) {
      return { success: false, reward: 0, message: `আজকের সর্বোচ্চ ${settings.spinDailyLimit} টি স্পিন শেষ হয়েছে। আগামীকাল আবার চেষ্টা করুন!` };
    }

    const rewards = settings.spinRewards && settings.spinRewards.length > 0 ? settings.spinRewards : [0.5, 1, 2, 3, 5, 10];
    const randomIndex = Math.floor(Math.random() * rewards.length);
    const reward = rewards[randomIndex];

    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.uid === currentUser.uid) {
          return {
            ...u,
            walletBalance: Number((u.walletBalance + reward).toFixed(2)),
            totalEarnings: Number((u.totalEarnings + reward).toFixed(2)),
            todayEarnings: Number((u.todayEarnings + reward).toFixed(2)),
            spinsToday: u.spinsToday + 1,
            updatedAt: new Date().toISOString(),
          };
        }
        return u;
      })
    );

    const newTx: WalletTransaction = {
      id: `tx-spin-${Date.now()}`,
      userId: currentUser.uid,
      type: 'spin_reward',
      amount: reward,
      status: 'completed',
      description: `লাকি হুইল স্পিন রিওয়ার্ড (৳${reward})`,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      reward,
      message: reward > 0 ? `🎉 অভিনন্দন! আপনি স্পিন করে ৳${reward.toFixed(2)} জিতেছেন!` : '😔 দুর্ভাগ্যবশত এইবার কোনো টাকা জেতেননি। আবার স্পিন করুন!',
    };
  };

  const requestWithdrawal = async (
    method: WithdrawalMethod,
    accountNumber: string,
    amount: number
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'দয়া করে লগইন করুন।' };
    if (!settings.userWithdrawalEnabled) {
      return { success: false, message: 'বর্তমানে সিস্টেম আপডেটের কারণে উইথড্রয়াল সাময়িক বন্ধ রয়েছে।' };
    }
    if (currentUser.status !== 'active') {
      return { success: false, message: 'আপনার একাউন্ট সাময়িকভাবে স্থগিত বা ব্লক রয়েছে।' };
    }
    if (amount < settings.minWithdrawal) {
      return { success: false, message: `ন্যূনতম উইথড্রয়াল পরিমাণ ৳${settings.minWithdrawal}।` };
    }
    if (amount > settings.maxWithdrawal) {
      return { success: false, message: `সর্বোচ্চ একক উইথড্রয়াল সীমা ৳${settings.maxWithdrawal}।` };
    }
    if (currentUser.walletBalance < amount) {
      return { success: false, message: 'আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই।' };
    }

    const fee = Number(((amount * settings.withdrawalFeePercent) / 100).toFixed(2));
    const netAmount = Number((amount - fee).toFixed(2));
    const withdrawalId = `WTH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newWithdrawal: WithdrawalRequest = {
      id: withdrawalId,
      userId: currentUser.uid,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      paymentMethod: method,
      accountNumber: accountNumber.trim(),
      amount,
      fee,
      netAmount,
      status: 'pending',
      adminNote: 'অপেক্ষমাণ (Processing queue)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.uid === currentUser.uid) {
          return {
            ...u,
            walletBalance: Number((u.walletBalance - amount).toFixed(2)),
            pendingWithdrawals: Number((u.pendingWithdrawals + amount).toFixed(2)),
            updatedAt: new Date().toISOString(),
          };
        }
        return u;
      })
    );

    setWithdrawals((prev) => [newWithdrawal, ...prev]);

    const tx: WalletTransaction = {
      id: `tx-wth-${Date.now()}`,
      userId: currentUser.uid,
      type: 'withdrawal',
      amount: -amount,
      status: 'pending',
      description: `${method} উইথড্রয়াল আবেদন (${accountNumber})`,
      referenceId: withdrawalId,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.uid,
      title: 'উইথড্র রিকোয়েস্ট গৃহীত হয়েছে',
      message: `আপনার ৳${amount} টাকার ${method} উইথড্রয়াল আবেদন সফলভাবে জমা হয়েছে। ২৪ ঘণ্টার মধ্যে প্রক্রিয়া সম্পন্ন হবে।`,
      type: 'withdrawal',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return {
      success: true,
      message: `উইথড্র রিকোয়েস্ট সফলভাবে জমা হয়েছে! ৳${netAmount.toFixed(2)} আপনার ${method} একাউন্টে পাঠানো হবে।`,
    };
  };

  const updateWithdrawalStatus = async (
    id: string,
    newStatus: WithdrawalStatus,
    adminNote?: string,
    txId?: string
  ): Promise<{ success: boolean; message: string }> => {
    const target = withdrawals.find((w) => w.id === id);
    if (!target) return { success: false, message: 'উইথড্রয়াল রিকোয়েস্ট পাওয়া যায়নি।' };

    const prevStatus = target.status;

    setWithdrawals((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            status: newStatus,
            adminNote: adminNote || w.adminNote,
            paymentTxId: txId || w.paymentTxId,
            updatedAt: new Date().toISOString(),
          };
        }
        return w;
      })
    );

    if ((newStatus === 'rejected' || newStatus === 'cancelled') && prevStatus === 'pending') {
      setAllUsers((prev) =>
        prev.map((u) => {
          if (u.uid === target.userId) {
            return {
              ...u,
              walletBalance: Number((u.walletBalance + target.amount).toFixed(2)),
              pendingWithdrawals: Math.max(0, Number((u.pendingWithdrawals - target.amount).toFixed(2))),
              updatedAt: new Date().toISOString(),
            };
          }
          return u;
        })
      );

      const refundTx: WalletTransaction = {
        id: `tx-refund-${Date.now()}`,
        userId: target.userId,
        type: 'refund',
        amount: target.amount,
        status: 'completed',
        description: `উইথড্রয়াল ফেরত: ${adminNote || 'এডমিন দ্বারা বাতিল'}`,
        referenceId: target.id,
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [refundTx, ...prev]);
    } else if (newStatus === 'paid' && prevStatus !== 'paid') {
      setAllUsers((prev) =>
        prev.map((u) => {
          if (u.uid === target.userId) {
            return {
              ...u,
              pendingWithdrawals: Math.max(0, Number((u.pendingWithdrawals - target.amount).toFixed(2))),
              totalWithdrawn: Number((u.totalWithdrawn + target.amount).toFixed(2)),
              updatedAt: new Date().toISOString(),
            };
          }
          return u;
        })
      );
    }

    const newLog: AdminLogItem = {
      id: `log-${Date.now()}`,
      adminId: currentUser?.uid || SUPER_ADMIN_UID,
      adminEmail: currentUser?.email || 'funnymr976@gmail.com',
      action: `WITHDRAWAL_${newStatus.toUpperCase()}`,
      target: `${target.id} (${target.userName})`,
      details: `স্ট্যাটাস: ${newStatus}, পরিমাণ: ৳${target.amount}, মেথড: ${target.paymentMethod}. নোট: ${adminNote || 'None'}`,
      timestamp: new Date().toISOString(),
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    return { success: true, message: `উইথড্রয়াল রিকোয়েস্ট সফলভাবে "${newStatus}" করা হয়েছে।` };
  };

  const createTask = (
    taskData: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt' | 'completionsToday' | 'totalCompletions'>
  ) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}`,
      completionsToday: 0,
      totalCompletions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);

    setAdminLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        adminId: currentUser?.uid || SUPER_ADMIN_UID,
        adminEmail: currentUser?.email,
        action: 'TASK_CREATED',
        target: newTask.title,
        details: `নতুন টাস্ক তৈরি করা হয়েছে। রিওয়ার্ড: ৳${newTask.rewardAmount}, সময়: ${newTask.timerDuration}s`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateTask = (taskId: string, updates: Partial<TaskItem>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    setAdminLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        adminId: currentUser?.uid || SUPER_ADMIN_UID,
        adminEmail: currentUser?.email,
        action: 'TASK_DELETED',
        target: taskId,
        details: `টাস্ক মুছে ফেলা হয়েছে: ${taskToDelete?.title || taskId}`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateUserStatus = (userId: string, status: UserStatus) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.uid === userId ? { ...u, status, updatedAt: new Date().toISOString() } : u))
    );

    setAdminLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        adminId: currentUser?.uid || SUPER_ADMIN_UID,
        adminEmail: currentUser?.email,
        action: 'USER_STATUS_CHANGE',
        target: userId,
        details: `ইউজার স্ট্যাটাস পরিবর্তন: ${status}`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const adjustUserBalance = (userId: string, amount: number, reason: string) => {
    const user = allUsers.find((u) => u.uid === userId);
    if (!user) return;

    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.uid === userId) {
          const newBal = Number((u.walletBalance + amount).toFixed(2));
          return {
            ...u,
            walletBalance: newBal,
            totalEarnings: amount > 0 ? Number((u.totalEarnings + amount).toFixed(2)) : u.totalEarnings,
            updatedAt: new Date().toISOString(),
          };
        }
        return u;
      })
    );

    const tx: WalletTransaction = {
      id: `tx-adj-${Date.now()}`,
      userId: userId,
      type: 'admin_adjustment',
      amount,
      status: 'completed',
      description: `এডমিন সমন্বয়: ${reason}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    setAdminLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        adminId: currentUser?.uid || SUPER_ADMIN_UID,
        adminEmail: currentUser?.email,
        action: 'BALANCE_ADJUSTMENT',
        target: `${user.name} (${user.username})`,
        details: `পরিমাণ: ৳${amount > 0 ? `+${amount}` : amount}, কারণ: ${reason}`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        if (db) {
          setDoc(doc(db, 'settings', 'global'), updated, { merge: true });
        }
      } catch (e) {
        // ignore offline
      }
      return updated;
    });

    setAdminLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        adminId: currentUser?.uid || SUPER_ADMIN_UID,
        adminEmail: currentUser?.email,
        action: 'SETTINGS_UPDATE',
        target: 'Global Settings',
        details: JSON.stringify(newSettings),
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const saveAd = (ad: AdvertisementItem) => {
    setAds((prev) => {
      const exists = prev.some((a) => a.id === ad.id);
      if (exists) {
        return prev.map((a) => (a.id === ad.id ? ad : a));
      }
      return [ad, ...prev];
    });

    setAdminLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        adminId: currentUser?.uid || SUPER_ADMIN_UID,
        adminEmail: currentUser?.email,
        action: 'AD_UPDATED',
        target: `${ad.name} (${ad.placement})`,
        details: `বিজ্ঞাপন কনফিগারেশন আপডেট করা হয়েছে`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        tasks,
        withdrawals,
        transactions,
        ads,
        settings,
        notifications,
        adminLogs,
        currentPanel,
        activeTab,
        isFirebaseActive,
        setPanel,
        setActiveTab,
        login,
        loginAsAdmin,
        loginAsDemoUser,
        register,
        logout,
        completeTask,
        watchVideoAd,
        spinWheel,
        requestWithdrawal,
        updateWithdrawalStatus,
        createTask,
        updateTask,
        deleteTask,
        updateUserStatus,
        adjustUserBalance,
        updateSettings,
        saveAd,
        markNotificationAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
