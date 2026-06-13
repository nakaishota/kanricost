import { useEffect, useState } from 'react'

/** target まで delay ms 後にイージングでカウントアップして表示する */
export function Counter({ target, delay }: { target: number; delay: number }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    let raf = 0
    let t0: number | null = null
    const dur = 1800
    const tick = (now: number) => {
      if (t0 === null) t0 = now
      const t = Math.min(1, (now - t0) / dur)
      const e = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(target * e))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(timer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [target, delay])

  return <>{val}</>
}
