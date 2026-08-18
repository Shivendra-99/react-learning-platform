import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 py-20">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="text-muted-foreground">That lesson doesn't exist yet. Head back to the course overview.</p>
      <Button asChild>
        <Link to="/">Back to overview</Link>
      </Button>
    </div>
  )
}
