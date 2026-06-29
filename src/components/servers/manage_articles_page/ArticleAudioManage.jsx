import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Volume2,
  Pause,
  RefreshCw,
  Trash2,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  uploadTtsFile,
  updateArticle,
  deleteTtsFile,
} from "@/api/servers/articleApi";
import { logError } from "@/utils/LogError";

const ArticleAudioManage = ({ article, onRefresh }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);

  // Clean up audio on unmount or URL change
  useEffect(() => {
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
      }
    };
  }, [audioPlayer]);

  // If audioUrl changes, reset player
  useEffect(() => {
    if (audioPlayer) {
      audioPlayer.pause();
      setAudioPlayer(null);
      setIsPlaying(false);
    }
  }, [article.audio_url]);

  const togglePlay = () => {
    if (!article.audio_url) return;

    if (isPlaying && audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      if (audioPlayer) {
        audioPlayer
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error("Audio play failed", err);
            toast.error("Audio playback failed");
          });
      } else {
        const audio = new Audio(article.audio_url);
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error("Audio play failed", err);
            toast.error("Audio playback failed");
          });
        audio.onended = () => {
          setIsPlaying(false);
        };
        setAudioPlayer(audio);
      }
    }
  };

  const handleGenerate = async () => {
    setIsUploading(true);
    const toastId = toast.loading("Generating audio voice...");
    try {
      await deleteTtsFile(article.id, article.audio_url);
      await uploadTtsFile(article.id);

      toast.success("Audio generated successfully!", { id: toastId });
    } catch (err) {
      logError(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!article.audio_url) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this article audio?",
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting audio...");
    try {
      if (article.audio_url) {
        await deleteTtsFile(article.id, article.audio_url);
      }

      toast.success("Audio deleted successfully", { id: toastId });
    } catch (err) {
      logError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-gray-400" />
          Article Audio
        </h3>
        {article.audio_url && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2.5 py-1 rounded-md">
            Active
          </span>
        )}
      </div>

      {article.audio_url ? (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={togglePlay}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
              isPlaying
                ? "bg-gray-950 border-gray-950 text-white hover:bg-gray-900"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause Audio
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Play Audio
              </>
            )}
          </button>

          <button
            onClick={handleGenerate}
            disabled={isUploading || isDeleting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Regenerate
          </button>

          <button
            onClick={handleDelete}
            disabled={isUploading || isDeleting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30">
          <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            No audio generated yet
          </p>
          <p className="text-xs text-gray-500 mb-4 px-4">
            Convert this article's content into speech using AI Voice.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Voice (TTS)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleAudioManage;
