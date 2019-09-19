
ffmpeg -i "mayhave-if-i-ever.mkv" -itsoffset 0.1 -i "mayhave-if-i-ever.mkv" -map 0:v -map 1:a -c copy "bmovbie-audio-delayed.mkv"

ffmpeg -i video-final.mkv -i If\ I\ Ever.wav -codec copy -shortest mayhave-if-i-ever.mkv

ffmpeg -i video.webm -filter:v "setpts=3.38095238095*PTS" video-final.mkv
