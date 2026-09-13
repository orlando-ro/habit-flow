import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}

export const GlassCard = ({ children, className = '', accentColor }: GlassCardProps) => {
  return (
    <div
      className={`glass rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] ${className}`}
      style={{
        boxShadow: accentColor ? `0 0 20px ${accentColor}1a` : 'none'
      }}
    >
      {children}
    </div>
  );
};
