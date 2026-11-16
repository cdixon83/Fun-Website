import { useRef, useState } from 'react'
import './App.css'

function App() {
  const [noPosition, setNoPosition] = useState(null)
  const [saidYes, setSaidYes] = useState(false)
  const answerAreaRef = useRef(null)
  const yesButtonRef = useRef(null)

  function moveNoButton(pointerX, pointerY) {
    const area = answerAreaRef.current
    const noButton = area?.querySelector('.no-button')
    const yesButton = yesButtonRef.current

    if (!area || !noButton || !yesButton) return

    const areaBounds = area.getBoundingClientRect()
    const yesBounds = yesButton.getBoundingClientRect()
    const buttonWidth = noButton.offsetWidth
    const buttonHeight = noButton.offsetHeight
    const halfWidth = buttonWidth / 2
    const halfHeight = buttonHeight / 2
    const maxX = areaBounds.width - halfWidth
    const maxY = areaBounds.height - halfHeight
    const yesX = yesBounds.left - areaBounds.left + yesBounds.width / 2
    const yesY = yesBounds.top - areaBounds.top + yesBounds.height / 2
    const targetX = pointerX - areaBounds.left
    const targetY = pointerY - areaBounds.top
    let bestPosition = null
    let bestDistance = -1

    for (let attempt = 0; attempt < 30; attempt += 1) {
      const x = halfWidth + Math.random() * (maxX - halfWidth)
      const y = halfHeight + Math.random() * (maxY - halfHeight)
      const overlapsYes =
        Math.abs(x - yesX) < (buttonWidth + yesBounds.width) / 2 + 16 &&
        Math.abs(y - yesY) < (buttonHeight + yesBounds.height) / 2 + 16

      if (overlapsYes) continue

      const distanceFromPointer = Math.hypot(x - targetX, y - targetY)
      if (distanceFromPointer > bestDistance) {
        bestDistance = distanceFromPointer
        bestPosition = { x, y }
      }
    }

    if (!bestPosition) {
      bestPosition = { x: maxX, y: maxY }
    }

    setNoPosition(bestPosition)
  }

  function dodgePointer(event) {
    event.preventDefault()
    moveNoButton(event.clientX, event.clientY)
  }

  function dodgeClick(event) {
    event.preventDefault()
    const bounds = event.currentTarget.getBoundingClientRect()
    moveNoButton(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2)
  }

  function dodgeKeyboard(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    const bounds = event.currentTarget.getBoundingClientRect()
    moveNoButton(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2)
  }

  return (
    <main className="page-shell">
      <div className="sparkle sparkle-one" aria-hidden="true">✦</div>
      <div className="sparkle sparkle-two" aria-hidden="true">✧</div>
      <div className="sparkle sparkle-three" aria-hidden="true">✦</div>

      <article className="question-card">
        <div className="card-topline">
          <span className="topline-star" aria-hidden="true">✦</span>
          <span>A VERY IMPORTANT QUESTION</span>
          <span className="topline-star" aria-hidden="true">✦</span>
        </div>

        <div className="castle-mark" aria-hidden="true">
          <svg viewBox="0 0 96 84" fill="none">
            <path d="M17 72V40h12V25l8 7v9h8V18l8-12 8 12v23h8v-9l8-7v15h12v32H17Z" />
            <path d="M42 72V53a6 6 0 0 1 12 0v19M23 51h8m34 0h8M48 20h1m17 26h1m-35 0h1" />
            <path d="M11 72h74M8 78h80" />
          </svg>
        </div>

        <p className="eyebrow">The weekend is calling...</p>
        <h1>Should we go to <span>Disney</span> this weekend?</h1>
        <p className="subtitle">A little magic sounds like a pretty good plan.</p>

        {saidYes ? (
          <div className="yes-response" role="status">
            <span className="response-star" aria-hidden="true">✦</span>
            <p>I knew you&apos;d say yes!</p>
            <span className="response-caption">Let the magic begin.</span>
          </div>
        ) : (
          <div className="answer-area" ref={answerAreaRef}>
            <button
              className="answer-button yes-button"
              onClick={() => setSaidYes(true)}
              ref={yesButtonRef}
              type="button"
            >
              Yes
              <span className="button-sparkle" aria-hidden="true">✦</span>
            </button>
            <button
              className={`answer-button no-button${noPosition ? ' is-moving' : ''}`}
              onClick={dodgeClick}
              onKeyDown={dodgeKeyboard}
              onPointerDown={dodgePointer}
              onPointerEnter={dodgePointer}
              style={
                noPosition
                  ? { left: `${noPosition.x}px`, top: `${noPosition.y}px` }
                  : undefined
              }
              type="button"
            >
              We can&apos;t
            </button>
          </div>
        )}

        <div className="card-footer">
          <span aria-hidden="true">✦</span>
          <span>MAKE THIS WEEKEND MAGICAL</span>
          <span aria-hidden="true">✦</span>
        </div>
      </article>
    </main>
  )
}

export default App
