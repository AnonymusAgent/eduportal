'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  footer?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, size = 'md', showCloseButton = true, footer }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const prevActive = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) { prevActive.current = document.activeElement; modalRef.current?.focus(); document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; if (prevActive.current instanceof HTMLElement) prevActive.current.focus(); }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', full: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div ref={modalRef} tabIndex={-1}
        className={cn('relative glass-strong rounded-3xl shadow-2xl w-full max-h-[90vh] flex flex-col animate-fade-in-up', sizes[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
          <h2 id="modal-title" className="text-lg font-bold text-slate-800">{title}</h2>
          {showCloseButton && (
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal" className="p-1">
              <X className="w-5 h-5" aria-hidden="true" />
            </Button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/20">{footer}</div>}
      </div>
    </div>
  );
}
