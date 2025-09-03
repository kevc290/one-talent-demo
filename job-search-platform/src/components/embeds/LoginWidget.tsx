import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function LoginWidget() {
  const { currentBrand } = useTheme();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: ''
        });
      }, 2000);
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">
              {isLogin ? 'Welcome back!' : 'Account created!'}
            </h3>
            <p className="text-gray-600">
              {isLogin ? 'Successfully signed in' : 'Welcome to JobSearch Pro'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-sm mx-auto overflow-hidden">
      {/* JobSearch Pro Header */}
      <div className={`px-6 py-4 border-b border-gray-200 ${
        currentBrand.colors.primary === 'blue' ? 'bg-blue-50' : 
        currentBrand.colors.primary === 'purple' ? 'bg-purple-50' : 'bg-emerald-50'
      }`}>
        <div className="flex items-center justify-center space-x-3">
          <span className="text-2xl">{currentBrand.logo}</span>
          <div className="text-center">
            <h3 className={`text-lg font-bold ${
              currentBrand.colors.primary === 'blue' ? 'text-blue-600' : 
              currentBrand.colors.primary === 'purple' ? 'text-purple-600' : 'text-emerald-600'
            }`}>
              {currentBrand.name}
            </h3>
            <p className="text-xs text-gray-600">Authentication Widget</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
            currentBrand.colors.primary === 'blue' ? 'bg-blue-100' : 
            currentBrand.colors.primary === 'purple' ? 'bg-purple-100' : 'bg-emerald-100'
          }`}>
            <User className={`w-6 h-6 ${
              currentBrand.colors.primary === 'blue' ? 'text-blue-600' : 
              currentBrand.colors.primary === 'purple' ? 'text-purple-600' : 'text-emerald-600'
            }`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h3>
          <p className="text-sm text-gray-600">
            {isLogin 
              ? 'Sign in to access your dashboard' 
              : 'Join thousands of job seekers'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name fields for registration */}
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Remember me / Forgot password */}
          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-3 rounded-lg font-medium focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed ${
              currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 
              currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        {isLogin && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-600 font-medium mb-1">Demo credentials:</p>
            <p className="text-xs text-blue-600">john.doe@example.com / password123</p>
          </div>
        )}

        {/* Toggle Mode */}
        <div className="text-center space-y-3">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'
            }
          </button>
          
          {/* Full App Access */}
          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={() => navigate(isLogin ? '/login' : '/register')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Access full {currentBrand.name} platform →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}