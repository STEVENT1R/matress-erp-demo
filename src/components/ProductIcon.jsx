import { Bed, Crown, Stethoscope, Heart, Baby, Sparkles } from 'lucide-react';

const iconMap = {
  premium: { icon: Crown, colors: 'from-amber-400 to-amber-600 text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  medical: { icon: Stethoscope, colors: 'from-blue-400 to-blue-600 text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  massage: { icon: Sparkles, colors: 'from-purple-400 to-purple-600 text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  baby: { icon: Baby, colors: 'from-pink-400 to-pink-600 text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/30' },
  standard: { icon: Bed, colors: 'from-primary-400 to-primary-600 text-primary-500', bg: 'bg-primary-100 dark:bg-primary-900/30' },
};

const typeMap = {
  'سوست منفصلة': 'standard',
  'فوم': 'standard',
  'طبية': 'medical',
  'كهربائية': 'massage',
};

// All available icon types for product customization
export const availableIconTypes = [
  { value: 'standard', label: 'عادي', Icon: Bed },
  { value: 'premium', label: 'فاخر', Icon: Crown },
  { value: 'medical', label: 'طبي', Icon: Stethoscope },
  { value: 'massage', label: 'مساج', Icon: Sparkles },
  { value: 'baby', label: 'أطفال', Icon: Baby },
];

export default function ProductIcon({ iconType, category, size = 'md' }) {
  const resolved = iconMap[iconType] || iconMap[typeMap[category]] || iconMap.standard;
  const Icon = resolved.icon;

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10',
  };

  return (
    <div className={`${sizes[size]} rounded-xl ${resolved.bg} flex items-center justify-center`}>
      <Icon className={`${iconSizes[size]} ${resolved.colors.split(' ')[2]}`} />
    </div>
  );
}
