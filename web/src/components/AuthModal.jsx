import React, { useState } from 'react';
import {
  X, Mail, Lock, User, ShieldCheck, ArrowRight, Building2,
  Tractor, ChevronLeft, Eye, EyeOff, Leaf, Phone, MapPin
} from 'lucide-react';
import { signUpUser, signInUser, getUserProfile } from '../services/firebase.js';

/* ── Friendly error messages ─────────────────────────────────────────────── */
function friendlyError(code, isHi) {
  switch (code) {
    case 'auth/email-already-in-use':
      return isHi ? 'यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।' : 'This email is already registered. Try logging in instead.';
    case 'auth/invalid-email':
      return isHi ? 'कृपया एक मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.';
    case 'auth/weak-password':
      return isHi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return isHi ? 'ईमेल या पासवर्ड अमान्य है। पुनः प्रयास करें।' : 'Incorrect email or password. Please try again.';
    case 'auth/too-many-requests':
      return isHi ? 'बहुत अधिक प्रयास। कृपया कुछ क्षण प्रतीक्षा करें।' : 'Too many attempts. Please wait a moment and try again.';
    default:
      return isHi ? 'कुछ गड़बड़ हुई। कृपया पुनः प्रयास करें।' : 'Something went wrong. Please try again.';
  }
}

