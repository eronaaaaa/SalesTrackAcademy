"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/ApiService";
import { Choice, Question } from "@/types/course";

interface QuizBuilderProps {
  lessonId: number;
  onClose: () => void;
  questions: Question[];
  onSaveSuccess: () => void;
}

export default function QuizBuilder({ lessonId, onClose, questions, onSaveSuccess }: QuizBuilderProps) {
  const [loading, setLoading] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState<Choice[] | null>([{ text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },]);
  const [existingQuestions, setExistingQuestions] = useState<Question[]>([]);

  useEffect(() => {
    loadQuestions();
  }, [lessonId]);

  const loadQuestions = async () => {
    try {
      setExistingQuestions(questions);
    } catch (err) { console.error("Failed to load questions", err); }
  };

  const handleChoiceChange = (idx: number, val: string) => {
    const newChoices = [...choices!];
    newChoices[idx].text = val;
    setChoices(newChoices);
  };

  const setCorrect = (index: number) => {
    const newChoices = choices?.map((c, i) => ({
      ...c,
      isCorrect: i === index,
    }));
    setChoices(newChoices!);
  };

const handleSave = async () => {
    if (!questionText || choices?.some(c => !c.text)) return alert("Fill everything!");
    setLoading(true);
    try {
      await api.createQuestion(lessonId, questionText, choices!);
      onSaveSuccess();
      setQuestionText("");
      setChoices(choices!.map((c, i) => ({ ...c, text: "", isCorrect: i === 0 })));
      
    } catch (err) { alert("Save failed"); } 
    finally { setLoading(false); }
  };

  return (
<div className="flex flex-col gap-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-700 h-full max-h-[95vh]">       <div className="flex flex-col min-h-0"> {/* min-h-0 is the magic flex fix for scrolling */}
       <div className="flex items-baseline justify-between"> <h3 className="text-xs font-black uppercase text-slate-400 tracking-tighter mb-4">
          Current Quiz ({existingQuestions.length})
        </h3>
                    <button className="p-2 text-slate-400 hover:text-red-500" onClick={onClose}>✕</button>
</div>
        
        <div className="overflow-y-auto pr-2 space-y-4 max-h-[300px] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          {existingQuestions.length > 0 ? (
            existingQuestions.map((q, i) => (
              <div key={q.id || i} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-sm font-bold dark:text-white mb-2">{i + 1}. {q.text}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.choices?.map((c: Choice) => (
                    <div key={c.id} className={`text-[10px] p-2 rounded-lg font-bold ${c.isCorrect ? 'bg-green-100 text-green-700' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                      {c.text}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 text-[10px] font-bold uppercase">
              No questions yet
            </div>
          )}
        </div>
      </div>
      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30">
        <h3 className="text-sm font-black dark:text-white mb-4">Add New Question</h3>
        <input 
          className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 mb-4 text-sm font-medium border-none shadow-sm"
          placeholder="Enter question..."
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
        />
        
        <div className="space-y-2">
          {choices?.map((c, i) => (
            <div key={i} className="flex gap-2">
              <input 
                className={`flex-1 p-3 rounded-xl text-xs border-2 transition-all ${c.isCorrect ? 'border-blue-500' : 'border-transparent'}`}
                placeholder={`Choice ${i+1}`}
                value={c.text}
                onChange={e => handleChoiceChange(i, e.target.value)}
              />
              <button 
                onClick={() => setChoices(choices.map((ch, idx) => ({ ...ch, isCorrect: idx === i })))}
                className={`px-4 rounded-xl font-bold text-xs ${c.isCorrect ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}
              >
                {c.isCorrect ? "CORRECT" : "SET"}
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform"
        >
          {loading ? "Saving..." : "Push to Lesson"}
        </button>
      </div>
    </div>
  );
}