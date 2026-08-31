/**
 * SpotifyPsychoacousticEngine.js
 * Motor de Recomendación Musical Personalizada con Spotify Web API (OAuth 2.0 PKCE)
 * Calibra parámetros acústicos según la fase hormonal y síntomas registrados,
 * basándose 100% en los artistas y gustos reales de la usuaria.
 */

export class SpotifyPsychoacousticEngine {
  static CLIENT_ID = 'fa292c3f485d40a4ba4fa1d17e61dd96'; // Client ID oficial de Spotify
  static REDIRECT_URI = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'http://localhost:8000/';
  static SCOPES = 'user-top-read user-read-recently-played user-read-playback-state';

  static getClientId() {
    if (typeof localStorage !== 'undefined') {
      const customId = localStorage.getItem('pochirocho_spotify_client_id');
      if (customId && customId.trim()) return customId.trim();
    }
    return this.CLIENT_ID;
  }

  static getRedirectUri() {
    if (typeof window !== 'undefined') {
      let uri = window.location.origin + window.location.pathname;
      if (!uri.endsWith('/') && !uri.includes('.')) {
        uri += '/';
      }
      return uri;
    }
    return this.REDIRECT_URI;
  }

  /**
   * Obtiene el token de acceso guardado en localStorage o verifica expiración
   */
  static getStoredToken() {
    if (typeof localStorage === 'undefined') return null;
    const token = localStorage.getItem('pochirocho_spotify_access_token');
    const expiresAt = localStorage.getItem('pochirocho_spotify_expires_at');

    if (!token || !expiresAt) return null;
    if (Date.now() > parseInt(expiresAt, 10)) {
      this.disconnect();
      return null;
    }
    return token;
  }

  static isConnected() {
    return !!this.getStoredToken();
  }

