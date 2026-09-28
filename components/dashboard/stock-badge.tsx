import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return <Badge className="bg-[#ff6b8b]/15 text-[#c9365b] hover:bg-[#ff6b8b]/15">Agotado</Badge>
  }
  if (stock <= 5) {
    return <Badge className={cn('bg-amber-100 text-amber-700 hover:bg-amber-100')}>Bajo stock</Badge>
  }
  return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Disponible</Badge>
}
