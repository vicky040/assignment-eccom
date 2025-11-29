import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <h2 className="text-6xl font-bold text-primary">404</h2>
      <p className="text-2xl font-medium mt-4">Page Not Found</p>
      <p className="text-muted-foreground mt-2">Could not find the page you were looking for.</p>
      <Button asChild className="mt-6">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
