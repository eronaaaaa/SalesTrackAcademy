import { Lesson } from "@/types/course";

interface LessonContentProps {
  lesson: Lesson;
}

export default function LessonContent({ lesson }: LessonContentProps) {
  if (!lesson.contentUrl) {
    return (
      <div className="aspect-video bg-slate-900 flex items-center justify-center">
        <p className="text-slate-500">No content available for this lesson.</p>
      </div>
    );
  }

  const isYouTube =
    lesson.contentUrl.includes("youtube.com") ||
    lesson.contentUrl.includes("youtu.be");

  if (isYouTube) {
    const videoId =
      lesson.contentUrl.split("v=")[1]?.split("&")[0] ||
      lesson.contentUrl.split("/").pop();

    return (
      <iframe
        className="w-full aspect-video rounded-3xl border-none shadow-2xl"
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  switch (lesson.contentType) {
    case "VIDEO":
      return (
        <video src={lesson.contentUrl} controls className="w-full aspect-video bg-black" />
      );
    case "AUDIO":
      return (
        <div className="p-12 bg-slate-100 dark:bg-slate-800 flex flex-col items-center">
          <p className="mb-4 font-bold text-slate-500 uppercase tracking-widest text-xs">
            Audio Lesson
          </p>
          <audio src={lesson.contentUrl} controls className="w-full" />
        </div>
      );
    case "PDF":
      return <iframe src={lesson.contentUrl} className="w-full h-[700px] border-none" />;
    default:
      return <div className="p-10 bg-slate-200">Unsupported content type</div>;
  }
}