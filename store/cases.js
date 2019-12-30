import uuid from 'uuid/v4'

export const state = () => ({
  cases: [],
  isFetching: false
})

export const getters = {
  getCases: state => state.cases,
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
  add(context, track) {
    delete track.uid
    this.$fireStore
        .collection('users')
        .doc(context.rootState.user.user.uid)
        .collection('cases')
        .add(track)
  },
  remove(context, track) {
    this.$fireStore
        .collection('users')
        .doc(context.rootState.user.user.uid)
        .collection('cases')
        .doc(track.uid)
        .delete()
  },
  save(context, item) {
    if (context.state.cases.find(tr => tr.uid === item.uid)) {
      this.$fireStore
        .collection('users')
        .doc(context.rootState.user.user.uid)
        .collection('cases')
        .doc(item.uid)
        .set(item, {merge: true})
    }
  },
  fetch(context) {
    this.$fireStore
      .collection('users')
      .doc(context.rootState.user.user.uid)
      .collection('cases')
      .onSnapshot(snapshot => {
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
