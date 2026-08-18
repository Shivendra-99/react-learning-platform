import { Navigate, useParams } from "react-router-dom"
import { getLessonBySlug } from "@/lib/lessons-data"
import { LessonHeader } from "@/components/lesson/lesson-header"
import { LessonFooter } from "@/components/lesson/lesson-footer"

export default function LessonPage() {
  const { slug } = useParams<{ slug: string }>()
  const lesson = getLessonBySlug(slug)

  if (!lesson) {
    return <Navigate to="/" replace />
  }

  const LessonContent = lesson.component

  return (
    <article className="mx-auto max-w-3xl">
      <LessonHeader lesson={lesson} />
      <div className="lesson-prose mt-8">
        <LessonContent />
      </div>
      <LessonFooter slug={lesson.slug} />
    </article>
  )
}
