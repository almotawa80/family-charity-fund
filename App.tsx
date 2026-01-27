
import React, { useState, useMemo, useEffect } from 'react';
import {
  User, Transaction, Project, UserRole, UserStatus, TransactionType, ProjectStatus, ThemeMode
} from './types';
import { INITIAL_USERS, INITIAL_PROJECTS, INITIAL_TRANSACTIONS } from './constants';
import { Layout } from './components/Layout';
import { StatCard } from './components/StatCard';
import {
  Wallet, TrendingUp, Users, CheckCircle,
  PlusCircle, AlertCircle, Calendar, ThumbsUp, Edit, HeartHandshake, Phone, CalendarDays, Coins, Filter, SortAsc, Settings as SettingsIcon, ShieldCheck, Bell, Info, ChevronLeft, ArrowRight, LayoutDashboard, Briefcase, Trash2, UserCircle, MessageCircle, Megaphone, UserCheck, UserX, Lock, User as UserIcon, LayoutGrid, Sun, Moon, Monitor, Save, KeyRound
} from 'lucide-react';

export default function App() {
  // --- Global State with LocalStorage Persistence ---
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('family_fund_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('family_fund_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('family_fund_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [announcement, setAnnouncement] = useState<string>(() => {
    return localStorage.getItem('family_fund_announcement') || '';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('family_fund_theme') as ThemeMode) || 'system';
  });

  // --- View State ---
  const [currentView, setCurrentView] = useState('dashboard');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [startingBalance, setStartingBalance] = useState<number>(() => {
    return Number(localStorage.getItem('family_fund_starting_balance')) || 0;
  });

  const [showStats, setShowStats] = useState(() => {
    const saved = localStorage.getItem('family_fund_show_stats');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showCompleted, setShowCompleted] = useState(() => {
    const saved = localStorage.getItem('family_fund_show_completed');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Forms State
  const [announcementInput, setAnnouncementInput] = useState(announcement);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseProjectId, setExpenseProjectId] = useState<number | ''>('');

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormName, setUserFormName] = useState('');
  const [userFormPhone, setUserFormPhone] = useState('');
  const [userFormPledge, setUserFormPledge] = useState('10');
  const [userFormJoinDate, setUserFormJoinDate] = useState('');

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectFormTitle, setProjectFormTitle] = useState('');
  const [projectFormDesc, setProjectFormDesc] = useState('');
  const [projectFormCost, setProjectFormCost] = useState('');
  const [projectFormStatus, setProjectFormStatus] = useState<ProjectStatus>(ProjectStatus.Voting);
  const [projectFormImage, setProjectFormImage] = useState('');

  // Admin Profile Edit State
  const [profileName, setProfileName] = useState('');
  const [profileUser, setProfileUser] = useState('');
  const [profilePass, setProfilePass] = useState('');

  const [projectFilter, setProjectFilter] = useState<'all' | ProjectStatus>('all');
  const [projectSort, setProjectSort] = useState<'votes' | 'cost' | 'newest'>('newest');

  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<'all' | TransactionType>('all');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Transaction form state (for editing)
  const [transFormDesc, setTransFormDesc] = useState('');
  const [transFormAmount, setTransFormAmount] = useState('');
  const [transFormDate, setTransFormDate] = useState('');
  const [transFormProjectId, setTransFormProjectId] = useState<number | ''>('');

  // --- Theme Logic ---
  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('family_fund_theme', theme);

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Update Profile States when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfileUser(currentUser.username || '');
      setProfilePass(currentUser.password || '');
    }
  }, [currentUser]);

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('family_fund_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('family_fund_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('family_fund_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('family_fund_announcement', announcement);
  }, [announcement]);

  useEffect(() => {
    localStorage.setItem('family_fund_starting_balance', startingBalance.toString());
  }, [startingBalance]);

  useEffect(() => {
    localStorage.setItem('family_fund_show_stats', JSON.stringify(showStats));
  }, [showStats]);

  useEffect(() => {
    localStorage.setItem('family_fund_show_completed', JSON.stringify(showCompleted));
  }, [showCompleted]);

  // --- Helpers ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-KW', {
      style: 'currency',
      currency: 'KWD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handlePhoneInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      setter(value);
    }
  };

  const handleImageFileChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateTotalContribution = (user: User) => {
    if (!user.joinDate) return 0;
    const joinDate = new Date(user.joinDate);
    const now = new Date();

    let months = (now.getFullYear() - joinDate.getFullYear()) * 12;
    months += now.getMonth() - joinDate.getMonth();

    // Add 1 to include the joining month
    const totalMonths = Math.max(0, months + 1);
    return totalMonths * user.monthlyPledge;
  };

  const totalFundBalance = useMemo(() => {
    const transactionSum = transactions.reduce((acc, t) => {
      return t.type === TransactionType.Deposit ? acc + t.amount : acc - t.amount;
    }, 0);
    return transactionSum + startingBalance;
  }, [transactions, startingBalance]);

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];
    if (projectFilter !== 'all') {
      result = result.filter(p => p.status === projectFilter);
    }

    // Respect the showCompleted setting from Quick Tools
    if (!showCompleted) {
      result = result.filter(p => p.status !== ProjectStatus.Completed);
    }
    result.sort((a, b) => {
      const statusOrder = { [ProjectStatus.Voting]: 0, [ProjectStatus.Active]: 1, [ProjectStatus.Completed]: 2 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      if (projectSort === 'votes') return b.votes - a.votes;
      if (projectSort === 'cost') return b.cost - a.cost;
      return b.id - a.id;
    });
    return result;
  }, [projects, projectFilter, projectSort]);

  // --- Handlers ---
  const handleLogout = () => {
    setCurrentView('dashboard');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setUsers(prev => prev.map(u =>
      u.id === currentUser.id
        ? { ...u, name: profileName, username: profileUser, password: profilePass }
        : u
    ));
    setCurrentUser(prev => prev ? { ...prev, name: profileName, username: profileUser, password: profilePass } : null);
    alert("تم تحديث الملف الشخصي بنجاح");
  };

  const processMonthlyDeductions = () => {
    if (!window.confirm("هل أنت متأكد من تنفيذ الاستقطاعات الشهرية؟")) return;
    const activeUsers = users.filter(u => u.status === UserStatus.Active);
    const newTransactions: Transaction[] = activeUsers.map(user => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      userId: user.id,
      type: TransactionType.Deposit,
      amount: user.monthlyPledge,
      date: new Date().toISOString(),
      description: "استقطاع شهري تلقائي"
    }));
    setTransactions(prev => [...prev, ...newTransactions]);
    alert("تم تنفيذ الاستقطاعات بنجاح.");
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmount);
    if (!amount || !expenseDesc) return;
    const newTransaction: Transaction = {
      id: Date.now(),
      type: TransactionType.Expense,
      amount: amount,
      description: expenseDesc,
      date: new Date().toISOString(),
      projectId: expenseProjectId ? Number(expenseProjectId) : undefined
    };
    setTransactions(prev => [...prev, newTransaction]);
    setExpenseAmount('');
    setExpenseDesc('');
    setExpenseProjectId('');
    alert("تم تسجيل المصروف.");
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (userFormPhone.length < 8) {
      alert("يرجى إدخال رقم هاتف صحيح مكون من 8 أرقام.");
      return;
    }

    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, name: userFormName, phone: userFormPhone, monthlyPledge: parseFloat(userFormPledge), joinDate: userFormJoinDate || u.joinDate } : u));
    } else {
      const newUser: User = {
        id: Date.now(),
        name: userFormName,
        phone: userFormPhone,
        monthlyPledge: parseFloat(userFormPledge),
        joinDate: userFormJoinDate || new Date().toISOString().split('T')[0],
        status: UserStatus.Active,
        role: UserRole.Member
      };
      setUsers(prev => [...prev, newUser]);
    }
    setIsUserModalOpen(false);
  };

  const toggleUserStatus = (user: User) => {
    const isActive = user.status === UserStatus.Active;
    if (window.confirm(isActive ? `تجميد حساب ${user.name}؟` : `تنشيط حساب ${user.name}؟`)) {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: isActive ? UserStatus.Inactive : UserStatus.Active } : u));
    }
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف العضو ${userName} نهائياً؟ لا يمكن التراجع عن هذه الخطوة.`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, title: projectFormTitle, description: projectFormDesc, cost: parseFloat(projectFormCost), status: projectFormStatus, image: projectFormImage } : p));
    } else {
      const newProject: Project = { id: Date.now(), title: projectFormTitle, description: projectFormDesc, cost: parseFloat(projectFormCost), status: projectFormStatus, votes: 0, votedUserIds: [], image: projectFormImage };
      setProjects(prev => [...prev, newProject]);
    }
    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (projectId: number, projectTitle: string) => {
    if (window.confirm(`هل أنت متأكد من حذف المشروع "${projectTitle}"؟ سيؤدي ذلك لحذف جميع السجلات المرتبطة به.`)) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
  };

  const handleDeleteTransaction = (transactionId: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذه العملية المالية؟")) {
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    }
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;

    setTransactions(prev => prev.map(t =>
      t.id === editingTransaction.id
        ? {
          ...t,
          description: transFormDesc,
          amount: parseFloat(transFormAmount),
          date: new Date(transFormDate).toISOString(),
          projectId: transFormProjectId ? Number(transFormProjectId) : undefined
        }
        : t
    ));
    setIsTransactionModalOpen(false);
  };

  const handleShareWhatsApp = (project: Project) => {
    const message = `تحية طيبة، أود مشاركتكم تفاصيل مبادرة جديدة في صندوق العائلة:
