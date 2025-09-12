# Microsoft Entra External ID Integration - Work Estimate

## Project Overview
Integrate Microsoft Entra External ID authentication to replace the current temporary token system in the job search platform while maintaining all existing user profile and application functionality.

## Current System Analysis
- **Frontend**: React 19 RC with TypeScript, custom AuthContext using temporary tokens
- **Backend**: Node.js/Express with PostgreSQL, bcrypt password hashing
- **Current Auth Flow**: Email/password registration → temporary tokens (`temp_token_${userId}_${timestamp}`)
- **Database**: PostgreSQL with users table and user_profiles table (UUID primary keys)
- **Token Storage**: localStorage/sessionStorage with "Remember me" functionality

## Target Architecture
- **Authentication**: Microsoft Entra External ID with Google OAuth provider
- **User Storage**: Existing PostgreSQL database (no schema changes required)  
- **Flow**: Google OAuth → Entra ID → Local user profile creation/mapping
- **Profile Management**: All existing functionality maintained (resumes, job applications, etc.)

## Work Estimate: 20 Hours

### Day 1: Azure Configuration & Frontend Integration (8 hours)
- Set up Microsoft Entra External ID tenant with Google authentication provider
- Install and configure MSAL React (`@azure/msal-react`) authentication library
- Replace current AuthContext and authService with MSAL providers
- Update login/register UI components to use Entra ID flows
- Handle token acquisition and storage through MSAL

### Day 2: Backend Integration (8 hours)
- Install MSAL Node (`@azure/msal-node`) for server-side token validation
- Replace temporary token system with proper Entra ID token validation
- Update authentication middleware (`src/middleware/auth.ts`)
- Implement user mapping flow (Entra ID user data → local database user/profile records)
- Update protected API routes and error handling

### Day 3: Deployment & Testing (4 hours)
- Deploy application to hosting platform (moving from GitHub Pages)
- Configure production environment variables and redirect URIs
- End-to-end authentication flow testing
- Bug fixes and refinements

## Requirements Confirmed
1. **Migration Strategy**: Start fresh (no existing user migration needed)
2. **User Experience**: Use Entra ID only for authentication, manage profiles locally in app
3. **Azure Subscription**: Available 
4. **Social Providers**: Google OAuth for PoC
5. **Timeline**: 2-3 days
6. **Environment**: Development only initially

## Technical Implementation Notes

### Frontend Changes Required
- Replace `src/services/authService.ts` MSAL integration
- Update `src/contexts/AuthContext.tsx` with MSAL providers
- Modify login/register components to use Entra ID flows
- Handle MSAL token storage and validation

### Backend Changes Required  
- Update `src/controllers/authController.ts` for Entra ID token validation
- Modify `src/middleware/auth.ts` to validate MSAL tokens
- Implement user creation flow for first-time Entra ID users
- Map Entra ID user claims to local user/profile records

### Database Impact
- **No schema changes required** - existing users and user_profiles tables will be used
- New users from Entra ID will be created in existing database structure
- Profile data (resumes, job applications, saved jobs) remains unchanged

## Key Benefits
- Enterprise-grade authentication without managing passwords
- Maintains all existing user profile and job application functionality  
- Keeps current PostgreSQL database schema and data
- Easy to extend with additional social providers
- Removes security risks of temporary token system

## Deliverables
- Microsoft Entra External ID tenant configured with Google provider
- React frontend integrated with MSAL authentication
- Node.js backend validating Entra ID tokens
- User mapping between Entra ID and local database
- Deployed application with production-ready authentication
- Documentation for future maintenance and extension

## Risk Mitigation
- 20-hour estimate includes 4-hour buffer for unforeseen issues
- Existing codebase is well-structured, facilitating clean integration
- Microsoft provides comprehensive documentation and code samples
- Current temporary token system provides clear migration path

---
*Document created: 2025-09-10*  
*Estimated completion: 20 hours over 2-3 days*