import { ReactNode } from 'react';

interface Props {
  title?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ title, onClose, children, footer, size = 'md' }: Props) {
  const max = size === 'sm' ? 'max-w-xs' : size === 'lg' ? 'max-w-lg' : 'max-w-sm';
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6" onClick={onClose}>
      <div className={`w-full ${max} card animate-floatUp`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-extrabold text-slate-800">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">✕</button>
          </div>
        )}
        <div>{children}</div>
        {footer && <div className="mt-3">{footer}</div>}
      </div>
    </div>
  );
}
