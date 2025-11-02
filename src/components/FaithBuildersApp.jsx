'use client'
import React, { useState, useEffect } from 'react'
import { Calendar, Bell, BookOpen, Users, Home, Settings, Search, Plus, Edit2, Trash2, X, Menu, MessageSquare, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function FaithBuildersApp() {
  const [currentPage, setCurrentPage] = useState('login')
  const [currentUser, setCurrentUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [aiPanelOpen, setAiPanelOpen] = useState(true)
  
  const [announcements, setAnnouncements] = useState([])
  const [events, setEvents] = useState([])
  const [resources, setResources] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load announcements
      const { data: announcementsData } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false })
      
      // Load events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
      
      // Load resources
      const { data: resourcesData } = await supabase
        .from('resources')
        .select('*')
        .order('upload_date', { ascending: false })
      
      // Load users
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
      
      if (announcementsData) setAnnouncements(announcementsData)
      if (eventsData) setEvents(eventsData)
      if (resourcesData) setResources(resourcesData)
      if (usersData) setUsers(usersData)
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async () => {
      const user = users.find(u => u.email === email && u.password === password)
      if (user) {
        setCurrentUser(user)
        setCurrentPage('dashboard')
        setError('')
      } else {
        setError('Invalid credentials')
      }
    }

    const handleGuestLogin = async () => {
      const guest = users.find(u => u.role === 'Guest')
      if (guest) {
        setCurrentUser(guest)
        setCurrentPage('dashboard')
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Faith Builders</h1>
            <p className="text-gray-600">Collaborative Community Platform</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Sign In
            </button>
          </div>
          
          <button
            onClick={handleGuestLogin}
            className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
          >
            Continue as Guest
          </button>
          
          <div className="mt-6 text-xs text-gray-500 text-center">
            <p>Demo: admin@faithbuilders.com / admin123</p>
          </div>
        </div>
      </div>
    )
  }

  const AIPanel = () => {
    const [aiQuery, setAiQuery] = useState('')
    const [aiResponse, setAiResponse] = useState('')

    const handleAiQuery = () => {
      const query = aiQuery.toLowerCase()
      if (query.includes('summar')) {
        setAiResponse(`📊 Summary: ${announcements.length} announcements, ${events.length} events, ${resources.length} resources available.`)
      } else if (query.includes('recommend')) {
        setAiResponse(`🎯 Recommendations: Check "${events[0]?.title}" on ${events[0]?.date}`)
      } else {
        setAiResponse('✨ Ask me to summarize, recommend events, or search resources!')
      }
    }

    return (
      <div className={`${aiPanelOpen ? 'w-80' : 'w-12'} bg-white border-l border-gray-200 flex flex-col transition-all`}>
        <div className="p-4 border-b flex items-center justify-between">
          {aiPanelOpen && <h3 className="font-semibold">AI Assistant</h3>}
          <button onClick={() => setAiPanelOpen(!aiPanelOpen)} className="text-gray-600 hover:text-gray-800">
            {aiPanelOpen ? <X size={20} /> : <MessageSquare size={20} />}
          </button>
        </div>
        
        {aiPanelOpen && (
          <>
            <div className="flex-1 p-4 overflow-y-auto">
              {aiResponse ? (
                <div className="bg-blue-50 rounded p-3 text-sm">{aiResponse}</div>
              ) : (
                <div className="text-gray-500 text-sm">
                  <p>👋 I'm your AI assistant. Ask me anything!</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                  placeholder="Ask me..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <button onClick={handleAiQuery} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  const Sidebar = () => {
    const navItems = [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
      { id: 'announcements', icon: Bell, label: 'Announcements' },
      { id: 'events', icon: Calendar, label: 'Events' },
      { id: 'resources', icon: BookOpen, label: 'Resources' },
    ]

    if (currentUser?.role === 'Admin') {
      navItems.push({ id: 'admin', icon: Settings, label: 'Admin' })
    }

    return (
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-800 text-white flex flex-col transition-all`}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold">Faith Builders</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
            <Menu size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                currentPage === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              {currentUser?.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs text-gray-400">{currentUser?.role}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => { setCurrentUser(null); setCurrentPage('login') }}
              className="w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    )
  }

  const Dashboard = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {currentUser?.name}!</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <Bell className="text-blue-600 mb-2" size={24} />
          <p className="text-3xl font-bold">{announcements.length}</p>
          <p className="text-sm text-gray-500">Announcements</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Calendar className="text-green-600 mb-2" size={24} />
          <p className="text-3xl font-bold">{events.length}</p>
          <p className="text-sm text-gray-500">Events</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <BookOpen className="text-purple-600 mb-2" size={24} />
          <p className="text-3xl font-bold">{resources.length}</p>
          <p className="text-sm text-gray-500">Resources</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm border-b">
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b">
                  <td className="py-3">{u.name}</td>
                  <td className="py-3 text-gray-600">{u.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      u.role === 'Admin' ? 'bg-red-100 text-red-700' :
                      u.role === 'Member' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (currentPage === 'login') return <LoginPage />

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'announcements' && <AnnouncementsPage />}
        {currentPage === 'events' && <EventsPage />}
        {currentPage === 'resources' && <ResourcesPage />}
        {currentPage === 'admin' && <AdminConsole />}
      </div>
      <AIPanel />
    </div>
  )
}