  static disconnect() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('pochirocho_spotify_access_token');
      localStorage.removeItem('pochirocho_spotify_refresh_token');
      localStorage.removeItem('pochirocho_spotify_expires_at');
      localStorage.removeItem('pochirocho_spotify_user_profile');
      localStorage.removeItem('pochirocho_spotify_top_artists');
    }
  }

  /**
   * Inicia el flujo de autorización OAuth 2.0 PKCE con Spotify
   */
  static async loginWithSpotify() {
    const codeVerifier = this.generateRandomString(64);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    localStorage.setItem('spotify_code_verifier', codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.getClientId(),
      scope: this.SCOPES,
      redirect_uri: this.getRedirectUri(),
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  /**
   * Intercepta el código de autorización tras el redirect de Spotify
   */
  static async handleAuthCallback() {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) return false;

    const codeVerifier = localStorage.getItem('spotify_code_verifier');
    if (!codeVerifier) return false;

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.getRedirectUri(),
          client_id: this.getClientId(),
          code_verifier: codeVerifier
        })
      });

      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem('pochirocho_spotify_access_token', data.access_token);
      localStorage.setItem('pochirocho_spotify_expires_at', (Date.now() + (data.expires_in * 1000)).toString());
      if (data.refresh_token) {
        localStorage.setItem('pochirocho_spotify_refresh_token', data.refresh_token);
      }

      // Limpiar URL sin recargar
      window.history.replaceState({}, document.title, window.location.pathname);
      await this.fetchAndStoreUserProfile();
      return true;
    } catch (err) {
      console.warn('Error al intercambiar token de Spotify:', err);
      return false;
    }
  }

  static async fetchAndStoreUserProfile() {
    const token = this.getStoredToken();
    if (!token) return null;

    try {
      const res = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const profile = await res.json();
        localStorage.setItem('pochirocho_spotify_user_profile', JSON.stringify(profile));
      }

      // Guardar top artists de la usuaria
      const artistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (artistsRes.ok) {
        const topArtistsData = await artistsRes.json();
        localStorage.setItem('pochirocho_spotify_top_artists', JSON.stringify(topArtistsData.items || []));
      }
    } catch (err) {
      console.warn('Error al sincronizar perfil de Spotify:', err);
    }
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
      reasonText: 'Sintonía equilibrada para acompañar tu día'
    };

    // 1. Calibración por Fase Hormonal
    if (p.includes('menstrual') || p.includes('regla')) {
      targets.target_energy = 0.28;
      targets.target_valence = 0.42;
      targets.target_tempo = 68;
      targets.target_acousticness = 0.75;
      targets.target_danceability = 0.35;
      targets.reasonText = 'Frecuencias y ritmos suaves para reducir cortisol y relajar el miometrio';
    } else if (p.includes('folicular')) {
      targets.target_energy = 0.72;
      targets.target_valence = 0.80;
      targets.target_tempo = 118;
      targets.target_acousticness = 0.25;
      targets.target_danceability = 0.70;
      targets.reasonText = 'Ritmos frescos y motivadores para acompañar el ascenso de tus estrógenos';
    } else if (p.includes('ovulatoria')) {
      targets.target_energy = 0.88;
      targets.target_valence = 0.88;
      targets.target_tempo = 126;
      targets.target_acousticness = 0.15;
      targets.target_danceability = 0.85;
      targets.reasonText = 'Máxima vitalidad y ritmo para celebrar tu pico de energía y confianza';
    } else if (p.includes('lutea') || p.includes('lútea') || p.includes('premenstrual')) {
      targets.target_energy = 0.38;
      targets.target_valence = 0.48;
      targets.target_tempo = 74;
      targets.target_acousticness = 0.55;
      targets.target_danceability = 0.40;
      targets.reasonText = 'Sonoridades envolventes que estabilizan la serotonina y calman la reactividad premenstrual';
    }

    // 2. Moduladores por Síntomas Físicos y Emocionales Registrados
    const hasCramps = s.some(sym => sym.includes('cólico') || sym.includes('colico') || sym.includes('dolor'));
    const hasFatigue = s.some(sym => sym.includes('fatiga') || sym.includes('cansancio') || sym.includes('insomnio'));
    const hasAnxiety = s.some(sym => sym.includes('ansiedad') || sym.includes('estrés') || sym.includes('estres') || sym.includes('triste'));

    if (hasCramps) {
      targets.target_energy = Math.max(0.20, targets.target_energy - 0.15);
      targets.target_tempo = Math.max(60, targets.target_tempo - 12);
      targets.target_acousticness = Math.min(0.90, targets.target_acousticness + 0.20);
      targets.reasonText = 'Melodía suave calibrada para calmar los cólicos y la tensión pélvica de hoy';
    } else if (hasFatigue) {
      targets.target_energy = Math.max(0.18, targets.target_energy - 0.20);
      targets.target_tempo = Math.max(55, targets.target_tempo - 15);
      targets.reasonText = 'Música serena y reconfortante para dar descanso a tu cuerpo hoy';
    } else if (hasAnxiety) {
      targets.target_valence = Math.min(0.65, targets.target_valence + 0.10);
      targets.target_energy = 0.35;
      targets.reasonText = 'Textura acústica anti-ansiedad para restaurar la calma de tu mente';
    }

    return targets;
  }

  /**
   * Obtiene la recomendación de canción usando los artistas favoritos de la usuaria
   */
  static async getRecommendationForUser(phase = 'Ovulatoria', symptoms = []) {
    const token = this.getStoredToken();
    const acousticTargets = this.computeAcousticTargets(phase, symptoms);

    if (!token) {
      return {
        isConnected: false,
        phase,
        acousticTargets
      };
    }

    try {
      // 1. Obtener los artistas favoritos de la usuaria para usarlos como semillas
      let seedArtists = [];
      const storedArtists = localStorage.getItem('pochirocho_spotify_top_artists');
      if (storedArtists) {
        try {
          const parsed = JSON.parse(storedArtists);
          seedArtists = parsed.slice(0, 3).map(a => a.id);
        } catch (e) {}
      }

      if (seedArtists.length === 0) {
        const topRes = await fetch('https://api.spotify.com/v1/me/top/artists?limit=3', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (topRes.ok) {
          const topData = await topRes.json();
          seedArtists = (topData.items || []).map(a => a.id);
        }
      }

      // Fallback a top tracks si no hay artistas suficientes
      let queryParams = new URLSearchParams({
        limit: '5',
        target_energy: acousticTargets.target_energy.toFixed(2),
        target_valence: acousticTargets.target_valence.toFixed(2),
        target_tempo: Math.round(acousticTargets.target_tempo).toString()
      });

      if (seedArtists.length > 0) {
        queryParams.append('seed_artists', seedArtists.slice(0, 3).join(','));
      } else {
        queryParams.append('seed_genres', 'pop,latin');
      }

      const recResponse = await fetch(`https://api.spotify.com/v1/recommendations?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!recResponse.ok) {
        throw new Error(`SPOTIFY_REC_ERROR_${recResponse.status}`);
      }

      const recData = await recResponse.json();
      const tracks = recData.tracks || [];

      if (tracks.length === 0) {
        throw new Error('NO_TRACKS_RETURNED');
      }

      const selectedTrack = tracks[0];

      return {
        isConnected: true,
        phase,
        acousticTargets,
        track: {
          id: selectedTrack.id,
          name: selectedTrack.name,
          artist: selectedTrack.artists?.map(a => a.name).join(', ') || 'Artista de tu biblioteca',
          albumName: selectedTrack.album?.name || '',
          albumCover: selectedTrack.album?.images?.[0]?.url || 'assets/ui/spotify_default_cover.png',
          previewUrl: selectedTrack.preview_url,
          spotifyUrl: selectedTrack.external_urls?.spotify || `https://open.spotify.com/track/${selectedTrack.id}`,
          uri: selectedTrack.uri
        }
      };
    } catch (err) {
      console.warn('Error al obtener recomendaciones personalizadas de Spotify:', err);
      return {
        isConnected: true,
        phase,
        acousticTargets,
        error: err.message
      };
    }
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
