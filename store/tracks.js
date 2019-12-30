
export const state = () => ({
  tracks: [],
  isFetching: false
})

export const getters = {
  getTracks: state => state.tracks,
  isFetching: state => state.isFetching
}

export const mutations = {
  setTracks(state, tracks) {
    state.tracks = [...tracks]
  },
  addTrack(state, track) {
    if (state.tracks.find(p => p.uid === track.uid)) {
      return
    }
    state.tracks = [...state.tracks, track]
  },
  removeTrack(state, track) {
    state.tracks = state.tracks.filter(
      tr => tr.uid !== track.uid
    )
  },

  setIsFetching(state, next) {
    state.isFetching = !!next
  }
}

export const actions = {
  add(context, {caseId, track}) {
    delete track.uid
    this.$fireStore
        .collection('users')
        .doc(context.rootState.user.user.uid)
        .collection('cases')
        .doc(caseId)
        .collection('tracks')
        .add(track)
  },
  remove(context, {caseId, track}) {
    this.$fireStore
        .collection('users')
        .doc(context.rootState.user.user.uid)
        .collection('cases')
        .doc(caseId)
        .collection('tracks')
        .doc(track.uid)
        .delete()
  },
  save(context, {caseId, track}) {
    if (context.state.tracks.find(tr => tr.uid === track.uid)) {
      this.$fireStore
        .collection('users')
        .doc(context.rootState.user.user.uid)
        .collection('cases')
        .doc(caseId)
        .collection('tracks')
        .doc(track.uid)
        .set(track, {merge: true})
    }
  },
  fetch(context, caseUid) {
    this.$fireStore
      .collection('users')
      .doc(context.rootState.user.user.uid)
      .collection('cases')
      .doc(caseUid)
      .collection('tracks')
      .onSnapshot(snapshot => {
        const tracks = []
        snapshot.forEach(doc => {
          tracks.push({
            uid: doc.id,
            ...doc.data()
          })
        })
        context.commit('setTracks', tracks)
      })
  }
}
