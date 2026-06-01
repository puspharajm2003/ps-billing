import React from 'react';
import '../BasicUI.css';

export const BasicWelcome: React.FC = () => {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh', padding: '2rem' }}>
      <div className="classic-bevel-out" style={{ width: '420px', padding: '2rem', textAlign: 'center', background: '#d4d0c8' }}>
        <h1 style={{ 
          color: 'var(--classic-text-red)', 
          fontFamily: 'Georgia, serif', 
          fontStyle: 'italic', 
          fontWeight: 'bold', 
          fontSize: '2.5rem',
          margin: '0 0 0.5rem 0'
        }}>
          PS - Billing
        </h1>
        <h3 style={{ 
          color: 'var(--classic-text-blue)', 
          fontWeight: 'bold', 
          fontSize: '1rem',
          margin: '0 0 1.5rem 0',
          fontFamily: 'sans-serif'
        }}>
          An Exclusive Software for<br />Inventory & Billing
        </h3>
        
        <div style={{ borderTop: '2px solid var(--classic-border-shadow)', borderBottom: '1px solid white', margin: '1rem auto', width: '220px' }}></div>
        
        <p style={{ color: 'var(--classic-text-red)', fontSize: '0.8rem', margin: '1rem 0 0.2rem 0' }}>
          Designed and Developed BY:
        </p>
        <h2 style={{ 
          color: '#0055ff', 
          fontFamily: 'Georgia, serif', 
          fontStyle: 'italic', 
          fontWeight: 'bold', 
          fontSize: '1.5rem',
          margin: '0 0 0.8rem 0'
        }}>
          Puspharaj M
        </h2>
        
        <p style={{ color: 'var(--classic-text-blue)', fontSize: '0.8rem', margin: '0.2rem 0' }}>
          Puducherry, India.
        </p>
        <p style={{ color: 'var(--classic-text-blue)', fontSize: '0.75rem', margin: '0.2rem 0', fontFamily: 'monospace' }}>
          email : Puspharaj.m2003@gmail.com
        </p>
      </div>
    </div>
  );
};

export default BasicWelcome;
