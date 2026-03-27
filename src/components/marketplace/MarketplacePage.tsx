import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Heart, Tag, Filter, ShoppingBag } from 'lucide-react';
import { products, categories, type Product } from '@/data/marketplaceData';

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  return `${days}d atrás`;
}

const conditionLabels = { new: 'Novo', used: 'Usado', refurbished: 'Recondicionado' };

const ProductCard = ({ product }: { product: Product }) => {
  const [saved, setSaved] = useState(product.saved);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass glass-border rounded-2xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all"
    >
      <div className="relative aspect-square overflow-hidden">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center"
        >
          <Heart className={`w-4 h-4 ${saved ? 'text-red-500 fill-red-500' : 'text-white'}`} />
        </motion.button>
        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg glass text-[10px] font-medium text-white">
          {conditionLabels[product.condition]}
        </span>
      </div>
      <div className="p-3">
        <p className="text-base font-bold text-foreground">{formatPrice(product.price)}</p>
        <p className="text-sm text-muted-foreground truncate mt-0.5">{product.title}</p>
        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{product.location}</span>
          <span className="mx-1">•</span>
          <span>{timeAgo(product.postedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Marketplace
          </h1>
          <button className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors">
            Vender
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full pl-10 pr-4 py-2.5 glass glass-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat ? 'bg-primary text-primary-foreground' : 'glass glass-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Nenhum produto encontrado</div>
        )}
      </div>
    </div>
  );
}
