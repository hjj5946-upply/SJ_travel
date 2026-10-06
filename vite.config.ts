import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages로 배포할 때는 저장소 이름으로 base를 맞춰야 함 (예: '/SJ_travel/').
  // 나중에 실제 GitHub 저장소 이름이 정해지면 이 값을 '/저장소이름/' 으로 바꿔주세요.
  base: '/SJ_travel/',
  // 같은 와이파이의 폰에서도 접속할 수 있게 외부 접속 허용 (npm run dev 시 Network 주소 출력)
  server: { host: true },
})
