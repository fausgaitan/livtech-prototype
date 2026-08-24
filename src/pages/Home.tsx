import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const swatches = [
  { name: 'background', className: 'bg-background border' },
  { name: 'foreground', className: 'bg-foreground' },
  { name: 'primary', className: 'bg-primary' },
  { name: 'secondary', className: 'bg-secondary border' },
  { name: 'muted', className: 'bg-muted border' },
  { name: 'accent', className: 'bg-accent border' },
  { name: 'border', className: 'bg-border' },
  { name: 'destructive', className: 'bg-destructive' },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
        Livtech
      </p>
      <h1 className="mt-2 text-3xl font-semibold">Theme check</h1>
      <p className="mt-2 text-muted-foreground">
        Your shadcndesign neutral palette is wired into the theme. Every
        component below inherits it automatically.
      </p>

      <div className="mt-8 grid grid-cols-4 gap-3">
        {swatches.map((s) => (
          <div key={s.name} className="space-y-1.5">
            <div className={`h-16 w-full rounded-md ${s.className}`} />
            <p className="text-xs text-muted-foreground">{s.name}</p>
          </div>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Components</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Badge>Badge</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>
    </div>
  )
}
