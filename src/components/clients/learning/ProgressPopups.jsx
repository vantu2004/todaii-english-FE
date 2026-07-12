import { PauseCircle } from "lucide-react";

export function PopupHalf({ onContinue }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-11/12 max-w-md shadow-2xl border border-neutral-100 dark:border-neutral-800 text-center space-y-5 animate-scale-in">
        <div className="mx-auto w-16 h-16 bg-brand-50 dark:bg-brand-950/30 rounded-full flex items-center justify-center text-brand-500">
          <PauseCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
            Bạn có còn ở đây không?
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Có vẻ như bạn đã tạm rời đi một lúc.
            <br />
            Bấm tiếp tục để quay lại học nhé!
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onContinue}
            className="w-full px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-md transition-colors duration-200"
          >
            Tiếp tục học
          </button>
        </div>
      </div>
    </div>
  );
}
