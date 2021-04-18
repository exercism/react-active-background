# react-active-background

## Requirements

- `react` >= 16.13.1
- `react-dom` >= 16.13.1

## Usage

Using `create-react-app`'s boiler-plate starter:

```typescript
import * as React from 'react'
import logo from './logo.svg'
import './App.css'

import { ActiveBackground, Confetti } from '@exercism/active-background'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ActiveBackground pattern={Confetti}>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </ActiveBackground>
      </header>
    </div>
  )
}

export default App
```

## Extending with your own animation

You can extend the background with your own canvas based animation by creating a class which fulfills the following:

```typescript
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
```
