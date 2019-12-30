export default function (context) {
    context.app.$fireAuth.onAuthStateChanged((user) => {
       if (user) {
           context.store.dispatch('user/setAuthenticatedUser', user)
            .then(() => context.redirect('/'))
       } else {
        context.store.dispatch('user/logout')
       }
    })
  }