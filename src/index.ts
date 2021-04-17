export { ActiveBackground } from './ActiveBackground'
export { Confetti } from './ActiveBackground/Confetti'
export { ZoomCircle } from './ActiveBackground/ZoomCircle'

export type ActiveBackgroundPatternOptions = Record<string, any>

export interface IActiveBackgroundPatternConstructor {
  new (
    canvas: HTMLCanvasElement,
    options: ActiveBackgroundPatternOptions
  ): IActiveBackgroundPattern
}

export interface IActiveBackgroundPattern {
  render(): void
  start(): void
  stop(): void
}

export interface IActiveBackground {
  pattern: IActiveBackgroundPatternConstructor
  patternOptions?: { [key: string]: any }
  className?: string
}
