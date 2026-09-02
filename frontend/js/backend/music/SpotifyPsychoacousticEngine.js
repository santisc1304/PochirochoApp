/**
 * SpotifyPsychoacousticEngine.js
 * Motor de Recomendación Musical Personalizada con Spotify Web API (OAuth 2.0 PKCE)
 * Calibra parámetros acústicos según la fase hormonal y síntomas registrados,
 * basándose 100% en los artistas y gustos reales de la usuaria.
 */

export class SpotifyPsychoacousticEngine {
  static CLIENT_ID = 'fa292c3f485d40a4ba4fa1d17e61dd96'; // Client ID oficial de Spotify
  static REDIRECT_URI = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'http://localhost:8000/';
  static SCOPES = 'user-top-read user-read-recently-played user-read-playback-state user-library-read';

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

  static disconnect() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('pochirocho_spotify_connected');
      localStorage.removeItem('pochirocho_spotify_access_token');
      localStorage.removeItem('pochirocho_spotify_refresh_token');
      localStorage.removeItem('pochirocho_spotify_expires_at');
      localStorage.removeItem('pochirocho_spotify_user_profile');
      localStorage.removeItem('pochirocho_spotify_top_artists');
      localStorage.removeItem('pochirocho_spotify_top_tracks');
      localStorage.removeItem('pochirocho_spotify_liked_tracks');
    }
  }

  /**
   * Inicia el flujo de autorización OAuth 2.0 PKCE con Spotify
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
   * Descarga el perfil completo y el repertorio histórico (artistas, tracks favoritos y me gusta)
   */
  static async fetchAndStoreUserProfile() {
    const token = await this.getValidToken() || this.getStoredToken();
    if (!token) return null;

    try {
      const res = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const profile = await res.json();
        localStorage.setItem('pochirocho_spotify_user_profile', JSON.stringify(profile));
      }

      // 1. Artistas favoritos históricos (long_term) y actuales (medium_term)
      try {
        let artistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=long_term', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!artistsRes.ok) {
          artistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term', {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        if (artistsRes.ok) {
          const topArtistsData = await artistsRes.json();
          localStorage.setItem('pochirocho_spotify_top_artists', JSON.stringify(topArtistsData.items || []));
        }
      } catch (e) {}

      // 2. Canciones favoritas históricas (top tracks long_term)
      try {
        let tracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=long_term', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!tracksRes.ok) {
          tracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=medium_term', {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        if (tracksRes.ok) {
          const topTracksData = await tracksRes.json();
          localStorage.setItem('pochirocho_spotify_top_tracks', JSON.stringify(topTracksData.items || []));
        }
      } catch (e) {}

      // 3. Canciones con "Me Gusta" (Liked Songs)
      try {
        const likedRes = await fetch('https://api.spotify.com/v1/me/tracks?limit=20', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (likedRes.ok) {
          const likedData = await likedRes.json();
          const likedTracks = (likedData.items || []).map(item => item.track).filter(Boolean);
          localStorage.setItem('pochirocho_spotify_liked_tracks', JSON.stringify(likedTracks));
        }
      } catch (e) {}

    } catch (err) {
      console.warn('Error al sincronizar biblioteca de Spotify:', err);
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
      targets.target_acousticness = Math.min(0.92, targets.target_acousticness + 0.20);
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
      targets.target_instrumentalness = 0.65; // Menor presencia vocal para evitar fatiga sensorial
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
      return `Acústica suave a ${tempo} BPM de ${art} diseñada para elevar la oxitocina y brindar alivio uterino en tu Fase Menstrual.`;
    }
    if (p.includes('folicular')) {
      return `Sonoridad vibrante a ${tempo} BPM de ${art} para potenciar el ascenso natural de tus estrógenos y tu creatividad.`;
    }
    if (p.includes('ovulatoria')) {
      return `Máxima vitalidad y ritmo bailable a ${tempo} BPM de ${art} para acompañar tu pico de confianza y magnetismo ovulatorio.`;
    }
    if (p.includes('lutea') || p.includes('lútea')) {
      return `Textura melódica envolvente a ${tempo} BPM de ${art} para estabilizar la serotonina y apaciguar la reactividad premenstrual.`;
    }

    return `Sintonía seleccionada de ${art} a ${tempo} BPM para armonizar tu ritmo cardíaco y tu bienestar de hoy.`;
  }

  /**
   * Obtiene la recomendación de canción usando el repertorio completo de la usuaria
   */
  static async getRecommendationForUser(phase = 'Ovulatoria', symptoms = []) {
    let token = await this.getValidToken() || this.getStoredToken();
    const acousticTargets = this.computeAcousticTargets(phase, symptoms);
    const isCalmPhase = acousticTargets.isCalmPhase;
    const excludedKeywords = ['metal', 'deathcore', 'screamo', 'hard rock', 'heavy metal', 'grindcore', 'punk', 'drill', 'hardcore', 'industrial', 'techno'];

    if (!token || !this.isConnected()) {
      return {
        isConnected: false,
        phase,
        acousticTargets
      };
    }

    // Helper fetch con auto-refresco en caso de 401
    const spotifyFetch = async (url) => {
      let res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) {
        const refreshedToken = await this.refreshAccessToken();
        if (refreshedToken) {
          token = refreshedToken;
          res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        }
      }
      return res;
    };

    try {
      // 1. Asegurar que los artistas favoritos de la usuaria estén sincronizados
      let storedArtists = [];
      let storedTracks = [];
      try {
        storedArtists = JSON.parse(localStorage.getItem('pochirocho_spotify_top_artists') || '[]');
        storedTracks = JSON.parse(localStorage.getItem('pochirocho_spotify_top_tracks') || '[]');
      } catch (e) {}

      if (storedArtists.length === 0 && storedTracks.length === 0) {
        await this.fetchAndStoreUserProfile();
        try {
          storedArtists = JSON.parse(localStorage.getItem('pochirocho_spotify_top_artists') || '[]');
          storedTracks = JSON.parse(localStorage.getItem('pochirocho_spotify_top_tracks') || '[]');
        } catch (e) {}
      }

      let seedArtists = [];
      let seedTracks = [];

      if (storedArtists.length) {
        if (isCalmPhase) {
          const calmArtists = storedArtists.filter(a => {
            const genres = (a.genres || []).map(g => g.toLowerCase());
            return !genres.some(g => excludedKeywords.some(ex => g.includes(ex)));
          });
          seedArtists = (calmArtists.length > 0 ? calmArtists : storedArtists).slice(0, 3).map(a => a.id);
        } else {
          seedArtists = storedArtists.slice(0, 3).map(a => a.id);
        }
      }

      if (storedTracks.length) {
        seedTracks = storedTracks.slice(0, 2).map(t => t.id);
      }

      let tracks = [];

      // Intento 1: Spotify Recommendations API oficial calibrada con los artistas favoritos de la usuaria
      let queryParams = new URLSearchParams({
        limit: '20',
        target_energy: acousticTargets.target_energy.toFixed(2),
        target_valence: acousticTargets.target_valence.toFixed(2),
        target_tempo: Math.round(acousticTargets.target_tempo).toString(),
        target_acousticness: acousticTargets.target_acousticness.toFixed(2),
        target_danceability: acousticTargets.target_danceability.toFixed(2)
      });

      if (acousticTargets.max_energy !== undefined) {
        queryParams.append('max_energy', acousticTargets.max_energy.toFixed(2));
      }
      if (acousticTargets.max_tempo !== undefined) {
        queryParams.append('max_tempo', Math.round(acousticTargets.max_tempo).toString());
      }
      if (acousticTargets.min_acousticness !== undefined) {
        queryParams.append('min_acousticness', acousticTargets.min_acousticness.toFixed(2));
      }
      if (acousticTargets.min_energy !== undefined) {
        queryParams.append('min_energy', acousticTargets.min_energy.toFixed(2));
      }

      if (seedArtists.length > 0) {
        queryParams.append('seed_artists', seedArtists.slice(0, 2).join(','));
      }
      if (seedTracks.length > 0) {
        queryParams.append('seed_tracks', seedTracks.slice(0, 2).join(','));
      }
      if (!seedArtists.length && !seedTracks.length) {
        queryParams.append('seed_genres', isCalmPhase ? 'acoustic,indie,ambient' : 'pop,latin,indie');
      }

      try {
        const recResponse = await spotifyFetch(`https://api.spotify.com/v1/recommendations?${queryParams.toString()}`);
        if (recResponse.ok) {
          const recData = await recResponse.json();
          tracks = recData.tracks || [];
        }
      } catch (e) {}

      // Intento 2: Si no hubo respuesta de recommendations, buscar directamente pistas de los artistas favoritos de la usuaria en Spotify
      if (tracks.length === 0 && storedArtists.length > 0) {
        const candidateArtists = storedArtists.slice(0, 5);
        const randomArtist = candidateArtists[Math.floor(Math.random() * candidateArtists.length)];
        if (randomArtist && randomArtist.name) {
          try {
            const searchRes = await spotifyFetch(`https://api.spotify.com/v1/search?q=artist:${encodeURIComponent(randomArtist.name)}&type=track&limit=20`);
            if (searchRes.ok) {
              const searchData = await searchRes.json();
              tracks = searchData.tracks?.items || [];
            }
          } catch (e) {}
        }
      }

      // Intento 3: Usar canciones guardadas de la biblioteca de la usuaria (Top Tracks o Liked Songs)
      if (tracks.length === 0) {
        try {
          const liked = JSON.parse(localStorage.getItem('pochirocho_spotify_liked_tracks') || '[]');
          const topTr = JSON.parse(localStorage.getItem('pochirocho_spotify_top_tracks') || '[]');
          let combined = [...liked, ...topTr];
          if (isCalmPhase && combined.length > 0) {
            combined = combined.filter(t => {
              const text = `${t.name} ${t.artists?.map(a => a.name).join(' ') || ''}`.toLowerCase();
              return !excludedKeywords.some(ex => text.includes(ex));
            });
          }
          tracks = combined;
        } catch (e) {}
      }

      // Intento 4: Búsqueda dinámica en Spotify según el tempo y estado de la fase
      if (tracks.length === 0) {
        const searchKeyword = isCalmPhase
          ? 'calm acoustic'
          : (phase.toLowerCase().includes('folicular') ? 'pop upbeat' : 'dance pop vital');
        try {
          const searchRes = await spotifyFetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchKeyword)}&type=track&limit=20`);
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            tracks = (searchData.tracks?.items || []).filter(t => t && t.name && (t.id || t.uri));
          }
        } catch (e) {}
      }

      // Intento 5: Búsqueda universal directa en Spotify si todo lo anterior devolvió 0
      if (tracks.length === 0) {
        try {
          const universalRes = await spotifyFetch('https://api.spotify.com/v1/search?q=piano%20acoustic%20relax&type=track&limit=10');
          if (universalRes.ok) {
            const uData = await universalRes.json();
            tracks = (uData.tracks?.items || []).filter(t => t && t.name && (t.id || t.uri));
          }
        } catch (e) {}
      }

      if (tracks.length === 0) {
        return {
          isConnected: true,
          phase,
          acousticTargets,
          error: 'No se encontraron pistas disponibles en Spotify Web API'
        };
      }

      // Elegir entre los mejores candidatos reales de Spotify
      const validTracks = tracks.filter(t => t && t.name);
      const selectedTrack = validTracks[Math.floor(Math.random() * validTracks.length)] || validTracks[0];
      const artistName = selectedTrack.artists?.map(a => a.name).join(', ') || 'Artista de Spotify';
      const tempo = Math.round(acousticTargets.target_tempo);
      const dynamicReason = this.buildDynamicReason(artistName, selectedTrack.name, phase, symptoms, tempo);

      return {
        isConnected: true,
        phase,
        acousticTargets: {
          ...acousticTargets,
          reasonText: dynamicReason
        },
        track: {
          id: selectedTrack.id,
          name: selectedTrack.name,
          artist: artistName,
          albumName: selectedTrack.album?.name || '',
          albumCover: selectedTrack.album?.images?.[0]?.url || 'assets/ui/spotify_default_cover.png',
          previewUrl: selectedTrack.preview_url,
          spotifyUrl: selectedTrack.external_urls?.spotify || `https://open.spotify.com/track/${selectedTrack.id}`,
          uri: selectedTrack.uri
        }
      };
    } catch (err) {
      console.warn('Error al obtener recomendaciones de Spotify Web API:', err);
      return {
        isConnected: false,
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
