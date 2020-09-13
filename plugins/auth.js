export default function (context) {
    context.app.$fireAuth.onAuthStateChanged((user) => {
       if (user) {
           context.store.dispatch('user/setAuthenticatedUser', user)
            .then(() => context.store.dispatch('cases/fetch'))
            .then(() => context.redirect('/cases'))
       } else {
        context.store.dispatch('user/logout')
       }
    })
  }