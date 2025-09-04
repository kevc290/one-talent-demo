import { JobSearchWidget } from '../../components/embeds/JobSearchWidget';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

export function SearchWidget() {
  return (
    <div style={{ margin: 0, padding: '16px', backgroundColor: 'transparent' }}>
      <ThemeProvider>
        <AuthProvider>
          <JobSearchWidget />
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}