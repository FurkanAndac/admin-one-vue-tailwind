import {
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
  mdiThemeLightDark,
} from '@mdi/js';
import { computed } from 'vue';

// Function to generate the menu configuration based on user status
export const generateMenuConfig = (status, credits) => {
  // Dynamic computed property to reactively return credits
  const compCredits = computed(() => {
    return credits.value !== undefined ? `Credits: ${credits.value}` : 'Loading...';
  });

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
      label: compCredits.value, // Display reactive credits directly
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
      label: compCredits.value, // Display reactive credits directly
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
