import { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext([]);

const reducer = (state, action) => {
  switch (action?.type) {
    case 'ADD_TRACK_TO_QUEUE': {
      const queue = new Map([...(state.queue?.entries() ?? [])]);
      queue.set(action.track.id, action.track);
      return { ...state, queue };
    }
    case 'DELETE_TRACK_FROM_QUEUE': {
      const queue = new Map([...(state.queue?.entries() ?? [])]);
      const removedTrack = queue.get(action.id);
      if (!removedTrack) return state;

      queue.delete(action.id);
      URL.revokeObjectURL(removedTrack.pictureUrl);
      URL.revokeObjectURL(removedTrack.audioUrl);

      return { ...state, queue };
    }
    case 'MOVE_TRACK': {
      const entries = [...(state.queue?.entries() ?? [])];

      const { source, destination } = action;
      if (typeof destination !== 'number') return state;
      if (source === destination) return state;

      const moved = entries.splice(source, 1);
      entries.splice(destination, 0, ...moved);

      const queue = new Map(entries);

      return { ...state, queue };
    }
    case 'SAVE_TRACKLIST': {
      const queue = state.queue ?? new Map();
      if (!state.queue.has(action.id)) return state;

      const track = {
        ...queue.get(action.id),
        tracklist: action.tracklist,
        rawTracklist: action.raw,
        tracklistManuallyEdited: true,
      };
      queue.set(action.id, track);

      return { ...state };
    }
    case 'SET_USE_FONT': {
      const settings = {
        ...state.settings,
        useFont: action.value,
      };
      saveSettings(settings);

      return { ...state, settings };
    }
    case 'SET_USE_CAPS': {
      const settings = {
        ...state.settings,
        useCaps: action.value,
      };
      saveSettings(settings);

      return { ...state, settings };
    }
    case 'SET_AUTOPLAY': {
      const settings = {
        ...state.settings,
        autoplay: action.value,
      };
      saveSettings(settings);

      return { ...state, settings };
    }
    case 'SET_AUTOPLAY_NEXT': {
      const settings = {
        ...state.settings,
        autoplayNext: action.value,
      };
      saveSettings(settings);

      return { ...state, settings };
    }
    default:
      return state;
  }
};

const saveSettings = settings => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

export function Store({ children }) {
  const [state, dispatch] = useReducer(reducer, { settings: {} }, state => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      state.settings = JSON.parse(savedSettings);
    }

    return state;
  });

  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>;
}

export default function useStore() {
  const store = useContext(StoreContext);
  return store;
}
