(function() {
  'use strict';

  // Prevent multiple loads
  if (window.JobSearchWidgets) {
    return;
  }

  // Widget configuration
  const WIDGET_BASE_URL = window.location.origin.includes('github.io') 
    ? 'https://kevc290.github.io/one-talent-demo'
    : (window.location.origin === 'https://localhost:5173' || window.location.origin === 'http://localhost:5173')
    ? 'http://localhost:5173'
    : window.location.origin;

  let assetsLoaded = false;
  let stylesInjected = false;

  // Get the current CSS filename from the built assets
  function getCurrentAssetFilename() {
    // In production, we'd need to know the current hash
    // For now, let's try to detect it from any existing links
    const existingLink = document.querySelector('link[href*="/assets/index-"]');
    if (existingLink) {
      const href = existingLink.getAttribute('href');
      const match = href.match(/assets\/(index-[^\.]+\.css)/);
      if (match) return match[1];
    }
    // Fallback to the latest known filename
    return 'index-BaCCchk1.css';
  }

  // CSS injection with scoping
  function injectStyles() {
    if (stylesInjected) return;

    // Load the main stylesheet
    const link = document.createElement('link');
    link.id = 'jobsearch-widget-styles';
    link.rel = 'stylesheet';
    link.href = `${WIDGET_BASE_URL}/assets/${getCurrentAssetFilename()}`;
    
    // Add CSS scoping and resets
    const style = document.createElement('style');
    style.id = 'jobsearch-widget-scope';
    style.textContent = `
      .jobsearch-widget-root {
        /* Create a new stacking context and reset inherited styles */
        position: relative;
        isolation: isolate;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #374151;
        background: transparent;
        box-sizing: border-box;
        z-index: 1000;
      }
      
      .jobsearch-widget-root *,
      .jobsearch-widget-root *::before,
      .jobsearch-widget-root *::after {
        box-sizing: border-box;
      }
      
      /* Reset common elements that might be styled by host site */
      .jobsearch-widget-root button {
        font-family: inherit;
        font-size: inherit;
        margin: 0;
      }
      
      .jobsearch-widget-root input,
      .jobsearch-widget-root textarea,
      .jobsearch-widget-root select {
        font-family: inherit;
        font-size: inherit;
      }
      
      .jobsearch-widget-root h1,
      .jobsearch-widget-root h2,
      .jobsearch-widget-root h3,
      .jobsearch-widget-root h4,
      .jobsearch-widget-root h5,
      .jobsearch-widget-root h6 {
        margin: 0;
        font-weight: inherit;
      }
      
      .jobsearch-widget-root p {
        margin: 0;
      }
      
      .jobsearch-widget-root ul,
      .jobsearch-widget-root ol {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      
      /* Loading animation */
      @keyframes jobsearch-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .jobsearch-loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #e5e7eb;
        border-top: 2px solid #3b82f6;
        border-radius: 50%;
        animation: jobsearch-spin 1s linear infinite;
      }
    `;
    
    document.head.appendChild(style);
    document.head.appendChild(link);
    stylesInjected = true;
  }

  // Mock job data for embedded widgets
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      remote: true,
      salary: { min: 120000, max: 180000 },
      type: 'Full-time',
      description: 'Join our team building next-generation software solutions.'
    },
    {
      id: '2', 
      title: 'Product Manager',
      company: 'InnovateCo',
      location: 'New York, NY',
      remote: false,
      salary: { min: 100000, max: 140000 },
      type: 'Full-time',
      description: 'Lead product strategy and development for our flagship platform.'
    },
    {
      id: '3',
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      remote: true,
      salary: { min: 80000, max: 120000 },
      type: 'Full-time',
      description: 'Build beautiful user interfaces with React and modern tools.'
    },
    {
      id: '4',
      title: 'Data Scientist',
      company: 'DataCorp',
      location: 'Seattle, WA',
      remote: true,
      salary: { min: 95000, max: 145000 },
      type: 'Full-time',
      description: 'Analyze data to drive business insights and decision making.'
    },
    {
      id: '5',
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'Los Angeles, CA',
      remote: false,
      salary: { min: 70000, max: 100000 },
      type: 'Full-time',
      description: 'Create intuitive and beautiful user experiences.'
    }
  ];

  // Filter jobs based on search criteria
  function filterJobs(searchTerm, location) {
    return mockJobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !location ||
        job.location.toLowerCase().includes(location.toLowerCase()) ||
        (location.toLowerCase().includes('remote') && job.remote);
        
      return matchesSearch && matchesLocation;
    });
  }

  // Create job listing HTML
  function createJobHTML(job, theme = 'modern') {
    const colors = getThemeColors(theme);
    return `
      <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.backgroundColor='#f3f4f6'" onmouseout="this.style.backgroundColor='#f9fafb'" onclick="window.location.href='${WIDGET_BASE_URL}/job/${job.id}'">
        <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${job.title}</div>
        <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">${job.company} • ${job.location}${job.remote ? ' • Remote' : ''}</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600; color: ${colors.primary};">$${Math.floor(job.salary.min/1000)}k - $${Math.floor(job.salary.max/1000)}k</span>
          <button style="background: ${colors.primary}; color: white; padding: 6px 12px; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;" onclick="event.stopPropagation(); window.location.href='${WIDGET_BASE_URL}/job/${job.id}'" onmouseover="this.style.backgroundColor='${colors.primaryHover}'" onmouseout="this.style.backgroundColor='${colors.primary}'">Apply</button>
        </div>
      </div>
    `;
  }

  // Get theme colors
  function getThemeColors(theme) {
    const themes = {
      kelly: {
        primary: '#00ae42',
        primaryHover: '#009638',
        primaryLight: '#10B981'
      },
      jobsearch: {
        primary: '#3B82F6',
        primaryHover: '#1D4ED8',
        primaryLight: '#3B82F6'
      },
      careerhub: {
        primary: '#8B5CF6',
        primaryHover: '#7C3AED',
        primaryLight: '#EC4899'
      },
      talentfinder: {
        primary: '#10B981',
        primaryHover: '#047857',
        primaryLight: '#F97316'
      },
      modern: {
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        primaryLight: '#3b82f6'
      }
    };
    
    return themes[theme] || themes.modern;
  }

  // Handle job search
  function handleJobSearch(widgetId) {
    const widget = document.getElementById(widgetId);
    const widgetContainer = widget.closest('[data-jobsearch-widget]');
    const theme = widgetContainer ? widgetContainer.getAttribute('data-theme') || 'modern' : 'modern';
    const colors = getThemeColors(theme);
    
    const searchInput = widget.querySelector('input[placeholder*="Job title"]');
    const locationInput = widget.querySelector('input[placeholder*="City"]');
    const resultsContainer = widget.querySelector('[data-results]');
    
    const searchTerm = searchInput.value.trim();
    const location = locationInput.value.trim();
    
    // Show loading state
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div class="jobsearch-loading-spinner"></div>
        <p style="margin-top: 1rem; color: #6b7280; font-size: 14px;">Searching jobs...</p>
      </div>
    `;
    
    // Simulate API call delay
    setTimeout(() => {
      const filteredJobs = filterJobs(searchTerm, location);
      
      if (filteredJobs.length === 0) {
        resultsContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: #6b7280;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">No jobs found</p>
            <p style="font-size: 14px;">Try adjusting your search criteria</p>
          </div>
        `;
      } else {
        const jobsHTML = filteredJobs.map(job => createJobHTML(job, theme)).join('');
        resultsContainer.innerHTML = `
          <h4 style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 12px;">Search Results (${filteredJobs.length})</h4>
          ${jobsHTML}
          <button type="button" onclick="window.location.href='${WIDGET_BASE_URL}/jobs'"
            style="width: 100%; margin-top: 16px; background: transparent; color: ${colors.primary}; padding: 8px 16px; border: 1px solid ${colors.primary}; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
            onmouseover="this.style.backgroundColor='${colors.primary}'; this.style.color='white'"
            onmouseout="this.style.backgroundColor='transparent'; this.style.color='${colors.primary}'">
            View All Jobs →
          </button>
        `;
      }
    }, 500);
  }

  // Handle login
  function handleLogin(widgetId) {
    const widget = document.getElementById(widgetId);
    const emailInput = widget.querySelector('input[type="email"]');
    const passwordInput = widget.querySelector('input[type="password"]');
    const submitButton = widget.querySelector('button[type="submit"]');
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.innerHTML = 'Signing In...';
    submitButton.disabled = true;
    
    // Simulate login API call
    setTimeout(() => {
      if (email && password) {
        // Successful login - redirect to main app
        window.location.href = `${WIDGET_BASE_URL}/dashboard`;
      } else {
        alert('Invalid credentials. Please try again.');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }
    }, 1000);
  }

  // Handle profile dropdown toggle
  function toggleProfile(widgetId) {
    const widget = document.getElementById(widgetId);
    const dropdown = widget.querySelector('[data-profile-dropdown]');
    const chevron = widget.querySelector('[data-chevron]');
    
    const isOpen = dropdown.style.opacity === '1';
    
    if (isOpen) {
      // Close dropdown
      dropdown.style.opacity = '0';
      dropdown.style.visibility = 'hidden';
      dropdown.style.transform = 'translateY(-8px)';
      chevron.style.transform = 'rotate(0deg)';
    } else {
      // Open dropdown
      dropdown.style.opacity = '1';
      dropdown.style.visibility = 'visible';
      dropdown.style.transform = 'translateY(0)';
      chevron.style.transform = 'rotate(180deg)';
      
      // Initialize profile content if not done yet
      initializeProfileWidget(widgetId);
    }
  }

  // Initialize profile widget with user data
  function initializeProfileWidget(widgetId) {
    const widget = document.getElementById(widgetId);
    const widgetContainer = widget.closest('[data-jobsearch-widget]');
    const theme = widgetContainer ? widgetContainer.getAttribute('data-theme') || 'modern' : 'modern';
    const colors = getThemeColors(theme);
    
    const userInfoContainer = widget.querySelector('[data-user-info]');
    const menuItemsContainer = widget.querySelector('[data-menu-items]');
    const profileContainer = widget.querySelector('[data-profile-container]');
    
    // Check if user is logged in
    const userData = localStorage.getItem('jobsearch_user');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        
        // Update profile button with user avatar and name
        profileContainer.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: white; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);" 
               onclick="window.JobSearchWidgets.toggleProfile('${widgetId}')"
               onmouseover="this.style.borderColor='${colors.primary}'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
               onmouseout="this.style.borderColor='#d1d5db'; this.style.boxShadow='0 1px 2px rgba(0,0,0,0.05)'">
            <img src="${user.avatar}" alt="${user.firstName} ${user.lastName}" 
                 style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
            <span style="font-size: 14px; font-weight: 500; color: #374151;">${user.firstName}</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #6b7280; transition: transform 0.2s;" data-chevron>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        `;
        
        // Update user info in dropdown
        userInfoContainer.innerHTML = `
          <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 4px;">${user.firstName} ${user.lastName}</p>
          <p style="font-size: 12px; color: #6b7280;">${user.email}</p>
        `;
        
        // Add menu items
        const menuItems = [
          { path: '/dashboard', label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0' },
          { path: '/saved-jobs', label: 'Saved Jobs', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
          { path: '/applications', label: 'My Applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { path: '/profile', label: 'Profile Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
        ];
        
        menuItemsContainer.innerHTML = menuItems.map(item => `
          <button onclick="window.location.href='${WIDGET_BASE_URL}${item.path}'"
                  style="display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 16px; background: transparent; border: none; text-align: left; cursor: pointer; transition: all 0.2s; color: #374151; font-size: 14px;"
                  onmouseover="this.style.backgroundColor='#f3f4f6'"
                  onmouseout="this.style.backgroundColor='transparent'">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #6b7280;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path>
            </svg>
            ${item.label}
          </button>
        `).join('') + `
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #e5e7eb;">
          <button onclick="window.JobSearchWidgets.handleLogout('${widgetId}')"
                  style="display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 16px; background: transparent; border: none; text-align: left; cursor: pointer; transition: all 0.2s; color: #dc2626; font-size: 14px;"
                  onmouseover="this.style.backgroundColor='#fef2f2'"
                  onmouseout="this.style.backgroundColor='transparent'">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #dc2626;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Sign Out
          </button>
        `;
        
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }

  // Handle profile logout
  function handleLogout(widgetId) {
    localStorage.removeItem('jobsearch_user');
    // Refresh the widget to show logged out state
    const widget = document.getElementById(widgetId).parentElement;
    if (widget && widget.getAttribute('data-jobsearch-widget') === 'profile') {
      // Reinitialize the widget
      setTimeout(() => {
        window.JobSearchWidgets.init();
      }, 100);
    }
    
    // Trigger custom event for parent page
    window.dispatchEvent(new CustomEvent('jobsearch:logout'));
  }

  // Close profile dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const profileWidgets = document.querySelectorAll('[data-jobsearch-widget="profile"]');
    profileWidgets.forEach(widget => {
      const widgetElement = widget.querySelector('[id^="widget-"]');
      if (widgetElement && !widgetElement.contains(event.target)) {
        const dropdown = widgetElement.querySelector('[data-profile-dropdown]');
        const chevron = widgetElement.querySelector('[data-chevron]');
        if (dropdown && dropdown.style.opacity === '1') {
          dropdown.style.opacity = '0';
          dropdown.style.visibility = 'hidden';
          dropdown.style.transform = 'translateY(-8px)';
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      }
    });
  });

  // Create static widget content (now fully functional)
  function createStaticWidget(widgetType, theme) {
    const widgetId = 'widget-' + Math.random().toString(36).substr(2, 9);
    const colors = getThemeColors(theme);
    
    const widgets = {
      search: `
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 600px;" id="${widgetId}">
          <div style="text-align: center; margin-bottom: 24px;">
            <h3 style="font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">Find Your Dream Job</h3>
            <p style="color: #6b7280;">Search from thousands of opportunities</p>
          </div>
          
          <div style="space-y: 16px;">
            <div style="position: relative; margin-bottom: 16px;">
              <input type="text" placeholder="Job title, keywords, or company" 
                style="width: 100%; padding: 12px 16px 12px 44px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; transition: all 0.2s; box-sizing: border-box;"
                onfocus="this.style.borderColor='${colors.primary}'; this.style.boxShadow='0 0 0 3px ${colors.primary}20'"
                onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
                onkeypress="if(event.key==='Enter') window.JobSearchWidgets.handleSearch('${widgetId}')">
              <svg style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #9ca3af; pointer-events: none;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            <div style="position: relative; margin-bottom: 16px;">
              <input type="text" placeholder="City, state, or remote"
                style="width: 100%; padding: 12px 16px 12px 44px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; transition: all 0.2s; box-sizing: border-box;"
                onfocus="this.style.borderColor='${colors.primary}'; this.style.boxShadow='0 0 0 3px ${colors.primary}20'"
                onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
                onkeypress="if(event.key==='Enter') window.JobSearchWidgets.handleSearch('${widgetId}')">
              <svg style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #9ca3af; pointer-events: none;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            
            <button type="button" onclick="window.JobSearchWidgets.handleSearch('${widgetId}')"
              style="width: 100%; background: ${colors.primary}; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
              onmouseover="this.style.backgroundColor='${colors.primaryHover}'"
              onmouseout="this.style.backgroundColor='${colors.primary}'">
              Search Jobs →
            </button>
          </div>
          
          <div style="margin-top: 24px;" data-results>
            <h4 style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 12px;">Featured Jobs</h4>
            ${mockJobs.slice(0, 2).map(job => createJobHTML(job, theme)).join('')}
          </div>
        </div>
      `,
      listings: `
        <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 400px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 16px; display: flex; align-items: center;">
            <svg style="width: 20px; height: 20px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"></path>
            </svg>
            Latest Jobs
          </h3>
          <div style="space-y: 12px;">
            ${mockJobs.slice(0, 3).map(job => `
              <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; transition: all 0.2s; cursor: pointer;" onmouseover="this.style.borderColor='${colors.primary}'; this.style.backgroundColor='#f8fafc'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='transparent'" onclick="window.location.href='${WIDGET_BASE_URL}/job/${job.id}'">
                <div style="font-weight: 600; color: #1f2937; font-size: 14px; margin-bottom: 4px;">${job.title}</div>
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">${job.company}</div>
                <div style="font-size: 12px; color: ${colors.primary}; font-weight: 600;">$${Math.floor(job.salary.min/1000)}k - $${Math.floor(job.salary.max/1000)}k</div>
              </div>
            `).join('')}
          </div>
          <button type="button" onclick="window.location.href='${WIDGET_BASE_URL}/jobs'"
            style="width: 100%; margin-top: 16px; background: transparent; color: ${colors.primary}; padding: 8px 16px; border: 1px solid ${colors.primary}; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
            onmouseover="this.style.backgroundColor='${colors.primary}'; this.style.color='white'"
            onmouseout="this.style.backgroundColor='transparent'; this.style.color='${colors.primary}'">
            View All Jobs →
          </button>
        </div>
      `,
      login: `
        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 400px;" id="${widgetId}">
          <div style="text-align: center; margin-bottom: 24px;">
            <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">Welcome Back</h3>
            <p style="color: #6b7280; font-size: 14px;">Sign in to your account</p>
          </div>
          
          <form onsubmit="event.preventDefault(); window.JobSearchWidgets.handleLogin('${widgetId}')">
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px;">Email</label>
              <input type="email" placeholder="Enter your email" required
                style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; transition: all 0.2s; box-sizing: border-box;"
                onfocus="this.style.borderColor='${colors.primary}'; this.style.boxShadow='0 0 0 3px ${colors.primary}20'"
                onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'">
            </div>
            
            <div style="margin-bottom: 24px;">
              <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px;">Password</label>
              <input type="password" placeholder="Enter your password" required
                style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none; transition: all 0.2s; box-sizing: border-box;"
                onfocus="this.style.borderColor='${colors.primary}'; this.style.boxShadow='0 0 0 3px ${colors.primary}20'"
                onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'">
            </div>
            
            <button type="submit"
              style="width: 100%; background: ${colors.primary}; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-bottom: 16px;"
              onmouseover="this.style.backgroundColor='${colors.primaryHover}'"
              onmouseout="this.style.backgroundColor='${colors.primary}'">
              Sign In
            </button>
            
            <div style="text-align: center;">
              <a href="#" onclick="event.preventDefault(); window.location.href='${WIDGET_BASE_URL}/register'" 
                 style="color: ${colors.primary}; text-decoration: none; font-size: 14px;"
                 onmouseover="this.style.textDecoration='underline'"
                 onmouseout="this.style.textDecoration='none'">
                Don't have an account? Sign up
              </a>
            </div>
          </form>
        </div>
      `,
      profile: `
        <div style="position: relative; display: inline-block;" id="${widgetId}">
          <div data-profile-container>
            <!-- Profile widget content will be inserted here -->
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: white; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);" 
                 onclick="window.JobSearchWidgets.toggleProfile('${widgetId}')"
                 onmouseover="this.style.borderColor='${colors.primary}'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
                 onmouseout="this.style.borderColor='#d1d5db'; this.style.boxShadow='0 1px 2px rgba(0,0,0,0.05)'">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #6b7280;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <span style="font-size: 14px; font-weight: 500; color: #374151;">Account</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #6b7280; transition: transform 0.2s;" data-chevron>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          
          <!-- Dropdown menu (hidden by default) -->
          <div style="position: absolute; right: 0; top: 100%; margin-top: 4px; width: 256px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; opacity: 0; visibility: hidden; transform: translateY(-8px); transition: all 0.2s;" data-profile-dropdown>
            <!-- User info section -->
            <div style="padding: 16px; border-bottom: 1px solid #e5e7eb;" data-user-info>
              <div style="text-align: center; color: #6b7280; font-size: 14px;">
                <p>Sign in to access your profile</p>
                <button onclick="window.location.href='${WIDGET_BASE_URL}/login'"
                        style="margin-top: 8px; background: ${colors.primary}; color: white; padding: 8px 16px; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.2s;"
                        onmouseover="this.style.backgroundColor='${colors.primaryHover}'"
                        onmouseout="this.style.backgroundColor='${colors.primary}'">
                  Sign In
                </button>
              </div>
            </div>
            
            <!-- Menu items (will be populated if user is logged in) -->
            <div style="padding: 8px 0;" data-menu-items>
              <!-- Menu items will be inserted here dynamically -->
            </div>
          </div>
        </div>
      `
    };
    
    return widgets[widgetType] || widgets.search;
  }

  // Create widget using direct DOM injection
  function createWidget(element, widgetType, options = {}) {
    const widgetId = 'widget-' + Math.random().toString(36).substr(2, 9);
    
    // Add loading state
    element.innerHTML = `
      <div class="jobsearch-widget-root">
        <div style="padding: 2rem; text-align: center; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div class="jobsearch-loading-spinner"></div>
          <p style="margin-top: 1rem; color: #6b7280; font-size: 14px;">Loading ${widgetType} widget...</p>
        </div>
      </div>
    `;

    // Simulate loading delay for better UX
    setTimeout(() => {
      try {
        const theme = options.theme || 'modern';
        const widgetContent = createStaticWidget(widgetType, theme);

        // Create the final widget
        const container = document.createElement('div');
        container.className = 'jobsearch-widget-root';
        container.id = widgetId;
        container.innerHTML = widgetContent;
        
        // Apply theme
        if (theme !== 'modern') {
          container.setAttribute('data-theme', theme);
        }

        // Replace loading content
        element.innerHTML = '';
        element.appendChild(container);
        
      } catch (error) {
        console.error('Failed to create widget:', error);
        element.innerHTML = `
          <div class="jobsearch-widget-root">
            <div style="padding: 2rem; text-align: center; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; color: #dc2626;">
              <p style="font-weight: 600; margin-bottom: 8px;">Widget Error</p>
              <p style="font-size: 14px;">Failed to load ${widgetType} widget. Please refresh the page.</p>
            </div>
          </div>
        `;
      }
      
      // Store reference
      element.setAttribute('data-widget-id', widgetId);
      element.setAttribute('data-widget-type', widgetType);
    }, 300);
  }

  // Initialize widgets
  function initializeWidgets() {
    const widgets = document.querySelectorAll('[data-jobsearch-widget]');
    
    widgets.forEach(element => {
      const widgetType = element.getAttribute('data-jobsearch-widget');
      const currentWidgetId = element.getAttribute('data-widget-id');
      const currentWidgetType = element.getAttribute('data-widget-type');
      
      // If widget type changed or no widget exists, recreate it
      if (!currentWidgetId || currentWidgetType !== widgetType) {
        const theme = element.getAttribute('data-theme') || 'modern';
        const options = { theme };

        createWidget(element, widgetType, options);
      }
    });
  }

  // Public API
  window.JobSearchWidgets = {
    init: initializeWidgets,
    handleSearch: handleJobSearch,
    handleLogin: handleLogin,
    toggleProfile: toggleProfile,
    handleLogout: handleLogout,
    version: '2.0.0'
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectStyles();
      initializeWidgets();
    });
  } else {
    injectStyles();
    initializeWidgets();
  }

  // Re-scan for new widgets periodically (for dynamic content)
  setInterval(initializeWidgets, 2000);

})();