import * as React from 'react'
import { useResizeObserver } from './hooks/useResizeObserver'
import { IActiveBackground, IActiveBackgroundPattern } from './index'

export const ActiveBackground: React.FC<IActiveBackground> = ({
  pattern,
  patternOptions = {},
  className,
  children,
}) => {
  const [canvasRef, setRef] = React.useState<HTMLCanvasElement | null>(null)
  const onRefSet = React.useCallback((ref) => setRef(ref), [setRef])
  const [update, setUpdate] = React.useState({})

  const updateCanvasSizeAndPosition = React.useCallback(() => {
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
  React.useEffect(updateCanvasSizeAndPosition, [updateCanvasSizeAndPosition])

  useResizeObserver({
    target: canvasRef?.parentElement,
    callback: updateCanvasSizeAndPosition,
  })

  React.useEffect(() => {
    if (!canvasRef) {
      return
    }

    const background: IActiveBackgroundPattern = new pattern(
      canvasRef,
      patternOptions
    )

    background.start()

    return () => {
      background.stop()
    }
  }, [canvasRef, pattern, patternOptions, update])

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
