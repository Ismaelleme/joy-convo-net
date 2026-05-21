import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ArrowLeft, Shield, ChevronDown } from 'lucide-react';
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

type Step = 'phone' | 'otp';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(countryCodes[0]);
  const [showCountry, setShowCountry] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMock, setIsMock] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const e164 = () => `${countryCode.code}${phone.replace(/\D/g, '')}`;

  const handlePhoneSubmit = async () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) return setError('Número inválido');
    setError('');
    setIsLoading(true);
    try {
      const res = await authApi.sendCode(e164());
      if (res.status === 'mock') {
        setIsMock(true);
        toast.info('Modo demo: use 123456 para entrar (backend SMS não conectado).');
      } else {
        setIsMock(false);
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

  const finishLogin = (phoneStr: string) => {
    const existing = useProfileStore.getState().profile;
    const userId = existing.id && existing.id !== 'me' ? existing.id : 'user-' + Date.now();
    const name = existing.name && existing.name !== 'Você' ? existing.name : `Usuário ${phoneStr.slice(-4)}`;
    localStorage.setItem('auth_token', 'session-' + Date.now());
    localStorage.setItem('auth_user', JSON.stringify({ id: userId, name, phone: phoneStr }));
    useProfileStore.getState().setProfile({ id: userId, name, phone: phoneStr });
    toast.success(`Bem-vindo, ${name}!`);
    navigate('/');
  };

  const handleOtpComplete = async (value: string) => {
    setOtp(value);
    setError('');
    if (value.length !== 6) return;
    setIsLoading(true);
    try {
      const res = await authApi.verifyCode(e164(), value);
      if (!res.approved) {
        setError('Código incorreto');
        toast.error('Código incorreto');
        setOtp('');
        return;
      }
      finishLogin(e164());
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
          <p className="text-sm text-muted-foreground mt-1">Entre com seu número</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.div key="phone" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-bold text-foreground">Seu número de telefone</h2>
                <p className="text-sm text-muted-foreground">Enviaremos um código SMS para confirmar</p>
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
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 right-0 mt-1 glass glass-border rounded-2xl shadow-lg overflow-hidden z-20">
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
                {isLoading ? <Spinner /> : (<>Enviar código <ArrowRight className="w-5 h-5" /></>)}
              </Button>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div key="otp" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <button onClick={() => { setStep('phone'); setOtp(''); setError(''); }} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
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
                {isMock && (
                  <p className="text-[11px] text-amber-500 bg-amber-500/10 rounded-lg px-3 py-1.5 inline-block mt-2">
                    Demo: use o código <span className="font-bold">123456</span>
                  </p>
                )}
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
