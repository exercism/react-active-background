import * as React from 'react'

interface IResizeObserver {
  target?: Element | null
  callback?: ResizeObserverCallback
}

export const useResizeObserver = ({
  target,
  callback,
}: IResizeObserver): void => {
  const observer = React.useMemo(
    () =>
      new ResizeObserver((resizeObserverEntries, resizeObserver) => {
        callback?.(resizeObserverEntries, resizeObserver)
      }),
    [callback]
  )

  React.useEffect(() => {
    if (observer && target) {
      observer.observe(target)
      return () => {
        observer.disconnect()
      }
    }
  }, [observer, target])
}
