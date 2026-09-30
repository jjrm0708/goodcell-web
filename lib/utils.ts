export { cn } from "cn"

export function formatCOP(valor: number): string {
  return '$' + valor.toLocaleString('es-CO')
}
