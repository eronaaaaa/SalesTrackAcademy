interface QuizResultProps {
  score: number;
  passed: boolean;
  onClose: () => void;
  onNext: () => void;
}

export default function QuizResultModal({ score, passed, onClose, onNext }: QuizResultProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="text-center">
          <div className={`mx-auto w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner 
            ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {passed ? '🏆' : '🔄'}
          </div>
          
          <h2 className="text-3xl font-black mb-2 dark:text-white">
            {passed ? 'Module Cleared!' : 'Not Quite...'}
          </h2>
          
          <p className="text-slate-500 font-medium mb-8">
            You scored <span className="text-slate-900 dark:text-white font-bold">{score}%</span>. 
            {passed ? " You're ready for the next challenge." : " Review the materials and try again."}
          </p>

          <div className="flex flex-col gap-3">
            {passed ? (
              <button 
                onClick={onNext}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                Continue to Next Lesson
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:opacity-90 transition-all"
              >
                Review Lesson
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}