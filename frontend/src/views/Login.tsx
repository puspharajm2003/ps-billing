import { useState, type FormEvent } from 'react';
import { useAuth } from '../AuthContext';

const t = (val: string) => val;

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
      setIsLoading(false);
    }
  };

  const handleExit = () => {
    // Clear inputs or show a message if they try to exit the web app
    setUsername('');
    setPassword('');
    setError('Cannot exit web application. Please close the browser tab.');
  };

  return (
    <div style={{
      margin: 0,
      padding: 0,
      width: '100vw',
      height: '100vh',
      /* Classic Windows Desktop Gradient */
      background: 'linear-gradient(to bottom right, #000040, #1e3c72, #2a5298, #000080)',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Desktop Icons */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Icon 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{
            width: '32px', height: '32px', background: '#fff', border: '1px solid #000', position: 'relative',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.5)'
          }}>
            {/* Fake shortcut arrow */}
            <div style={{ position: 'absolute', bottom: -4, left: -4, background: '#fff', border: '1px solid #000', width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: '4px solid #000' }} />
            </div>
          </div>
          <span style={{ color: '#fff', textShadow: '1px 1px 1px #000', fontSize: '12px', marginTop: '4px', textAlign: 'center' }}>
            {t('SMR')}<br/>{t('Tamilnadu')}
          </span>
        </div>
        
        {/* Icon 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{
            width: '32px', height: '32px', background: '#fff', border: '1px solid #000', position: 'relative',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.5)'
          }}>
            <div style={{ position: 'absolute', bottom: -4, left: -4, background: '#fff', border: '1px solid #000', width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: '4px solid #000' }} />
            </div>
          </div>
          <span style={{ color: '#fff', textShadow: '1px 1px 1px #000', fontSize: '12px', marginTop: '4px', textAlign: 'center' }}>
            {t('SMR Pondy')}
          </span>
        </div>
      </div>

      {/* Login Dialog Box */}
      <div style={{
        background: '#c0c0c0',
        padding: '2px', // Thin outer border
        borderTop: '2px solid #ffffff',
        borderLeft: '2px solid #ffffff',
        borderRight: '2px solid #404040',
        borderBottom: '2px solid #404040',
        width: '450px',
        boxShadow: '4px 4px 10px rgba(0,0,0,0.5)'
      }}>
        {/* Inner grey area with top grey bar */}
        <div style={{
          background: '#c0c0c0',
          paddingTop: '20px',
          paddingBottom: '25px',
          paddingLeft: '15px',
          paddingRight: '15px',
        }}>
          {/* Inner inset border box */}
          <div style={{
            borderTop: '1px solid #808080',
            borderLeft: '1px solid #808080',
            borderRight: '1px solid #ffffff',
            borderBottom: '1px solid #ffffff',
            padding: '30px 20px',
            position: 'relative'
          }}>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              {/* Error Message */}
              {error && (
                <div style={{ position: 'absolute', top: '5px', left: '20px', color: 'red', fontSize: '12px', fontWeight: 'bold' }}>
                  {error}
                </div>
              )}

              {/* Username Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ 
                  color: '#800000', // Maroon
                  fontFamily: '"Times New Roman", Times, serif', 
                  fontWeight: 'bold', 
                  fontSize: '18px',
                  width: '120px'
                }}>
                  {t('User Name')}
                </label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    height: '28px',
                    borderTop: '2px solid #808080',
                    borderLeft: '2px solid #808080',
                    borderRight: '2px solid #ffffff',
                    borderBottom: '2px solid #ffffff',
                    padding: '0 5px',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#fff',
                    color: '#000'
                  }}
                />
              </div>

              {/* Password Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ 
                  color: '#800000', // Maroon
                  fontFamily: '"Times New Roman", Times, serif', 
                  fontWeight: 'bold', 
                  fontSize: '18px',
                  width: '120px'
                }}>
                  {t('Password')}
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    height: '28px',
                    borderTop: '2px solid #808080',
                    borderLeft: '2px solid #808080',
                    borderRight: '2px solid #ffffff',
                    borderBottom: '2px solid #ffffff',
                    padding: '0 5px',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#fff',
                    color: '#000'
                  }}
                />
              </div>

              {/* Buttons Row */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '15px' }}>
                <button 
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: '#e68a00', // Classic Orange
                    borderTop: '2px solid #ffffff',
                    borderLeft: '2px solid #ffffff',
                    borderRight: '2px solid #000000',
                    borderBottom: '2px solid #000000',
                    padding: '6px 20px',
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#000',
                    cursor: isLoading ? 'wait' : 'pointer',
                    minWidth: '100px'
                  }}
                >
                  <span style={{ textDecoration: 'underline' }}>{t('L')}</span>{t('OGIN')}
                </button>

                <button 
                  type="button"
                  onClick={handleExit}
                  style={{
                    background: '#e68a00', // Classic Orange
                    borderTop: '2px solid #ffffff',
                    borderLeft: '2px solid #ffffff',
                    borderRight: '2px solid #000000',
                    borderBottom: '2px solid #000000',
                    padding: '6px 20px',
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#000',
                    cursor: 'pointer',
                    minWidth: '100px'
                  }}
                >
                  <span style={{ textDecoration: 'underline' }}>{t('E')}</span>{t('XIT')}
                </button>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <a 
                  href="https://github.com/puspharajm2003/ps-billing/releases/latest" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    color: '#0000ee',
                    textDecoration: 'underline',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Download Desktop App
                </a>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
