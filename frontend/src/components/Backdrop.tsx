import type { ReactNode } from 'react';

interface BackdropProps {
  onDismiss?: () => void;
  children: ReactNode;
}

/** Material Design Backdrop — panel que desliza desde abajo cubriendo ~70% de pantalla */
export function Backdrop({ onDismiss, children }: BackdropProps) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col">
      {/* Capa semitransparente — toca para cerrar */}
      <div
        className="flex-1 bg-black/40 animate-fade-in"
        onClick={onDismiss}
      />

      {/* Panel deslizante */}
      <div className="bg-white rounded-t-2xl shadow-xl animate-slide-up max-h-[72vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
