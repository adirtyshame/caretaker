export const state = () => {
    return {
        user: undefined,
    }
}

export const mutations = {
    setUser(state, user) {
        state.user = user
    }
}

export const getters = {
    getUser(state) {
        return state.user
    }
}

export const actions = {
    logout(context) {
        this.$fireAuth.signOut().then(() => {
            context.dispatch('setAuthenticatedUser', null)
            this.$router.push('/login')
          }).catch(err => console.log(error))
    },
    googleSignIn(context) {
        const provider = new this.$fireAuthObj.GoogleAuthProvider()
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.$fireAuth.signInWithPopup(provider)
                context.dispatch('setAuthenticatedUser', result.user)
                resolve()
            } catch(e) {
                console.error(e)
                reject(e)
            }
        });
      },
      async passwordSignIn(context, {email, password}) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.$fireAuth.signInWithEmailAndPassword(email, password)
                context.dispatch('setAuthenticatedUser', result.user)
                resolve()
            } catch(e) {
                console.error(e)
                reject(e)
            }
        });
      },
      async register(context, {email, password}) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.$fireAuth.createUserWithEmailAndPassword(email, password)
                context.dispatch('setAuthenticatedUser', result.user)
                resolve()
            } catch(e) {
                console.error(e)
                reject(e)
            }
        });
      },
    setAuthenticatedUser(context, user) {
        if (user) {
            const u = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                providerId: user.providerData[0].providerId
            }
            context.commit('setUser', u)
            this.$fireStore.collection('users').doc(u.uid).set(u)
        } else {
            context.commit('setUser', undefined)
        }
    }
}