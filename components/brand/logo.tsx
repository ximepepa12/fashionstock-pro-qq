import { Shirt } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  iconClassName,
  textClassName,
}: {
  className?: string
  iconClassName?: string
  textClassName?: string
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#ff6b8b] text-white',
          iconClassName,
        )}
      >
        <Shirt className="size-5" />
      </div>
      <span className={cn('text-lg font-semibold tracking-tight text-slate-900', textClassName)}>FashionStock Pro</span>
    </div>
  )
}
