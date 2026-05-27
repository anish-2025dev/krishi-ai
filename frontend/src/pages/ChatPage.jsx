import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'

const QUICK = [
  'मेरी फसल के लिए पानी कब देना चाहिए?',
  'गेहूं में कौन सी खाद डालें?',
  'What is the best time to sow mustard?',
  'Pest control ke liye kya karein?',
  'सरकारी योजनाएं कौन सी हैं किसानों के लिए?',
  'How to increase crop yield?',
]

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { role:'assistant', content:`नमस्ते ${user?.name || 'किसान भाई'}! 🌿 मैं KrishiAI आपका खेती सहायक हूँ। आप हिंदी, English, या Hinglish में पूछ सकते हैं। कैसे मदद करूँ?` }
  ])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [language, setLanguage] = useState('hindi')
  const bottomRef = useRef()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')

    const userMsg = { role:'user', content:msg }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const history = messages.slice(-10).map(m => ({ role:m.role==='assistant'?'model':'user', content:m.content }))
      const { data } = await API.post('/ai/chat', {
        message: msg,
        history,
        language,
        user_context: {
          location:   user?.location?.state,
          crops:      user?.crops,
          land_acres: user?.land_acres,
        },
      })
      setMessages(prev => [...prev, { role:'assistant', content:data.reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role:'assistant', content:'माफ़ करें, अभी कनेक्शन में समस्या है। कृपया दोबारा कोशिश करें।' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div style={{ maxWidth:700, margin:'0 auto', display:'flex', flexDirection:'column', height:'calc(100vh - 140px)' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <h1 style={{ fontSize:'1.2rem', fontWeight:800, color:'#c8e6c9' }}>🤖 AI Farming Assistant</h1>
            <p style={{ fontSize:'.78rem', color:'#4a7c4e' }}>Powered by Google Gemini</p>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {[['hindi','हिं'],['english','EN'],['hinglish','HIN']].map(([val,label]) => (
              <button key={val} onClick={() => setLanguage(val)} style={{ padding:'6px 12px', borderRadius:100, fontSize:'.72rem', fontWeight:700, border:`1px solid ${language===val?'#4caf50':'rgba(76,175,80,.2)'}`, background:language===val?'rgba(76,175,80,.15)':'transparent', color:language===val?'#81c784':'#4a7c4e', cursor:'pointer', transition:'all .2s' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick questions */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
          {QUICK.map(q => (
            <button key={q} onClick={() => send(q)} style={{ padding:'6px 12px', fontSize:'.72rem', borderRadius:100, border:'1px solid rgba(76,175,80,.2)', background:'rgba(27,45,28,.6)', color:'#66bb6a', cursor:'pointer', transition:'all .2s', fontFamily:"'Sora',sans-serif" }}>
              {q.length > 30 ? q.slice(0,30)+'…' : q}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:12, paddingRight:4, marginBottom:16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
              {m.role === 'assistant' && (
                <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#4caf50,#1b5e20)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0, marginRight:10, marginTop:4 }}>🤖</div>
              )}
              <div style={{
                maxWidth:'80%',
                padding:'12px 16px',
                borderRadius: m.role==='user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.role==='user' ? 'linear-gradient(135deg,#4caf50,#2e7d32)' : 'rgba(27,45,28,.8)',
                border: m.role==='user' ? 'none' : '1px solid rgba(76,175,80,.15)',
                color: '#e8f5e9',
                fontSize:'.88rem',
                lineHeight:1.65,
                whiteSpace:'pre-wrap',
              }}>
                {m.content}
              </div>
              {m.role === 'user' && (
                <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(76,175,80,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0, marginLeft:10, marginTop:4 }}>👨‍🌾</div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#4caf50,#1b5e20)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>🤖</div>
              <div style={{ padding:'12px 18px', background:'rgba(27,45,28,.8)', border:'1px solid rgba(76,175,80,.15)', borderRadius:'18px 18px 18px 4px', display:'flex', gap:6, alignItems:'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:'#4caf50', animation:`bounce .8s ${i*0.15}s infinite alternate` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display:'flex', gap:10 }}>
          <input
            className="input-field"
            placeholder={language==='hindi'?'खेती के बारे में पूछें...':language==='hinglish'?'Khet ke baare mein poochhen...':'Ask about farming...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==='Enter' && !e.shiftKey && send()}
            style={{ flex:1 }}
          />
          <button className="btn-primary" style={{ padding:'12px 20px', flexShrink:0 }} onClick={() => send()} disabled={loading || !input.trim()}>
            Send →
          </button>
        </div>

        <style>{`
          @keyframes bounce{ from{transform:translateY(0)} to{transform:translateY(-6px)} }
        `}</style>
      </div>
    </Layout>
  )
}
