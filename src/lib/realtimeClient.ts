type MsgHandler = (data: any) => void;

export function connectRealtime(userId: string | undefined, onMessage: MsgHandler) {
  if (typeof window === 'undefined') return { disconnect: () => {} };
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const base = api.replace(/\/api\/?$/, '');
    // Prefer using stored auth token for secure WS auth; fall back to userId for legacy
    const token = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem('raktsetu_token') : null;
    // use subprotocol to pass JWT securely instead of query string
    const wsUrl = (base.startsWith('https') ? 'wss' : 'ws') + '://' + base.replace(/^https?:\/\//, '') + `/ws`;
    const ws = token ? new WebSocket(wsUrl, token) : (userId ? new WebSocket(wsUrl, String(userId)) : null);
    if (!ws) return { disconnect: () => {} };

    ws.addEventListener('open', () => {
      // console.log('Realtime connected');
    });

    ws.addEventListener('message', (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        onMessage(msg);
      } catch (_) {}
    });

    ws.addEventListener('close', () => {
      // console.log('Realtime disconnected');
    });

    return {
      disconnect: () => { try { ws.close(); } catch (_) {} },
    };
  } catch (err) {
    return { disconnect: () => {} };
  }
}

export default { connectRealtime };
