import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { CircleCheck, CircleX, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizOption {
  id: string
  text: string
}

interface QuizProps {
  question: string
  options: QuizOption[]
  correctId: string
  explanation: string
}

export function Quiz({ question, options, correctId, explanation }: QuizProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const answered = selected !== null
  const isCorrect = selected === correctId

  return (
    <div className="not-prose overflow-hidden rounded-xl border">
      <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5 text-sm font-medium text-foreground">
        <HelpCircle className="size-4 text-primary" aria-hidden="true" />
        Quick quiz
      </div>
      <div className="space-y-3 p-4">
        <p className="text-sm font-medium text-foreground">{question}</p>
        <div className="space-y-2" role="radiogroup" aria-label={question}>
          {options.map((option) => {
            const isSelected = selected === option.id
            const revealCorrect = answered && option.id === correctId
            const revealWrong = answered && isSelected && option.id !== correctId
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(option.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors",
                  revealCorrect && "border-success bg-success/10 text-foreground",
                  revealWrong && "border-destructive bg-destructive/10 text-foreground",
                  !revealCorrect && !revealWrong && isSelected && "border-primary bg-primary/5",
                  !isSelected && !revealCorrect && "border-border hover:bg-muted/50",
                )}
              >
                <span>{option.text}</span>
                {revealCorrect ? <CircleCheck className="size-4 shrink-0 text-success" aria-hidden="true" /> : null}
                {revealWrong ? <CircleX className="size-4 shrink-0 text-destructive" aria-hidden="true" /> : null}
              </button>
            )
          })}
        </div>

        <AnimatePresence>
          {answered ? (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "rounded-lg px-3.5 py-2.5 text-sm",
                  isCorrect ? "bg-success/10 text-foreground" : "bg-primary/5 text-foreground",
                )}
              >
                <p className="mb-1 font-semibold">{isCorrect ? "Correct — here's why:" : "Not quite — here's why:"}</p>
                <p className="text-muted-foreground">{explanation}</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
