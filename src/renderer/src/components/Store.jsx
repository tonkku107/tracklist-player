import { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext([]);

const reducer = (state, action) => {
  switch (action?.type) {
    case 'ADD_TRACK_TO_QUEUE': {
      const queue = [...(state.queue ?? []), action.track];
      return { ...state, queue };
    }
    case 'DELETE_TRACK_FROM_QUEUE': {
      const queue = [...(state.queue ?? [])];
      const index = queue.indexOf(action.track);
      if (index === -1) return state;
      queue.splice(index, 1);
      if (action.track.pictureUrl) URL.revokeObjectURL(action.track.pictureUrl);
      URL.revokeObjectURL(action.track.audioUrl);
      return { ...state, queue };
    }
    case 'SAVE_TRACKLIST': {
      const queue = state.queue;
      queue[action.index] = {
        ...queue[action.index],
        tracklist: action.tracklist,
        rawTracklist: action.raw,
        tracklistManuallyEdited: true,
      };
      return { ...state, queue };
    }
    default:
      return state;
  }
};

export function Store({ children }) {
  const [state, dispatch] = useReducer(reducer, {});

  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>;
}

export default function useStore() {
  const store = useContext(StoreContext);
  return store;
}
