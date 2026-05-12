import urllib.request
import zipfile
import os
import shutil

url = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
zip_path = "ffmpeg.zip"

print("📥 Downloading ffmpeg (this might take a minute)...")
urllib.request.urlretrieve(url, zip_path)

print("📦 Extracting ffmpeg.exe...")
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    for member in zip_ref.namelist():
        if member.endswith('ffmpeg.exe'):
            source = zip_ref.open(member)
            target = open('ffmpeg.exe', 'wb')
            with source, target:
                shutil.copyfileobj(source, target)
            break

# Clean up the zip file
if os.path.exists(zip_path):
    os.remove(zip_path)

print("✅ ffmpeg.exe has been successfully placed in your audio-service folder!")
print("🚀 You can now run `python app.py` and the error will be gone.")
