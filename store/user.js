export const state = () => {
    return {
        user: undefined,
        darkmode: true,
    }
}

export const mutations = {
    setUser(state, user) {
        state.user = user
    },
    setDarkMode(state, mode) {
        state.darkmode = mode
    }
}

export const getters = {
    getUser(state) {
        return state.user
    },
    getDarkMode(state) {
        return state.darkmode
    }
}

export const actions = {
    darkMode(context, mode) {
        context.commit('setDarkMode', mode)
    },
    logout(context) {
        this.$fire.auth.signOut().then(() => {
            context.dispatch('setAuthenticatedUser', null)
            this.$router.push('/login')
        }).catch(err => console.log(error))
    },
    googleSignIn(context) {
        const provider = new this.$fireModule.auth.GoogleAuthProvider()
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.$fire.auth.signInWithPopup(provider)
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
                const result = await this.$fire.auth.signInWithEmailAndPassword(email, password)
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
                const result = await this.$fire.auth.createUserWithEmailAndPassword(email, password)
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
            this.$fire.firestore.collection('users').doc(u.uid).set(u)
        } else {
            context.commit('setUser', undefined)
        }
    }
}