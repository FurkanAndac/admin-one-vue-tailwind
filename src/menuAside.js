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
      // to: userStatus === 'UXReviewer' ? '/questionnaire' : (userStatus === 'Company' ? '/add-application' : '/forms'),
      to: '/forms',
      label: userStatus === 'UXReviewer' ? 'Questionnaire' : (userStatus === 'Company' ? 'Add Application' : 'Forms'),
      icon: mdiSquareEditOutline
    },

  ];
}
