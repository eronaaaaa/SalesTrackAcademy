import { useState } from "react";
import { Question, Choice } from "@/types/course";

// interface Choice {
//   id: number;
//   text: string;
// }

// interface Question {
//   id: number;
//   text: string;
//   choices: Choice[];
// }

interface QuestionCardProps {
  question: Question;
  selectedChoiceId: number | null;
  onSelect: (choiceId: number) => void;
}

export default function QuestionCard({
  question,
  selectedChoiceId,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl mb-6 last:mb-0 transition-all">
      <h3 className="text-lg font-bold mb-4 dark:text-white leading-snug">
        {question.text}
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {question.choices.map((choice) => {
          const isSelected = selectedChoiceId === choice.id;

          return (
            <button
              key={choice.id}
              onClick={() => onSelect(choice.id)}
              className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-200 font-medium text-sm
                ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                    : "border-transparent bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                  ${isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300 dark:border-slate-600"}`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                {choice.text}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
