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
  lg: 'w-12 h-12 text-base',
};

const statusSizeMap = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
};

const colors = [
  'bg-emerald-600', 'bg-blue-600', 'bg-purple-600', 'bg-rose-600',
  'bg-amber-600', 'bg-cyan-600', 'bg-indigo-600', 'bg-pink-600',
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function UserAvatar({ user, name, size = 'md', showStatus = false, className = '' }: AvatarProps) {
  const displayName = user?.name || name || '?';
  const status = user?.status;

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div className={`${sizeMap[size]} ${getColor(displayName)} rounded-full flex items-center justify-center font-semibold text-primary-foreground`}>
        {getInitials(displayName)}
      </div>
      {showStatus && status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizeMap[size]} rounded-full border-2 border-background ${
            status === 'online' ? 'bg-online' : status === 'away' ? 'bg-amber-500' : 'bg-muted-foreground'
          }`}
        />
      )}
    </div>
  );
}
