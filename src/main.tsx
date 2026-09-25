import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// GitHub Pages는 별도 서버 라우팅 설정이 없는 정적 호스팅이라
// 새로고침 시 404가 나지 않도록 HashRouter(#/trips/...)를 사용합니다.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
