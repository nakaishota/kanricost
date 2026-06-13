/**
 * stroke ベースの SVG アイコン。inner はパス文字列(domains/resultTypes が保持)。
 */
export function Icon({
  inner,
  size,
  strokeWidth = 1.5,
  color,
}: {
  inner: string
  size: number
  strokeWidth?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', color }}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  )
}
