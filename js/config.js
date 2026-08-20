/**
 * LifeProof - Application Configuration & Route Definitions
 */

const LifeProofConfig = {
  appName: 'LifeProof',
  version: '1.1.0',
  routes: {
    home: '/index.html',
    login: '/login.html',
    student: '/pages/student.html',
    recruiter: '/pages/recruiter.html',
    faculty: '/pages/faculty.html',
    studentDashboard: '/pages/student.html',
    recruiterDashboard: '/pages/recruiter.html',
    facultyDashboard: '/pages/faculty.html',
    about: '/pages/about.html'
  },
  roles: {
    STUDENT: 'student',
    RECRUITER: 'recruiter',
    FACULTY: 'faculty'
  },
  getDashboardForRole(role) {
    switch (role) {
      case 'recruiter':
        return this.routes.recruiter;
      case 'faculty':
        return this.routes.faculty;
      case 'student':
      default:
        return this.routes.student;
    }
  }
};

// Freeze configuration to prevent accidental runtime mutations
Object.freeze(LifeProofConfig);
Object.freeze(LifeProofConfig.routes);
Object.freeze(LifeProofConfig.roles);

if (typeof window !== 'undefined') {
  window.LifeProofConfig = LifeProofConfig;
}
