import { useEffect, useState } from 'react';

export default function usePresence() {
  const [presenceSettings, setPresenceSettingsState] = useState({ enabled: false });

  useEffect(() => {
    window.api?.presence?.getSettings().then(setPresenceSettingsState);
  }, []);

  const setPresenceSettings = (key, value) => {
    window.api?.presence?.setSettings(key, value).then(setPresenceSettingsState);
  };

  const setActivity = status => {
    window.api?.presence?.setActivity(status);
  };

  return {
    presenceSettings,
    setPresenceSettings,
    setActivity,
  };
}
