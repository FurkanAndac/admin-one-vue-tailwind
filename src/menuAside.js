import {
  mdiAccountCircle,
  mdiMonitor,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette
} from '@mdi/js';

// Function to generate menu items based on user status
export function generateMenuAside(userStatus) {
  return [
    {
      to: '/dashboard',
      icon: mdiMonitor,
      label: 'Dashboard'
    },
    {
      to: '/tables',
      label: 'Tables',
      icon: mdiTable
    },
    {
      // to: userStatus === 'UXReviewer' ? '/questionnaire' : (userStatus === 'Company' ? '/add-application' : '/forms'),
      to: '/forms',
      label: userStatus === 'UXReviewer' ? 'Questionnaire' : (userStatus === 'Company' ? 'Add Application' : 'Forms'),
      icon: mdiSquareEditOutline
    },
    {
      to: '/ui',
      label: 'UI',
      icon: mdiTelevisionGuide
    },
    {
      to: '/responsive',
      label: 'Responsive',
      icon: mdiResponsive
    },
    {
      to: '/',
      label: 'Styles',
      icon: mdiPalette
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: mdiAccountCircle
    },
    {
      to: '/login',
      label: 'Login',
      icon: mdiLock
    },
    {
      to: '/error',
      label: 'Error',
      icon: mdiAlertCircle
    }
  ];
}
