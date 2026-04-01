import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Sparkles, Bot, User, Copy, Check, RotateCcw,
  Lightbulb, Code, FileText, Palette, Zap, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const suggestions = [
  { icon: Lightbulb, label: 'Gerar ideias', prompt: 'Me dê 5 ideias criativas para um projeto de tecnologia' },
  { icon: Code, label: 'Ajuda com código', prompt: 'Explique como usar React hooks de forma eficiente' },
  { icon: FileText, label: 'Resumir texto', prompt: 'Me ajude a resumir um texto longo de forma objetiva' },
  { icon: Palette, label: 'Design dicas', prompt: 'Quais são as tendências de UI/UX design em 2024?' },
];

const mockResponses: Record<string, string> = {
  default: `Olá! 👋 Sou o assistente IA do **iSync**. Posso te ajudar com várias coisas:

- 💡 **Gerar ideias** criativas para projetos
- 📝 **Resumir textos** e criar conteúdo
- 💻 **Ajudar com código** e programação
- 🎨 **Dicas de design** e tendências
- 📅 **Organizar sua agenda** e tarefas
- 🔍 **Pesquisar informações** sobre qualquer tema

Como posso te ajudar hoje?`,
  ideias: `Aqui estão **5 ideias criativas** para projetos de tecnologia! 🚀

1. **🤖 Assistente de Produtividade com IA** — Um app que analisa seus hábitos e sugere rotinas otimizadas automaticamente.

2. **🌱 Jardim Digital Gamificado** — Plataforma onde tarefas concluídas fazem crescer uma planta virtual, promovendo produtividade.

3. **🎵 Gerador de Playlists por Humor** — App que detecta seu humor via texto/voz e cria playlists personalizadas.

4. **📸 Rede Social de Micro-Momentos** — Stories que duram apenas 60 segundos com filtros gerados por IA.

5. **🏋️ Personal Trainer IA** — App que cria treinos personalizados baseados em câmera e feedback de postura em tempo real.

Quer que eu detalhe alguma dessas ideias? 😊`,
  codigo: `Claro! Aqui vai uma explicação sobre **React Hooks** eficientes:

\`\`\`tsx
// ✅ useMemo para cálculos pesados
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// ✅ useCallback para funções estáveis
const handleClick = useCallback((id: string) => {
  setSelected(id);
}, []);

// ✅ Custom hook para lógica reutilizável
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
\`\`\`

**Dicas importantes:**
- Use \`useMemo\` apenas quando o cálculo é realmente custoso
- \`useCallback\` é útil quando passa funções para componentes memoizados
- Extraia lógica complexa em **custom hooks**

Precisa de mais exemplos? 💻`,
  resumir: `Posso te ajudar a **resumir textos**! ✨

Basta colar o texto aqui e eu vou:

1. 📌 **Identificar os pontos-chave** do conteúdo
2. 🎯 **Extrair a ideia central** de cada parágrafo
3. 📝 **Criar um resumo conciso** mantendo a essência
4. 📊 **Listar tópicos principais** em bullet points

Cole o texto que deseja resumir e eu faço o resto! 😊`,
  design: `Tendências de **UI/UX Design** em 2024! 🎨

### 1. 🌊 Bento Grid Layout
Layouts em grade estilo "bento box" com cards de tamanhos variados.

### 2. ✨ Glassmorphism 2.0
Efeitos de vidro com blur mais sutil e cores vibrantes por trás.

### 3. 🎭 Micro-interações
Animações sutis em hover, scroll e transições que encantam.

### 4. 🌙 Dark Mode Premium
Tons escuros com gradientes suaves e efeitos de glow.

### 5. 🤖 UI Generativa
Interfaces que se adaptam ao comportamento do usuário via IA.

### 6. 📱 Design Espacial
Preparação para interfaces 3D e realidade aumentada.

Quer que eu aprofunde em alguma dessas tendências? 🚀`,
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('ideia') || lower.includes('criativ') || lower.includes('projeto')) return mockResponses.ideias;
  if (lower.includes('código') || lower.includes('codigo') || lower.includes('react') || lower.includes('hook') || lower.includes('programação')) return mockResponses.codigo;
  if (lower.includes('resum') || lower.includes('texto')) return mockResponses.resumir;
  if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('tendência')) return mockResponses.design;
  if (lower.includes('olá') || lower.includes('oi') || lower.includes('bom dia') || lower.includes('boa tarde') || lower.includes('boa noite') || lower.includes('ajud'))
    return mockResponses.default;
  return `Entendi sua pergunta sobre *"${input.slice(0, 60)}${input.length > 60 ? '...' : ''}"*! 🤔\n\nEssa é uma ótima questão. Aqui estão alguns pontos para considerar:\n\n- 📌 **Analise o contexto** antes de tomar decisões\n- 🔍 **Pesquise referências** de projetos similares\n- 💡 **Teste diferentes abordagens** para encontrar a melhor solução\n- 🤝 **Colabore com outros** para obter perspectivas diferentes\n\nQuer que eu aprofunde em algum desses pontos? Estou aqui para ajudar! ✨`;
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-sm font-bold text-foreground mt-3">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-base font-bold text-foreground mt-3">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('- ')) {
          const text = line.replace('- ', '');
          return (
            <div key={i} className="flex gap-2 pl-2">
              <span className="text-primary mt-1.5 text-[6px]">●</span>
              <span className="text-sm text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{
                __html: text
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-muted text-primary text-xs font-mono">$1</code>')
              }} />
            </div>
          );
        }
        if (line.startsWith('```')) {
          return null; // handled below
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        if (/^\d+\./.test(line)) {
          return (
            <div key={i} className="flex gap-2 pl-2">
              <span className="text-primary font-bold text-sm min-w-[20px]">{line.match(/^(\d+)/)?.[1]}.</span>
              <span className="text-sm text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{
                __html: line.replace(/^\d+\.\s*/, '')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
              }} />
            </div>
          );
        }
        return (
          <p key={i} className="text-sm text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-muted text-primary text-xs font-mono">$1</code>')
          }} />
        );
      })}
      {/* Render code blocks */}
      {content.includes('```') && content.split('```').filter((_, i) => i % 2 === 1).map((block, i) => {
        const lang = block.split('\n')[0];
        const code = block.split('\n').slice(1).join('\n');
        return (
          <div key={`code-${i}`} className="rounded-xl overflow-hidden border border-border/50 my-2">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/30">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">{lang || 'code'}</span>
              <CopyButton text={code} />
            </div>
            <pre className="p-4 overflow-x-auto text-xs font-mono text-foreground/80 bg-background/50 leading-relaxed">
              {code}
            </pre>
          </div>
        );
      })}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1 rounded-lg hover:bg-muted/50 transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-online" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
    </button>
  );
}