export default function AuthModal({ isOpen, onClose, language = 'EN', onLoginSuccess, initialMode = 'login', onSkip }) {
  const isHi = language === 'HI';
  const [isLogin, setIsLogin] = useState(initialMode !== 'signup');
  const [step, setStep] = useState('form'); // 'role' | 'form'
  const [role, setRole] = useState(null);   // 'farmer' | 'buyer'

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setName(''); setEmail(''); setPassword(''); setPhone('');
    setLocation(''); setSoilType(''); setCompanyName('');
    setError(''); setStep('form'); setRole(null);
  };

  const switchMode = (toLogin) => {
    setIsLogin(toLogin);
    resetForm();
    if (!toLogin) setStep('role');
  };

  /* ── Handle Login ─────────────────────────────────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const firebaseUser = await signInUser(email, password);
      const profile = await getUserProfile(firebaseUser.uid);
      if (!profile) throw new Error('User profile not found. Please contact support.');
      onLoginSuccess?.(profile);
      onClose();
    } catch (err) {
      setError(friendlyError(err.code, isHi) || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Handle Signup ────────────────────────────────────────────────────── */
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!role) { setError(isHi ? 'कृपया पहले अपनी भूमिका चुनें।' : 'Please select a role first.'); return; }
    setLoading(true);
    setError('');
    try {
      const userData = {
        name: name.trim(),
        phone: phone.trim(),
        role,
        ...(role === 'farmer'
          ? { location: location.trim(), soilType: soilType.trim() }
          : { companyName: companyName.trim() }
        )
      };
      const firebaseUser = await signUpUser(email, password, userData);
      const profile = await getUserProfile(firebaseUser.uid);
      onLoginSuccess?.(profile);
      onClose();
    } catch (err) {
      setError(friendlyError(err.code, isHi) || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Role Selection Step ─────────────────────────────────────────────── */
  const RoleStep = () => (
    <div className="space-y-5 animate-fade-up">
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-black text-[#2C2416] dark:text-[#F0FDF4]">{isHi ? "एग्रोस्टेट से जुड़ें" : "Join Agrostat"}</h3>
        <p className="text-sm font-medium text-[#5A4F3F] dark:text-[#94A3B8]">
          {isHi ? "आप किस रूप में पंजीकरण करना चाहते हैं?" : "I want to register as a…"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Farmer tile */}
        <button
          type="button"
          onClick={() => { setRole('farmer'); setStep('form'); }}
          className="group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-[#E8DDD0] dark:border-[#263828] hover:border-[#2E7D32] dark:hover:border-[#4ADE80] bg-white dark:bg-[#162217] hover:bg-[#E8F5E9] dark:hover:bg-[#1C3320] transition-all shadow-sm hover:shadow-md"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] dark:bg-[#1C3320] group-hover:bg-white dark:group-hover:bg-[#162217] flex items-center justify-center text-[#2E7D32] dark:text-[#4ADE80] transition-colors border border-[#A5D6A7] dark:border-[#2E5E33]">
            <Tractor className="w-8 h-8" strokeWidth={1.8} />
          </div>
          <div className="text-center">
            <div className="text-base font-black text-[#2C2416] dark:text-[#F0FDF4]">🌾 {isHi ? "किसान" : "Farmer"}</div>
            <div className="text-xs text-[#5A4F3F] dark:text-[#94A3B8] mt-0.5 font-medium">{isHi ? "फसल बेचें, भाव देखें" : "Sell produce, track rates"}</div>
          </div>
        </button>

        {/* Buyer tile */}
        <button
          type="button"
          onClick={() => { setRole('buyer'); setStep('form'); }}
          className="group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-[#E8DDD0] dark:border-[#263828] hover:border-[#D97706] dark:hover:border-[#FBBF24] bg-white dark:bg-[#162217] hover:bg-[#FEF3E2] dark:hover:bg-[#2B2313] transition-all shadow-sm hover:shadow-md"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#FEF3E2] dark:bg-[#2B2313] group-hover:bg-white dark:group-hover:bg-[#162217] flex items-center justify-center text-[#D97706] dark:text-[#FBBF24] transition-colors border border-[#FCD34D] dark:border-[#523E1B]">
            <Building2 className="w-8 h-8" strokeWidth={1.8} />
          </div>
          <div className="text-center">
            <div className="text-base font-black text-[#2C2416] dark:text-[#F0FDF4]">🏢 {isHi ? "व्यापारी" : "Buyer"}</div>
            <div className="text-xs text-[#5A4F3F] dark:text-[#94A3B8] mt-0.5 font-medium">{isHi ? "सीधी खरीद, थोक ऑर्डर" : "Source produce, bulk orders"}</div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
      <div className="card w-full max-w-md p-6 sm:p-8 relative border-2 border-[#F0E6D2] dark:border-[#263828] bg-white dark:bg-[#141F15] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#8C7B6B] dark:text-[#94A3B8] hover:text-[#2C2416] dark:hover:text-[#F0FDF4] hover:bg-[#FDF6E9] dark:hover:bg-[#1E2E20] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header icon */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] dark:bg-[#1C3320] border-2 border-[#A5D6A7] dark:border-[#2E5E33] text-[#2E7D32] dark:text-[#4ADE80] flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6" strokeWidth={2.2} />
          </div>
          <h3 className="text-2xl font-black text-[#2C2416] dark:text-[#F0FDF4]">
            {isLogin 
              ? (isHi ? 'पुनः स्वागत है' : 'Welcome Back')
              : (step === 'role' 
                  ? (isHi ? 'खाता बनाएं' : 'Create Account') 
                  : (isHi ? `${role === 'farmer' ? 'किसान' : 'व्यापारी'} पंजीकरण` : `Register as ${role === 'farmer' ? 'Farmer' : 'Buyer'}`))}
          </h3>
          {step === 'form' && !isLogin && (
            <p className="text-sm font-medium text-[#5A4F3F] dark:text-[#94A3B8]">
              {role === 'farmer' ? (isHi ? '🌾 किसान खाता' : '🌾 Farmer Account') : (isHi ? '🏢 व्यापारी खाता' : '🏢 Buyer Account')}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[#FEE2E2] dark:bg-[#331717] border border-[#FCA5A5] dark:border-[#5E2626] text-sm font-semibold text-[#B91C1C] dark:text-[#F87171]">
            {error}
          </div>
        )}

        {/* ── SIGNUP: Role Selection ─────────────────────────────────────────── */}
        {!isLogin && step === 'role' && <RoleStep />}

        {/* ── SIGNUP: Form ──────────────────────────────────────────────────── */}
        {!isLogin && step === 'form' && (
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Back to role */}
            <button
              type="button"
              onClick={() => setStep('role')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#2E7D32] dark:text-[#4ADE80] hover:underline mb-1"
            >
              <ChevronLeft className="w-4 h-4" /> {isHi ? "भूमिका बदलें" : "Change role"}
            </button>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="field-label dark:text-[#94A3B8] flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#2E7D32] dark:text-[#4ADE80]" /> {isHi ? "पूरा नाम *" : "Full Name *"}
              </label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)}
                placeholder={role === 'farmer' ? (isHi ? 'उदा. गुरमैल सिंह' : 'e.g. Sardar Gurmail Singh') : 'e.g. Rajesh Kumar'}
                className="field-input dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828]" />
            </div>

            {/* Company Name (buyer only) */}
            {role === 'buyer' && (
              <div className="space-y-1">
                <label className="field-label dark:text-[#94A3B8] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#D97706] dark:text-[#FBBF24]" /> {isHi ? "फर्म / कंपनी का नाम" : "Company / Business Name"}
                </label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Agro Traders Pvt. Ltd." className="field-input dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828]" />
              </div>
            )}

            {/* Location (farmer) */}
            {role === 'farmer' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="field-label dark:text-[#94A3B8] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#2E7D32] dark:text-[#4ADE80]" /> {isHi ? "जिला / राज्य" : "Village / District"}
                  </label>
                  <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Ludhiana, PB" className="field-input dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828]" />
                </div>
                <div className="space-y-1">
                  <label className="field-label dark:text-[#94A3B8] flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-[#2E7D32] dark:text-[#4ADE80]" /> {isHi ? "मिट्टी" : "Soil Type"}
                  </label>
                  <select value={soilType} onChange={e => setSoilType(e.target.value)} className="field-input dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828]">
                    <option value="">Select</option>
                    <option value="Loam">Loam / दोमट</option>
                    <option value="Sandy Loam">Sandy Loam / बलुई दोमट</option>
                    <option value="Clay">Clay / चिकनी मिट्टी</option>
                    <option value="Black Cotton Soil">Black Cotton / काली मिट्टी</option>
                    <option value="Alluvial">Alluvial / जलोढ़</option>
                    <option value="Red Soil">Red Soil / लाल मिट्टी</option>
                  </select>
                </div>
              </div>
            )}

            {/* Phone */}
            <div className="space-y-1">
              <label className="field-label dark:text-[#94A3B8] flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#2E7D32] dark:text-[#4ADE80]" /> {isHi ? "मोबाइल नंबर (वैकल्पिक)" : "Phone (optional)"}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sm font-bold text-[#8C7B6B] dark:text-[#94A3B8] border-r border-[#E8DDD0] dark:border-[#263828] pr-2">+91</span>
                <input type="tel" maxLength={10} value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210" className="field-input pl-16 dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828]" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="field-label dark:text-[#94A3B8] flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#2E7D32] dark:text-[#4ADE80]" /> {isHi ? "ईमेल आईडी *" : "Email Address *"}
              </label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" className="field-input dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828]" />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="field-label dark:text-[#94A3B8] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#2E7D32] dark:text-[#4ADE80]" /> {isHi ? "पासवर्ड *" : "Password *"}
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required minLength={6}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={isHi ? "न्यूनतम 6 अक्षर" : "Min. 6 characters"} className="field-input pr-12 dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828]" />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7B6B] dark:text-[#94A3B8] hover:text-[#2C2416] dark:hover:text-[#F0FDF4] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <span>{isHi ? "खाता बनाया जा रहा है…" : "Creating Account…"}</span> : <><span>{isHi ? "पंजीकरण पूर्ण करें" : "Create Account"}</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        {/* ── LOGIN Form ────────────────────────────────────────────────────── */}
        {isLogin && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="field-label dark:text-[#94A3B8] flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#2E7D32] dark:text-[#4ADE80]" /> {isHi ? "ईमेल आईडी" : "Email Address"}
              </label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" className="field-input dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828]" />
            </div>
            <div className="space-y-1">
              <label className="field-label dark:text-[#94A3B8] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#2E7D32] dark:text-[#4ADE80]" /> {isHi ? "पासवर्ड" : "Password"}
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={isHi ? "अपना पासवर्ड दर्ज करें" : "Your password"} className="field-input pr-12 dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828]" />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7B6B] dark:text-[#94A3B8] hover:text-[#2C2416] dark:hover:text-[#F0FDF4] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <span>{isHi ? "लॉगिन हो रहे हैं…" : "Signing In…"}</span> : <><span>{isHi ? "लॉगिन करें" : "Sign In"}</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        {/* Toggle Login / Signup */}
        <div className="mt-6 pt-4 border-t border-[#F0E6D2] dark:border-[#263828] text-center text-sm text-[#5A4F3F] dark:text-[#94A3B8] space-y-2">
          {isLogin ? (
            <p>
              {isHi ? "खाता नहीं है? " : "Don't have an account? "}
              <button type="button" onClick={() => switchMode(false)}
                className="font-bold text-[#2E7D32] dark:text-[#4ADE80] hover:underline ml-1">
                {isHi ? "यहाँ पंजीकरण करें" : "Register here"}
              </button>
            </p>
          ) : (
            <p>
              {isHi ? "पहले से खाता है? " : "Already registered? "}
              <button type="button" onClick={() => switchMode(true)}
                className="font-bold text-[#2E7D32] dark:text-[#4ADE80] hover:underline ml-1">
                {isHi ? "लॉगिन करें" : "Sign In"}
              </button>
            </p>
          )}
          {onSkip && (
            <button type="button" onClick={onSkip}
              className="text-xs text-[#8C7B6B] dark:text-[#94A3B8] hover:text-[#2E7D32] dark:hover:text-[#4ADE80] font-semibold underline underline-offset-2 transition-colors pt-1 block w-full text-center">
              {isHi ? "छोड़ें — गेस्ट के रूप में जारी रखें" : "Skip — Continue as Guest"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
