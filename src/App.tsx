import { useState } from 'react'
import type { AnswerRecord, DiagnosisResult, Question } from './types'
import { selectQuestions } from './logic/selectQuestions'
import { diagnose } from './logic/scoring'
import { StartScreen } from './components/StartScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultScreen } from './components/ResultScreen'

type Screen = 'start' | 'quiz' | 'result'

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [questions, setQuestions] = useState<Question[]>([])
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  /** quiz をマウントし直して内部状態(idx・回答)をリセットするためのキー */
  const [runId, setRunId] = useState(0)

  const startQuiz = () => {
    setQuestions(selectQuestions())
    setResult(null)
    setRunId((n) => n + 1)
    setScreen('quiz')
  }

  const finishQuiz = (answers: AnswerRecord[]) => {
    setResult(diagnose(answers))
    setScreen('result')
  }

  return (
    <main className="app-frame">
      {screen === 'start' && <StartScreen onStart={startQuiz} />}
      {screen === 'quiz' && (
        <QuizScreen key={runId} questions={questions} onFinish={finishQuiz} />
      )}
      {screen === 'result' && result && (
        <ResultScreen result={result} onRestart={startQuiz} />
      )}
    </main>
  )
}
