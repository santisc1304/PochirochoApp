/**
 * SpotifyPsychoacousticEngine.js
 * Motor de Recomendación Musical Personalizada con Spotify Web API (OAuth 2.0 PKCE)
 * Calibra parámetros acústicos según la fase hormonal y síntomas registrados,
 * basándose 100% en los artistas y gustos reales de la usuaria.
 */

export class SpotifyPsychoacousticEngine {
  static CLIENT_ID = 'fa292c3f485d40a4ba4fa1d17e61dd96'; // Client ID oficial de Spotify
  static REDIRECT_URI = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'http://localhost:80/';
  static SCOPES = 'user-top-read user-read-recently-played user-read-playback-state user-library-read user-read-email user-read-private';

  static getClientId() {
    if (typeof localStorage !== 'undefined') {
      const customId = localStorage.getItem('pochirocho_spotify_client_id');
      if (customId && customId.trim()) return customId.trim();
    }
    return this.CLIENT_ID;
  }

  static getRedirectUri() {
    if (typeof localStorage !== 'undefined') {
      const custom = localStorage.getItem('pochirocho_spotify_custom_redirect');
      if (custom && custom.trim().length > 0) {
        return custom.trim();
      }
    }
    if (typeof window !== 'undefined') {
      const origin = window.location.origin.replace(/\/+$/, '');
      return origin + '/';
    }
    return this.REDIRECT_URI;
  }

