
export const state = () => ({
  tracks: [],
  isFetching: false
})

export const getters = {
  getSortedTracks: state => [...state.tracks].sort(function (var1, var2) {
    let a = new Date(var1.timestamp)
    let b = new Date(var2.timestamp)
    if (a > b)
      return 1;
    if (a < b)
      return -1;

    return 0;
  }),
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
  add(context, { caseId, track }) {
    delete track.uid
    this.$fire.firestore
      .collection('users')
      .doc(context.rootState.user.user.uid)
      .collection('cases')
      .doc(caseId)
      .collection('tracks')
      .add(track)
  },
  remove(context, { caseId, track }) {
    this.$fire.firestore
      .collection('users')
      .doc(context.rootState.user.user.uid)
      .collection('cases')
      .doc(caseId)
      .collection('tracks')
      .doc(track.uid)
      .delete()
  },
  save(context, { caseId, track }) {
    if (context.state.tracks.find(tr => tr.uid === track.uid)) {
      this.$fire.firestore
        .collection('users')
        .doc(context.rootState.user.user.uid)
        .collection('cases')
        .doc(caseId)
        .collection('tracks')
        .doc(track.uid)
        .set(track, { merge: true })
    }
  },
  fetch(context, caseUid) {
    this.$fire.firestore
      .collection('users')
      .doc(context.rootState.user.user.uid)
      .collection('cases')
      .doc(caseUid)
      .collection('tracks')
      .onSnapshot({ includeMetadataChanges: true }, snapshot => {
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
