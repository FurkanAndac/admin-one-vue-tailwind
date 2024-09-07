import {
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
  mdiThemeLightDark,
} from '@mdi/js';

// Function to generate the menu configuration based on user status
export const generateMenuConfig = (status, credits) => {
  const commonMenuItems = [
    {
      icon: mdiThemeLightDark,
      label: 'Light/Dark',
      isDesktopNoLabel: true,
      isToggleLightDark: true
    },
    {
      icon: mdiLogout,
      label: 'Log out',
      isDesktopNoLabel: true,
      isLogout: true
    }
  ];

  const companyMenuItems = [
    {
      label: `Credits: ${credits || 'Loading...'}`, // Use dynamic credits
    },
    {
      isCurrentUser: true,
      menu: [
        {
          icon: mdiAccount,
          label: 'My Profile',
          to: '/profile'
        },
        {
          icon: mdiCogOutline,
          label: 'Settings'
        },
        {
          icon: mdiEmail,
          label: 'Messages'
        },
        {
          isDivider: true
        },
        {
          icon: mdiLogout,
          label: 'Log Out',
          isLogout: true
        }
      ]
    },
    ...commonMenuItems
  ];

  const uxReviewerMenuItems = [
    {
      label: `Credits: ${credits !== undefined && credits !== null ? credits : 'Loading...'}`, // Use dynamic credits or 'Loading...'
    },
    {
      isCurrentUser: true,
      menu: [
        {
          icon: mdiAccount,
          label: 'My Profile',
          to: '/profile'
        },
        {
          icon: mdiCogOutline,
          label: 'Settings'
        }
      ]
    },
    ...commonMenuItems
  ];

  if (status === 'Company') {
    return companyMenuItems;
  } else if (status === 'UXReviewer') {
    return uxReviewerMenuItems;
  } else {
    return []; // Default or empty menu configuration
  }
};
