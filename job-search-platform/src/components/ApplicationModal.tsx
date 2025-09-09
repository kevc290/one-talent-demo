import { useState } from 'react';
import { X, Upload, CheckCircle, FileText, AlertCircle, UserPlus, Tag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { mockAuth } from '../utils/mockAuth';
import { parseResume, isValidResumeFile } from '../utils/resumeParser';
import type { Job } from '../data/jobs';

interface ApplicationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onApplicationSubmitted?: () => void;
}

export function ApplicationModal({ job, isOpen, onClose, onApplicationSubmitted }: ApplicationModalProps) {
  const { currentBrand } = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    password: '',
    confirmPassword: '',
  });
  const [parsedSkills, setParsedSkills] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [parseError, setParseError] = useState('');
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processDroppedFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragOver(false);
      }
      return newCounter;
    });
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(0);
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      await processDroppedFile(file);
    }
  };

  const processDroppedFile = async (file: File) => {
    setFileName(file.name);
    setParseError('');
    setParseSuccess(false);
    setParsedSkills([]);

    // Validate file type
    if (!isValidResumeFile(file)) {
      setParseError('Invalid file type. Please upload PDF, DOCX, DOC, or TXT files.');
      return;
    }

    // Parse resume
    setIsParsing(true);
    try {
      // Try to use Claude AI if API key is available
      const claudeApiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      const parseResult = await parseResume(file, { 
        useClaudeAI: !!claudeApiKey,
        apiKey: claudeApiKey 
      });
      
      if (parseResult.success && parseResult.data) {
        // Auto-fill form fields from parsed data
        const parsedData = parseResult.data;
        
        setFormData(prev => ({
          ...prev,
          fullName: parsedData.fullName || prev.fullName,
          email: parsedData.email || prev.email,
          phone: parsedData.phone || prev.phone,
        }));

        // Set parsed skills
        if (parsedData.skills && parsedData.skills.length > 0) {
          setParsedSkills(parsedData.skills);
        }

        // Update user profile if logged in
        if (user) {
          updateProfileFromResume(parsedData, file.name);
        }

        setParseSuccess(true);
      } else {
        setParseError(parseResult.error || 'Failed to parse resume');
      }
    } catch (error) {
      console.error('Resume processing error:', error);
      setParseError('Failed to parse resume. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    }
    
    // Validate password fields if creating account
    if (showAccountCreation && !user) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { user, updateProfileFromResume, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      let applicationUser = user;
      
      // Create account for unauthenticated users
      if (!user && showAccountCreation) {
        try {
          const [firstName, ...lastNameParts] = formData.fullName.trim().split(' ');
          const lastName = lastNameParts.join(' ') || firstName; // Fallback if no last name
          
          await register({
            firstName,
            lastName,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.password,
          });
          
          setAccountCreated(true);
          
          // Get the newly created user (register should auto-login)
          applicationUser = user;
          
          // Wait a moment to ensure auth state updates
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          setIsSubmitting(false);
          setErrors({ email: 'Account creation failed. This email might already be registered.' });
          return;
        }
      }
      
      // Simulate API call for application submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save application to user's applications if authenticated (or just created account)
      if (applicationUser || user) {
        const currentUser = applicationUser || user;
        if (currentUser) {
          mockAuth.addApplication(currentUser.id, {
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            appliedDate: new Date().toISOString(),
            status: 'pending'
          });
        }
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Call the callback if provided
      if (onApplicationSubmitted) {
        onApplicationSubmitted();
      }
      
      // Reset form after 4 seconds and close modal
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ fullName: '', email: '', phone: '', coverLetter: '', password: '', confirmPassword: '' });
        setFileName('');
        setErrors({});
        setParseSuccess(false);
        setParseError('');
        setParsedSkills([]);
        setShowAccountCreation(false);
        setAccountCreated(false);
        setIsDragOver(false);
        setDragCounter(0);
        onClose();
      }, 4000);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ general: 'An error occurred while submitting your application. Please try again.' });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ fullName: '', email: '', phone: '', coverLetter: '', password: '', confirmPassword: '' });
      setFileName('');
      setErrors({});
      setIsSubmitted(false);
      setParseSuccess(false);
      setParseError('');
      setShowAccountCreation(false);
      setAccountCreated(false);
      setIsDragOver(false);
      setDragCounter(0);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Apply for Position</h2>
            <p className="text-sm text-gray-600 mt-1">
              {job.title} at {job.company}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {accountCreated ? 'Account Created & Application Submitted!' : 'Application Submitted!'}
            </h3>
            <p className="text-gray-600">
              {accountCreated ? (
                <>
                  Welcome to JobSearch Pro! Your account has been created and your application for the {job.title} position has been submitted. 
                  You can now track your applications in your dashboard.
                </>
              ) : (
                <>
                  Thank you for your interest in the {job.title} position. We'll review your application and get back to you soon.
                </>
              )}
            </p>
          </div>
        )}

        {/* Form */}
        {!isSubmitted && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Parsed Skills Display */}
            {parsedSkills.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-600" />
                  <h4 className="text-sm font-medium text-gray-700">
                    Skills Extracted from Resume ({parsedSkills.length})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {parsedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currentBrand.colors.primary === 'blue' 
                          ? 'bg-blue-100 text-blue-800' 
                          : currentBrand.colors.primary === 'purple'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  {import.meta.env.VITE_CLAUDE_API_KEY 
                    ? 'Skills extracted using AI-powered analysis' 
                    : 'Add a Claude API key for enhanced skill extraction'}
                </p>
              </div>
            )}

            {/* Account Creation Prompt for Unauthenticated Users */}
            {!user && (
              <div className={`rounded-lg p-4 ${
                currentBrand.colors.primary === 'blue' ? 'bg-blue-50 border border-blue-200' : 
                currentBrand.colors.primary === 'purple' ? 'bg-purple-50 border border-purple-200' : 'bg-emerald-50 border border-emerald-200'
              }`}>
                <div className="flex items-start space-x-3">
                  <UserPlus className={`w-5 h-5 mt-0.5 ${
                    currentBrand.colors.primary === 'blue' ? 'text-blue-600' : 
                    currentBrand.colors.primary === 'purple' ? 'text-purple-600' : 'text-emerald-600'
                  }`} />
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium mb-1 ${
                      currentBrand.colors.primary === 'blue' ? 'text-blue-900' : 
                      currentBrand.colors.primary === 'purple' ? 'text-purple-900' : 'text-emerald-900'
                    }`}>
                      Create an account to track your applications
                    </h4>
                    <p className={`text-xs mb-3 ${
                      currentBrand.colors.primary === 'blue' ? 'text-blue-700' : 
                      currentBrand.colors.primary === 'purple' ? 'text-purple-700' : 'text-emerald-700'
                    }`}>
                      Get access to your dashboard, save jobs, and track your application status.
                    </p>
                    
                    {!showAccountCreation ? (
                      <button
                        type="button"
                        onClick={() => setShowAccountCreation(true)}
                        className={`text-xs font-medium ${
                          currentBrand.colors.primary === 'blue' ? 'text-blue-600 hover:text-blue-700' : 
                          currentBrand.colors.primary === 'purple' ? 'text-purple-600 hover:text-purple-700' : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                      >
                        Yes, create my account →
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${
                              currentBrand.colors.primary === 'blue' ? 'text-blue-900' : 
                              currentBrand.colors.primary === 'purple' ? 'text-purple-900' : 'text-emerald-900'
                            }`}>
                              Password *
                            </label>
                            <input
                              type="password"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
                                errors.password ? 'border-red-300 bg-red-50' : 
                                currentBrand.colors.primary === 'blue' ? 'border-blue-300' : 
                                currentBrand.colors.primary === 'purple' ? 'border-purple-300' : 'border-emerald-300'
                              }`}
                              placeholder="Create password"
                            />
                            {errors.password && (
                              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${
                              currentBrand.colors.primary === 'blue' ? 'text-blue-900' : 
                              currentBrand.colors.primary === 'purple' ? 'text-purple-900' : 'text-emerald-900'
                            }`}>
                              Confirm Password *
                            </label>
                            <input
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
                                errors.confirmPassword ? 'border-red-300 bg-red-50' : 
                                currentBrand.colors.primary === 'blue' ? 'border-blue-300' : 
                                currentBrand.colors.primary === 'purple' ? 'border-purple-300' : 'border-emerald-300'
                              }`}
                              placeholder="Confirm password"
                            />
                            {errors.confirmPassword && (
                              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                            )}
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => setShowAccountCreation(false)}
                          className={`text-xs ${
                            currentBrand.colors.primary === 'blue' ? 'text-blue-600 hover:text-blue-700' : 
                            currentBrand.colors.primary === 'purple' ? 'text-purple-600 hover:text-purple-700' : 'text-emerald-600 hover:text-emerald-700'
                          }`}
                        >
                          ← Skip account creation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume/CV
              </label>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 relative cursor-pointer ${
                  parseSuccess ? 'border-green-400 bg-green-50' : 
                  parseError ? 'border-red-400 bg-red-50' : 
                  isDragOver ? 
                    currentBrand.colors.primary === 'blue' ? 'border-blue-500 bg-blue-50 scale-105' :
                    currentBrand.colors.primary === 'purple' ? 'border-purple-500 bg-purple-50 scale-105' : 'border-emerald-500 bg-emerald-50 scale-105'
                  :
                    currentBrand.colors.primary === 'blue' ? 'border-gray-300 hover:border-blue-400' : 
                    currentBrand.colors.primary === 'purple' ? 'border-gray-300 hover:border-purple-400' : 'border-gray-300 hover:border-emerald-400'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isParsing ? (
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-2 ${
                      currentBrand.colors.primary === 'blue' ? 'border-blue-600' : 
                      currentBrand.colors.primary === 'purple' ? 'border-purple-600' : 'border-emerald-600'
                    }`}></div>
                    <p className={`text-sm ${
                      currentBrand.colors.primary === 'blue' ? 'text-blue-600' : 
                      currentBrand.colors.primary === 'purple' ? 'text-purple-600' : 'text-emerald-600'
                    }`}>Parsing resume...</p>
                  </div>
                ) : parseSuccess ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                    <p className="text-sm text-green-700 mb-1">Resume processed successfully!</p>
                    <p className="text-xs text-green-600">Form fields have been auto-filled with demo data</p>
                    <p className="text-xs text-blue-600 mt-1">📝 Note: GitHub Pages uses mock parsing for demo purposes</p>
                  </div>
                ) : parseError ? (
                  <div className="flex flex-col items-center">
                    <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
                    <p className="text-sm text-red-700 mb-1">Parsing failed</p>
                    <p className="text-xs text-red-600">{parseError}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      {fileName ? fileName : isDragOver ? 'Drop your resume here!' : 'Click to upload or drag & drop your resume'}
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX, DOC, or TXT (max 5MB)</p>
                    <p className={`text-xs mt-1 ${
                      currentBrand.colors.primary === 'blue' ? 'text-blue-600' : 
                      currentBrand.colors.primary === 'purple' ? 'text-purple-600' : 'text-emerald-600'
                    }`}>✨ AI-powered parsing will fill your details</p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isParsing}
                />
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                  errors.coverLetter ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              />
              {errors.coverLetter && (
                <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.coverLetter.length}/500 characters
              </p>
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center ${
                  currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                  currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {!user && showAccountCreation ? 'Creating Account...' : 'Submitting...'}
                  </>
                ) : (
                  !user && showAccountCreation ? 'Create Account & Apply' : 'Submit Application'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}