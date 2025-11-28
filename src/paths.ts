export const paths = {
    home: '/',
    auth: {
      signIn: '/login',
      signUp: '/register',
      resetPassword: '/reset-password',
    },
    dashboard: {
      overview: '/dashboard',
      account: '/dashboard/account',
      customers: '/dashboard/customers',
      integrations: '/dashboard/integrations',
      settings: '/dashboard/settings',
    },
    errors: {
      notFound: '/404',
    },
  } as const;