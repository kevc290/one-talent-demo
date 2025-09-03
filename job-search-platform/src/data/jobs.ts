export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary: {
    min: number;
    max: number;
  };
  description: string;
  requirements: string[];
  postedDate: string;
  department: 'Software' | 'Healthcare' | 'Manufacturing';
}

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: { min: 140000, max: 180000 },
    description: 'We are looking for an experienced Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.',
    requirements: ['5+ years of experience', 'React & Node.js expertise', 'AWS experience', 'Strong communication skills'],
    postedDate: '2025-08-28',
    department: 'Software'
  },
  {
    id: '2',
    title: 'Frontend Engineer',
    company: 'Digital Innovations',
    location: 'Remote',
    type: 'Remote',
    salary: { min: 100000, max: 140000 },
    description: 'Join our remote-first team building cutting-edge user interfaces. We value creativity and technical excellence in equal measure.',
    requirements: ['3+ years React/TypeScript', 'UI/UX sensibility', 'Experience with design systems', 'Agile methodology'],
    postedDate: '2025-08-30',
    department: 'Software'
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'CloudScale Inc',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: { min: 120000, max: 160000 },
    description: 'Help us build and maintain scalable infrastructure for our cloud-native applications. Experience with Kubernetes and CI/CD pipelines required.',
    requirements: ['Kubernetes expertise', 'CI/CD pipeline management', 'Infrastructure as Code', 'Linux administration'],
    postedDate: '2025-09-01',
    department: 'Software'
  },
  {
    id: '4',
    title: 'Mobile App Developer',
    company: 'AppWorks Studio',
    location: 'Seattle, WA',
    type: 'Contract',
    salary: { min: 85000, max: 120000 },
    description: 'Contract position for developing cross-platform mobile applications using React Native and Flutter.',
    requirements: ['React Native experience', 'Flutter knowledge', 'App Store deployment', 'RESTful APIs'],
    postedDate: '2025-08-29',
    department: 'Software'
  },
  {
    id: '5',
    title: 'Backend Software Engineer',
    company: 'DataFlow Systems',
    location: 'New York, NY',
    type: 'Full-time',
    salary: { min: 110000, max: 150000 },
    description: 'Build robust backend services and APIs for our data processing platform. Python and microservices experience required.',
    requirements: ['Python expertise', 'Microservices architecture', 'Database design', 'Docker & Kubernetes'],
    postedDate: '2025-08-27',
    department: 'Software'
  },
  {
    id: '6',
    title: 'Junior Web Developer',
    company: 'StartupHub',
    location: 'Remote',
    type: 'Part-time',
    salary: { min: 50000, max: 70000 },
    description: 'Perfect opportunity for junior developers to grow their skills in a supportive environment. Mentorship provided.',
    requirements: ['1+ year web development', 'HTML/CSS/JavaScript', 'Eagerness to learn', 'Team player'],
    postedDate: '2025-09-02',
    department: 'Software'
  },
  {
    id: '7',
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: { min: 150000, max: 200000 },
    description: 'Develop and deploy machine learning models for production systems. Work with cutting-edge AI technologies.',
    requirements: ['ML frameworks (TensorFlow/PyTorch)', 'Python & SQL', 'Model deployment experience', 'Statistics background'],
    postedDate: '2025-08-26',
    department: 'Software'
  },
  {
    id: '8',
    title: 'Registered Nurse - ICU',
    company: 'City General Hospital',
    location: 'Chicago, IL',
    type: 'Full-time',
    salary: { min: 75000, max: 95000 },
    description: 'Seeking experienced ICU nurse for our state-of-the-art intensive care unit. Night shift differential available.',
    requirements: ['Current RN license', 'ICU experience preferred', 'BLS/ACLS certification', 'Critical thinking skills'],
    postedDate: '2025-08-31',
    department: 'Healthcare'
  },
  {
    id: '9',
    title: 'Physical Therapist',
    company: 'Wellness Medical Center',
    location: 'Denver, CO',
    type: 'Full-time',
    salary: { min: 80000, max: 100000 },
    description: 'Join our rehabilitation team helping patients recover from injuries and surgeries. Flexible scheduling available.',
    requirements: ['PT license', 'DPT degree preferred', 'Patient care experience', 'Strong communication'],
    postedDate: '2025-08-28',
    department: 'Healthcare'
  },
  {
    id: '10',
    title: 'Medical Assistant',
    company: 'Family Care Clinic',
    location: 'Phoenix, AZ',
    type: 'Part-time',
    salary: { min: 35000, max: 45000 },
    description: 'Support our medical team with patient care and administrative duties in a busy family practice setting.',
    requirements: ['MA certification', 'EMR experience', 'Phlebotomy skills', 'Customer service oriented'],
    postedDate: '2025-09-01',
    department: 'Healthcare'
  },
  {
    id: '11',
    title: 'Nurse Practitioner',
    company: 'Rural Health Network',
    location: 'Remote',
    type: 'Remote',
    salary: { min: 110000, max: 130000 },
    description: 'Provide telehealth services to underserved communities. Flexible hours and meaningful work.',
    requirements: ['NP license', 'Telehealth experience', 'Primary care background', 'Independent practitioner'],
    postedDate: '2025-08-30',
    department: 'Healthcare'
  },
  {
    id: '12',
    title: 'Pharmacy Technician',
    company: 'MedPharm Solutions',
    location: 'Miami, FL',
    type: 'Full-time',
    salary: { min: 38000, max: 48000 },
    description: 'Assist pharmacists in preparing and dispensing medications. Hospital pharmacy experience a plus.',
    requirements: ['CPhT certification', 'Attention to detail', 'Math skills', 'Team collaboration'],
    postedDate: '2025-08-29',
    department: 'Healthcare'
  },
  {
    id: '13',
    title: 'Healthcare Data Analyst',
    company: 'HealthTech Analytics',
    location: 'Atlanta, GA',
    type: 'Contract',
    salary: { min: 70000, max: 90000 },
    description: 'Analyze healthcare data to improve patient outcomes and operational efficiency. SQL and Tableau required.',
    requirements: ['Healthcare data experience', 'SQL proficiency', 'Tableau/Power BI', 'HIPAA knowledge'],
    postedDate: '2025-09-02',
    department: 'Healthcare'
  },
  {
    id: '14',
    title: 'Emergency Room Physician',
    company: 'Metropolitan Hospital',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    salary: { min: 250000, max: 350000 },
    description: 'Board-certified emergency medicine physician needed for Level 1 trauma center. Competitive compensation package.',
    requirements: ['MD/DO degree', 'EM board certification', 'ATLS/ACLS', 'Trauma experience'],
    postedDate: '2025-08-27',
    department: 'Healthcare'
  },
  {
    id: '15',
    title: 'Manufacturing Engineer',
    company: 'Precision Manufacturing Co',
    location: 'Detroit, MI',
    type: 'Full-time',
    salary: { min: 85000, max: 110000 },
    description: 'Optimize manufacturing processes and implement lean principles in our automotive parts facility.',
    requirements: ['Engineering degree', 'Lean Six Sigma', 'CAD/CAM experience', 'Process improvement'],
    postedDate: '2025-08-31',
    department: 'Manufacturing'
  },
  {
    id: '16',
    title: 'Quality Control Inspector',
    company: 'Industrial Standards Inc',
    location: 'Houston, TX',
    type: 'Full-time',
    salary: { min: 45000, max: 60000 },
    description: 'Ensure product quality meets specifications through inspection and testing. ISO 9001 experience preferred.',
    requirements: ['Quality inspection experience', 'Attention to detail', 'ISO 9001 knowledge', 'Technical documentation'],
    postedDate: '2025-08-28',
    department: 'Manufacturing'
  },
  {
    id: '17',
    title: 'Production Supervisor',
    company: 'GlobalTech Manufacturing',
    location: 'Charlotte, NC',
    type: 'Full-time',
    salary: { min: 65000, max: 85000 },
    description: 'Lead production team in meeting daily targets while maintaining safety and quality standards.',
    requirements: ['Supervisory experience', 'Production planning', 'Safety compliance', 'Team leadership'],
    postedDate: '2025-09-01',
    department: 'Manufacturing'
  },
  {
    id: '18',
    title: 'CNC Machine Operator',
    company: 'Advanced Machining',
    location: 'Milwaukee, WI',
    type: 'Part-time',
    salary: { min: 40000, max: 55000 },
    description: 'Operate CNC machines to produce precision parts. Training provided for the right candidate.',
    requirements: ['CNC experience helpful', 'Blueprint reading', 'Precision measurement', 'Safety conscious'],
    postedDate: '2025-08-30',
    department: 'Manufacturing'
  },
  {
    id: '19',
    title: 'Supply Chain Coordinator',
    company: 'Logistics Solutions',
    location: 'Columbus, OH',
    type: 'Contract',
    salary: { min: 55000, max: 75000 },
    description: 'Coordinate material flow and inventory management for manufacturing operations. SAP experience required.',
    requirements: ['Supply chain knowledge', 'SAP experience', 'Inventory management', 'Data analysis'],
    postedDate: '2025-08-29',
    department: 'Manufacturing'
  },
  {
    id: '20',
    title: 'Assembly Line Worker',
    company: 'Electronics Assembly Corp',
    location: 'Portland, OR',
    type: 'Full-time',
    salary: { min: 35000, max: 45000 },
    description: 'Join our electronics assembly team. No experience necessary - we provide comprehensive training.',
    requirements: ['High school diploma', 'Manual dexterity', 'Team oriented', 'Reliable attendance'],
    postedDate: '2025-09-02',
    department: 'Manufacturing'
  },
  {
    id: '21',
    title: 'Industrial Maintenance Technician',
    company: 'Factory Systems Inc',
    location: 'Indianapolis, IN',
    type: 'Full-time',
    salary: { min: 60000, max: 80000 },
    description: 'Maintain and repair industrial equipment including PLCs, hydraulics, and electrical systems.',
    requirements: ['Industrial maintenance experience', 'PLC troubleshooting', 'Electrical knowledge', 'Problem-solving skills'],
    postedDate: '2025-08-26',
    department: 'Manufacturing'
  }
];