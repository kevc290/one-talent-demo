export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companyInfo: {
    size: string;
    founded: string;
    industry: string;
    website: string;
    description: string;
  };
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary: {
    min: number;
    max: number;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  department: 'Software' | 'Healthcare' | 'Manufacturing';
}

// export const jobs: Job[] = [
//   {
//     id: '1',
//     title: 'Senior Full Stack Developer',
//     company: 'TechCorp Solutions',
//     companyLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=120&fit=crop&crop=center&auto=format',
//     companyInfo: {
//       size: '500-1000 employees',
//       founded: '2015',
//       industry: 'Technology',
//       website: 'https://techcorp.com',
//       description: 'TechCorp Solutions is a leading software company specializing in enterprise solutions and cloud services.'
//     },
//     location: 'San Francisco, CA',
//     type: 'Full-time',
//     salary: { min: 140000, max: 180000 },
//     description: 'We are looking for an experienced Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies. This role offers the opportunity to work on cutting-edge projects with a collaborative team of engineers.',
//     requirements: ['5+ years of experience in full-stack development', 'Expert knowledge of React & Node.js', 'Experience with AWS cloud services', 'Strong communication and teamwork skills', 'Bachelor\'s degree in Computer Science or related field'],
//     benefits: ['Comprehensive health insurance', 'Dental and vision coverage', 'Flexible work arrangements', '401(k) with company matching', 'Professional development budget', 'Stock options'],
//     postedDate: '2025-08-28',
//     department: 'Software'
//   },
//   {
//     id: '2',
//     title: 'Frontend Engineer',
//     company: 'Digital Innovations',
//     companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=120&fit=crop&crop=center&auto=format',
//     companyInfo: {
//       size: '100-500 employees',
//       founded: '2018',
//       industry: 'Digital Agency',
//       website: 'https://digitalinnovations.com',
//       description: 'Digital Innovations creates stunning digital experiences for Fortune 500 companies worldwide.'
//     },
//     location: 'Remote',
//     type: 'Remote',
//     salary: { min: 100000, max: 140000 },
//     description: 'Join our remote-first team building cutting-edge user interfaces. We value creativity and technical excellence in equal measure. You\'ll work on diverse projects for high-profile clients.',
//     requirements: ['3+ years React/TypeScript experience', 'Strong UI/UX design sensibility', 'Experience with modern design systems', 'Familiarity with Agile methodology', 'Portfolio of recent work'],
//     benefits: ['Remote work flexibility', 'Home office stipend', 'Health and wellness allowance', 'Unlimited PTO', 'Learning and conference budget', 'Top-tier equipment'],
//     postedDate: '2025-08-30',
//     department: 'Software'
//   },
//   {
//     id: '3',
//     title: 'DevOps Engineer',
//     company: 'CloudScale Inc',
//     companyLogo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&h=120&fit=crop&crop=center&auto=format',
//     companyInfo: {
//       size: '200-500 employees',
//       founded: '2016',
//       industry: 'Cloud Computing',
//       website: 'https://cloudscale.com',
//       description: 'CloudScale provides enterprise cloud infrastructure and DevOps solutions to companies worldwide.'
//     },
//     location: 'Austin, TX',
//     type: 'Full-time',
//     salary: { min: 120000, max: 160000 },
//     description: 'Help us build and maintain scalable infrastructure for our cloud-native applications. Experience with Kubernetes and CI/CD pipelines required. You\'ll work with the latest tools and technologies.',
//     requirements: ['Kubernetes expertise and certification preferred', 'CI/CD pipeline design and management', 'Infrastructure as Code (Terraform, Ansible)', 'Linux system administration', 'Docker containerization'],
//     benefits: ['Competitive salary and bonuses', 'Full health benefits', 'Flexible work schedule', 'Professional certification support', '401(k) matching', 'Team outings and events'],
//     postedDate: '2025-09-01',
//     department: 'Software'
//   },
//   {
//     id: '4',
//     title: 'Mobile App Developer',
//     company: 'AppWorks Studio',
//     companyLogo: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=120&h=120&fit=crop&crop=center&auto=format',
//     companyInfo: {
//       size: '50-100 employees',
//       founded: '2019',
//       industry: 'Mobile Development',
//       website: 'https://appworks.com',
//       description: 'AppWorks Studio specializes in creating innovative mobile applications for startups and enterprises.'
//     },
//     location: 'Seattle, WA',
//     type: 'Contract',
//     salary: { min: 85000, max: 120000 },
//     description: 'Contract position for developing cross-platform mobile applications using React Native and Flutter. Work on exciting projects with a creative team.',
//     requirements: ['Strong React Native development experience', 'Flutter knowledge and implementation', 'App Store and Google Play deployment', 'RESTful API integration', 'Mobile UI/UX best practices'],
//     benefits: ['Competitive contract rates', 'Flexible schedule', 'Remote work options', 'Project completion bonuses', 'Professional development support'],
//     postedDate: '2025-08-29',
//     department: 'Software'
//   },
//   {
//     id: '5',
//     title: 'Backend Software Engineer',
//     company: 'DataFlow Systems',
//     companyLogo: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=120&h=120&fit=crop&crop=center&auto=format',
//     companyInfo: {
//       size: '300-500 employees',
//       founded: '2014',
//       industry: 'Data Processing',
//       website: 'https://dataflow.com',
//       description: 'DataFlow Systems processes billions of data points daily for enterprise clients across various industries.'
//     },
//     location: 'New York, NY',
//     type: 'Full-time',
//     salary: { min: 110000, max: 150000 },
//     description: 'Build robust backend services and APIs for our data processing platform. Python and microservices experience required. Join a team handling massive scale systems.',
//     requirements: ['Python expertise with Django/FastAPI', 'Microservices architecture design', 'Database design and optimization', 'Docker & Kubernetes deployment', 'Message queue systems (RabbitMQ, Kafka)'],
//     benefits: ['Excellent health coverage', 'Commuter benefits', 'Catered lunches', 'Learning stipend', 'Stock options', 'Sabbatical program'],
//     postedDate: '2025-08-27',
//     department: 'Software'
//   },
//   {
//     id: '6',
//     title: 'Junior Web Developer',
//     company: 'StartupHub',
//     companyLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&h=120&fit=crop&crop=center&auto=format',
//     companyInfo: {
//       size: '20-50 employees',
//       founded: '2021',
//       industry: 'Startup Incubator',
//       website: 'https://startuphub.com',
//       description: 'StartupHub helps early-stage companies build their digital presence and scale their technology.'
//     },
//     location: 'Remote',
//     type: 'Part-time',
//     salary: { min: 50000, max: 70000 },
//     description: 'Perfect opportunity for junior developers to grow their skills in a supportive environment. Mentorship provided by senior developers.',
//     requirements: ['1+ year web development experience', 'HTML/CSS/JavaScript fundamentals', 'Basic React knowledge', 'Eagerness to learn new technologies', 'Strong problem-solving skills'],
//     benefits: ['Mentorship program', 'Flexible part-time hours', 'Learning resources', 'Career growth path', 'Team collaboration tools'],
//     postedDate: '2025-09-02',
//     department: 'Software'
//   },
//   {
//     id: '7',
//     title: 'Machine Learning Engineer',
//     company: 'AI Innovations',
//     companyLogo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&h=120&fit=crop&crop=center&auto=format',
//     companyInfo: {
//       size: '100-200 employees',
//       founded: '2017',
//       industry: 'Artificial Intelligence',
//       website: 'https://aiinnovations.com',
//       description: 'AI Innovations develops cutting-edge machine learning solutions for healthcare, finance, and autonomous systems.'
//     },
//     location: 'Boston, MA',
//     type: 'Full-time',
//     salary: { min: 150000, max: 200000 },
//     description: 'Develop and deploy machine learning models for production systems. Work with cutting-edge AI technologies and research teams.',
//     requirements: ['ML frameworks expertise (TensorFlow/PyTorch)', 'Strong Python & SQL skills', 'Model deployment and MLOps experience', 'Statistics and mathematics background', 'PhD preferred but not required'],
//     benefits: ['Top-tier compensation', 'Research publication support', 'Conference attendance', 'GPU computing resources', 'Collaborative research environment', 'Stock options'],
//     postedDate: '2025-08-26',
//     department: 'Software'
//   },
//   {
//     id: '8',
//     title: 'Registered Nurse - ICU',
//     company: 'City General Hospital',
//     companyLogo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=120&h=120&fit=crop&crop=center&auto=format',
//     companyInfo: {
//       size: '1000+ employees',
//       founded: '1985',
//       industry: 'Healthcare',
//       website: 'https://citygeneral.com',
//       description: 'City General Hospital is a leading medical center providing comprehensive healthcare services to the community.'
//     },
//     location: 'Chicago, IL',
//     type: 'Full-time',
//     salary: { min: 75000, max: 95000 },
//     description: 'Seeking experienced ICU nurse for our state-of-the-art intensive care unit. Night shift differential available. Join a dedicated team of healthcare professionals.',
//     requirements: ['Current RN license in Illinois', 'ICU experience preferred', 'BLS/ACLS certification required', 'Critical thinking and decision-making skills', 'Team collaboration abilities'],
//     benefits: ['Comprehensive health insurance', 'Shift differentials', 'Continuing education support', 'Retirement plan', 'Paid time off', 'Employee wellness programs'],
//     postedDate: '2025-08-31',
//     department: 'Healthcare'
//   },
//   {
//     id: '9',
//     title: 'Physical Therapist',
//     company: 'Wellness Medical Center',
//     companyLogo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&h=120&fit=crop&crop=center&auto=format',
//     companyInfo: {
//       size: '200-500 employees',
//       founded: '1992',
//       industry: 'Healthcare',
//       website: 'https://wellnessmedical.com',
//       description: 'Wellness Medical Center provides comprehensive rehabilitation and physical therapy services.'
//     },
//     location: 'Denver, CO',
//     type: 'Full-time',
//     salary: { min: 80000, max: 100000 },
//     description: 'Join our rehabilitation team helping patients recover from injuries and surgeries. Flexible scheduling available with supportive team environment.',
//     requirements: ['Physical Therapy license in Colorado', 'DPT degree preferred', 'Patient care experience', 'Strong communication skills', 'Manual therapy techniques'],
//     benefits: ['Flexible scheduling', 'Professional development', 'Health benefits', 'Continuing education allowance', 'Performance bonuses', 'Modern equipment'],
//     postedDate: '2025-08-28',
//     department: 'Healthcare'
//   },
//   {
//     id: '10',
//     title: 'Medical Assistant',
//     company: 'Family Care Clinic',
//     companyLogo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=120&h=120&fit=crop&crop=center&auto=format',
//     companyInfo: {
//       size: '20-50 employees',
//       founded: '2005',
//       industry: 'Healthcare',
//       website: 'https://familycare.com',
//       description: 'Family Care Clinic provides comprehensive primary care services in a warm, family-friendly environment.'
//     },
//     location: 'Phoenix, AZ',
//     type: 'Part-time',
//     salary: { min: 35000, max: 45000 },
//     description: 'Support our medical team with patient care and administrative duties in a busy family practice setting. Great opportunity for career growth.',
//     requirements: ['Medical Assistant certification', 'EMR system experience', 'Phlebotomy skills preferred', 'Customer service orientation', 'Bilingual skills a plus'],
//     benefits: ['Part-time flexibility', 'Health insurance option', 'Paid training', 'Career advancement opportunities', 'Supportive work environment'],
//     postedDate: '2025-09-01',
//     department: 'Healthcare'
//   }
// ];