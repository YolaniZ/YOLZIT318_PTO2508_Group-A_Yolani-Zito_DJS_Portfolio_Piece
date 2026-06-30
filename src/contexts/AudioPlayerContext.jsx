import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { readFromStorage, writeToStorage } from '../utils/storage';

const AudioPlayerContext = createContext(null);
const PROGRESS_STORAGE_KEY = 'djs_listening_progress';

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressMap, setProgressMap] = useState(() => readFromStorage(PROGRESS_STORAGE_KEY, {}));

  useEffect(() => {
    writeToStorage(PROGRESS_STORAGE_KEY, progressMap);
  }, [progressMap]);

  const updateProgressForTrack = useCallback((track, time, trackDuration) => {
    if (!track || !track.episodeId) {
      return;
    }

    const resolvedDuration = Number.isFinite(trackDuration) && trackDuration > 0 ? trackDuration : 0;
    const resolvedTime = Number.isFinite(time) && time >= 0 ? time : 0;
    const finished = resolvedDuration > 0 && resolvedTime / resolvedDuration >= 0.98;

    setProgressMap((prev) => ({
      ...prev,
      [track.episodeId]: {
        position: resolvedTime,
        duration: resolvedDuration,
        finished,
        updatedAt: new Date().toISOString()
      }
    }));
  }, []);

  const playTrack = useCallback(
    async (track) => {
      const audioElement = audioRef.current;

      if (!audioElement || !track?.audioSrc) {
        return;
      }

      const isDifferentTrack = currentTrack?.episodeId !== track.episodeId;

      if (isDifferentTrack) {
        audioElement.src = track.audioSrc;
        setCurrentTrack(track);
      }

      try {
        if (isDifferentTrack) {
          const savedProgress = progressMap[track.episodeId];
          await audioElement.play();

          if (savedProgress?.position && savedProgress.position > 0) {
            audioElement.currentTime = savedProgress.position;
          }
        } else if (audioElement.paused) {
          await audioElement.play();
        } else {
          audioElement.pause();
        }
      } catch {
        // Browser autoplay policies can block playback until user interaction.
      }
    },
    [currentTrack?.episodeId, progressMap]
  );

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const seekTo = useCallback((nextTime) => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = nextTime;
  }, []);

  const resetHistory = useCallback(() => {
    setProgressMap({});
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    const onTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
      updateProgressForTrack(currentTrack, audioElement.currentTime, audioElement.duration);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoadedMetadata = () => {
      setDuration(audioElement.duration || 0);

      if (currentTrack?.episodeId) {
        const savedProgress = progressMap[currentTrack.episodeId];

        if (savedProgress?.position && savedProgress.position < audioElement.duration) {
          audioElement.currentTime = savedProgress.position;
        }
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      if (currentTrack) {
        updateProgressForTrack(currentTrack, audioElement.duration, audioElement.duration);
      }
    };

    audioElement.addEventListener('timeupdate', onTimeUpdate);
    audioElement.addEventListener('loadedmetadata', onLoadedMetadata);
    audioElement.addEventListener('play', onPlay);
    audioElement.addEventListener('pause', onPause);
    audioElement.addEventListener('ended', onEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', onTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', onLoadedMetadata);
      audioElement.removeEventListener('play', onPlay);
      audioElement.removeEventListener('pause', onPause);
      audioElement.removeEventListener('ended', onEnded);
    };
  }, [currentTrack, progressMap, updateProgressForTrack]);

  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (!isPlaying) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [isPlaying]);

  const value = useMemo(
    () => ({
      audioRef,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      progressMap,
      playTrack,
      pause,
      seekTo,
      resetHistory
    }),
    [currentTrack, isPlaying, currentTime, duration, progressMap, playTrack, pause, seekTo, resetHistory]
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);

  if (!context) {
    throw new Error('useAudioPlayer must be used inside AudioPlayerProvider');
  }

  return context;
}
