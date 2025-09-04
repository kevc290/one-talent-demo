import { MiniJobListings } from '../../components/embeds/MiniJobListings';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

export function ListingsWidget() {
  return (
    <div style={{ margin: 0, padding: '16px', backgroundColor: 'transparent' }}>
      <ThemeProvider>
        <AuthProvider>
          <MiniJobListings />
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}