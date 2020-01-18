// This is `@middleware/router-auth.js`

export default function({ store, redirect, route }) {
    // user already logged in and next route is '/login'
    store.state.user.user && route.name === 'login' ? redirect('/cases') : ''
    // 
    !store.state.user.user && !['login', 'register'].includes(route.name) ? redirect('/login') : ''
  }
  