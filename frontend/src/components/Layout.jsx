import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { icon: '🏠', label: 'Dashboard',   path: '/dashboard' },
  { icon: '🌦️', label: 'Weather',     path: '/weather' },
  { icon: '🌱', label: 'Crop AI',     path: '/crops' },
  { icon: '🔬', label: 'Disease',     path: '/disease' },
  { icon: '📊', label: 'Market',      path: '/market' },
  { icon: '🤖', label: 'AI Chat',     path: '/chat' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0d1a0f', fontFamily:"'Sora',sans-serif" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220, flexShrink: 0,
          background: 'rgba(13,20,14,.98)',
          borderRight: '1px solid rgba(76,175,80,.1)',
          display: 'flex', flexDirection: 'column', padding: '20px 12px',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .3s',
        }}
        className="md-sidebar"
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8, marginBottom:24 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#4caf50,#1b5e20)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🌿</div>
          <span style={{ fontWeight:800, fontSize:'1rem', color:'#e8f5e9' }}>Krishi<span style={{ color:'#66bb6a' }}>AI</span></span>
        </Link>

        {/* Farmer card */}
        {user && (
          <div style={{ background:'rgba(46,125,50,.1)', border:'1px solid rgba(76,175,80,.15)', borderRadius:12, padding:'12px 14px', marginBottom:20 }}>
            <div style={{ fontSize:'1.4rem', marginBottom:4 }}>👨‍🌾</div>
            <div style={{ fontWeight:700, fontSize:'.85rem', color:'#c8e6c9' }}>{user.name}</div>
            <div style={{ fontSize:'.7rem', color:'#4a7c4e' }}>{user.land_acres || 0} acres · {user.location?.state || 'India'}</div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:4 }}>
          {NAV.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span style={{ fontSize:'1rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{ background:'rgba(229,57,53,.1)', border:'1px solid rgba(229,57,53,.2)', borderRadius:10, padding:'10px 14px', color:'#ef9a9a', fontSize:'.85rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8, marginTop:12 }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:30 }} />
      )}

      {/* Desktop sidebar always visible */}
      <style>{`
        @media(min-width:768px){
          .md-sidebar{ transform:translateX(0) !important; position:static; }
          .main-content{ margin-left:0; }
        }
      `}</style>

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflowX:'hidden' }}>
        {/* Topbar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 24px', borderBottom:'1px solid rgba(76,175,80,.08)', background:'rgba(13,26,15,.95)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'#66bb6a', fontSize:'1.3rem', padding:4 }} className="md-hide">
              ☰
            </button>
            <div>
              <div style={{ fontWeight:700, fontSize:'.95rem', color:'#c8e6c9' }}>
                {NAV.find(n => n.path === location.pathname)?.label || 'KrishiAI'}
              </div>
              <div style={{ fontSize:'.68rem', color:'#3d6b40' }}>{new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#4caf50,#1b5e20)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>👨‍🌾</div>
          </div>
        </div>

        <style>{`@media(min-width:768px){.md-hide{display:none!important}}`}</style>

        {/* Page content */}
        <main style={{ flex:1, padding:'24px', overflowY:'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
