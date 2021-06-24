const resourceConfig = {
    statusChoices: [
    { id: 'no-action-taken', name: 'No Action Taken', icon: 'warning', style: 'error' },
    { id: 'donor-contacted', name: 'Donor Contacted', icon: 'connect_without_contact', style: 'error' },
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