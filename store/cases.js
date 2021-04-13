import uuid from 'uuid/v4'

export const state = () => ({
  cases: [],
  isFetching: false
})

export const getters = {
  getCases: state => {
    const items = [...state.cases].sort((a, b) => a.lastName.localeCompare(b.lastName))
    return items
  },
  isFetching: state => state.isFetching
}

export const mutations = {
  setCases(state, nursingCases) {
    state.cases = [...nursingCases]
  },
  addCase(state, nursingCase) {
    if (state.cases.find(p => p.uid === nursingCase.uid)) {
      return
    }
    state.cases = [...state.cases, nursingCase]
  },
  removeCase(state, nursingCase) {
    state.cases = state.cases.filter(
      nc => nc.uid !== nursingCase.uid
    )
  },

  setIsFetching(state, next) {
    state.isFetching = !!next
  }
}

export const actions = {
  async add(context, track) {
    delete track.uid
    return await this.$fire.firestore
        .collection('users')
        .doc(context.rootState.user.user.uid)
        .collection('cases')
        .add(track)
  },
  async remove(context, track) {
    return await this.$fire.firestore
        .collection('users')
        .doc(context.rootState.user.user.uid)
        .collection('cases')
        .doc(track.uid)
        .delete()
  },
  save(context, item) {
    if (context.state.cases.find(tr => tr.uid === item.uid)) {
      this.$fire.firestore
        .collection('users')
        .doc(context.rootState.user.user.uid)
        .collection('cases')
        .doc(item.uid)
        .set(item, {merge: true})
    }
  },
  fetch(context) {
    this.$fire.firestore
      .collection('users')
      .doc(context.rootState.user.user.uid)
      .collection('cases')
      .onSnapshot({ includeMetadataChanges: true }, snapshot => {
        const cases = []
        snapshot.forEach(doc => {
          cases.push({
            uid: doc.id,
            ...doc.data()
          })
        })
        context.commit('setCases', cases)
      })
  },
}
