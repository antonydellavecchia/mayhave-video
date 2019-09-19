import os
import subprocess

cwd = os.chdir('/home/antony/Downloads')

def run():
    files = os.listdir()
    subprocess.call('ffmpeg -i mayhave_video.webm -c:a copy -c:v libx264 -b:v 5M -maxrate 5M mayhave_video.mp4')
    

