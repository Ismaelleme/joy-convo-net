import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Instagram, MessageSquare, Music, Phone, ThumbsUp, ArrowLeft, Sparkles } from 'lucide-react';
import { socialPlatforms, type SocialPlatform } from '@/data/socialFeaturesData';
import { useNavigate } from 'react-router-dom';

const iconMap: Record<string, React.ElementType> = {
  Instagram,
  MessageSquare,
  Music,
  Phone,
  ThumbsUp,
};

const PlatformCard = ({
  platform,
  index,
  searchQuery,
  highlightedFeature,
  onHighlight,
}: {
  platform: SocialPlatform;
  index: number;
  searchQuery: string;
  highlightedFeature: string | null;
  onHighlight: (f: string | null) => void;
}) => {
  const [expanded, setExpanded] = useState(true);
  const Icon = iconMap[platform.icon];

  const filtered = platform.features.filter((f) =>
    f.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (searchQuery && filtered.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden hover:border-primary/30 transition-all duration-300"
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${platform.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{platform.name}</h3>
            <span className="text-xs text-muted-foreground">
              {filtered.length} funcionalidade{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Features list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="px-5 pb-5 space-y-1.5">
              {filtered.map((feature) => {
                const isHighlighted = highlightedFeature === `${platform.id}-${feature}`;
                return (
                  <motion.li
                    key={feature}
                    whileHover={{ x: 4 }}
                    onClick={() =>
                      onHighlight(isHighlighted ? null : `${platform.id}-${feature}`)
                    }
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm ${
                      isHighlighted
                        ? 'bg-primary/15 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isHighlighted ? 'bg-primary' : 'bg-muted-foreground/40'
                      }`}
                    />
                    {feature}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SocialFeatures = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);
  const navigate = useNavigate();

  const totalFeatures = socialPlatforms.reduce((acc, p) => acc + p.features.length, 0);

  return (
    <div className="min-h-screen bg-background bg-noise">
      {/* Header */}
      <header className="sticky top-0 z-40 glass glass-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl hover:bg-accent/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Funcionalidades
            </h1>
            <p className="text-xs text-muted-foreground">
              {totalFeatures} recursos em {socialPlatforms.length} plataformas
            </p>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar funcionalidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card/60 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 backdrop-blur-sm transition-all text-sm"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialPlatforms.map((platform, i) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              index={i}
              searchQuery={searchQuery}
              highlightedFeature={highlightedFeature}
              onHighlight={setHighlightedFeature}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialFeatures;
