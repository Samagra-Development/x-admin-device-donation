const resourceConfig = {
    homepageCards: [
      { 
        title: {
          en: 'Donate your smartphone', hi: 'अपना स्मार्टफ़ोन दान करें'
        },
        target: process.env.NEXT_PUBLIC_DONATE_DEVICE_FORM_URL,
        icon: 'volunteer_activism',
        colour: 'primary',
      },
      { 
        title: {
          en: 'Track your smartphone and get your Digi Saathi certificate', hi: 'अपने स्मार्टफ़ोन को ट्रैक करें और अपना Digi साथी प्रशंसा पत्र लें'
        },
        target: '/track',
        icon: 'grading',
        colour: 'secondary',
      },
      { 
        title: {
          en: 'Frequently Asked Questions', hi: 'जानकारी'
        },
        target: '/#',
        icon: 'quiz',
        colour: 'primary',
      },
      { 
        title: {
          en: 'Login for state officials', hi: 'राज्य के अधिकारियों के लिए लॉग इन'
        },
        target: '/login',
        icon: 'login',
        colour: 'secondary',
      },

    ],
    statusChoices: [
    { id: 'no-action-taken', name: 'No Action Taken', icon: 'warning', style: 'error' },    
    { id: 'donor-no-init', name: 'Delivery Not Initiated', icon: 'pending_actions', style: 'error' },
    { id: 'donor-init', name: 'Delivery Initiated', icon: 'inventory', style: 'pending' },
    { id: 'received-state', name: 'Received by state', icon: 'real_estate_agent' , style: 'success' },
    { id: 'delivered-child', name: 'Delivered to child', icon: 'check_circle', style: 'success'  },
    { id: 'cancelled', name: 'Cancelled', icon: 'disabled_by_default', style: 'error'  },
  ],
  deliveryTypeChoices: [
    { id: 'hand', name: 'Hand Off', filterable: true},
    { id: 'pickup', name: 'Pick Up', filterable: true},
    { id: 'courier', name: 'Courier', filterable: true},
    { id: 'handnonhp', name: 'Hand Off (outside HP)'},
    { id: 'couriernonhp', name: 'Courier (outside HP)'},
  ]
}

export default resourceConfig;