export function AIAssistantPage() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateTyping = useCallback((response: string) => {
    const assistantId = `ai-${Date.now()}`;
    setIsTyping(true);
    
    // Simulate thinking delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isTyping: true,
      }]);

      let currentChar = 0;
      const speed = 12; // ms per character
      
      const interval = setInterval(() => {
        currentChar += Math.floor(Math.random() * 3) + 1;
        if (currentChar >= response.length) {
          currentChar = response.length;
          clearInterval(interval);
          setIsTyping(false);
          setMessages(prev => prev.map(m => 
            m.id === assistantId ? { ...m, content: response, isTyping: false } : m
          ));
        } else {
          setMessages(prev => prev.map(m => 
            m.id === assistantId ? { ...m, content: response.slice(0, currentChar) } : m
          ));
        }
      }, speed);
    }, 800);
  }, []);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isTyping) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: msg,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    inputRef.current?.focus();

    const response = getResponse(msg);
    simulateTyping(response);
  };

  const handleReset = () => {
    setMessages([]);
    toast.success('Conversa reiniciada');
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="h-full flex flex-col bg-background bg-noise relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none opacity-50" />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3 glass-strong glass-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-brand flex items-center justify-center glow-sm">
            <Sparkles className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              iSync AI
              <span className="px-1.5 py-0.5 rounded-md bg-primary/15 text-primary text-[9px] font-bold uppercase tracking-wider">Beta</span>
            </h1>
            <p className="text-[10px] text-muted-foreground">Assistente inteligente</p>
          </div>
        </div>
        {messages.length > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleReset}
            className="p-2 rounded-xl hover:bg-muted/40 transition-all text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </motion.button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin relative z-10">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-6 py-8">
            {/* Hero */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-brand flex items-center justify-center glow-xl floating">
                <Bot className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-online flex items-center justify-center border-2 border-background">
                <Zap className="w-3 h-3 text-background" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mt-6 mb-8"
            >
              <h2 className="text-xl font-bold text-foreground mb-2">Como posso ajudar?</h2>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                Pergunte qualquer coisa — ideias, código, resumos, dicas e muito mais.
              </p>
            </motion.div>

            {/* Suggestion cards */}
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm">
              {suggestions.map((s, i) => (
                <motion.button
                  key={s.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  onClick={() => handleSend(s.prompt)}
                  className="flex flex-col items-start gap-2 p-3.5 rounded-2xl glass glass-border hover:glass-border-bright hover:glow-xs transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{s.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center flex-shrink-0 mt-0.5 glow-xs">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-lg'
                      : 'glass glass-border rounded-bl-lg'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <>
                        <MarkdownRenderer content={msg.content} />
                        {msg.isTyping && (
                          <div className="flex items-center gap-1 mt-2">
                            {[0, 1, 2].map(j => (
                              <span
                                key={j}
                                className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                                style={{ animationDelay: `${j * 0.2}s` }}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                  <p className={`text-[9px] text-muted-foreground mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'} px-1`}>
                    {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="relative z-10 px-3 pb-3">
        <div className="glass-strong glass-border-bright rounded-2xl p-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isTyping ? 'A IA está respondendo...' : 'Pergunte qualquer coisa...'}
                disabled={isTyping}
                className="w-full bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-gradient-brand rounded-xl text-primary-foreground hover:brightness-110 transition-all glow-sm disabled:opacity-30 disabled:glow-none"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          <p className="text-[9px] text-muted-foreground text-center mt-2">
            iSync AI pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
