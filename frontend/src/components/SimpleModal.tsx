import { type ReactNode } from 'react';
import { useBreakpoint } from '../hooks/useResponsive';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function SimpleModal({ isOpen, onClose, title, children }: SimpleModalProps) {
  if (!isOpen) return null;

  const { isMobile, modalPadding, fontSize } = useBreakpoint();

  return (
    <div 
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        zIndex: '1000',
        padding: isMobile ? '0' : '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: isMobile ? '16px 16px 0 0' : '12px',
          maxWidth: isMobile ? '100%' : '600px',
          width: '100%',
          maxHeight: isMobile ? '90vh' : '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          animation: isMobile ? 'slideUpModal 0.3s ease-out' : 'fadeInModal 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: isMobile ? `20px ${modalPadding} 16px` : `24px ${modalPadding} 16px`,
          borderBottom: '2px solid #f3f4f6',
          position: 'sticky',
          top: '0',
          background: 'white',
          borderRadius: isMobile ? '16px 16px 0 0' : '12px 12px 0 0'
        }}>
          <h2 style={{
            fontSize: fontSize.xl,
            fontWeight: '700',
            color: '#1f2937',
            margin: '0',
            paddingRight: '40px'
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: isMobile ? '16px' : '20px',
              right: modalPadding,
              background: 'none',
              border: 'none',
              fontSize: isMobile ? '28px' : '24px',
              cursor: 'pointer',
              color: '#6b7280',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            ×
          </button>
        </div>
        <div style={{
          padding: modalPadding
        }}>
          {children}
        </div>
      </div>
      
      <style>{`
        @keyframes slideUpModal {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeInModal {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}