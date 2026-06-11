import { BookOpen } from "lucide-react";

const EmptyNoteState = () => (
  <div className="h-full flex flex-col items-center justify-center text-neutral-300 bg-white select-none dark:bg-neutral-950 dark:text-neutral-600">
    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4 dark:bg-neutral-800">
      <BookOpen size={32} className="opacity-50" />
    </div>
    <p className="text-lg font-medium text-neutral-400 dark:text-neutral-500">
      Select a vocabulary deck to start
    </p>
    <p className="text-sm text-neutral-300 dark:text-neutral-600">
      Or create a new one from the left sidebar
    </p>
  </div>
);

export default EmptyNoteState;
