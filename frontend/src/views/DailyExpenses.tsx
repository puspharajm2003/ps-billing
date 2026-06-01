import React, { useState } from 'react';
import './Views.css';

const t = (val: string) => val;

export const DailyExpenses: React.FC = () => {
  const [refNo, setRefNo] = useState('');
  const [refDate, setRefDate] = useState(new Date().toLocaleDateString('en-IN', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, ' / '));
  const [expensesGroup, setExpensesGroup] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');

  return (
    <div className="view-container animate-slide-down">
      <div className="view-header">
        <div>
          <h2>{t('Daily Expenses')}</h2>
          <p>{t('Manage daily operational expenses')}</p>
        </div>
      </div>

      <div className="glass-card" style={{ flex: 1, display: 'flex', gap: '20px', minHeight: '400px' }}>
        
        {/* Left Column: Ref. No. List */}
        <div style={{ width: '120px', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', background: 'var(--color-bg-tertiary)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ borderBottom: '1px solid var(--color-border)', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {t('Ref. No.')}
          </div>
          <div style={{ flex: 1 }}>
            {/* List items would go here */}
          </div>
        </div>

        {/* Right Column: Form Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header Info Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)', marginBottom: '20px' }}>
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
              <label style={{ width: '80px' }}>{t('Ref. No.')} :</label>
              <input 
                type="text" 
                value={refNo} 
                onChange={e => setRefNo(e.target.value)} 
                className="form-control"
                style={{ width: '100px' }}
              />
            </div>
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
              <label style={{ width: '80px' }}>{t('Ref. Date')} :</label>
              <input 
                type="text" 
                value={refDate} 
                onChange={e => setRefDate(e.target.value)} 
                className="form-control"
                style={{ width: '120px', textAlign: 'center' }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px', margin: '0 auto', flex: 1, justifyContent: 'center' }}>
            
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
              <label style={{ width: '120px', textAlign: 'right', marginRight: '15px' }}>{t('Expenses Group')} :</label>
              <input 
                list="expenses-groups"
                value={expensesGroup} 
                onChange={e => setExpensesGroup(e.target.value)}
                className="form-control"
                style={{ flex: 1 }}
              />
              <datalist id="expenses-groups">
                <option value={t('Travel')} />
                <option value={t('Food & Dining')} />
                <option value={t('Office Supplies')} />
              </datalist>
            </div>

            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
              <label style={{ width: '120px', textAlign: 'right', marginRight: '15px' }}>{t('Amount')} :</label>
              <input 
                type="text" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                className="form-control"
                style={{ width: '150px' }}
              />
            </div>

            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
              <label style={{ width: '120px', textAlign: 'right', marginRight: '15px' }}>{t('Narration')} :</label>
              <input 
                type="text" 
                value={narration} 
                onChange={e => setNarration(e.target.value)} 
                className="form-control"
                style={{ flex: 1 }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Button Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" style={{ width: '100px' }}>{t('Add')}</button>
          <button className="btn btn-secondary" style={{ width: '100px' }} disabled>{t('Save')}</button>
          <button className="btn btn-secondary" style={{ width: '100px' }} disabled>{t('Undo')}</button>
          <button className="btn btn-secondary" style={{ width: '100px' }}>{t('Exit')}</button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" style={{ width: '100px' }} disabled>{t('Edit')}</button>
          <button className="btn btn-secondary" style={{ width: '100px' }} disabled>{t('Delete')}</button>
        </div>
      </div>
    </div>
  );
};

export default DailyExpenses;