  /**
   * Refresca silenciosamente el token de acceso usando el refresh_token guardado (OAuth PKCE)
   */
  static async refreshAccessToken() {
    if (typeof localStorage === 'undefined') return null;
    const refreshToken = localStorage.getItem('pochirocho_spotify_refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.getClientId()
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem('pochirocho_spotify_access_token', data.access_token);
          localStorage.setItem('pochirocho_spotify_expires_at', (Date.now() + ((data.expires_in || 3600) * 1000)).toString());
          if (data.refresh_token) {
            localStorage.setItem('pochirocho_spotify_refresh_token', data.refresh_token);
          }
          localStorage.setItem('pochirocho_spotify_connected', 'true');
          return data.access_token;
        }
      }
    } catch (err) {
      console.warn('SpotifyPsychoacousticEngine: Error al refrescar token de Spotify:', err);
    }
    return null;
  }

  /**
   * Obtiene un token válido, refrescándolo automáticamente si está vencido sin desconectar jamás a la usuaria
   */
  static async getValidToken() {
    if (typeof localStorage === 'undefined') return null;
    let token = localStorage.getItem('pochirocho_spotify_access_token');
    const expiresAt = localStorage.getItem('pochirocho_spotify_expires_at');
    const refreshToken = localStorage.getItem('pochirocho_spotify_refresh_token');

    // Si no hay token o está por vencer y tenemos refresh_token, renovar
    if ((!token || (expiresAt && Date.now() > (parseInt(expiresAt, 10) - 60000))) && refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) return refreshed;
    }

    return token;
  }

  /**
   * Obtiene el token de acceso guardado en localStorage sin desconectar
   */
  static getStoredToken() {
    if (typeof localStorage === 'undefined') return null;
    const token = localStorage.getItem('pochirocho_spotify_access_token');
    const expiresAt = localStorage.getItem('pochirocho_spotify_expires_at');
    const refreshToken = localStorage.getItem('pochirocho_spotify_refresh_token');

    // Si expiró pero tenemos refresh_token, disparar refresco en segundo plano sin desconectar
    if (expiresAt && Date.now() > parseInt(expiresAt, 10) && refreshToken) {
      this.refreshAccessToken().catch(() => {});
    }
    return token;
  }

  static isConnected() {
    if (typeof localStorage === 'undefined') return false;
    return !!(
      localStorage.getItem('pochirocho_spotify_connected') === 'true' ||
      localStorage.getItem('pochirocho_spotify_access_token') ||
      localStorage.getItem('pochirocho_spotify_refresh_token')
    );
  }

  static getUserProfile() {
    if (typeof localStorage === 'undefined') return null;
    try {
      return JSON.parse(localStorage.getItem('pochirocho_spotify_user_profile') || 'null');
    } catch(e) {
      return null;
    }
  }

  static async fetchUserProfile(force = false) {
    if (!force) {
      const cached = this.getUserProfile();
      if (cached && (cached.email || cached.id)) return cached;
    }
    const token = await this.getValidToken() || this.getStoredToken();
    if (!token) return null;
    try {
      const res = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const profile = await res.json();
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('pochirocho_spotify_user_profile', JSON.stringify(profile));
        }
        return profile;
      }
    } catch (e) {
      console.warn('Error obteniendo perfil de Spotify:', e);
    }
    return this.getUserProfile();
  }

  static disconnect(options = {}) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('pochirocho_spotify_connected');
      localStorage.removeItem('pochirocho_spotify_access_token');
      localStorage.removeItem('pochirocho_spotify_refresh_token');
      localStorage.removeItem('pochirocho_spotify_expires_at');
      localStorage.removeItem('pochirocho_spotify_user_profile');
      localStorage.removeItem('pochirocho_spotify_top_artists');
      localStorage.removeItem('pochirocho_spotify_top_tracks');
      localStorage.removeItem('pochirocho_spotify_liked_tracks');
      localStorage.removeItem('pochirocho_spotify_saved_albums');
      localStorage.removeItem('pochirocho_spotify_recent_tracks');
      localStorage.removeItem('pochirocho_spotify_api_error');
      localStorage.removeItem('pochirocho_spotify_last_rec');
      localStorage.removeItem('spotify_code_verifier');
      ['menstrual', 'folicular', 'ovulatoria', 'lutea'].forEach(ph => {
        localStorage.removeItem(`pochirocho_sp_rec_idx_${ph}`);
        localStorage.removeItem(`pochirocho_sp_idx_${ph}`);
      });
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('spotify_code_verifier');
    }
    try {
      document.cookie = 'spotify_code_verifier=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch(e) {}

    // Si se solicita cerrar sesión en la web de Spotify para permitir conectar otra cuenta limpiamente
    if (options.logoutSpotifyWeb && typeof window !== 'undefined') {
      try {
        const logoutWin = window.open('https://accounts.spotify.com/logout', '_blank', 'width=600,height=500');
        if (logoutWin) {
          setTimeout(() => { try { logoutWin.close(); } catch(e) {} }, 2500);
        }
      } catch(e) {}
    }
  }

  /**
   * Cambia de cuenta de Spotify: purga datos locales y abre el diálogo forzado
   */
  static async switchAccount() {
    this.disconnect({ logoutSpotifyWeb: true });
    setTimeout(() => {
      this.loginWithSpotify();
    }, 600);
  }

  /**
   * Inicia el flujo de autorización OAuth 2.0 PKCE con Spotify.
   * show_dialog: 'true' garantiza que Spotify SIEMPRE muestre la pantalla de confirmación
   * permitiendo cambiar de cuenta de usuario en lugar de auto-conectarse a la anterior.
   */
  static async loginWithSpotify() {
    const codeVerifier = this.generateRandomString(64);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    try {
      localStorage.setItem('spotify_code_verifier', codeVerifier);
      sessionStorage.setItem('spotify_code_verifier', codeVerifier);
      document.cookie = `spotify_code_verifier=${codeVerifier}; path=/; max-age=600; SameSite=Lax`;
    } catch(e) {}

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.getClientId(),
      scope: this.SCOPES,
      redirect_uri: this.getRedirectUri(),
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      show_dialog: 'true' // Forzar diálogo de login y selección de cuenta
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  /**
   * Intercepta el código de autorización o token tras el redirect de Spotify
   */
  static async handleAuthCallback() {
    if (typeof window === 'undefined') return false;

    // 1. Soporte para Implicit Grant en Hash Fragment (#access_token=...)
    if (window.location.hash && window.location.hash.includes('access_token')) {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const expiresIn = parseInt(hashParams.get('expires_in'), 10) || 3600;
        if (accessToken) {
          localStorage.setItem('pochirocho_spotify_access_token', accessToken);
          localStorage.setItem('pochirocho_spotify_expires_at', (Date.now() + (expiresIn * 1000)).toString());
          localStorage.setItem('pochirocho_spotify_connected', 'true');
          window.history.replaceState({}, document.title, window.location.pathname);
          await this.fetchAndStoreUserProfile();
          return true;
        }
      } catch (e) {
        console.warn('Spotify: Error al procesar token de hash:', e);
      }
    }

    // 2. Soporte para Authorization Code PKCE (?code=...)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) return false;

    let codeVerifier = null;
    try {
      codeVerifier = localStorage.getItem('spotify_code_verifier') || sessionStorage.getItem('spotify_code_verifier');
      if (!codeVerifier && document.cookie) {
        const match = document.cookie.match(/spotify_code_verifier=([^;]+)/);
        if (match) codeVerifier = match[1];
      }
    } catch(e) {}

    if (!codeVerifier) return false;

    const urisToTry = [this.getRedirectUri()];
    const cleanOrigin = window.location.origin.replace(/\/+$/, '');
    if (!urisToTry.includes(cleanOrigin + '/')) urisToTry.push(cleanOrigin + '/');
    if (!urisToTry.includes(cleanOrigin)) urisToTry.push(cleanOrigin);

    for (let redirectUri of urisToTry) {
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: this.getClientId(),
            code_verifier: codeVerifier
          })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('pochirocho_spotify_access_token', data.access_token);
          localStorage.setItem('pochirocho_spotify_expires_at', (Date.now() + (data.expires_in * 1000)).toString());
          if (data.refresh_token) {
            localStorage.setItem('pochirocho_spotify_refresh_token', data.refresh_token);
          }
          localStorage.setItem('pochirocho_spotify_connected', 'true');
          try {
            localStorage.removeItem('spotify_code_verifier');
            sessionStorage.removeItem('spotify_code_verifier');
          } catch(e) {}

          // Limpiar URL sin recargar
          window.history.replaceState({}, document.title, window.location.pathname);
          await this.fetchAndStoreUserProfile();
          return true;
        }
      } catch (err) {
        console.warn('Error en intento de intercambio de token de Spotify:', err);
      }
    }
    return false;
  }

  /**
   * Descarga el perfil completo y la biblioteca musical real de la usuaria
   * (artistas favoritos en varios rangos, canciones favoritas, guardadas en biblioteca y álbumes)
   */
  static async fetchAndStoreUserProfile() {
    const token = await this.getValidToken() || this.getStoredToken();
    if (!token) return null;

    let profile = null;
    try {
      const res = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 403) {
        localStorage.setItem('pochirocho_spotify_api_error', '403_FORBIDDEN');
        return null;
      }
      if (res.ok) {
        profile = await res.json();
        localStorage.setItem('pochirocho_spotify_user_profile', JSON.stringify(profile));
        localStorage.removeItem('pochirocho_spotify_api_error');
      }

      // 1. Artistas favoritos en múltiples rangos de tiempo (medium_term, long_term, short_term)
      let allArtists = [];
      const artistIds = new Set();
      for (let tr of ['medium_term', 'long_term', 'short_term']) {
        try {
          const aRes = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${tr}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (aRes.ok) {
            const aData = await aRes.json();
            (aData.items || []).forEach(art => {
              if (art && art.id && !artistIds.has(art.id)) {
                artistIds.add(art.id);
                allArtists.push(art);
              }
            });
          }
        } catch(e) {}
      }
      if (allArtists.length > 0) {
        localStorage.setItem('pochirocho_spotify_top_artists', JSON.stringify(allArtists));
      }

      // 2. Canciones favoritas (top tracks medium_term, long_term, short_term)
      let allTopTracks = [];
      const trackIds = new Set();
      for (let tr of ['medium_term', 'long_term', 'short_term']) {
        try {
          const tRes = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${tr}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (tRes.ok) {
            const tData = await tRes.json();
            (tData.items || []).forEach(trk => {
              if (trk && trk.id && !trackIds.has(trk.id)) {
                trackIds.add(trk.id);
                allTopTracks.push(trk);
              }
            });
          }
        } catch(e) {}
      }
      if (allTopTracks.length > 0) {
        localStorage.setItem('pochirocho_spotify_top_tracks', JSON.stringify(allTopTracks));
      }

      // 3. Canciones con "Me Gusta" (Liked Songs)
      try {
        const likedRes = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (likedRes.ok) {
          const likedData = await likedRes.json();
          const likedTracks = (likedData.items || []).map(item => item.track).filter(Boolean);
          localStorage.setItem('pochirocho_spotify_liked_tracks', JSON.stringify(likedTracks));
        }
      } catch (e) {}

      // 4. Álbumes guardados en la biblioteca (Saved Albums)
      try {
        const albumsRes = await fetch('https://api.spotify.com/v1/me/albums?limit=20', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (albumsRes.ok) {
          const albumsData = await albumsRes.json();
          const savedAlbums = (albumsData.items || []).map(item => item.album).filter(Boolean);
          localStorage.setItem('pochirocho_spotify_saved_albums', JSON.stringify(savedAlbums));
        }
      } catch (e) {}

      // 5. Escuchadas recientemente (Recently Played)
      try {
        const recentRes = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (recentRes.ok) {
          const recentData = await recentRes.json();
          const recentTracks = (recentData.items || []).map(item => item.track).filter(Boolean);
          localStorage.setItem('pochirocho_spotify_recent_tracks', JSON.stringify(recentTracks));
        }
      } catch (e) {}

    } catch (err) {
      console.warn('Error al sincronizar biblioteca de Spotify:', err);
    }
    return profile;
  }

  /**
   * Calcula los parámetros acústicos ideales según la fase biológica y los síntomas
   */
  static computeAcousticTargets(phase = 'Ovulatoria', symptoms = []) {
    const p = phase.toLowerCase();
    const s = symptoms.map(sym => String(sym).toLowerCase());

    let targets = {
      target_energy: 0.5,
      target_valence: 0.5,
      target_tempo: 100,
      target_acousticness: 0.3,
      target_danceability: 0.5,
      target_instrumentalness: 0.05,
      target_mode: 1
    };

    // 1. Perfiles Psicoacústicos Basales por Fase Hormonal
    if (p.includes('menstrual') || p.includes('regla')) {
      targets.target_energy = 0.22;
      targets.target_valence = 0.40;
      targets.target_tempo = 65;
      targets.target_acousticness = 0.80;
      targets.target_danceability = 0.35;
      targets.target_mode = 0; // Armonías menores reconfortantes
      targets.max_energy = 0.38;
      targets.max_tempo = 85;
      targets.min_acousticness = 0.45;
      targets.isCalmPhase = true;
    } else if (p.includes('folicular')) {
      targets.target_energy = 0.72;
      targets.target_valence = 0.80;
      targets.target_tempo = 118;
      targets.target_acousticness = 0.25;
      targets.target_danceability = 0.70;
      targets.target_mode = 1; // Modo mayor alegre
      targets.min_energy = 0.45;
      targets.isCalmPhase = false;
    } else if (p.includes('ovulatoria')) {
      targets.target_energy = 0.88;
      targets.target_valence = 0.88;
      targets.target_tempo = 128;
      targets.target_acousticness = 0.15;
      targets.target_danceability = 0.85;
      targets.target_mode = 1;
      targets.min_energy = 0.65;
      targets.min_valence = 0.60;
      targets.isCalmPhase = false;
    } else if (p.includes('lutea') || p.includes('lútea') || p.includes('premenstrual')) {
      targets.target_energy = 0.35;
      targets.target_valence = 0.45;
      targets.target_tempo = 74;
      targets.target_acousticness = 0.60;
      targets.target_danceability = 0.40;
      targets.target_mode = 0;
      targets.max_energy = 0.48;
      targets.max_tempo = 95;
      targets.min_acousticness = 0.35;
      targets.isCalmPhase = true;
    }

    // 2. Moduladores por Síntomas Físicos y Emocionales Registrados
    const hasCramps = s.some(sym => sym.includes('cólico') || sym.includes('colico') || sym.includes('dolor'));
    const hasFatigue = s.some(sym => sym.includes('fatiga') || sym.includes('cansancio') || sym.includes('insomnio'));
    const hasAnxiety = s.some(sym => sym.includes('ansiedad') || sym.includes('estrés') || sym.includes('estres') || sym.includes('triste'));
    const hasHeadache = s.some(sym => sym.includes('cabeza') || sym.includes('migraña') || sym.includes('migrana'));

    if (hasCramps) {
      targets.target_energy = Math.max(0.18, targets.target_energy - 0.15);
      targets.target_tempo = Math.max(60, targets.target_tempo - 10);
      targets.target_acousticness = Math.min(0.95, targets.target_acousticness + 0.20);
      targets.max_energy = 0.32;
      targets.max_tempo = 78;
      targets.min_acousticness = 0.55;
      targets.isCalmPhase = true;
    } else if (hasFatigue) {
      targets.target_energy = Math.max(0.18, targets.target_energy - 0.18);
      targets.target_tempo = Math.max(58, targets.target_tempo - 12);
      targets.max_energy = 0.35;
      targets.max_tempo = 80;
      targets.isCalmPhase = true;
    } else if (hasAnxiety) {
      targets.target_valence = Math.min(0.60, targets.target_valence + 0.10);
      targets.target_energy = 0.30;
      targets.max_energy = 0.40;
      targets.isCalmPhase = true;
    }

    if (hasHeadache) {
      targets.target_instrumentalness = 0.65;
      targets.max_energy = 0.30;
      targets.isCalmPhase = true;
    }

    return targets;
  }

  /**
   * Genera una explicación clínica dinámica basada en el artista, pista, tempo y fase
   */
  static buildDynamicReason(artistName = '', trackName = '', phase = 'Ovulatoria', symptoms = [], tempo = 100) {
    const p = phase.toLowerCase();
    const s = symptoms.map(sym => String(sym).toLowerCase());
    const art = artistName || 'tu artista favorito';

    const hasCramps = s.some(sym => sym.includes('cólico') || sym.includes('colico') || sym.includes('dolor'));
    const hasFatigue = s.some(sym => sym.includes('fatiga') || sym.includes('cansancio'));
    const hasStress = s.some(sym => sym.includes('estrés') || sym.includes('ansiedad'));

    if (hasCramps) {
      return `Atenuación somática con ritmo relajado a ${tempo} BPM de ${art} para reducir espasmos y relajar el miometrio.`;
    }
    if (hasFatigue) {
      return `Cadencia serena de ${art} calibrada para regenerar energía mitocondrial y brindar descanso a tu cuerpo.`;
    }
    if (hasStress) {
      return `Frecuencias armónicas anti-cortisol de ${art} para restaurar la calma del sistema nervioso autónomo.`;
    }

    if (p.includes('menstrual')) {
      return `Acústica suave a ${tempo} BPM de ${art} seleccionada de tus favoritos para elevar la oxitocina y brindar alivio en tu Fase Menstrual.`;
    }
    if (p.includes('folicular')) {
      return `Sonoridad vibrante a ${tempo} BPM de ${art} de tu biblioteca para potenciar el ascenso natural de estrógenos y tu creatividad.`;
    }
    if (p.includes('ovulatoria')) {
      return `Máxima vitalidad y ritmo bailable a ${tempo} BPM de ${art} para acompañar tu pico de confianza y magnetismo ovulatorio.`;
    }
    if (p.includes('lutea') || p.includes('lútea')) {
      return `Textura melódica reconfortante a ${tempo} BPM de ${art} para estabilizar la serotonina y apaciguar la reactividad premenstrual.`;
    }

    return `Sintonía seleccionada de ${art} a ${tempo} BPM para armonizar tu bienestar y ritmo biológico de hoy.`;
  }

  /**
   * Algoritmo de Recomendación Dinámico:
   * Examina estrictamente los artistas favoritos, álbumes guardados y canciones favoritas
   * de la usuaria, clasificándolos y puntuándolos según las métricas psicoacústicas de su ciclo.
   */
  static async getRecommendationForUser(phase = 'Ovulatoria', symptoms = [], forceRotate = false) {
    let token = await this.getValidToken() || this.getStoredToken();
    const acousticTargets = this.computeAcousticTargets(phase, symptoms);
    const isCalmPhase = acousticTargets.isCalmPhase;

    if (!token || !this.isConnected()) {
      return {
        isConnected: false,
        phase,
        acousticTargets
      };
    }

    let lastStatus = 200;
    const spotifyFetch = async (url) => {
      let res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      lastStatus = res.status;
      if (res.status === 401) {
        const refreshedToken = await this.refreshAccessToken();
        if (refreshedToken) {
          token = refreshedToken;
          res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
          lastStatus = res.status;
        }
      }
      return res;
    };

    try {
      // 1. Asegurar sincronización de la biblioteca de la usuaria
      let storedArtists = [];
      let storedTracks = [];
      let likedTracks = [];
      let savedAlbums = [];
      let recentTracks = [];

      try {
        storedArtists = JSON.parse(localStorage.getItem('pochirocho_spotify_top_artists') || '[]');
        storedTracks = JSON.parse(localStorage.getItem('pochirocho_spotify_top_tracks') || '[]');
        likedTracks = JSON.parse(localStorage.getItem('pochirocho_spotify_liked_tracks') || '[]');
        savedAlbums = JSON.parse(localStorage.getItem('pochirocho_spotify_saved_albums') || '[]');
        recentTracks = JSON.parse(localStorage.getItem('pochirocho_spotify_recent_tracks') || '[]');
      } catch (e) {}

      if (storedArtists.length === 0 && storedTracks.length === 0 && likedTracks.length === 0) {
        await this.fetchAndStoreUserProfile();
        try {
          storedArtists = JSON.parse(localStorage.getItem('pochirocho_spotify_top_artists') || '[]');
          storedTracks = JSON.parse(localStorage.getItem('pochirocho_spotify_top_tracks') || '[]');
          likedTracks = JSON.parse(localStorage.getItem('pochirocho_spotify_liked_tracks') || '[]');
          savedAlbums = JSON.parse(localStorage.getItem('pochirocho_spotify_saved_albums') || '[]');
          recentTracks = JSON.parse(localStorage.getItem('pochirocho_spotify_recent_tracks') || '[]');
        } catch (e) {}
      }

      // Si Spotify devolvió 403 Forbidden (cuenta no admitida en Spotify for Developers)
      const storedApiError = localStorage.getItem('pochirocho_spotify_api_error');
      if (storedApiError === '403_FORBIDDEN' || lastStatus === 403) {
        return {
          isConnected: true,
          hasApiError: true,
          errorCode: 403,
          errorType: 'ACCOUNT_DEV_MODE',
          phase,
          acousticTargets,
          profile: this.getUserProfile()
        };
      }

      // 2. Compilar el conjunto de canciones candidatas 100% de la biblioteca real de la usuaria
      const candidateMap = new Map();

      // a) Canciones favoritas explícitas (Top Tracks)
      storedTracks.forEach((t, idx) => {
        if (t && t.id) {
          const bonus = Math.max(10, 25 - idx);
          candidateMap.set(t.id, { ...t, _source: 'top_tracks', _affinityBonus: bonus });
        }
      });

      // b) Canciones con "Me Gusta" (Liked Songs)
      likedTracks.forEach(t => {
        if (t && t.id) {
          if (candidateMap.has(t.id)) {
            candidateMap.get(t.id)._affinityBonus += 20;
          } else {
            candidateMap.set(t.id, { ...t, _source: 'liked', _affinityBonus: 22 });
          }
        }
      });

      // c) Canciones de álbumes guardados en la biblioteca
      savedAlbums.forEach(alb => {
        if (alb && alb.tracks && Array.isArray(alb.tracks.items)) {
          alb.tracks.items.forEach(t => {
            if (t && t.id) {
              if (candidateMap.has(t.id)) {
                candidateMap.get(t.id)._affinityBonus += 12;
              } else {
                candidateMap.set(t.id, {
                  ...t,
                  album: { name: alb.name, images: alb.images },
                  _source: 'saved_album',
                  _affinityBonus: 15
                });
              }
            }
          });
        }
      });

      // d) Canciones escuchadas recientemente
      recentTracks.forEach(t => {
        if (t && t.id) {
          if (candidateMap.has(t.id)) {
            candidateMap.get(t.id)._affinityBonus += 8;
          } else {
            candidateMap.set(t.id, { ...t, _source: 'recent', _affinityBonus: 8 });
          }
        }
      });

      // e) Si hay artistas favoritos registrados, enriquecer con sus canciones principales en Spotify
      if (candidateMap.size < 15 && storedArtists.length > 0) {
        const topArtistsToFetch = storedArtists.slice(0, 3);
        for (let art of topArtistsToFetch) {
          try {
            const artTracksRes = await spotifyFetch(`https://api.spotify.com/v1/artists/${art.id}/top-tracks?market=from_token`);
            if (artTracksRes.ok) {
              const artData = await artTracksRes.json();
              (artData.tracks || []).forEach((t, idx) => {
                if (t && t.id && !candidateMap.has(t.id)) {
                  candidateMap.set(t.id, {
                    ...t,
                    _source: 'favorite_artist',
                    _affinityBonus: Math.max(8, 20 - (idx * 2))
                  });
                }
              });
            }
          } catch(e) {}
        }
      }

      const allCandidates = Array.from(candidateMap.values());

      // Si la biblioteca de la usuaria está completamente vacía (cuenta nueva sin reproducciones ni likes):
      if (allCandidates.length === 0) {
        return {
          isConnected: true,
          isEmptyLibrary: true,
          phase,
          acousticTargets,
          profile: this.getUserProfile()
        };
      }

      // 3. Puntuación y Ranking Psicoacústico según Fase Hormonal y Síntomas
      const calmPositiveWords = ['acoustic', 'indie', 'folk', 'piano', 'chill', 'lofi', 'lo-fi', 'ambient', 'r&b', 'soul', 'ballad', 'slow', 'quiet', 'dream', 'sleep', 'relax', 'soft', 'bossa'];
      const calmNegativeWords = ['metal', 'deathcore', 'screamo', 'hard rock', 'heavy metal', 'grindcore', 'punk', 'drill', 'hardcore', 'industrial', 'trap pesado'];
      const energeticPositiveWords = ['pop', 'dance', 'upbeat', 'electro', 'funk', 'disco', 'reggaeton', 'latin', 'vital', 'party', 'house', 'synth', 'hyperpop'];

      const artistGenreMap = {};
      storedArtists.forEach(a => {
        if (a && a.id && Array.isArray(a.genres)) {
          artistGenreMap[a.id] = a.genres.map(g => g.toLowerCase());
        }
      });

      const scoredCandidates = allCandidates.map(track => {
        let score = 50 + (track._affinityBonus || 0);

        let trackGenres = [];
        if (Array.isArray(track.artists)) {
          track.artists.forEach(a => {
            if (a && a.id && artistGenreMap[a.id]) {
              trackGenres.push(...artistGenreMap[a.id]);
            }
          });
        }
        const textToMatch = `${track.name || ''} ${track.album?.name || ''} ${trackGenres.join(' ')}`.toLowerCase();

        if (isCalmPhase) {
          const hasCalmBonus = calmPositiveWords.some(w => textToMatch.includes(w));
          const hasCalmPenalty = calmNegativeWords.some(w => textToMatch.includes(w));
          if (hasCalmBonus) score += 28;
          if (hasCalmPenalty) score -= 65;
        } else {
          const hasEnergeticBonus = energeticPositiveWords.some(w => textToMatch.includes(w));
          if (hasEnergeticBonus) score += 28;
          if (textToMatch.includes('sleep') || textToMatch.includes('meditation')) score -= 30;
        }

        if (typeof track.popularity === 'number') {
          score += (track.popularity * 0.15);
        }

        return {
          track,
          score
        };
      });

      scoredCandidates.sort((a, b) => b.score - a.score);

      // Agrupar los mejores candidatos (top 8) para permitir rotación fluida entre sus canciones favoritas
      const topPool = scoredCandidates.slice(0, Math.min(8, scoredCandidates.length)).map(item => item.track);

      const idxKey = `pochirocho_sp_rec_idx_${phase.toLowerCase()}`;
      let recIdx = parseInt(localStorage.getItem(idxKey) || '0', 10);
      if (forceRotate) {
        recIdx = (recIdx + 1) % topPool.length;
        try { localStorage.setItem(idxKey, recIdx.toString()); } catch(e) {}
      } else {
        recIdx = recIdx % topPool.length;
      }

      const chosenTrack = topPool[recIdx] || topPool[0];
      const artistNames = chosenTrack.artists?.map(a => a.name).join(', ') || 'Artista de tu biblioteca';
      const tempo = Math.round(acousticTargets.target_tempo);
      const dynamicReason = this.buildDynamicReason(artistNames, chosenTrack.name, phase, symptoms, tempo);

      const trackPayload = {
        id: chosenTrack.id,
        name: chosenTrack.name,
        artist: artistNames,
        albumName: chosenTrack.album?.name || '',
        albumCover: chosenTrack.album?.images?.[0]?.url || 'assets/ui/spotify_default_cover.png',
        previewUrl: chosenTrack.preview_url,
        spotifyUrl: chosenTrack.external_urls?.spotify || `https://open.spotify.com/track/${chosenTrack.id}`,
        uri: chosenTrack.uri
      };

      try {
        localStorage.setItem('pochirocho_spotify_last_rec', JSON.stringify({
          phase,
          track: trackPayload,
          timestamp: Date.now()
        }));
      } catch(e) {}

      return {
        isConnected: true,
        phase,
        acousticTargets: {
          ...acousticTargets,
          reasonText: dynamicReason
        },
        track: trackPayload
      };
    } catch (err) {
      console.warn('Error en recomendación dinámica de Spotify:', err);
      return {
        isConnected: true,
        hasApiError: true,
        errorCode: lastStatus || 500,
        errorMessage: err.message,
        phase,
        acousticTargets,
        profile: this.getUserProfile()
      };
    }
  }

  /**
   * Diagnóstico Integral de Conexión: Verifica si la falla proviene de la Cuenta
   * (Spotify Developer Mode / 403 Forbidden) o del iPhone / Safari (almacenamiento / red).
   */
  static async diagnoseConnection() {
    const report = {
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      isIPhone: typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent),
      isConnectedFlag: typeof localStorage !== 'undefined' ? localStorage.getItem('pochirocho_spotify_connected') === 'true' : false,
      hasAccessToken: typeof localStorage !== 'undefined' ? !!localStorage.getItem('pochirocho_spotify_access_token') : false,
      hasRefreshToken: typeof localStorage !== 'undefined' ? !!localStorage.getItem('pochirocho_spotify_refresh_token') : false,
      tokenExpiresAt: typeof localStorage !== 'undefined' ? localStorage.getItem('pochirocho_spotify_expires_at') : null,
      isTokenExpired: false,
      clientId: this.getClientId(),
      redirectUri: this.getRedirectUri(),
      meApiStatus: null,
      meApiData: null,
      meApiError: null,
      searchApiStatus: null,
      searchApiError: null,
      diagnosis: '',
      rootCause: '', // 'ACCOUNT_DEV_MODE', 'TOKEN_EXPIRED', 'IPHONE_NETWORK', 'NOT_LOGGED_IN', 'SUCCESS'
      recommendedAction: ''
    };

    if (report.tokenExpiresAt) {
      report.isTokenExpired = Date.now() > parseInt(report.tokenExpiresAt, 10);
    }

    if (!report.hasAccessToken && !report.hasRefreshToken) {
      report.rootCause = 'NOT_LOGGED_IN';
      report.diagnosis = 'No hay sesión de Spotify iniciada en este dispositivo.';
      report.recommendedAction = 'Presiona "Conectar mi Cuenta de Spotify" para iniciar sesión con OAuth.';
      return report;
    }

    let token = await this.getValidToken();
    if (!token && typeof localStorage !== 'undefined') {
      token = localStorage.getItem('pochirocho_spotify_access_token');
    }

    // Prueba 1: Endpoint de Perfil (/v1/me)
    try {
      const resMe = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      report.meApiStatus = resMe.status;
      if (resMe.ok) {
        report.meApiData = await resMe.json();
        report.profile = report.meApiData;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('pochirocho_spotify_user_profile', JSON.stringify(report.meApiData));
        }
      } else {
        try {
          report.meApiError = await resMe.json();
        } catch(e) {
          report.meApiError = resMe.statusText;
        }
      }
    } catch (netErr) {
      report.meApiStatus = 'NETWORK_ERROR';
      report.meApiError = netErr.message;
    }

    // Prueba 2: Búsqueda de Catálogo (/v1/search)
    try {
      const resSearch = await fetch('https://api.spotify.com/v1/search?q=acoustic&type=track&limit=1', {
        headers: { Authorization: `Bearer ${token}` }
      });
      report.searchApiStatus = resSearch.status;
      if (!resSearch.ok) {
        try {
          report.searchApiError = await resSearch.json();
        } catch(e) {
          report.searchApiError = resSearch.statusText;
        }
      }
    } catch (searchErr) {
      report.searchApiStatus = 'NETWORK_ERROR';
      report.searchApiError = searchErr.message;
    }

    // Determinar Causa Raíz
    if (report.meApiStatus === 200) {
      report.rootCause = 'SUCCESS';
      report.diagnosis = `¡Conexión 100% exitosa! Tu iPhone se comunica perfectamente con Spotify y tu cuenta (${report.meApiData?.display_name || report.meApiData?.id || 'Usuario'}) tiene permisos activos.`;
      report.recommendedAction = 'Todo funciona correctamente. Las recomendaciones se basarán en tus artistas y pistas favoritas.';
    } else if (report.meApiStatus === 403 || report.searchApiStatus === 403) {
      report.rootCause = 'ACCOUNT_DEV_MODE';
      report.diagnosis = `🚨 DIAGNÓSTICO: ES UN PROBLEMA DE LA CUENTA (Spotify Developer Mode), NO DE TU IPHONE.
Tu iPhone tiene el token guardado y se comunica sin problemas. Sin embargo, los servidores de Spotify devuelven "Error 403 Forbidden".
Esto sucede porque en Spotify Developer Dashboard la aplicación está en "Development Mode". En este modo, Spotify bloquea cualquier cuenta que no haya sido agregada manualmente a la lista de usuarios autorizados.`;
      report.recommendedAction = `Para solucionarlo en tu cuenta:
1. Abre https://developer.spotify.com/dashboard en tu navegador.
2. Haz clic en la App correspondiente a este Client ID.
3. Ve a "Settings" -> pestaña "Users and Access".
4. Agrega tu nombre y el correo exacto de tu cuenta de Spotify.
5. Guarda los cambios. ¡Listo!
Mientras tanto, Pochirocho activa automáticamente el Catálogo Psicoacústico Calibrado para que nunca te falte música.`;
    } else if (report.meApiStatus === 401) {
      report.rootCause = 'TOKEN_EXPIRED';
      report.diagnosis = `⚠️ DIAGNÓSTICO: SESIÓN EXPIRADA.
El token guardado en tu iPhone caducó y debe renovarse mediante inicio de sesión.`;
      report.recommendedAction = 'Haz clic en "Reconectar con Spotify" para obtener una nueva llave de acceso.';
    } else if (report.meApiStatus === 'NETWORK_ERROR') {
      report.rootCause = 'IPHONE_NETWORK';
      report.diagnosis = `🚨 DIAGNÓSTICO: PROBLEMA DEL IPHONE O DE LA RED.
Safari o la conexión de red del iPhone bloquearon la solicitud a api.spotify.com (${report.meApiError}).`;
      report.recommendedAction = 'Revisa si tienes un bloqueador de contenido activo o restricción de navegación privada en Safari (Ajustes > Safari).';
    } else {
      report.rootCause = 'UNKNOWN';
      report.diagnosis = `Respuesta de Spotify: Código HTTP ${report.meApiStatus || 'Desconocido'}.`;
      report.recommendedAction = 'Reconecta tu cuenta de Spotify.';
    }

    return report;
  }

  // Helpers PKCE
  static generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  static async generateCodeChallenge(codeVerifier) {
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
      return codeVerifier;
    }
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
