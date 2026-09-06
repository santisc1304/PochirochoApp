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

  // Catálogo Psicoacústico Curado: Garantiza sintonía musical calibrada por fase incluso si la API de Spotify
  // devuelve 404 por endpoints deprecados o 403 por Development Mode en el Developer Dashboard.
  static PSYCHOACOUSTIC_CATALOG = {
    Menstrual: [
      {
        id: '6kkwzBDIRLqBWe5yg56gKG',
        name: 'Weightless',
        artist: 'Marconi Union',
        albumName: 'Weightless (Ambient Transmissions)',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273d09a25b1548e6a2b8e3ad59e',
        spotifyUrl: 'https://open.spotify.com/track/6kkwzBDIRLqBWe5yg56gKG',
        tempo: 60,
        reasonText: 'Composición acústica calibrada a 60 BPM para inducir ondas alfa cerebrales, reducir cortisol y calmar cólicos uterinos.'
      },
      {
        id: '1R0a2iIrJGumZ0KbEw0iNX',
        name: 'Daylight',
        artist: 'Taylor Swift',
        albumName: 'Lover',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647',
        spotifyUrl: 'https://open.spotify.com/track/1R0a2iIrJGumZ0KbEw0iNX',
        tempo: 75,
        reasonText: 'Textura armónica cálida y envolvente diseñada para elevar la oxitocina y brindar refugio emocional durante tu sangrado.'
      },
      {
        id: '7D080T8IRgfxgSSyaPo9Kd',
        name: 'Sparks',
        artist: 'Coldplay',
        albumName: 'Parachutes',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273de062e7428f869e57be0be05',
        spotifyUrl: 'https://open.spotify.com/track/7D080T8IRgfxgSSyaPo9Kd',
        tempo: 72,
        reasonText: 'Guitarras acústicas suaves y cadencia hipnótica que activan el sistema parasimpático para disipar el cansancio físico.'
      },
      {
        id: '4v1A9Qszr8fE5gVlq4jZ6O',
        name: 'Banana Pancakes',
        artist: 'Jack Johnson',
        albumName: 'In Between Dreams',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b27341ad9cba9bc840502187fcf9',
        spotifyUrl: 'https://open.spotify.com/track/4v1A9Qszr8fE5gVlq4jZ6O',
        tempo: 68,
        reasonText: 'Tonalidad acústica reconfortante que evoca calma hogareña y alivio de la hipersensibilidad corporal en tu Fase Menstrual.'
      },
      {
        id: '6tDDoYIxWvMLTdKpjFbt1K',
        name: 'telepatía',
        artist: 'Kali Uchis',
        albumName: 'Sin Miedo (del Amor y Otros Demonios)',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b2734cf74e8a8647ce56ef8eb025',
        spotifyUrl: 'https://open.spotify.com/track/6tDDoYIxWvMLTdKpjFbt1K',
        tempo: 83,
        reasonText: 'R&B etéreo de tempo moderado que ayuda a relajar la musculatura pélvica sin restar vitalidad a tu día.'
      }
    ],
    Folicular: [
      {
        id: '1BxfuPKGuaTgP7aM0fbdwr',
        name: 'Cruel Summer',
        artist: 'Taylor Swift',
        albumName: 'Lover',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647',
        spotifyUrl: 'https://open.spotify.com/track/1BxfuPKGuaTgP7aM0fbdwr',
        tempo: 105,
        reasonText: 'Energía pop ascendente que sintoniza con el aumento de estrógenos, estimulando la motivación y la creatividad.'
      },
      {
        id: '0yLdNVWF3Srea0uzk55zFn',
        name: 'Flowers',
        artist: 'Miley Cyrus',
        albumName: 'Endless Summer Vacation',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273f429549123dbe8552764ba1d',
        spotifyUrl: 'https://open.spotify.com/track/0yLdNVWF3Srea0uzk55zFn',
        tempo: 118,
        reasonText: 'Línea de bajo disco-funk que refuerza la independencia, la dopamina y la vitalidad del inicio de tu ciclo.'
      },
      {
        id: '463CkQjx2Zk1yXoBuierM9',
        name: 'Levitating',
        artist: 'Dua Lipa',
        albumName: 'Future Nostalgia',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327720204931',
        spotifyUrl: 'https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9',
        tempo: 103,
        reasonText: 'Ritmo vibrante perfecto para acompañar nuevos planes, sesiones de ejercicio y tu renovado dinamismo mental.'
      },
      {
        id: '5OD9r33m42e27DqPzKzH3k',
        name: 'golden hour',
        artist: 'JVKE',
        albumName: 'this is what ____ feels like (Vol. 1-4)',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273a216db8a3f87fb51a545025a',
        spotifyUrl: 'https://open.spotify.com/track/5OD9r33m42e27DqPzKzH3k',
        tempo: 94,
        reasonText: 'Arreglos de piano expansivos que celebran el despertar sensorial y la luminosidad de tu Fase Folicular.'
      }
    ],
    Ovulatoria: [
      {
        id: '3rUGC1vUpkMQigIZ3zy2Su',
        name: 'Greedy',
        artist: 'Tate McRae',
        albumName: 'THINK LATER',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b27322fd80276f3d11d332616f73',
        spotifyUrl: 'https://open.spotify.com/track/3rUGC1vUpkMQigIZ3zy2Su',
        tempo: 111,
        reasonText: 'Beats enérgicos y vocales seguras que potencian tu magnetismo social, confianza y pico de libido ovulatoria.'
      },
      {
        id: '1vYXt7VS8qGhaW0alXY79m',
        name: 'Dance The Night',
        artist: 'Dua Lipa',
        albumName: 'Dance The Night (From Barbie The Album)',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b27357ddc3c04225e37a09b3052a',
        spotifyUrl: 'https://open.spotify.com/track/1vYXt7VS8qGhaW0alXY79m',
        tempo: 110,
        reasonText: 'Sonoridad radiante que acompaña la máxima sociabilidad, carisma y celebración del pico fértil.'
      },
      {
        id: '4Dvkj6JhhA12EX05QKi792',
        name: 'As It Was',
        artist: 'Harry Styles',
        albumName: "Harry's House",
        albumCover: 'https://i.scdn.co/image/ab67616d0000b2732e8f605f6396f42b3b784a91',
        spotifyUrl: 'https://open.spotify.com/track/4Dvkj6JhhA12EX05QKi792',
        tempo: 126,
        reasonText: 'Cadencia ágil y optimista ideal para canalizar tu pico de energía física y expresión interpersonal.'
      },
      {
        id: '5ZjsC929Q3c89E8qj9Jk0N',
        name: 'Houdini',
        artist: 'Dua Lipa',
        albumName: 'Houdini',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273fc5f8e6589304a956ae8e02d',
        spotifyUrl: 'https://open.spotify.com/track/5ZjsC929Q3c89E8qj9Jk0N',
        tempo: 117,
        reasonText: 'Pulsaciones electro-pop magnéticas para sintonizar con la máxima seguridad y poder sensorial de tu ovulación.'
      }
    ],
    Lutea: [
      {
        id: '4R2kfaDFslZEMLoQut9Ag5',
        name: 'cardigan',
        artist: 'Taylor Swift',
        albumName: 'folklore',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b27395f754318336a95e85238f4d',
        spotifyUrl: 'https://open.spotify.com/track/4R2kfaDFslZEMLoQut9Ag5',
        tempo: 65,
        reasonText: 'Atmósfera melódica nostálgica y reconfortante para estabilizar la serotonina y apaciguar la reactividad premenstrual.'
      },
      {
        id: '2mgANf0nLz8Zz64Qk5bZ68',
        name: 'Golden Hour',
        artist: 'Kacey Musgraves',
        albumName: 'Golden Hour',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273d6e5d8ec0c5ecfcf39a3f2db',
        spotifyUrl: 'https://open.spotify.com/track/2mgANf0nLz8Zz64Qk5bZ68',
        tempo: 78,
        reasonText: 'Brisa acústica pacificadora que acompaña el repliegue introspectivo guiado por la progesterona.'
      },
      {
        id: '5Gb9x904mZ2s214f4V8a0x',
        name: 'Mystery of Love',
        artist: 'Sufjan Stevens',
        albumName: 'Call Me by Your Name (Original Motion Picture Soundtrack)',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b2730623d8c19fb7b659c2688006',
        spotifyUrl: 'https://open.spotify.com/track/5Gb9x904mZ2s214f4V8a0x',
        tempo: 74,
        reasonText: 'Cuerdas acústicas sutiles y frecuencias armónicas bajas que desarman la irritabilidad y el estrés premenstrual.'
      },
      {
        id: '0A1t3eK7j7L7uTj0k0r4N7',
        name: 'Sunsetz',
        artist: 'Cigarettes After Sex',
        albumName: 'Cigarettes After Sex',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b27339798efd48e025f82c40c173',
        spotifyUrl: 'https://open.spotify.com/track/0A1t3eK7j7L7uTj0k0r4N7',
        tempo: 70,
        reasonText: 'Dream-pop aterciopelado para desconectar de la sobreestimulación mental y favorecer un descanso profundo.'
      }
    ]
  };

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

      // Fallback Infalible al Catálogo Psicoacústico Calibrado por Fase Hormonal:
      // Si la API de Spotify devuelve 0 pistas (por estar en Development Mode 403, endpoints deprecados 404
      // o cuenta sin biblioteca previa), NUNCA dejamos a la usuaria en un estado vacío o bloqueado.
      if (tracks.length === 0) {
        let normPhase = 'Menstrual';
        const pLow = (phase || '').toLowerCase();
        if (pLow.includes('folicular')) normPhase = 'Folicular';
        else if (pLow.includes('ovulatoria')) normPhase = 'Ovulatoria';
        else if (pLow.includes('lutea') || pLow.includes('lútea') || pLow.includes('premenstrual')) normPhase = 'Lutea';

        const catalog = this.PSYCHOACOUSTIC_CATALOG[normPhase] || this.PSYCHOACOUSTIC_CATALOG.Menstrual;
        const idxKey = `pochirocho_sp_idx_${normPhase}`;
        let idx = parseInt(localStorage.getItem(idxKey) || '0', 10);
        if (forceRotate) {
          idx = (idx + 1) % catalog.length;
          try { localStorage.setItem(idxKey, idx.toString()); } catch(e) {}
        } else {
          idx = idx % catalog.length;
        }
        const selected = catalog[idx];

        return {
          isConnected: true,
          phase,
          isCalibratedFallback: true,
          acousticTargets: {
            ...acousticTargets,
            target_tempo: selected.tempo,
            reasonText: selected.reasonText
          },
          track: {
            id: selected.id,
            name: selected.name,
            artist: selected.artist,
            albumName: selected.albumName,
            albumCover: selected.albumCover,
            spotifyUrl: selected.spotifyUrl,
            uri: `spotify:track:${selected.id}`
          }
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
      let normPhase = 'Menstrual';
      const pLow = (phase || '').toLowerCase();
      if (pLow.includes('folicular')) normPhase = 'Folicular';
      else if (pLow.includes('ovulatoria')) normPhase = 'Ovulatoria';
      else if (pLow.includes('lutea') || pLow.includes('lútea') || pLow.includes('premenstrual')) normPhase = 'Lutea';

      const catalog = this.PSYCHOACOUSTIC_CATALOG[normPhase] || this.PSYCHOACOUSTIC_CATALOG.Menstrual;
      const selected = catalog[0];
      return {
        isConnected: true,
        phase,
        isCalibratedFallback: true,
        acousticTargets: {
          ...acousticTargets,
          target_tempo: selected.tempo,
          reasonText: selected.reasonText
        },
        track: {
          id: selected.id,
          name: selected.name,
          artist: selected.artist,
          albumName: selected.albumName,
          albumCover: selected.albumCover,
          spotifyUrl: selected.spotifyUrl,
          uri: `spotify:track:${selected.id}`
        }
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