🔹 *المشروع:* ${project.title}
💰 *التكلفة:* ${formatCurrency(project.cost)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // --- Sub-View Renders ---


  const renderGeneralSettings = () => (
    <div className="space-y-12">
      {/* Page Header Description */}
      <div className="bg-gradient-to-r from-primary/10 to-transparent p-8 rounded-[2rem] border-r-8 border-primary">
        <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">الإعدادات العامة للنظام</h3>
        <p className="text-gray-500 dark:text-gray-400 font-bold">تحكم في مظهر التطبيق، بيانات الحساب، والخيارات المتقدمة للشاشة الرئيسية.</p>
      </div>

      <div className="flex flex-col gap-10">
        {/* Home Screen Control Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-700 shadow-xl transition-all hover:shadow-2xl lg:col-span-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-600"><Megaphone className="w-8 h-8" /></div>
              <div>
                <h3 className="text-2xl font-black dark:text-white">الإعلانات والتحكم الرئيسي</h3>
                <p className="text-xs text-gray-400 font-bold">إدارة ما يظهر للأعضاء في الشاشة الرئيسية</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
            {/* Announcement Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">نص الإعلان الحالي</label>
                {announcement && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black">نشط الآن</span>}
              </div>
              <div className="relative">
                <textarea
                  rows={4}
                  value={announcementInput}
                  onChange={(e) => setAnnouncementInput(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-[2rem] px-8 py-8 font-bold outline-none focus:border-amber-500/30 focus:bg-white dark:focus:bg-gray-750 transition-all resize-none shadow-inner dark:text-white text-xl leading-relaxed"
                  placeholder="اكتب التنبيه أو الإعلان الذي سيظهر للجميع..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => { setAnnouncement(announcementInput); alert('تم نشر الإعلان بنجاح'); }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black py-5 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-lg border-b-4 border-amber-800 active:border-b-0"
                >
                  نشر الإعلان
                </button>
                <button
                  onClick={() => { setAnnouncement(''); setAnnouncementInput(''); alert('تم إخفاء الإعلان'); }}
                  className="px-10 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-black py-5 rounded-2xl hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-200"
                >
                  إخفاء
                </button>
              </div>
            </div>

            {/* Quick Access Tools & Balance */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">إعدادات سريعة</h4>
                {[
                  { label: 'إحصائيات الصندوق', desc: 'إظهار مبالغ الرصيد والأعضاء', state: showStats, setter: setShowStats, icon: LayoutDashboard, color: 'blue' },
                  { label: 'أرشيف المبادرات', desc: 'عرض المشاريع التي انجزت بنجاح', state: showCompleted, setter: setShowCompleted, icon: Briefcase, color: 'purple' }
                ].map((tool, idx) => (
                  <button
                    key={idx}
                    onClick={() => tool.setter(!tool.state)}
                    className={`group p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between shadow-sm hover:shadow-md ${tool.state ? `bg-${tool.color}-50 dark:bg-${tool.color}-900/10 border-${tool.color}-100 dark:border-${tool.color}-900/30` : 'bg-gray-50 dark:bg-gray-700 border-transparent'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl transition-colors ${tool.state ? `bg-${tool.color}-500 text-white shadow-lg` : 'bg-gray-200 dark:bg-gray-600 text-gray-400'}`}>
                        <tool.icon className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <div className={`font-black text-sm ${tool.state ? `text-${tool.color}-700 dark:text-${tool.color}-300` : 'text-gray-400'}`}>{tool.label}</div>
                        <div className="text-[10px] text-gray-400 font-bold">{tool.desc}</div>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${tool.state ? 'bg-teal-500 shadow-inner' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-md ${tool.state ? 'left-1' : 'left-7'}`}></div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-8 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/10 dark:to-teal-900/20 rounded-[2.5rem] border border-teal-200/50 dark:border-teal-900/30 shadow-inner">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-teal-500 rounded-lg text-white"><Wallet className="w-5 h-5" /></div>
                  <label className="text-[10px] font-black text-teal-700 dark:text-teal-400 uppercase tracking-widest">تحكم الرصيد الافتتاحي (د.ك)</label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={startingBalance || ''}
                    onChange={e => setStartingBalance(Number(e.target.value))}
                    className="w-full pr-8 pl-6 py-5 bg-white dark:bg-gray-800 border-2 border-teal-500/10 rounded-[1.5rem] font-black text-3xl outline-none focus:border-teal-500/40 transition-all text-center text-teal-600 shadow-sm"
                    placeholder="0"
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 left-8 text-[10px] font-black text-teal-400 uppercase">دينار كويتي</div>
                </div>
                <div className="mt-4 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-teal-600/50 mt-1 shrink-0" />
                  <p className="text-[9px] font-bold text-teal-600/60 leading-relaxed italic">سيُضاف هذا المبلغ مباشرة إلى "الرصيد المتاح" في الواجهة الرئيسية بجانب نواتج العمليات المالية المسجلة.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Selection Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-700 shadow-xl transition-all hover:shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary"><Sun className="w-8 h-8" /></div>
            <div>
              <h3 className="text-2xl font-black dark:text-white">مظهر التطبيق</h3>
              <p className="text-xs text-gray-400 font-bold">اختر الوضع المفضل لعينيك</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { id: 'light', label: 'فاتح', icon: Sun, color: 'text-amber-500' },
              { id: 'dark', label: 'داكن', icon: Moon, color: 'text-indigo-400' },
              { id: 'system', label: 'تلقائي', icon: Monitor, color: 'text-teal-500' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setTheme(mode.id as ThemeMode)}
                className={`group flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 transition-all duration-300 ${theme === mode.id ? 'bg-primary/5 border-primary shadow-lg ring-4 ring-primary/10' : 'bg-gray-50 dark:bg-gray-700 border-transparent hover:border-gray-200 dark:hover:border-gray-600'}`}
              >
                <mode.icon className={`w-10 h-10 transition-transform group-hover:scale-110 ${theme === mode.id ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`font-black text-sm ${theme === mode.id ? 'text-primary' : 'text-gray-400'}`}>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Admin Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-700 shadow-xl transition-all hover:shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-teal-500/10 rounded-2xl text-teal-600"><ShieldCheck className="w-8 h-8" /></div>
            <div>
              <h3 className="text-2xl font-black dark:text-white">حساب المسؤول</h3>
              <p className="text-xs text-gray-400 font-bold">تأمين وتحديث بيانات الدخول</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {[
              { value: profileName, setter: setProfileName, icon: UserIcon, placeholder: 'الاسم الكامل' },
              { value: profileUser, setter: setProfileUser, icon: ShieldCheck, placeholder: 'اسم المستخدم' },
              { value: profilePass, setter: setProfilePass, icon: Lock, placeholder: 'كلمة المرور الجديدة', type: 'password' }
            ].map((field, idx) => (
              <div key={idx} className="relative group">
                <field.icon className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors w-5 h-5" />
                <input
                  required
                  type={field.type || 'text'}
                  value={field.value}
                  onChange={e => field.setter(e.target.value)}
                  className="w-full pr-14 pl-6 py-5 bg-gray-50 dark:bg-gray-700 dark:text-white border-2 border-transparent rounded-3xl font-bold outline-none focus:border-teal-500/30 focus:bg-white dark:focus:bg-gray-750 transition-all text-lg"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-teal-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 border-b-4 border-teal-900 active:border-b-0 uppercase tracking-widest text-sm">
              <Save className="w-5 h-5" />
              <span>تحديث البيانات</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderManageAdmin = () => (
    <div className="space-y-10">
      {/* Subscription Collection Card */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-4 flex items-center gap-4">
            <LayoutGrid className="w-8 h-8" /> تحصيل الاشتراكات
          </h3>
          <p className="opacity-90 font-bold text-lg max-w-lg leading-relaxed">تشغيل خصم الاشتراكات الشهرية لجميع الأعضاء بضغطة واحدة.</p>
        </div>
        <button
          onClick={processMonthlyDeductions}
          className="relative z-10 bg-white text-indigo-800 font-black py-5 px-10 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-300 border-2 border-transparent hover:border-white/50 text-xl"
        >
          تنفيذ الاستقطاع
        </button>
      </div>

      {/* Expenses Management Card */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-700 shadow-xl transition-colors">
        <h3 className="text-2xl font-black mb-8 flex items-center gap-3 dark:text-white">
          <Coins className="w-7 h-7 text-red-500" />
          <span>تسجيل مصروفات</span>
        </h3>
        <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            required
            value={expenseDesc}
            onChange={e => setExpenseDesc(e.target.value)}
            className="md:col-span-2 w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
            placeholder="بيان المصروف"
          />
          <div className="relative">
            <input
              type="number"
              required
              value={expenseAmount}
              onChange={e => setExpenseAmount(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
              placeholder="المبلغ"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">د.ك</span>
          </div>
          <select
            value={expenseProjectId}
            onChange={e => setExpenseProjectId(Number(e.target.value))}
            className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg appearance-none cursor-pointer"
          >
            <option value="">عام / نثريات</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <button type="submit" className="md:col-span-2 bg-red-500 text-white font-black py-5 rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 text-xl border-b-4 border-red-700 active:border-b-0">تأكيد عملية الصرف</button>
        </form>
      </div>

      {/* Transactions Log Section */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-700 shadow-xl transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <h3 className="text-2xl font-black flex items-center gap-3 dark:text-white">
            <LayoutDashboard className="w-7 h-7 text-primary" />
            <span>سجل العمليات المالية</span>
          </h3>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-initial">
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={transactionTypeFilter}
                onChange={e => setTransactionTypeFilter(e.target.value as any)}
                className="pr-10 pl-4 py-2.5 bg-gray-50 dark:bg-gray-700 dark:text-white border border-transparent rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
              >
                <option value="all">الكل</option>
                <option value={TransactionType.Deposit}>إيداعات +</option>
                <option value={TransactionType.Expense}>مصروفات -</option>
              </select>
            </div>

            <div className="relative flex-grow md:max-w-xs">
              <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={transactionSearch}
                onChange={e => setTransactionSearch(e.target.value)}
                placeholder="بحث في البيان..."
                className="w-full pr-10 pl-4 py-2.5 bg-gray-50 dark:bg-gray-700 dark:text-white border border-transparent rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-gray-50 dark:border-gray-700 shadow-inner">
          <table className="w-full text-right">
            <thead className="bg-gray-50/50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-5">تاريخ العملية</th>
                <th className="px-6 py-5">البيان / الوصف</th>
                <th className="px-6 py-5">المبلغ</th>
                <th className="px-6 py-5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {transactions
                .filter(t => {
                  const matchesType = transactionTypeFilter === 'all' || t.type === transactionTypeFilter;
                  const matchesSearch = t.description.toLowerCase().includes(transactionSearch.toLowerCase());
                  return matchesType && matchesSearch;
                })
                .slice().reverse()
                .map(t => (
                  <tr key={t.id} className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                    <td className="px-6 py-5 text-sm font-bold text-gray-500">{new Date(t.date).toLocaleDateString('ar-KW')}</td>
                    <td className="px-6 py-5 text-sm font-black text-gray-800 dark:text-white">{t.description}</td>
                    <td className={`px-6 py-5 text-lg font-black ${t.type === TransactionType.Deposit ? 'text-teal-600' : 'text-red-500'}`}>
                      {t.type === TransactionType.Deposit ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTransaction(t);
                            setTransFormDesc(t.description);
                            setTransFormAmount(t.amount.toString());
                            setTransFormDate(new Date(t.date).toISOString().split('T')[0]);
                            setTransFormProjectId(t.projectId || '');
                            setIsTransactionModalOpen(true);
                          }}
                          className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(t.id)}
                          className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderManageProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black dark:text-white">إدارة المشاريع والمبادرات</h3><button onClick={() => { setEditingProject(null); setProjectFormTitle(''); setProjectFormDesc(''); setProjectFormCost(''); setIsProjectModalOpen(true); }} className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all"><PlusCircle className="w-5 h-5 ml-2" />إضافة مشروع</button></div>
      <div className="grid gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between group hover:border-primary transition-all">
            <div className="flex items-center gap-6">
              {p.image && <img src={p.image} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />}
              <div>
                <h4 className="font-black text-xl mb-1 group-hover:text-primary transition-colors dark:text-white">{p.title}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400">{formatCurrency(p.cost)}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${p.status === ProjectStatus.Voting ? 'bg-red-100 text-red-700' : p.status === ProjectStatus.Active ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {p.status === ProjectStatus.Active ? 'قيد التنفيذ' : p.status === ProjectStatus.Voting ? 'تصويت' : 'مكتمل'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setEditingProject(p); setProjectFormTitle(p.title); setProjectFormDesc(p.description); setProjectFormCost(p.cost.toString()); setProjectFormStatus(p.status); setProjectFormImage(p.image || ''); setIsProjectModalOpen(true); }} className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit className="w-6 h-6" /></button>
              <button onClick={() => handleDeleteProject(p.id, p.title)} className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 className="w-6 h-6" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderManageMembers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black dark:text-white">إدارة أعضاء العائلة</h3><button onClick={() => { setEditingUser(null); setUserFormName(''); setUserFormPhone(''); setUserFormPledge('10'); setUserFormJoinDate(''); setIsUserModalOpen(true); }} className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all"><PlusCircle className="w-5 h-5 ml-2" />إضافة عضو</button></div>

      <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-[2rem] p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-1">إجمالي الاستقطاعات</h4>
          <p className="text-3xl font-black text-gray-800 dark:text-white">
            {formatCurrency(users.reduce((acc, u) => acc + calculateTotalContribution(u), 0))}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <span className="block text-[10px] font-black text-gray-400 uppercase">إجمالي المشتركين</span>
            <span className="text-xl font-black text-gray-800 dark:text-white">{users.length}</span>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
          <div className="text-center">
            <span className="block text-[10px] font-black text-gray-400 uppercase">التحصيل الشهري</span>
            <span className="text-xl font-black text-teal-600">{formatCurrency(users.reduce((acc, u) => acc + u.monthlyPledge, 0))}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between group hover:shadow-lg hover:border-teal-200 transition-all">
            <div className="flex-1">
              <div className="font-black text-xl mb-1 dark:text-white">{u.name}</div>
              <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{u.role === UserRole.Admin ? 'مدير النظام' : 'عضو مساهم'}</div>
              <div className="flex items-center gap-2 mt-3 text-gray-500 font-bold text-sm" dir="ltr">
                <Phone className="w-4 h-4 text-primary" />
                <span>+965 {u.phone}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-gray-400 font-bold text-xs">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>انضم في: {u.joinDate ? new Date(u.joinDate).toLocaleDateString('ar-KW') : 'غير محدد'}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="text-[10px] font-black text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 rounded-lg w-fit flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5" />
                  {formatCurrency(u.monthlyPledge)} شهرياً
                </div>
                <div className="text-[10px] font-black text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg w-fit flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5" />
                  إجمالي الاستقطاع: {formatCurrency(calculateTotalContribution(u))}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={() => { setEditingUser(u); setUserFormName(u.name); setUserFormPhone(u.phone); setUserFormPledge(u.monthlyPledge.toString()); setUserFormJoinDate(u.joinDate); setIsUserModalOpen(true); }} className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl transition-all hover:bg-blue-600 hover:text-white shadow-sm" title="تعديل"><Edit className="w-5 h-5" /></button>
              <button onClick={() => toggleUserStatus(u)} className={`p-4 rounded-2xl transition-all shadow-sm ${u.status === UserStatus.Active ? 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'}`} title={u.status === UserStatus.Active ? 'تجميد' : 'تفعيل'}>{u.status === UserStatus.Active ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}</button>
              <button onClick={() => handleDeleteUser(u.id, u.name)} className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl transition-all hover:bg-red-600 hover:text-white shadow-sm" title="حذف"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- Main Render ---

  return (
    <Layout currentUser={currentUser} onLogout={handleLogout} currentView={currentView} setView={setCurrentView}>
      {currentView === 'dashboard' ? (
        <>
          {announcement && (
            <div className="mb-10 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-[2.5rem] p-8 flex items-start gap-6 shadow-sm animate-in slide-in-from-top duration-500 transition-colors">
              <div className="bg-amber-100 dark:bg-amber-900/40 p-4 rounded-full shrink-0"><Megaphone className="w-8 h-8 text-amber-600 dark:text-amber-500" /></div>
              <div>
                <h3 className="font-black text-amber-800 dark:text-amber-400 text-xl mb-2">إعلان هام من إدارة الصندوق</h3>
                <p className="text-amber-700 dark:text-amber-300 font-bold leading-relaxed text-lg">{announcement}</p>
              </div>
            </div>
          )}

          {showStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <StatCard title="الرصيد المتاح" value={formatCurrency(totalFundBalance)} icon={Wallet} colorClass="bg-teal-500 text-teal-600" />
              <StatCard title="الأعضاء الفاعلون" value={users.filter(u => u.status === UserStatus.Active).length.toString()} icon={Users} colorClass="bg-purple-500 text-purple-600" />
              <StatCard title="المشاريع القائمة" value={projects.filter(p => p.status === ProjectStatus.Active).length.toString()} icon={TrendingUp} colorClass="bg-orange-500 text-orange-600" />
            </div>
          )}

          <div className="mb-16">
            <h2 className="text-3xl font-black border-r-8 border-primary pr-4 mb-10 text-gray-800 dark:text-white">المبادرات والمشاريع الحالية</h2>
            <div className="flex flex-col gap-10">
              {filteredAndSortedProjects.map(project => (
                <div key={project.id} className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                  {project.image && (
                    <div className="h-56 w-full overflow-hidden relative">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-6 right-8">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ${project.status === ProjectStatus.Voting ? 'bg-red-500 text-white' : project.status === ProjectStatus.Active ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'}`}>
                          {project.status === ProjectStatus.Active ? 'قيد التنفيذ' : project.status === ProjectStatus.Voting ? 'تصويت' : 'مكتمل'}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-10 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-tight">{project.title}</h3>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-10 font-bold leading-relaxed text-lg flex-grow">{project.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-gray-50 dark:border-gray-700">
                      <button onClick={() => handleShareWhatsApp(project)} className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all hover:bg-green-600 hover:text-white shadow-sm"><MessageCircle className="w-6 h-6" /> مشاركة</button>
                      <div className="bg-gray-50 dark:bg-gray-700 px-8 py-4 rounded-2xl font-black text-gray-800 dark:text-white text-xl border border-gray-100 dark:border-gray-600">{formatCurrency(project.cost)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-black mb-10 text-gray-800 dark:text-white">آخر العمليات المالية المنفذة</h2>
            <div className="bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-lg">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                      <th className="px-10 py-6 text-start font-black text-gray-400 dark:text-gray-500 text-xs uppercase tracking-[0.2em]">التاريخ</th>
                      <th className="px-10 py-6 text-start font-black text-gray-400 dark:text-gray-500 text-xs uppercase tracking-[0.2em]">البيان</th>
                      <th className="px-10 py-6 text-start font-black text-gray-400 dark:text-gray-500 text-xs uppercase tracking-[0.2em]">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {transactions.slice().reverse().slice(0, 6).map(t => (
                      <tr key={t.id} className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300">
                        <td className="px-10 py-7 text-gray-400 font-bold">{new Date(t.date).toLocaleDateString('ar-EG')}</td>
                        <td className="px-10 py-7 font-black text-gray-800 dark:text-white">{t.description}</td>
                        <td className={`px-10 py-7 font-black text-xl ${t.type === TransactionType.Deposit ? 'text-teal-600' : 'text-red-500'}`}>
                          {t.type === TransactionType.Deposit ? '+' : '-'}{formatCurrency(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-8 bg-gray-50/30 dark:bg-gray-900 border-t border-gray-50 dark:border-gray-700 text-center">
                <span className="text-gray-400 font-bold text-sm">عرض آخر 6 عمليات فقط</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <h2 className="text-4xl font-black text-gray-800 dark:text-white flex items-center gap-4">
              <ShieldCheck className="w-10 h-10 text-primary" /> لوحة التحكم الإدارية
            </h2>
          </div>

          <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
            <button onClick={() => setCurrentView('settings')} className={`px-8 py-4 rounded-[1.5rem] font-black text-lg transition-all duration-300 whitespace-nowrap shadow-sm ${currentView === 'settings' ? 'bg-primary text-white shadow-primary/20' : 'bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}>الإعدادات العامة</button>
            <button onClick={() => setCurrentView('users')} className={`px-8 py-4 rounded-[1.5rem] font-black text-lg transition-all duration-300 whitespace-nowrap shadow-sm ${currentView === 'users' ? 'bg-primary text-white shadow-primary/20' : 'bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}>إدارة الأعضاء</button>
            <button onClick={() => setCurrentView('manage-projects')} className={`px-8 py-4 rounded-[1.5rem] font-black text-lg transition-all duration-300 whitespace-nowrap shadow-sm ${currentView === 'manage-projects' ? 'bg-primary text-white shadow-primary/20' : 'bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}>إدارة المشاريع</button>
            <button onClick={() => setCurrentView('manage-admin')} className={`px-8 py-4 rounded-[1.5rem] font-black text-lg transition-all duration-300 whitespace-nowrap shadow-sm ${currentView === 'manage-admin' ? 'bg-teal-600 text-white shadow-teal-600/20' : 'bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}>العمليات المالية</button>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentView === 'settings' && renderGeneralSettings()}
            {currentView === 'users' && renderManageMembers()}
            {currentView === 'manage-projects' && renderManageProjects()}
            {currentView === 'manage-admin' && renderManageAdmin()}
          </div>
        </div>
      )}

      {/* Admin Modals */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-[100] p-4 transition-colors">
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="bg-primary p-8 text-white flex justify-between items-center shadow-lg"><h3 className="font-black text-2xl">{editingUser ? 'تعديل بيانات العضو' : 'إضافة عضو جديد'}</h3><button onClick={() => setIsUserModalOpen(false)} className="hover:rotate-90 transition-transform bg-white/20 p-2 rounded-full"><ArrowRight className="w-6 h-6 rotate-45" /></button></div>
            <form onSubmit={handleSaveUser} className="p-10 space-y-8">
              <div>
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mr-2 block mb-3">الاسم الكامل للعضو</label>
                <input required type="text" value={userFormName} onChange={e => setUserFormName(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] px-8 py-5 font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg" placeholder="أحمد محمد علي" />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mr-2 block mb-3">رقم الهاتف (8 خانات)</label>
                <div className="relative" dir="ltr">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-black text-lg flex items-center gap-3 border-r border-gray-200 dark:border-gray-600 pr-4 h-8">
                    <img src="https://flagcdn.com/kw.svg" className="w-6 h-4 object-cover rounded-sm shadow-sm" alt="KW" />
                    <span>+965</span>
                  </div>
                  <input
                    required
                    type="tel"
                    value={userFormPhone}
                    onChange={handlePhoneInput(setUserFormPhone)}
                    className="w-full pl-36 pr-8 py-5 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] font-black text-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all tracking-[0.2em]"
                    placeholder="XXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mr-2 block mb-3">تاريخ الانضمام</label>
                <input
                  type="date"
                  value={userFormJoinDate}
                  onChange={e => setUserFormJoinDate(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] px-8 py-5 font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg"
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mr-2 block mb-3">مبلغ الاشتراك (د.ك)</label>
                <input required type="number" value={userFormPledge} onChange={e => setUserFormPledge(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] px-8 py-5 font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all text-xl" placeholder="10" />
              </div>

              <button type="submit" className="w-full bg-primary text-white font-black py-6 rounded-[1.5rem] shadow-xl shadow-primary/20 transition-all active:scale-95 text-xl border-b-4 border-teal-800 active:border-b-0">حفظ بيانات العضو</button>
            </form>
          </div>
        </div>
      )}

      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-[100] p-4 transition-colors">
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="bg-primary p-8 text-white flex justify-between items-center shadow-lg"><h3 className="font-black text-2xl">تفاصيل المبادرة الجديدة</h3><button onClick={() => setIsProjectModalOpen(false)} className="hover:rotate-90 transition-transform bg-white/20 p-2 rounded-full"><ArrowRight className="w-6 h-6 rotate-45" /></button></div>
            <form onSubmit={handleSaveProject} className="p-10 space-y-8">
              <input required type="text" value={projectFormTitle} onChange={e => setProjectFormTitle(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] px-8 py-5 font-bold outline-none text-xl" placeholder="عنوان المبادرة..." />
              <textarea required rows={4} value={projectFormDesc} onChange={e => setProjectFormDesc(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] px-8 py-5 font-bold resize-none outline-none text-lg leading-relaxed" placeholder="صف المبادرة وأهدافها..." />

              <div>
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mr-2 block mb-3">صورة المشروع</label>
                <div className="space-y-4">
                  {projectFormImage && (
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                      <img src={projectFormImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProjectFormImage('')}
                        className="absolute top-4 right-4 bg-red-500 text-white p-2.5 rounded-full shadow-xl hover:bg-red-600 transition-all active:scale-95"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <LayoutGrid className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="url"
                        value={projectFormImage}
                        onChange={e => setProjectFormImage(e.target.value)}
                        className="w-full pr-12 pl-6 py-5 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                        placeholder="رابط الصورة الخارجـي..."
                      />
                    </div>

                    <label className="flex items-center justify-center gap-3 pr-6 pl-6 py-5 bg-primary/5 text-primary border-2 border-dashed border-primary/20 rounded-[1.5rem] font-black cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-all text-sm group">
                      <PlusCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span>رفع صورة مـن الجهاز</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileChange(setProjectFormImage)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="relative">
                  <input required type="number" value={projectFormCost} onChange={e => setProjectFormCost(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] px-8 py-5 font-black outline-none text-xl" placeholder="الميزانية" />
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">د.ك</span>
                </div>
                <select value={projectFormStatus} onChange={e => setProjectFormStatus(e.target.value as ProjectStatus)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] px-8 py-5 font-black outline-none focus:ring-4 focus:ring-primary/10 cursor-pointer text-lg"><option value={ProjectStatus.Voting}>مرحلة التصويت</option><option value={ProjectStatus.Active}>قيد التنفيذ</option><option value={ProjectStatus.Completed}>مشروع مكتمل</option></select>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-black py-6 rounded-[1.5rem] shadow-xl shadow-primary/20 transition-all active:scale-95 text-xl border-b-4 border-teal-800 active:border-b-0">حفظ ونشر المبادرة</button>
            </form>
          </div>
        </div>
      )}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-[100] p-4 transition-colors">
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="bg-primary p-8 text-white flex justify-between items-center shadow-lg">
              <h3 className="font-black text-2xl">تعديل العملية المالية</h3>
              <button onClick={() => setIsTransactionModalOpen(false)} className="hover:rotate-90 transition-transform bg-white/20 p-2 rounded-full">
                <ArrowRight className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSaveTransaction} className="p-10 space-y-8">
              <div>
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mr-2 block mb-3">البيان / الوصف</label>
                <input required type="text" value={transFormDesc} onChange={e => setTransFormDesc(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] px-8 py-5 font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mr-2 block mb-3">المبلغ (د.ك)</label>
                  <input required type="number" value={transFormAmount} onChange={e => setTransFormAmount(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] px-8 py-5 font-black outline-none text-xl" />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mr-2 block mb-3">التاريخ</label>
                  <input required type="date" value={transFormDate} onChange={e => setTransFormDate(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] px-8 py-5 font-bold outline-none text-lg" />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mr-2 block mb-3">المشروع المرتبط (اختياري)</label>
                <select
                  value={transFormProjectId}
                  onChange={e => setTransFormProjectId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-[1.5rem] px-8 py-5 font-bold outline-none cursor-pointer"
                >
                  <option value="">عام / نثريات</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>

              <button type="submit" className="w-full bg-primary text-white font-black py-6 rounded-[1.5rem] shadow-xl shadow-primary/20 transition-all active:scale-95 text-xl border-b-4 border-teal-800 active:border-b-0">
                حفظ التغييرات
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
