export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
}

const sizeClasses = {
  small: 'py-2.5 px-4 text-xs',
  medium: 'py-[11px] px-5 text-sm',
  large: 'py-3 px-6 text-base',
};

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={[
        'inline-block cursor-pointer border-0 rounded-[3em] font-bold leading-none font-sans',
        sizeClasses[size],
        primary
          ? 'bg-[#555ab9] text-white'
          : 'bg-transparent text-[#333] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]',
      ].join(' ')}
      style={backgroundColor ? { backgroundColor } : undefined}
      {...props}
    >
      {label}
    </button>
  );
};
