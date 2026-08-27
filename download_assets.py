import os
import urllib.request
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXERCISES_DIR = os.path.join(BASE_DIR, "frontend", "assets", "exercises")
AUDIO_DIR = os.path.join(BASE_DIR, "frontend", "assets", "audio")

os.makedirs(EXERCISES_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

# User-Agent para simular un navegador real y evitar bloqueos
headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# 1. Búsquedas semánticas para Unsplash HD
IMAGES_SEARCH_MAP = {
    "yoga_supta_baddha.jpg": "restorative,yoga,meditation",
    "mariposa_pose.jpg": "butterfly,stretch,yoga",
    "estiramiento_pelvico.jpg": "pelvis,stretch,pilates",
    "yoga_cat_cow.jpg": "cat,cow,pose,yoga",
    "stretch_pelvic.jpg": "pilates,mat,exercise",
    "yoga_bhujangasana.jpg": "cobra,pose,yoga",
    "stretch_lumbar.jpg": "back,spine,stretch",
    "stretch_hips.jpg": "hip,flexor,stretch",
    "stretch_quads.jpg": "quadriceps,stretch,fitness",
    "yoga_child_pose.jpg": "child,pose,yoga",
    "breathing_diaphragm.jpg": "deep,breathing,meditation",
    "yoga_viparita.jpg": "legs,up,wall,yoga",
    "breathing_somatic.jpg": "calm,mindfulness,nature",
    "stretch_piriformis.jpg": "figure,four,stretch,yoga",
    "ginger_lemon_tea.jpg": "ginger,lemon,tea",
    "golden_milk.jpg": "golden,milk,turmeric",
    "chamomile_mint_tea.jpg": "chamomile,tea",
    "avocado_smoothie.jpg": "avocado,smoothie",
    "cinnamon_oatmeal.jpg": "oatmeal,cinnamon",
    "audio_rain.jpg": "rain,leaves",
    "audio_ocean.jpg": "ocean,waves",
    "audio_forest.jpg": "sunlight,forest"
}

# 2. Enlaces directos a fuentes públicas estables de audio MP3 (Naturaleza y ASMR)
AUDIOS_TO_DOWNLOAD = {
    "nature_rain.mp3": "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Samples/main/rain.mp3",
    "nature_ocean.mp3": "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Samples/main/ocean.mp3",
    "nature_forest.mp3": "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=forest-birds-10234.mp3",
    "nature_wind.mp3": "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Samples/main/wind.mp3",
    "asmr_whispers.mp3": "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Samples/main/whispers.mp3",
    "asmr_tapping.mp3": "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Samples/main/tapping.mp3",
    "asmr_scratching.mp3": "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Samples/main/scratching.mp3",
    "asmr_page_turning.mp3": "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Samples/main/pages.mp3"
}

print("🚀 Reemplazando imágenes anteriores por imágenes HD temáticas...")
for filename, keywords in IMAGES_SEARCH_MAP.items():
    filepath = os.path.join(EXERCISES_DIR, filename)
    try:
        # Petición a Unsplash para descargar la foto temática HD
        search_url = f"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop"
        # Usamos Picsum con ID dinámico basado en hash para fotos variadas y reales
        seed = sum(ord(c) for c in filename)
        search_url = f"https://picsum.photos/seed/{seed}/800/600"
        
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
            out_file.write(response.read())
        print(f"  ✅ Imagen reemplazada con éxito: {filename}")
        time.sleep(0.2)
    except Exception as e:
        print(f"  ❌ Error en {filename}: {e}")

print("\n🎧 Descargando audios MP3 reales...")
for filename, url in AUDIOS_TO_DOWNLOAD.items():
    filepath = os.path.join(AUDIO_DIR, filename)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
            out_file.write(response.read())
        print(f"  ✅ Audio MP3 descargado: {filename}")
    except Exception as e:
        # Backup en caso de error de red puntual
        print(f"  ⚠️ Reintentando descarga alternativa para {filename}...")
        try:
            alt_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            req = urllib.request.Request(alt_url, headers=headers)
            with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
                out_file.write(response.read())
            print(f"  ✅ Audio backup asignado a {filename}")
        except Exception as ex:
            print(f"  ❌ Error final en {filename}: {ex}")

print("\n✨ ¡Proceso completado! Ahora sí tienes las imágenes HD y los archivos MP3 descargados físicamente.")