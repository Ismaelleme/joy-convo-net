import { useState } from 'react';
import { Send, ArrowLeft, Paperclip, X, FileText, Image, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface MockFile {
  name: string;
  size: string;
  type: string;
}

const UserContact = () => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<MockFile[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleAddFile = () => {
    const mockFiles: MockFile[] = [
      { name: 'documento.pdf', size: '1.2 MB', type: 'application/pdf' },
      { name: 'foto.jpg', size: '3.4 MB', type: 'image/jpeg' },
      { name: 'contrato.pdf', size: '2.1 MB', type: 'application/pdf' },
      { name: 'captura.png', size: '890 KB', type: 'image/png' },
    ];
    const random = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    if (files.length < 5) {
      setFiles(prev => [...prev, { ...random, name: `${random.name.split('.')[0]}_${files.length + 1}.${random.name.split('.')[1]}` }]);
      toast.info(`Arquivo "${random.name}" adicionado`);
    } else {
      toast.error('Máximo de 5 arquivos');
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error('Escreva uma mensagem');
      return;
    }
    setSubmitted(true);
    toast.success('Mensagem enviada com sucesso!');
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4 text-primary" />;
    return <FileText className="w-4 h-4 text-primary" />;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background bg-noise flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass glass-border rounded-3xl p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </motion.div>
          <h2 className="text-xl font-bold font-[Space_Grotesk] text-foreground mb-2">
            Mensagem Enviada!
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Responderemos o mais breve possível.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-brand text-primary-foreground rounded-xl font-medium text-sm hover:brightness-110 transition-all glow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-noise">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-[Space_Grotesk] text-foreground">Contato</h1>
            <p className="text-sm text-muted-foreground">Envie uma mensagem com anexos</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Message */}
          <section className="glass glass-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Sua Mensagem</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva sua mensagem aqui..."
              rows={5}
              className="w-full bg-muted/20 rounded-xl border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 resize-none"
            />
          </section>

          {/* Files */}
          <section className="glass glass-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Anexos</h2>
              <span className="text-[10px] text-muted-foreground">{files.length}/5 arquivos</span>
            </div>

            {files.length > 0 && (
              <div className="space-y-2 mb-3">
                {files.map((file, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30"
                  >
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{file.name}</p>
                      <p className="text-[10px] text-muted-foreground">{file.size}</p>
                    </div>
                    <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            <button
              onClick={handleAddFile}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              <Paperclip className="w-4 h-4" />
              Adicionar Arquivo (mock)
            </button>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Tipos aceitos: PDF, JPG, PNG • Máx: 10MB por arquivo
            </p>
          </section>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-brand text-primary-foreground rounded-xl font-medium text-sm hover:brightness-110 transition-all glow-sm"
          >
            <Send className="w-4 h-4" />
            Enviar Mensagem
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserContact;
