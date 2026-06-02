import React from 'react';
import { useAuth } from '../AuthContext';
import type { CompanySettings } from '../App';
import '../BasicUI.css';

const t = (val: string) => val;

interface BasicWelcomeProps {
  settings: CompanySettings;
}

export const BasicWelcome: React.FC<BasicWelcomeProps> = ({ settings }) => {
  const { user } = useAuth();

  // Determine logo profile
  const isGroups = user?.username === 'smrgroups' || settings?.company_name?.toLowerCase().includes('groups');
  const isTN = user?.username === 'smrtamilnadu' || settings?.company_name?.toLowerCase().includes('tamilnadu');
  const isPondy = user?.username === 'smrpondy' || settings?.company_name?.toLowerCase().includes('pondy');

  return (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center' }}>
      
      {/* Welcome Banner */}
      <div className="classic-bevel-out" style={{ width: '100%', maxWidth: '850px', background: '#d4d0c8', padding: '10px 15px' }}>
        <div style={{ 
          background: 'linear-gradient(90deg, #800000 0%, #d4d0c8 100%)', 
          color: '#ffffff', 
          padding: '4px 8px', 
          fontWeight: 'bold', 
          fontSize: '0.85rem',
          marginBottom: '10px'
        }}>
          {t('SYSTEM ACCESS GRANTED — ADVANCED SMR MATRIX WORKSTATION')}
        </div>
        <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: '1.4' }}>
          {t('Welcome back,')} <strong>{user?.username}</strong>. {t('You have successfully authenticated into the SMR Groups Advanced Billing & Inventory System. Your secure enterprise profile has been initialized below.')}
        </p>
      </div>

      {/* Main Matrix Bevel Box */}
      <div className="classic-bevel-out" style={{ width: '100%', maxWidth: '850px', background: '#d4d0c8', padding: '1.2rem' }}>
        
        {/* Upper Header: Logo & Company Name */}
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '2px dashed #808080', paddingBottom: '0.8rem' }}>
          {/* Brand Logo box */}
          <div className="classic-bevel-in" style={{ 
            width: '80px', 
            height: '80px', 
            background: '#ffffff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {isGroups ? (
              <img src="/logo.jpg" alt="SMR Groups" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : isTN ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#000080', color: '#fff', fontWeight: 'bold' }}>
                <span style={{ fontSize: '1.4rem', letterSpacing: '1px' }}>{t('SMR')}</span>
                <span style={{ fontSize: '0.6rem', background: '#ff4c4c', padding: '1px 3px', marginTop: '1px' }}>{t('TAMILNADU')}</span>
              </div>
            ) : isPondy ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#800000', color: '#fff', fontWeight: 'bold' }}>
                <span style={{ fontSize: '1.4rem', letterSpacing: '1px' }}>{t('SMR')}</span>
                <span style={{ fontSize: '0.6rem', background: '#e68a00', padding: '1px 3px', marginTop: '1px', color: '#000' }}>{t('PONDY')}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#808080', color: '#fff', fontWeight: 'bold' }}>
                <span style={{ fontSize: '1.4rem' }}>{t('SMR')}</span>
                <span style={{ fontSize: '0.6rem' }}>{t('OFFLINE')}</span>
              </div>
            )}
          </div>

          {/* Company Brand details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <h1 style={{ 
              margin: 0, 
              color: 'var(--classic-text-red, #800000)', 
              fontFamily: '"Times New Roman", Times, serif', 
              fontWeight: 'bold', 
              fontSize: '2rem',
              lineHeight: '1.1'
            }}>
              {settings.company_name}
            </h1>
            <p style={{ margin: 0, color: 'var(--classic-text-blue, #000080)', fontWeight: 'bold', fontSize: '0.85rem' }}>
              {t('Advanced Enterprise Inventory & Automated Billing Console')}
            </p>
          </div>
        </div>

        {/* Matrix Grid (Properties Sheet style) */}
        <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '0.82rem', fontWeight: 'bold', color: '#303030' }}>
          {t('Ⅰ. ENTERPRISE PROFILE MATRIX')}
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.2rem', fontSize: '0.8rem' }}>
          <tbody>
            <tr>
              <td style={{ width: '160px', background: '#808080', color: '#fff', padding: '5px 8px', fontWeight: 'bold', border: '1px solid #c0c0c0' }}>{t('Brand Name')}</td>
              <td className="classic-bevel-in" colSpan={3} style={{ padding: '5px 8px', background: '#fff', border: '1px solid #808080', fontWeight: 'bold' }}>
                {settings.company_name}
              </td>
            </tr>
            <tr>
              <td style={{ background: '#808080', color: '#fff', padding: '5px 8px', fontWeight: 'bold', border: '1px solid #c0c0c0' }}>{t('GSTIN / GST Number')}</td>
              <td className="classic-bevel-in" style={{ padding: '5px 8px', background: '#fff', border: '1px solid #808080', fontFamily: 'monospace', fontWeight: 'bold', color: '#008000' }}>
                {settings.gstin || t('NOT REGISTERED')}
              </td>
              <td style={{ background: '#808080', color: '#fff', padding: '5px 8px', fontWeight: 'bold', border: '1px solid #c0c0c0' }}>{t('State & Code')}</td>
              <td className="classic-bevel-in" style={{ padding: '5px 8px', background: '#fff', border: '1px solid #808080', fontWeight: 'bold' }}>
                {settings.state} ({settings.state_code})
              </td>
            </tr>
            <tr>
              <td style={{ background: '#808080', color: '#fff', padding: '5px 8px', fontWeight: 'bold', border: '1px solid #c0c0c0' }}>{t('Communication Details')}</td>
              <td className="classic-bevel-in" colSpan={3} style={{ padding: '5px 8px', background: '#fff', border: '1px solid #808080' }}>
                <strong>{t('Phone:')}</strong> {settings.phone || '—'} &nbsp;|&nbsp; <strong>{t('Email:')}</strong> {settings.email || '—'}
              </td>
            </tr>
            <tr>
              <td style={{ background: '#808080', color: '#fff', padding: '5px 8px', fontWeight: 'bold', border: '1px solid #c0c0c0' }}>{t('Registered Address')}</td>
              <td className="classic-bevel-in" colSpan={3} style={{ padding: '5px 8px', background: '#fff', border: '1px solid #808080', fontStyle: 'italic' }}>
                {settings.address}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Bank & Financial Matrix */}
        <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '0.82rem', fontWeight: 'bold', color: '#303030' }}>
          {t('Ⅱ. TREASURY & BANKING SETTINGS')}
        </h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <tbody>
            <tr>
              <td style={{ width: '160px', background: '#808080', color: '#fff', padding: '5px 8px', fontWeight: 'bold', border: '1px solid #c0c0c0' }}>{t('Bank Name')}</td>
              <td className="classic-bevel-in" style={{ padding: '5px 8px', background: '#fff', border: '1px solid #808080' }}>
                {settings.bank_name || '—'}
              </td>
              <td style={{ width: '150px', background: '#808080', color: '#fff', padding: '5px 8px', fontWeight: 'bold', border: '1px solid #c0c0c0' }}>{t('IFSC Code')}</td>
              <td className="classic-bevel-in" style={{ padding: '5px 8px', background: '#fff', border: '1px solid #808080', fontFamily: 'monospace', fontWeight: 'bold' }}>
                {settings.ifsc_code || '—'}
              </td>
            </tr>
            <tr>
              <td style={{ background: '#808080', color: '#fff', padding: '5px 8px', fontWeight: 'bold', border: '1px solid #c0c0c0' }}>{t('Account Title')}</td>
              <td className="classic-bevel-in" style={{ padding: '5px 8px', background: '#fff', border: '1px solid #808080' }}>
                {settings.account_name || '—'}
              </td>
              <td style={{ background: '#808080', color: '#fff', padding: '5px 8px', fontWeight: 'bold', border: '1px solid #c0c0c0' }}>{t('Account Number')}</td>
              <td className="classic-bevel-in" style={{ padding: '5px 8px', background: '#fff', border: '1px solid #808080', fontFamily: 'monospace', fontWeight: 'bold' }}>
                {settings.account_number || '—'}
              </td>
            </tr>
            <tr>
              <td style={{ background: '#808080', color: '#fff', padding: '5px 8px', fontWeight: 'bold', border: '1px solid #c0c0c0' }}>{t('Branch Name')}</td>
              <td className="classic-bevel-in" colSpan={3} style={{ padding: '5px 8px', background: '#fff', border: '1px solid #808080' }}>
                {settings.branch || '—'}
              </td>
            </tr>
          </tbody>
        </table>

      </div>
      
      {/* Footer copyright stamp */}
      <div style={{ fontSize: '0.7rem', color: '#505050', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '0.3rem' }}>
        <span>{t('PS - Billing Console v1.0.1 • Seychelles Matrix Engine • Licensed for Offline Production')}</span>
        <span>{t('Designed and Developed by Puspharaj M. Visakhapatnam / Puducherry, India.')}</span>
      </div>

    </div>
  );
};

export default BasicWelcome;
