export default function (context) {
  context.app.$fire.auth.onAuthStateChanged((user) => {
    if (user) {
      context.store.dispatch('user/setAuthenticatedUser', user)
        .then(() => context.store.dispatch('cases/fetch'))
    } else {
      context.store.dispatch('user/logout')
    }
  })
}