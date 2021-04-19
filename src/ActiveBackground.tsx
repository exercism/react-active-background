import type { ReactNode } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { useResizeObserver } from './hooks/useResizeObserver'

export type PatternOptions = Record<string, unknown>
export interface PatternConstructor<TOptions> {
  new (
    canvas: HTMLCanvasElement,
    options?: TOptions
  ): ActiveBackgroundPattern
}
export interface ActiveBackgroundPattern {
  render(): void
  start(): void
  stop(): void
}

export interface ActiveBackgroundProps<TPatternOptions = PatternOptions> {
  Pattern: PatternConstructor<TPatternOptions>
  patternOptions?: TPatternOptions
  className?: string
  children: ReactNode
}


export function ActiveBackground({ Pattern, patternOptions, className, children }: ActiveBackgroundProps): JSX.Element {
  const [canvasRef, setRef] = useState<HTMLCanvasElement | null>(null)
  const onRefSet = useCallback((ref) => setRef(ref), [setRef])
  const [update, setUpdate] = useState({})

  const updateCanvasSizeAndPosition = useCallback(() => {
    if (!canvasRef) {
      return
    }

    canvasRef.style.height = `${canvasRef.parentElement?.offsetHeight}px`
    canvasRef.style.width = `${canvasRef.parentElement?.offsetWidth}px`
    canvasRef.style.top = `${canvasRef.parentElement?.offsetTop}px`
    canvasRef.style.left = `${canvasRef.parentElement?.offsetLeft}px`
    canvasRef.height =
      canvasRef.parentElement?.offsetHeight ?? 0 * window.devicePixelRatio
    canvasRef.width =
      canvasRef.parentElement?.offsetWidth ?? 0 * window.devicePixelRatio

    setUpdate({})
  }, [canvasRef, setUpdate])

  // Set canvas to size and position of parent element
  useEffect(updateCanvasSizeAndPosition, [updateCanvasSizeAndPosition])

  useResizeObserver({
    target: canvasRef?.parentElement,
    callback: updateCanvasSizeAndPosition,
  })

  useEffect(() => {
    if (!canvasRef) {
      return
    }

    const background = new Pattern(
      canvasRef,
      patternOptions
    )

    background.start()

    return () => {
      background.stop()
    }
  }, [canvasRef, Pattern, patternOptions, update])

  const selfClassName = 'active-background-canvas'
  className = className ? `${className} ${selfClassName}` : selfClassName
  return (
    <>
      <canvas
        style={{ position: 'absolute' }}
        className={className}
        ref={onRefSet}
      />
      <div style={{ position: 'relative' }}>{children}</div>
    </>
  )
}
