import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({
  src,
  firstName,
  lastName,
  size = 'md',
  className,
}: AvatarProps) {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const initials = getInitials(firstName, lastName);

  if (src) {
    return (
      <div className={cn('rounded-full p-0.5 bg-gradient-to-br from-indigo-400 to-cyan-400', className)}>
        <img
          src={src}
          alt={`${firstName || ''} ${lastName || ''}`.trim() || 'User avatar'}
          className={cn(
            'rounded-full object-cover bg-white border-2 border-white',
            sizeStyles[size],
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20',
        sizeStyles[size],
        className,
      )}
      aria-label={`${firstName || ''} ${lastName || ''}`.trim() || 'User'}
    >
      {initials}
    </div>
  );
}
