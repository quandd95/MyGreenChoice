import React, { useState } from 'react';
import { X, UserCheck, Shield, GraduationCap, Lock, Mail, User, CheckCircle2, Sparkles } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserRole, UserProfile } from '../types/aiImpact';
import { INITIAL_STUDENT_USER, INITIAL_TEACHER_USER, GUEST_USER } from '../data/aiImpactData';
import { sounds } from '../utils/soundEffects';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: UserRole;
}

interface StoredAccount extends UserProfile {
  password?: string;
}

const LOCAL_STORAGE_USERS_KEY = 'ai_impact_registered_users';
const LOCAL_STORAGE_SESSION_KEY = 'ai_impact_current_user';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'student',
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>(initialRole || 'student');

  React.useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole, isOpen]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [classId, setClassId] = useState('Lớp 5A');
  const [groupName, setGroupName] = useState('Nhóm Mầm Xanh');
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper to get local stored accounts
  const getStoredAccounts = (): StoredAccount[] => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  // Helper to save local stored accounts
  const saveStoredAccount = (acc: StoredAccount) => {
    try {
      const list = getStoredAccounts().filter((u) => u.email.toLowerCase() !== acc.email.toLowerCase());
      list.push(acc);
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(list));
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(acc));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  };

  // Handle Form Submit (Register / Login)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');
    setIsLoading(true);

    const cleanEmail = email.trim();
    const cleanDisplayName = displayName.trim();

    try {
      if (mode === 'register') {
        let userId = '';
        let firebaseAuthSuccess = false;

        // 1. Try Firebase Auth native creation
        try {
          const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          userId = userCred.user.uid;
          firebaseAuthSuccess = true;
        } catch (authErr: unknown) {
          const errString = authErr instanceof Error ? authErr.message : String(authErr);
          // If Email/Password is not enabled on Firebase backend or throws operation-not-allowed
          if (errString.includes('operation-not-allowed') || errString.includes('auth/')) {
            // Generate resilient persistent ID
            userId = 'usr_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
          } else {
            throw authErr;
          }
        }

        // 2. Build complete UserProfile
        const newProfile: StoredAccount = {
          id: userId,
          email: cleanEmail,
          displayName: cleanDisplayName || (role === 'teacher' ? 'Thầy/Cô Giáo' : 'Học Sinh Mới'),
          role,
          classId: role === 'student' ? classId : undefined,
          groupName: role === 'student' ? groupName : undefined,
          avatar: role === 'teacher' ? '/assets/ai_impact/teacher_icon.png' : '/assets/extracted/student_big_avatar.png',
          password,
        };

        // 3. Persist into Firebase Firestore
        try {
          await setDoc(doc(db, 'users', userId), {
            id: newProfile.id,
            email: newProfile.email,
            displayName: newProfile.displayName,
            role: newProfile.role,
            classId: newProfile.classId || null,
            groupName: newProfile.groupName || null,
            avatar: newProfile.avatar,
            createdAt: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn('Firestore write warning:', dbErr);
        }

        // 4. Save to Local Accounts registry for instant future logins
        saveStoredAccount(newProfile);

        sounds.playSuccess();
        onLoginSuccess(newProfile);
        onClose();
      } else {
        // LOGIN MODE
        let authenticatedUser: UserProfile | null = null;

        // Try Firebase native sign in first
        try {
          const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
          const snap = await getDoc(doc(db, 'users', userCred.user.uid));
          if (snap.exists()) {
            authenticatedUser = snap.data() as UserProfile;
          } else {
            authenticatedUser = {
              id: userCred.user.uid,
              email: userCred.user.email || cleanEmail,
              displayName: userCred.user.displayName || (role === 'teacher' ? 'Giáo viên' : 'Học sinh'),
              role,
              avatar: role === 'teacher' ? '/assets/ai_impact/teacher_icon.png' : '/assets/extracted/student_big_avatar.png',
            };
          }
        } catch {
          // If Firebase Auth fails (e.g. operation-not-allowed or local account)
          // Search stored accounts
          const stored = getStoredAccounts();
          const match = stored.find(
            (u) => u.email.toLowerCase() === cleanEmail.toLowerCase() && (!u.password || u.password === password)
          );

          if (match) {
            authenticatedUser = match;
          } else {
            // Also check Firestore users collection directly
            try {
              const snapshot = await getDocs(collection(db, 'users'));
              snapshot.forEach((d) => {
                const data = d.data() as StoredAccount;
                if (data.email && data.email.toLowerCase() === cleanEmail.toLowerCase()) {
                  authenticatedUser = data;
                }
              });
            } catch {}

            // Admin instant access fallback if email contains admin
            if (!authenticatedUser && cleanEmail.toLowerCase().includes('admin')) {
              authenticatedUser = {
                id: 'admin_' + Date.now(),
                email: cleanEmail,
                displayName: cleanDisplayName || 'Quản Trị Viên (Giáo Viên)',
                role: 'teacher',
                avatar: '/assets/ai_impact/teacher_icon.png',
              };
              saveStoredAccount({ ...authenticatedUser, password });
            }
          }
        }

        if (authenticatedUser) {
          // Update session
          localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(authenticatedUser));
          sounds.playSuccess();
          onLoginSuccess(authenticatedUser);
          onClose();
        } else {
          setErrorMsg('Email hoặc mật khẩu chưa chính xác. Bạn có thể nhấn tab "Đăng ký tài khoản" để tạo tài khoản mới!');
        }
      }
    } catch (err: unknown) {
      const errString = err instanceof Error ? err.message : String(err);
      if (errString.includes('auth/invalid-credential') || errString.includes('auth/wrong-password')) {
        setErrorMsg('Email hoặc mật khẩu không chính xác.');
      } else if (errString.includes('auth/email-already-in-use')) {
        setErrorMsg('Email này đã được đăng ký. Hãy chuyển sang tab Đăng nhập.');
      } else {
        setErrorMsg(`Lỗi: ${errString}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In (Firebase Native Provider)
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const gUser = result.user;

      let profile: UserProfile;
      const snap = await getDoc(doc(db, 'users', gUser.uid));
      if (snap.exists()) {
        profile = snap.data() as UserProfile;
      } else {
        profile = {
          id: gUser.uid,
          email: gUser.email || '',
          displayName: gUser.displayName || (role === 'teacher' ? 'Giáo viên' : 'Học sinh'),
          role,
          classId: role === 'student' ? classId : undefined,
          groupName: role === 'student' ? groupName : undefined,
          avatar: gUser.photoURL || (role === 'teacher' ? '/assets/ai_impact/teacher_icon.png' : '/assets/extracted/student_big_avatar.png'),
        };
        await setDoc(doc(db, 'users', gUser.uid), profile);
      }

      saveStoredAccount(profile);
      sounds.playSuccess();
      onLoginSuccess(profile);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('popup-closed-by-user')) {
        setErrorMsg(`Đăng nhập Google: ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Instant 1-Click Demo Login helpers
  const handleQuickLogin = (selectedRole: UserRole) => {
    sounds.playStarCoin();
    let user: UserProfile;
    if (selectedRole === 'student') {
      user = INITIAL_STUDENT_USER;
    } else if (selectedRole === 'teacher') {
      user = INITIAL_TEACHER_USER;
    } else {
      user = GUEST_USER;
    }
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(user));
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-emerald-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌱</span>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">
                AI-IMPACT EM KIẾN TẠO
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                {mode === 'login' ? 'Đăng nhập phân quyền hệ thống' : 'Đăng ký tài khoản thành viên'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {/* Tabs: Đăng nhập vs Đăng ký */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-black">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessNotice('');
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'login' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg('');
                setSuccessNotice('');
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'register' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Đăng ký tài khoản
            </button>
          </div>

          {/* Role Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Chọn vai trò của bạn:</label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                  role === 'student'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-black shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black">Học Sinh</div>
                  <div className="text-[10px] text-slate-500">Làm dự án & hỏi AI</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                  role === 'teacher'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-950 font-black shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-200 text-blue-800 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black">Giáo Viên</div>
                  <div className="text-[10px] text-slate-500">Quản lý & duyệt kế hoạch</div>
                </div>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {successNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Họ và tên (*)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="VD: admin hoặc Nguyễn Minh Anh"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email (*)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com hoặc name@truonghoc.edu.vn"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Mật khẩu (*)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {role === 'student' && mode === 'register' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Lớp học</label>
                  <input
                    type="text"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    placeholder="VD: Lớp 5A"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tên nhóm</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="VD: Nhóm Mầm Xanh"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#15803D] hover:bg-[#166534] text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isLoading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng Nhập Ngay' : 'Hoàn Tất Đăng Ký'}</span>
            </button>
          </form>

          {/* Google Sign-in */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="shrink mx-2 text-[10px] font-bold text-slate-400 uppercase">Hoặc</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2 px-3 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Đăng nhập nhanh với Google</span>
          </button>

          {/* Quick Demo Login */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Hoặc thử nghiệm nhanh 1-chạm:
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center text-emerald-900 transition-colors cursor-pointer"
              >
                <div className="text-xs font-black">Học Sinh 🎒</div>
                <div className="text-[10px] text-emerald-700 font-medium truncate">Minh Anh</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('teacher')}
                className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-center text-blue-900 transition-colors cursor-pointer"
              >
                <div className="text-xs font-black">Giáo Viên 👩‍🏫</div>
                <div className="text-[10px] text-blue-700 font-medium truncate">Cô Hoàng Yến</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('guest')}
                className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-center text-purple-900 transition-colors cursor-pointer"
              >
                <div className="text-xs font-black">Khách Tham Quan 🌟</div>
                <div className="text-[10px] text-purple-700 font-medium truncate">Xem mẫu</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
