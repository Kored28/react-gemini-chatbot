import { useState } from 'react'

function App() {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [isDark, setIsDark] = useState(false)

  const SupriseOptions = [
    "Who won the latest Novel Prize?",
    "Who was Manchester United latest signing?",
    "How do you learn martial arts",
  ]

  const suprise = () => {
    const randomvalue = SupriseOptions[Math.floor(Math.random() * SupriseOptions.length)]
    setValue(randomvalue)
  }

  const getResponse = async() => {
    if(!value){
      setError("Error! Please ask a question")
      return
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const response = await fetch("http://localhost:8000/gemini", options)

      const data = await response.text()
      setChatHistory(oldHistory => [...oldHistory, {
        role: "user",
        parts: [{ text: value }]
      },
      {
        role: "model",
        parts: [{ text: data }]
      }
    ])
    setValue("")

    } catch (error) {
      console.error(error)
      setError("Something went wrong! Please try again later.")
    }
  }

  const clear = () => {
    setValue("")
    setError("")
  }

  return (
    <div className='app' data-theme={isDark ? "dark": "light"}>
      <div className='suprise-container'>
        <div className='know'>
          <p>What do you to know </p>
          <button onClick={suprise} className='suprise' disabled={!chatHistory}>Suprise me</button>
        </div>
        <button onClick={() => setIsDark(!isDark)} className='suprise'>{isDark ? "Light mode": "Dark mode" }</button>
      </div>
      <div className="input-container">
        <input type="text"
        value={value}
        placeholder="When is Easter...?"
        onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p className='error'>{error}</p>}
      <div className="search-result">
        {chatHistory.map((chatItem, _index) => (
          <div className="answer" key={_index}>
            <p style={{fontWeight: "bold"}}>{chatItem.role}:</p>
            {chatItem.parts.map((part, i) => (
            < p key={i}>{part.text}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
