import { useEffect, useState } from 'react'
import axios from 'axios'
import { Answer, Question } from '../types/question'
import { Button } from 'antd'

const TIMER_SECONDS = 15

function QuestionForm() {
    const [questions, setQuestions] = useState<Question[]>([])
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [timer, setTimer] = useState(TIMER_SECONDS);
    const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
    const [score, setScore] = useState<number | null>(null)

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const url = 'http://localhost:5000/api/question/list';
                const results = await axios.get(url)
                console.log(results)
                if (results.data) {
                    setQuestions(results.data.data)
                }
            } catch (err) {
                alert('Error in fetch questions!');
            }

        }
        fetchQuestions()
    }, [])

    useEffect(() => {
        if (activeIndex < questions.length) {
            const countdown = setInterval(() => {
                setTimer((prev: any) => {
                    if (prev === 1) {
                        handlenext(null);
                        return TIMER_SECONDS
                    }
                    return prev - 1
                })

            }, 2000)
            return () => clearInterval(countdown)
        }
    }, [activeIndex, questions])

    const handlenext = (selectedQuesion: string | null) => {
        const current = questions[activeIndex]
        setTimer(TIMER_SECONDS);
        setActiveIndex(prev => prev + 1);
        setSelectedAnswers(prev => [...prev, { questionId: current?.id, selected: selectedQuesion }])

    }

    const calculateScore = async () => {
        try {
            const url = 'http://localhost:5000/api/question/list';
            const results = await axios.get(url)
            if (results.data) {
                let total = 0;
                results.data.data.forEach((q: Question, idx: number) => {
                    if (selectedAnswers[idx]?.selected === q.answer) {
                        total += 1;
                    }

                })
                setScore(total)
            }
        } catch (err) {
            alert('Error in fetch questions!');
        }

    }

    useEffect(() => {
        if (activeIndex === questions.length && questions.length > 0) {
            calculateScore()
        }
    }, [activeIndex])

    const retryQuiz = () => {
        setActiveIndex(0);
        setSelectedAnswers([]);
        setScore(null)
        setTimer(TIMER_SECONDS);
    }

    const current = questions[activeIndex];

    return (
        <>
            Question List ({questions.length})
            <div style={{ display: "flex", justifyContent: 'center' }}>
                {score !== null ? (
                    <div>
                        <h2>Quiz Copleted</h2>
                        <p>Your Score: {score} / {questions.length}</p>
                        <Button onClick={retryQuiz}>Retry Quiz</Button>
                    </div>
                ) :
                    current ? (
                        <div>
                            <p><span><b>Question {activeIndex + 1}.</b></span> {current?.question}</p>
                            <ul style={{ display: 'flex', gap: 5 }}>
                                {current.options.map((option) => (
                                    <li style={{ listStyle: 'none' }} key={option}>
                                        <Button onClick={() => handlenext(option)}>{option}</Button>
                                    </li>

                                ))}
                            </ul>
                            <p>Time Remaining: {timer}s</p>
                        </div>
                    ) : <p>Loading Questions...</p>}
            </div>

        </>
    )
}

export default QuestionForm
