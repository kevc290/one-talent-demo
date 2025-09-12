import { Breadcrumb } from '../components/Breadcrumb';
import { useTheme } from '../contexts/ThemeContext';
import { TrendingUp, Users, Globe, Award, Briefcase, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  const { currentBrand } = useTheme();
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'About' }
  ];

  const stats = [
    { value: '450K+', label: 'Annual Job Connections' },
    { value: '75+', label: 'Years of Excellence' },
    { value: '$4.3B', label: '2024 Revenue' },
    { value: '#1', label: 'U.S. Staffing Firm' }
  ];

  const industries = [
    'Accounting & Finance',
    'Education',
    'Engineering',
    'Government',
    'Healthcare',
    'Information Technology',
    'Manufacturing',
    'Scientific'
  ];

  const values = [
    {
      icon: Users,
      title: 'People First',
      description: 'We believe in the transformative power of talent and prioritize human potential in everything we do.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Our worldwide network connects businesses with talent across borders and time zones.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Pioneering workforce solutions since 1946, we continuously evolve to meet tomorrow\'s challenges.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Recognized as a leader in staffing by Everest Group and Forbes for our outstanding service.'
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-white`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${
        currentBrand.colors.primary === 'blue' ? 'bg-blue-600' : 
        currentBrand.colors.primary === 'purple' ? 'bg-purple-600' : 
        currentBrand.colors.primary === 'emerald' ? 'bg-emerald-600' : 'bg-gray-800'
      }`}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering Businesses & People
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-95">
              We connect talent with opportunity, creating limitless possibilities for growth and success.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className={`text-3xl font-bold mb-2`} style={{ color: currentBrand.cssVars['--color-accent'] }}>
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                Since inventing the staffing industry in 1946, we've been dedicated to connecting people with meaningful work opportunities. We believe that the right job can transform lives and the right talent can transform businesses.
              </p>
              <p className="text-lg text-gray-600">
                Today, we continue to pioneer innovative workforce solutions that adapt to the changing world of work, ensuring that both businesses and individuals can access their full potential.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: currentBrand.cssVars['--color-accent'] }} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Industry Pioneer</h3>
                  <p className="text-gray-600">Invented the staffing industry and continue to lead innovation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: currentBrand.cssVars['--color-accent'] }} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Global Network</h3>
                  <p className="text-gray-600">Extensive reach across industries and geographic boundaries</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: currentBrand.cssVars['--color-accent'] }} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Trusted Partner</h3>
                  <p className="text-gray-600">75+ years of experience matching talent with opportunity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                     style={{ backgroundColor: `${currentBrand.cssVars['--color-accent']}15` }}>
                  <value.icon className="w-6 h-6" style={{ color: currentBrand.cssVars['--color-accent'] }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Industries Section */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our expertise spans across diverse sectors, ensuring specialized knowledge and tailored solutions for every industry.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white rounded-lg px-4 py-3 text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-gray-700 font-medium">{industry}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recognition Section */}
        <div className={`mt-16 rounded-xl p-8 md:p-12 text-white`} style={{ 
          backgroundColor: currentBrand.cssVars['--color-primary'] 
        }}>
          <div className="max-w-3xl mx-auto text-center">
            <Award className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Industry Recognition</h2>
            <p className="text-lg mb-6 opacity-95">
              Everest Group names us a Leader and Star Performer in Professional, Industrial, IT, and Engineering Staffing. 
              Forbes ranks us as the #1 temporary staffing firm in the United States.
            </p>
            <p className="text-lg opacity-90">
              These accolades reflect our unwavering commitment to excellence and innovation in workforce solutions.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking for your next career opportunity or seeking top talent for your organization, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: currentBrand.cssVars['--color-accent'] }}
            >
              Find Jobs
              <ArrowRight className="w-5 h-5" />
            </Link>
            {/* <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Post a Job
              <Briefcase className="w-5 h-5" />
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}