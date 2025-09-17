import RPC from 'discord-rpc';

const CLIENT_ID = '1417544325939855502';

class PresenceHandler {
  constructor(store, ipcMain) {
    this.store = store;
    this.ipcMain = ipcMain;

    this.ipcMain.handle('presence:get-settings', this.getSettings.bind(this));
    this.ipcMain.handle('presence:set-settings', this.setSettings.bind(this));
    this.ipcMain.on('presence:set-activity', this.setActivity.bind(this));

    this.client = null;
    this._init();
  }

  _init() {
    if (this.client) return;
    if (!this.store.get('presence.enabled')) return;

    this.client = new RPC.Client({ transport: 'ipc' });

    this.client.on('ready', this.onReady.bind(this));
    this.client.on('disconnected', this.onDisconnected.bind(this));

    this.client.login({ clientId: CLIENT_ID });
  }

  _destroy() {
    if (!this.client) return;
    this.client.destroy();
    this.client = null;
  }

  _update() {
    const enabled = this.store.get('presence.enabled');
    if (enabled && !this.client) return this._init();
    if (!enabled && this.client) return this._destroy();
  }

  onReady() {
    console.log('Discord presence ready');
  }

  onDisconnected() {
    console.log('Discord presence disconnected');
  }

  getSettings() {
    return this.store.get('presence') ?? { enabled: false };
  }

  setSettings(_, key, value) {
    this.store.set(`presence.${key}`, value);

    this._update();

    return this.store.get('presence');
  }

  setActivity(_, status) {
    if (!this.store.get('presence.enabled')) return;
    console.log(status);

    let activity = null;
    if (status) {
      const start = new Date();
      start.setSeconds(start.getSeconds() - status.currentTime);
      const end = new Date(start);
      end.setSeconds(end.getSeconds() + status.duration);

      activity = {
        type: 2,
        state: status.artist ? status.artist : undefined,
        details: status.title ? status.title : undefined,
        timestamps: {
          start: start.getTime(),
          end: !isNaN(status.duration) && isFinite(status.duration) ? end.getTime() : undefined,
        },
        status_display_type: 1,
        assets: {
          large_image: status.cover?.startsWith('https://') ? status.cover : undefined,
          large_text: status.album ? status.album : undefined,
          large_url: status.link,
        },
      };
    }

    console.log(activity);

    this.client.request('SET_ACTIVITY', {
      pid: process.pid,
      activity,
    });
  }
}

export default PresenceHandler;
