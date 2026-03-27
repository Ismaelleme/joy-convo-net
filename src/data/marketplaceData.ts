export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  location: string;
  category: string;
  condition: 'new' | 'used' | 'refurbished';
  saved: boolean;
  postedAt: Date;
}

const now = Date.now();

export const products: Product[] = [
  { id: 'prod1', title: 'MacBook Pro M2 14"', price: 8500, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', seller: 'Ana Silva', location: 'São Paulo, SP', category: 'Eletrônicos', condition: 'used', saved: false, postedAt: new Date(now - 86400000) },
  { id: 'prod2', title: 'Cadeira Gamer ThunderX3', price: 1200, image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop', seller: 'Carlos Santos', location: 'Rio de Janeiro, RJ', category: 'Móveis', condition: 'new', saved: true, postedAt: new Date(now - 172800000) },
  { id: 'prod3', title: 'iPhone 15 Pro 256GB', price: 6800, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', seller: 'Marina Costa', location: 'Curitiba, PR', category: 'Eletrônicos', condition: 'new', saved: false, postedAt: new Date(now - 259200000) },
  { id: 'prod4', title: 'Mesa de Escritório L', price: 850, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop', seller: 'Pedro Oliveira', location: 'BH, MG', category: 'Móveis', condition: 'used', saved: false, postedAt: new Date(now - 345600000) },
  { id: 'prod5', title: 'Fone Sony WH-1000XM5', price: 1900, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', seller: 'Julia Mendes', location: 'Porto Alegre, RS', category: 'Eletrônicos', condition: 'refurbished', saved: false, postedAt: new Date(now - 432000000) },
  { id: 'prod6', title: 'Teclado Mecânico RGB', price: 450, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop', seller: 'Lucas Ferreira', location: 'Brasília, DF', category: 'Eletrônicos', condition: 'new', saved: true, postedAt: new Date(now - 518400000) },
];

export const categories = ['Todos', 'Eletrônicos', 'Móveis', 'Veículos', 'Roupas', 'Esportes'];
