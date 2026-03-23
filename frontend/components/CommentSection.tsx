import {Comment} from "@/types/course";
export default function CommentSection({
  commentText,
  onCommentTextChange,
  handlePostComment,
  comments,
}: {
  commentText: string;
  onCommentTextChange: (commentText: string) => void;
  handlePostComment: () => void;
  comments: Comment[];
}) {
  return (
    <div className="mt-12 space-y-6">
      <h3 className="text-xl font-black dark:text-white">Discussion</h3>

      {/* Input Box */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <textarea
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none mb-4 min-h-[100px]"
          placeholder="Ask a question or leave feedback..."
          value={commentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
        />
        <button
          onClick={handlePostComment}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
        >
          Post Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl"
          >
            <div className="flex justify-between mb-2">
              <span className="font-bold text-xs text-blue-600 uppercase">
                {c.user.email}
              </span>
              <span className="text-[10px] text-slate-400">
                {new Date(c.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm dark:text-slate-300">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
