import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function QuizPage() {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.getQuiz()
      .then(setQuiz)
      .catch((e) => setError(e.message || 'Failed to load quiz'))
      .finally(() => setLoading(false));
  }, []);

  const handleQuizSubmit = async () => {
    try {
      const res = await api.submitQuiz(answers, quiz.length);
      setResult(res);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem' }}>
        Loading quiz…
      </div>
    );
  }

  if (result) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="section-header">
          <span className="section-icon">🎯</span>
          <h2>Test Your Knowledge — Result</h2>
        </div>
        <div className="quiz-result">
          🎉 You scored {result.score} / {result.total}!
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="section-header">
        <span className="section-icon">🎯</span>
        <h2>Test Your Knowledge</h2>
      </div>
      {error && <p style={{ color: '#c00', marginBottom: '1rem' }}>{error}</p>}
      {quiz.map((q, idx) => (
        <div key={q.id} className="quiz-card">
          <h3 style={{ marginBottom: '1rem' }}>
            {idx + 1}. {q.question}
          </h3>
          {q.options.map((opt) => (
            <button
              key={opt}
              className={`quiz-option${answers[q.id] === opt ? ' selected' : ''}`}
              onClick={() => setAnswers({ ...answers, [q.id]: opt })}
            >
              {opt}
            </button>
          ))}
        </div>
      ))}
      {quiz.length > 0 && (
        <button className="btn-primary" onClick={handleQuizSubmit} style={{ maxWidth: 300 }}>
          Submit Answers
        </button>
      )}
      {quiz.length === 0 && <p>No quiz questions available yet.</p>}
    </div>
  );
}

