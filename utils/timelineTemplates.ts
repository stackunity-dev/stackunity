export const timelineTemplates = {
  project: {
    title: 'Project Timeline',
    align: 'start',
    side: 'end',
    density: 'default',
    direction: 'vertical',
    lineColor: 'primary',
    lineWidth: 2,
    lineInset: 0,
    dotSize: 'small',
    elevation: 2,
    rounded: true,
    reverse: false,
    truncateLine: false,
    fillDots: true,
    hideOpposite: false,
    items: [
      {
        title: 'Project Kickoff',
        text: 'Initial meeting with stakeholders to define project scope and objectives.',
        icon: 'mdi-flag',
        color: 'success',
        time: 'Jan 15, 2023',
        hideOpposite: false
      },
      {
        title: 'Design Phase',
        text: 'Creating wireframes and mockups for the application interface.',
        icon: 'mdi-palette',
        color: 'info',
        time: 'Feb 1, 2023',
        hideOpposite: false
      },
      {
        title: 'Development Started',
        text: 'Beginning of the coding phase with frontend and backend implementation.',
        icon: 'mdi-code-braces',
        color: 'primary',
        time: 'Mar 10, 2023',
        hideOpposite: false
      },
      {
        title: 'Testing Phase',
        text: 'Quality assurance and bug fixing before the release.',
        icon: 'mdi-test-tube',
        color: 'warning',
        time: 'Apr 5, 2023',
        hideOpposite: false
      },
      {
        title: 'Project Launch',
        text: 'Successful deployment of the application to production.',
        icon: 'mdi-rocket-launch',
        color: 'error',
        time: 'May 1, 2023',
        hideOpposite: false
      }
    ]
  },

  routine: {
    title: 'Daily Routine',
    align: 'center',
    side: 'end',
    density: 'compact',
    direction: 'vertical',
    lineColor: 'secondary',
    lineWidth: 2,
    lineInset: 0,
    dotSize: 'small',
    elevation: 2,
    rounded: true,
    reverse: false,
    truncateLine: false,
    fillDots: true,
    hideOpposite: false,
    items: [
      {
        title: 'Wake Up & Meditation',
        text: 'Start the day with 15 minutes of meditation to focus and prepare mentally.',
        icon: 'mdi-weather-sunset-up',
        color: 'info',
        time: '06:00',
        hideOpposite: false
      },
      {
        title: 'Morning Exercise',
        text: '30 minutes of physical exercise to stimulate body and mind.',
        icon: 'mdi-run',
        color: 'success',
        time: '06:30',
        hideOpposite: false
      },
      {
        title: 'Breakfast',
        text: 'Balanced meal to start the day with energy.',
        icon: 'mdi-food-apple',
        color: 'primary',
        time: '07:15',
        hideOpposite: false
      },
      {
        title: 'Work - Morning Session',
        text: 'Focus on priority tasks when energy is at its peak.',
        icon: 'mdi-briefcase',
        color: 'secondary',
        time: '08:00',
        hideOpposite: false
      },
      {
        title: 'Lunch Break',
        text: 'Balanced meal and short walk to recharge.',
        icon: 'mdi-food',
        color: 'warning',
        time: '12:00',
        hideOpposite: false
      },
      {
        title: 'Work - Afternoon Session',
        text: 'Meetings and collaborative tasks.',
        icon: 'mdi-account-group',
        color: 'secondary',
        time: '13:00',
        hideOpposite: false
      },
      {
        title: 'Personal Time',
        text: 'Hobbies, family or personal development.',
        icon: 'mdi-heart',
        color: 'error',
        time: '18:00',
        hideOpposite: false
      },
      {
        title: 'Bedtime Preparation',
        text: 'Reading and relaxation for a restful night.',
        icon: 'mdi-weather-night',
        color: 'info',
        time: '22:00',
        hideOpposite: false
      }
    ]
  },

  history: {
    title: 'Company History',
    align: 'start',
    side: 'alternate',
    density: 'default',
    direction: 'vertical',
    lineColor: 'secondary',
    lineWidth: 3,
    lineInset: 0,
    dotSize: 'large',
    elevation: 4,
    rounded: true,
    reverse: false,
    truncateLine: false,
    fillDots: false,
    hideOpposite: false,
    items: [
      {
        title: 'Company Founded',
        text: 'Our company was established with a vision to revolutionize the industry.',
        icon: 'mdi-domain',
        color: 'primary',
        time: '2010',
        hideOpposite: false
      },
      {
        title: 'First Major Client',
        text: 'Secured our first enterprise client, marking a significant milestone.',
        icon: 'mdi-handshake',
        color: 'success',
        time: '2012',
        hideOpposite: false
      },
      {
        title: 'International Expansion',
        text: 'Opened our first international office in London, UK.',
        icon: 'mdi-earth',
        color: 'info',
        time: '2015',
        hideOpposite: false
      },
      {
        title: 'Product Launch',
        text: 'Released our flagship product that changed the market landscape.',
        icon: 'mdi-new-box',
        color: 'warning',
        time: '2018',
        hideOpposite: false
      },
      {
        title: 'IPO',
        text: 'Successfully completed our initial public offering on the stock exchange.',
        icon: 'mdi-chart-line',
        color: 'error',
        time: '2022',
        hideOpposite: false
      }
    ]
  },

  process: {
    title: 'Workflow Process',
    align: 'end',
    side: 'start',
    density: 'comfortable',
    direction: 'vertical',
    lineColor: 'success',
    lineWidth: 2,
    lineInset: 8,
    dotSize: 'small',
    elevation: 2,
    rounded: true,
    reverse: false,
    truncateLine: true,
    fillDots: true,
    hideOpposite: false,
    items: [
      {
        title: 'Request Submission',
        text: 'Customer submits a new service request through the portal.',
        icon: 'mdi-clipboard-text',
        color: 'primary',
        time: 'Step 1',
        hideOpposite: false
      },
      {
        title: 'Initial Review',
        text: 'Support team reviews the request and assigns priority.',
        icon: 'mdi-eye-outline',
        color: 'info',
        time: 'Step 2',
        hideOpposite: false
      },
      {
        title: 'Assignment',
        text: 'Request is assigned to the appropriate department for handling.',
        icon: 'mdi-account-switch',
        color: 'secondary',
        time: 'Step 3',
        hideOpposite: false
      },
      {
        title: 'Resolution',
        text: 'Department resolves the issue and documents the solution.',
        icon: 'mdi-check-circle',
        color: 'success',
        time: 'Step 4',
        hideOpposite: false
      },
      {
        title: 'Feedback',
        text: 'Customer provides feedback on the service quality.',
        icon: 'mdi-star',
        color: 'warning',
        time: 'Step 5',
        hideOpposite: false
      }
    ]
  }
};

export const getTimelineTemplate = (templateName: string) => {
  return JSON.parse(JSON.stringify(timelineTemplates[templateName as keyof typeof timelineTemplates] || {}));
}; 