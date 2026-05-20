import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ArrowLeft, Shield, ChevronDown, Mail, Lock, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { authApi, ApiError } from '@/lib/api';
import { useProfileStore } from '@/store/profileStore';
import logo from '@/assets/logo.png';


const countryCodes = [
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+351', country: 'PT', flag: '🇵🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
];

type Step = 'phone' | 'otp' | 'profile';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(countryCodes[0]);
  const [showCountry, setShowCountry] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const e164 = () => `${countryCode.code}${phone.replace(/\D/g, '')}`;

  const handlePhoneSubmit = async () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Número inválido');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await authApi.sendCode(e164());
      if (res.status === 'mock') {
        toast.info('Twilio não configurado — use o código 123456 para testar.');
      } else {
        toast.success('Código enviado por SMS');
      }
      setStep('otp');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao enviar código.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpComplete = async (value: string) => {
    setOtp(value);
    setError('');
    if (value.length !== 6) return;
    setIsLoading(true);
    try {
      const res = await authApi.verifyCode(e164(), value);
      if (!res.approved || !res.verificationToken) {
        setError('Código incorreto');
        toast.error('Código incorreto');
        return;
      }
      setVerificationToken(res.verificationToken);
      toast.success('Telefone verificado');
      setStep('profile');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao verificar.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setError('');
    setOtp('');
    setIsLoading(true);
    try {
      await authApi.sendCode(e164());
      toast.success('Código reenviado');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Falha ao reenviar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async () => {
    if (!name.trim() || name.trim().length < 2) return setError('Digite seu nome (min. 2 letras)');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('E-mail inválido');
    if (password.length < 8) return setError('Senha deve ter ao menos 8 caracteres');

    setError('');
    setIsLoading(true);
    try {
      const res = await authApi.register({
        email: email.trim(),
        name: name.trim(),
        password,
        phone: e164(),
        verificationToken,
      });
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('auth_user', JSON.stringify(res.user));
      useProfileStore.getState().setProfile({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        phone: res.user.phone ?? e164(),
      });
      toast.success(`Bem-vindo, ${res.user.name}!`);
      navigate('/');

    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao criar conta.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: { x: 80, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -80, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-background bg-noise flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center mb-10">
          <img src={logo} alt="iSync" width={72} height={72} className="mb-3 rounded-2xl" />
          <h1 className="text-2xl font-bold text-gradient tracking-tight">iSync</h1>
          <p className="text-sm text-muted-foreground mt-1">Conecte-se ao que importa</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.div key="phone" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-bold text-foreground">Seu número de telefone</h2>
                <p className="text-sm text-muted-foreground">Enviaremos um código SMS real para verificar</p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <button
                    onClick={() => setShowCountry(!showCountry)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl glass glass-border text-foreground hover:bg-muted/30 transition-all"
                  >
                    <span className="text-xl">{countryCode.flag}</span>
                    <span className="font-medium">{countryCode.code}</span>
                    <span className="text-muted-foreground text-sm">{countryCode.country}</span>
                    <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
                  </button>

                  <AnimatePresence>
                    {showCountry && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 right-0 mt-1 glass glass-border rounded-2xl shadow-lg overflow-hidden z-20"
                      >
                        {countryCodes.map((cc) => (
                          <button
                            key={cc.code}
                            onClick={() => { setCountryCode(cc); setShowCountry(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-all text-foreground"
                          >
                            <span className="text-xl">{cc.flag}</span>
                            <span className="font-medium">{cc.code}</span>
                            <span className="text-sm text-muted-foreground">{cc.country}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={phone}
                    onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(''); }}
                    placeholder="(00) 00000-0000"
                    className="pl-12 h-13 rounded-2xl glass glass-border text-foreground text-lg tracking-wide border-0"
                    inputMode="tel"
                  />
                </div>

                {error && <p className="text-destructive text-sm text-center">{error}</p>}
              </div>

              <Button
                onClick={handlePhoneSubmit}
                disabled={isLoading || phone.replace(/\D/g, '').length < 10}
                className="w-full h-12 rounded-2xl text-base font-bold gap-2 bg-gradient-brand hover:brightness-110 transition-all glow-sm border-0"
              >
                {isLoading ? <Spinner /> : (<>Continuar <ArrowRight className="w-5 h-5" /></>)}
              </Button>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div key="otp" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <button onClick={() => setStep('phone')} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>

              <div className="text-center space-y-2">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-brand glow-sm flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-primary-foreground" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Código de verificação</h2>
                <p className="text-sm text-muted-foreground">
                  Enviamos um código de 6 dígitos para
                  <br />
                  <span className="text-foreground font-medium">{countryCode.code} {phone}</span>
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={handleOtpComplete}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="w-12 h-14 text-xl rounded-2xl glass glass-border text-foreground border-0" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && <p className="text-destructive text-sm text-center">{error}</p>}
              {isLoading && <div className="flex justify-center"><Spinner small /></div>}

              <p className="text-center text-sm text-muted-foreground">
                Não recebeu?{' '}
                <button onClick={resendCode} className="text-primary font-medium hover:underline" disabled={isLoading}>
                  Reenviar código
                </button>
              </p>
            </motion.div>
          )}

          {step === 'profile' && (
            <motion.div key="profile" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-bold text-foreground">Crie sua conta</h2>
                <p className="text-sm text-muted-foreground">Telefone verificado ✓ Agora seus dados de acesso</p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    placeholder="Seu nome completo"
                    maxLength={60}
                    className="pl-12 h-12 rounded-2xl glass glass-border text-foreground border-0"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="seu@email.com"
                    maxLength={120}
                    className="pl-12 h-12 rounded-2xl glass glass-border text-foreground border-0"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Senha (mín. 8 caracteres)"
                    maxLength={72}
                    className="pl-12 h-12 rounded-2xl glass glass-border text-foreground border-0"
                  />
                </div>

                {error && <p className="text-destructive text-sm text-center">{error}</p>}
              </div>

              <Button
                onClick={handleProfileSubmit}
                disabled={isLoading || !name.trim() || !email.trim() || password.length < 8}
                className="w-full h-12 rounded-2xl text-base font-bold gap-2 bg-gradient-brand hover:brightness-110 transition-all glow-sm border-0"
              >
                {isLoading ? <Spinner /> : (<>Criar conta <ArrowRight className="w-5 h-5" /></>)}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Ao continuar, você concorda com nossos{' '}
          <button className="text-primary hover:underline">Termos de Uso</button>
          {' '}e{' '}
          <button className="text-primary hover:underline">Política de Privacidade</button>
        </p>
      </div>
    </div>
  );
};

const Spinner = ({ small }: { small?: boolean }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    className={`${small ? 'w-6 h-6 border-primary' : 'w-5 h-5 border-primary-foreground'} border-2 border-t-transparent rounded-full`}
  />
);

export default Register;
