import { User } from '@/types/chat';

interface AvatarProps {
  user?: User;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

const statusSizeMap = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
};

const gradients = [
  'from-blue-500 to-cyan-400',
  'from-indigo-500 to-blue-400',
  'from-violet-500 to-indigo-400',
  'from-sky-500 to-blue-400',
  'from-blue-600 to-sky-400',
  'from-cyan-500 to-blue-500',
  'from-indigo-600 to-cyan-400',
  'from-blue-500 to-violet-400',
];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function UserAvatar({ user, name, size = 'md', showStatus = false, className = '' }: AvatarProps) {
  const displayName = user?.name || name || '?';
  const status = user?.status;

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div className={`${sizeMap[size]} bg-gradient-to-br ${getGradient(displayName)} rounded-2xl flex items-center justify-center font-bold text-primary-foreground shadow-lg`}>
        {getInitials(displayName)}
      </div>
      {showStatus && status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${statusSizeMap[size]} rounded-full border-2 border-background ${
            status === 'online' ? 'bg-online' : status === 'away' ? 'bg-amber-400' : 'bg-muted-foreground'
          }`}
        />
      )}
    </div>
  );
}
