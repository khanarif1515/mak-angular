export const FORM_INFO = {
  'anonymous': {
    'label': 'Make my donation anonymous',
    'placeholder': '',
    'note': '',
    'error': {
      'required': '',
      'custom': ''
    }
  },
  'mobile': {
    'label': 'Mobile Number',
    'placeholder': 'Enter Mobile Number',
    'note': 'All donation updates will be sent on this number',
    'error': {
      'required': 'Please enter your phone number',
      'custom': 'Please enter a valid phone number'
    }
  },
  'name': {
    'label': 'Name',
    'placeholder': 'Enter Name',
    'error': {
      'required': 'Please enter your name',
      'minlength': 'Minimum 3 characters required',
      'maxlength': 'Maximum character limit exceeds',
      'pattern': 'Please enter a valid name'
    },
  },
  'email': {
    'label': 'Email Address',
    'placeholder': 'Email Address',
    'error': {
      'required': 'Please enter your email address',
      'email': 'Please enter a valid email',
      'pattern': 'Please enter a valid email'
    },
  },
  'pincode': {
    'label': 'Pincode',
    'placeholder': 'Pincode',
    'error': {
      'required': 'Please enter your pincode',
      'minlength': 'Please enter a valid Pincode',
      'maxlength': 'Please enter a valid Pincode',
      'pattern': 'Please enter a valid Pincode'
    },
  },
  'address': {
    'label': 'Address',
    'placeholder': 'Address',
    'error': {
      'required': 'Please enter your address',
      'minlength': 'Please enter a valid Address',
      'maxlength': 'Please enter a valid Address',
    },
  },
  'pancard': {
    'label': 'Pancard',
    'placeholder': 'Pancard',
    'error': {
      'required': 'Please enter your pan',
      'pattern': 'Invalid Pancard Number',
    },
  },
  'passport': {
    'label': 'Passport Number',
    'placeholder': 'Passport No.',
    'error': {
      'required': 'Please enter your passport number',
      'pattern': 'Invalid passport Number',
    },
  },
  'otp': {
    'label': 'OTP',
    'placeholder': 'Enter OTP',
    'error': {
      'required': 'Please enter your otp',
      'pattern': 'Invalid OTP Number',
    },
  },
  'manualAmount': {
    'label': '',
    'placeholder': 'Enter Amount',
    'error': {
      'required': 'Please enter an amount',
      'min': 'Please enter minimum {{min_amount}}',
      'max': 'Please enter amount less then {{max_amount}}'
    },
  }
};
