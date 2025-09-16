import { useState, useEffect } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          🚀 k8s-manifest-showcase
        </h1>

        {/* 여기에 프로젝트별 컨텐츠 추가 */}
        {/* Adding a comment to trigger a new push */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
          <p className="text-white text-center">
            Your content goes here
          </p>
        </div>
      </div>
    </div>
  )
}

export default App