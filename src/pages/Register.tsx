import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ArrowLeft, Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import logo from '@/assets/logo.png';

const countryCodes = [
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+351', country: 'PT', flag: '🇵🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
];

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(countryCodes[0]);
  const [showCountry, setShowCountry] = useState(false);
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handlePhoneSubmit = () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Número inválido');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpComplete = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (value === '123456' || value.length === 6) {
          setStep('profile');
        }
      }, 1200);
    }
  };

  const handleProfileSubmit = () => {
    if (!name.trim()) {
      setError('Digite seu nome');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  const slideVariants = {
    enter: { x: 80, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -80, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center mb-10"
        >
          <img src={logo} alt="iSync" width={72} height={72} className="mb-3" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">iSync</h1>
          <p className="text-sm text-muted-foreground mt-1">Conecte-se ao que importa</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Phone */}
          {step === 'phone' && (
            <motion.div
              key="phone"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Seu número de telefone</h2>
                <p className="text-sm text-muted-foreground">
                  Enviaremos um código SMS para verificar seu número
                </p>
              </div>

              <div className="space-y-3">
                {/* Country code selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowCountry(!showCountry)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors"
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
                        className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-20"
                      >
                        {countryCodes.map((cc) => (
                          <button
                            key={cc.code}
                            onClick={() => { setCountryCode(cc); setShowCountry(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-foreground"
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

                {/* Phone input */}
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={phone}
                    onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(''); }}
                    placeholder="(00) 00000-0000"
                    className="pl-12 h-13 rounded-xl bg-card border-border text-foreground text-lg tracking-wide"
                    inputMode="tel"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-destructive text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <Button
                onClick={handlePhoneSubmit}
                disabled={isLoading || phone.replace(/\D/g, '').length < 10}
                className="w-full h-12 rounded-xl text-base font-semibold gap-2"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* STEP 2: OTP */}
          {step === 'otp' && (
            <motion.div
              key="otp"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <button
                onClick={() => setStep('phone')}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>

              <div className="text-center space-y-2">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Código de verificação</h2>
                <p className="text-sm text-muted-foreground">
                  Enviamos um código de 6 dígitos para
                  <br />
                  <span className="text-foreground font-medium">{countryCode.code} {phone}</span>
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpComplete}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-14 text-xl rounded-lg border-border bg-card text-foreground" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-xl rounded-lg border-border bg-card text-foreground" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-xl rounded-lg border-border bg-card text-foreground" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-xl rounded-lg border-border bg-card text-foreground" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-xl rounded-lg border-border bg-card text-foreground" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-xl rounded-lg border-border bg-card text-foreground" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {isLoading && (
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                  />
                </div>
              )}

              <p className="text-center text-sm text-muted-foreground">
                Não recebeu?{' '}
                <button className="text-primary font-medium hover:underline">
                  Reenviar código
                </button>
              </p>
            </motion.div>
          )}

          {/* STEP 3: Profile */}
          {step === 'profile' && (
            <motion.div
              key="profile"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Como devemos te chamar?</h2>
                <p className="text-sm text-muted-foreground">Escolha o nome que aparecerá no seu perfil</p>
              </div>

              {/* Avatar placeholder */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-foreground">
                    {name ? name[0].toUpperCase() : '?'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  placeholder="Seu nome"
                  className="h-13 rounded-xl bg-card border-border text-foreground text-lg text-center"
                  maxLength={30}
                />

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-destructive text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <Button
                onClick={handleProfileSubmit}
                disabled={isLoading || !name.trim()}
                className="w-full h-12 rounded-xl text-base font-semibold gap-2"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Começar
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
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

export default Register;
