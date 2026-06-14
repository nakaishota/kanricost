import { useState } from 'react'
import type { AnswerRecord, DiagnosisResult, Question } from './types'
import { selectQuestions } from './logic/selectQuestions'
import { diagnose } from './logic/scoring'
import { StartScreen } from './components/StartScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultScreen } from './components/ResultScreen'
import { FeedbackScreen } from './components/FeedbackScreen'

type Screen = 'start' | 'quiz' | 'result' | 'feedback'

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  /** 結果の発表演出(カーテン)をスキップするか(フィードバックから戻ったとき) */
  const [skipIntro, setSkipIntro] = useState(false)
  /** quiz をマウントし直して内部状態(idx・回答)をリセットするためのキー */
  const [runId, setRunId] = useState(0)

  const startQuiz = () => {
    setQuestions(selectQuestions())
    setResult(null)
    setSkipIntro(false)
    setRunId((n) => n + 1)
    setScreen('quiz')
  }

  const finishQuiz = (a: AnswerRecord[]) => {
    setAnswers(a)
    setResult(diagnose(a))
    setSkipIntro(false)
    setScreen('result')
  }

  return (
    <main className="app-frame">
      {screen === 'start' && <StartScreen onStart={startQuiz} />}
      {screen === 'quiz' && (
        <QuizScreen key={runId} questions={questions} onFinish={finishQuiz} />
      )}
      {screen === 'result' && result && (
        <ResultScreen
          result={result}
          skipIntro={skipIntro}
          onRestart={startQuiz}
          onFeedback={() => setScreen('feedback')}
        />
      )}
      {screen === 'feedback' && result && (
        <FeedbackScreen
          questions={questions}
          answers={answers}
          result={result}
          onClose={() => {
            setSkipIntro(true)
            setScreen('result')
          }}
          onDone={() => setScreen('start')}
        />
      )}
    </main>
  )
}
