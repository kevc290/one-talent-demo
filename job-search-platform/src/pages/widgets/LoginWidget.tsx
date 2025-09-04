import { LoginWidget as LoginWidgetComponent } from '../../components/embeds/LoginWidget';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

export function LoginWidget() {
  return (
    <div style={{ margin: 0, padding: '16px', backgroundColor: 'transparent' }}>
      <ThemeProvider>
        <AuthProvider>
          <LoginWidgetComponent />
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}