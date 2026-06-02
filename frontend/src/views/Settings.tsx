import React, { useState, useEffect } from 'react';
import { 
  Building, CreditCard, Save, AlertTriangle, CheckCircle, Layers, Plus, Trash2
} from 'lucide-react';
import { API_URL } from '../App';
import type { CompanySettings, CustomSectionDef } from '../App';
import { useAuth } from '../AuthContext';
import './Views.css';

// Translation helper
const t = (val: string) => val;

interface SettingsProps {
  onSettingsUpdate: () => void;
  onSectionsUpdate?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSettingsUpdate, onSectionsUpdate }) => {
  const { authFetch } = useAuth();
  const [settings, setSettings] = useState<CompanySettings>({
    id: 1,
    company_name: '',
    address: '',
    phone: '',
    email: '',
    gstin: '',
    state: '',
    state_code: '',
    bank_name: '',
    account_name: '',
    account_number: '',
    ifsc_code: '',
    branch: '',
    terms_conditions: ''
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Custom sections state
  const [customSections, setCustomSections] = useState<CustomSectionDef[]>([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionColor, setNewSectionColor] = useState('#6366f1');
  const [sectionAlert, setSectionAlert] = useState<string | null>(null);

  // Backup state
  const [securityKey, setSecurityKey] = useState('');
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupAlert, setBackupAlert] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await authFetch(`${API_URL}/settings`);
      if (res.ok) {
        const data = await res.json();
        if (data) setSettings(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchCustomSections = async () => {
    try {
      const res = await authFetch(`${API_URL}/custom-sections`);
      if (res.ok) setCustomSections(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchSettings();
    fetchCustomSections();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim()) { setSectionAlert('Please enter a section name.'); return; }
    setSectionAlert(null);
    try {
      const res = await authFetch(`${API_URL}/custom-sections`, {
        method: 'POST',
        body: JSON.stringify({ name: newSectionName.trim(), color: newSectionColor })
      });
      if (res.ok) {
        setNewSectionName('');
        setNewSectionColor('#6366f1');
        await fetchCustomSections();
        if (onSectionsUpdate) onSectionsUpdate();
        setSectionAlert('✓ Section created successfully!');
        setTimeout(() => setSectionAlert(null), 3000);
      } else {
        const err = await res.json();
        setSectionAlert(err.error || 'Failed to create section.');
      }
    } catch (err) { setSectionAlert('Network error.'); }
  };

  const handleDeleteSection = async (id: number, name: string) => {
    if (!window.confirm(`Delete the "${name}" section? All documents in this section will remain in the database but will no longer be accessible via this menu.`)) return;
    try {
      const res = await authFetch(`${API_URL}/custom-sections/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchCustomSections();
        if (onSectionsUpdate) onSectionsUpdate();
      }
    } catch (err) { console.error(err); }
  };

  const handleBackup = async () => {
    if (securityKey.length < 6) {
      setBackupAlert('Security key must be at least 6 characters.');
      return;
    }
    setBackupLoading(true);
    setBackupAlert(null);
    try {
      const res = await authFetch(`${API_URL}/backup`, {
        method: 'POST',
        body: JSON.stringify({ securityKey })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // The filename is provided in Content-Disposition header, but we can set a fallback here
        const contentDisposition = res.headers.get('Content-Disposition');
        let filename = 'backup.enc';
        if (contentDisposition && contentDisposition.includes('filename="')) {
          filename = contentDisposition.split('filename="')[1].split('"')[0];
        }
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setBackupAlert('✓ Backup downloaded successfully!');
        setSecurityKey('');
      } else {
        const err = await res.json();
        setBackupAlert(err.error || 'Backup failed.');
      }
    } catch (err) {
      setBackupAlert('Network error during backup.');
    } finally {
      setBackupLoading(false);
    }
  };

  if (loading && !settings.company_name) {
    return (
      <div className="view-container">
        <p className="text-secondary">{t('Loading enterprise configuration...')}</p>
      </div>
    );
  }

  return (
    <div className="view-container animate-slide-down">
      <div className="view-header">
        <div>
          <h2>{t('Enterprise Settings')}</h2>
          <p>{t('Govern SMR Groups credentials, banking integrations, and terms of service')}</p>
        </div>
      </div>

      {alert && (
        <div 
          className={`glass-card flex items-center gap-4 ${alert.type === 'success' ? 'text-blue' : 'text-gold'}`}
          style={{ borderColor: alert.type === 'success' ? 'var(--color-accent-blue)' : 'var(--color-accent-gold)' }}
        >
          {alert.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span>{alert.message}</span>
        </div>
      )}

      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setAlert(null);
          try {
            const res = await authFetch(`${API_URL}/settings`, {
              method: 'PUT',
              body: JSON.stringify(settings)
            });
            if (res.ok) {
              setAlert({ type: 'success', message: t('Enterprise profile settings updated successfully.') });
              onSettingsUpdate();
            } else {
              setAlert({ type: 'error', message: t('Failed to update settings.') });
            }
            setLoading(false);
          } catch (err) {
            console.error(err);
            setAlert({ type: 'error', message: t('Network error. Please try again.') });
            setLoading(false);
          }
        }} 
        className="flex flex-col gap-6"
      >
        <div className="glass-card flex flex-col gap-4">
          <h3 className="text-gold flex items-center gap-2">
            <Building size={20} />
            <span>{t('Company Profile Credentials')}</span>
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label>{t('Company / Corporate Name')}</label>
              <input type="text" name="company_name" value={settings.company_name} onChange={handleChange} required className="form-control" />
            </div>
            <div className="form-group">
              <label>{t('Corporate GSTIN')}</label>
              <input type="text" name="gstin" value={settings.gstin} onChange={handleChange} placeholder={t('e.g. 37AAAAASMRG1Z9')} className="form-control" style={{ fontFamily: 'monospace', letterSpacing: '1px' }} />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>{t('Phone / Support Hotline')}</label>
              <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>{t('Billing & Finance Email')}</label>
              <input type="email" name="email" value={settings.email} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>{t('State Jurisdiction')}</label>
              <input type="text" name="state" value={settings.state} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>{t('State Code')}</label>
              <input type="text" name="state_code" value={settings.state_code} onChange={handleChange} className="form-control" style={{ width: '80px', textAlign: 'center' }} />
            </div>
          </div>

          <div className="form-group">
            <label>{t('Registered Office Address')}</label>
            <textarea name="address" value={settings.address} onChange={handleChange} required rows={3} className="form-control" />
          </div>
        </div>

        <div className="glass-card flex flex-col gap-4">
          <h3 className="text-blue flex items-center gap-2">
            <CreditCard size={20} />
            <span>{t('Corporate Banking Details')}</span>
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label>{t('Bank Name')}</label>
              <input type="text" name="bank_name" value={settings.bank_name} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>{t('Account Holder Name')}</label>
              <input type="text" name="account_name" value={settings.account_name} onChange={handleChange} className="form-control" />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>{t('Account Number')}</label>
              <input type="text" name="account_number" value={settings.account_number} onChange={handleChange} className="form-control" style={{ fontFamily: 'monospace' }} />
            </div>
            <div className="form-group">
              <label>{t('IFSC Code')}</label>
              <input type="text" name="ifsc_code" value={settings.ifsc_code} onChange={handleChange} className="form-control" style={{ fontFamily: 'monospace', textTransform: 'uppercase' }} />
            </div>
            <div className="form-group">
              <label>{t('Bank Branch')}</label>
              <input type="text" name="branch" value={settings.branch} onChange={handleChange} className="form-control" />
            </div>
          </div>
        </div>

        <div className="glass-card flex flex-col gap-4">
          <h3 className="text-secondary flex items-center gap-2">
            <span>{t('Declarations & Invoice Terms')}</span>
          </h3>
          <div className="form-group">
            <label>{t('Terms & Conditions (printed on footer of invoice)')}</label>
            <textarea name="terms_conditions" value={settings.terms_conditions} onChange={handleChange} rows={4} className="form-control" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-muted text-secondary" style={{ fontSize: '0.8rem' }}>
            {t('Updates apply instantly to new quotes, sales sheets, and ledgers.')}
          </p>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={18} />
            <span>{loading ? t('Saving Changes...') : t('Save Settings')}</span>
          </button>
        </div>
      </form>

      {/* ========================
          SECURE DATABASE BACKUP
          ======================== */}
      <div className="glass-card flex flex-col gap-4" style={{ borderColor: 'var(--color-accent-gold)', borderWidth: '1px', marginTop: '1.5rem' }}>
        <h3 className="text-gold flex items-center gap-2">
          <Save size={20} />
          <span>{t('Secure Offline Backup')}</span>
        </h3>
        <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
          {t('Download an encrypted copy of your entire local database (Settings, Invoices, Customers, Items, etc.). The file will be encrypted using AES-256 with the security key you provide below.')}
        </p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: 200 }}>
            <label>{t('Encryption Security Key (Min 6 chars)')}</label>
            <input 
              type="password" 
              value={securityKey} 
              onChange={e => setSecurityKey(e.target.value)} 
              placeholder="e.g. MySecretKey123"
              className="form-control"
            />
          </div>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleBackup}
            disabled={backupLoading}
            style={{ background: 'var(--color-accent-gold)', borderColor: 'var(--color-accent-gold)', color: '#000', marginBottom: '0.4rem' }}
          >
            <Save size={16} />
            <span>{backupLoading ? t('Encrypting & Downloading...') : t('Download Encrypted Backup')}</span>
          </button>
        </div>
        {backupAlert && (
          <p style={{ color: backupAlert.startsWith('✓') ? '#10b981' : '#ef4444', fontSize: '0.85rem' }}>
            {backupAlert}
          </p>
        )}
      </div>

      {/* ========================
          DOCUMENT SECTIONS MANAGER
          ======================== */}
      <div className="glass-card flex flex-col gap-4" style={{ borderColor: '#6366f1', borderWidth: '1px' }}>
        <h3 style={{ color: '#6366f1' }} className="flex items-center gap-2">
          <Layers size={20} />
          <span>{t('Document Sections Manager')}</span>
        </h3>
        <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
          {t('Create custom document types like')} <strong>{t('Purchase Orders')}</strong>, <strong>{t('Sales Orders')}</strong>, {t('or')} <strong>{t('Proforma Invoices')}</strong>. 
          {t('Each section gets its own dedicated tab in the sidebar and menu.')}
        </p>

        {/* Existing sections list */}
        {customSections.length > 0 && (
          <div className="table-responsive">
            <table className="table-glass">
              <thead>
                <tr>
                  <th>{t('Section Name')}</th>
                  <th>{t('URL Slug')}</th>
                  <th>{t('Color')}</th>
                  <th style={{ width: 80, textAlign: 'center' }}>{t('Delete')}</th>
                </tr>
              </thead>
              <tbody>
                {customSections.map(sec => (
                  <tr key={sec.id}>
                    <td style={{ fontWeight: 600 }}>
                      <span style={{ 
                        display: 'inline-block', width: 10, height: 10, 
                        borderRadius: '50%', backgroundColor: sec.color, 
                        marginRight: 8 
                      }} />
                      {sec.name}
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>/section/{sec.slug}</td>
                    <td>
                      <span style={{ 
                        display: 'inline-block', 
                        background: sec.color, 
                        color: '#fff', 
                        padding: '2px 10px', 
                        borderRadius: 4, 
                        fontSize: '0.8rem' 
                      }}>{sec.color}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleDeleteSection(sec.id, sec.name)}
                        style={{ color: '#ef4444', padding: '0.35rem 0.6rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add new section */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: 200 }}>
            <label>{t('New Section Name')}</label>
            <input 
              type="text" 
              value={newSectionName} 
              onChange={e => setNewSectionName(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSection())}
              placeholder="e.g. Dispatch Note, AMC Invoice..."
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>{t('Accent Color')}</label>
            <input 
              type="color" 
              value={newSectionColor} 
              onChange={e => setNewSectionColor(e.target.value)}
              style={{ width: 50, height: 38, padding: 2, border: '1px solid var(--color-border)', borderRadius: 6, cursor: 'pointer' }}
            />
          </div>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleAddSection}
            style={{ background: newSectionColor, borderColor: newSectionColor, marginBottom: '0.4rem' }}
          >
            <Plus size={16} />
            <span>{t('Add Section')}</span>
          </button>
        </div>
        {sectionAlert && (
          <p style={{ color: sectionAlert.startsWith('✓') ? '#10b981' : '#ef4444', fontSize: '0.85rem' }}>
            {sectionAlert}
          </p>
        )}
      </div>
    </div>
  );
};

export default Settings;