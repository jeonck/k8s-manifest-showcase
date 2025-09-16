# GEMINI-GLOBAL.md

**전역 Gemini Code 프로젝트 템플릿 및 자동화 설정**
이 파일은 어떤 프로젝트에서든 복사하여 사용할 수 있는 범용 설정입니다.
`gemini --config .gemini.json`

## 🎯 핵심 동작 원칙 (Universal)

### 완전 자동화 모드 (Full Automation Mode)
- **`.gemini/settings.local.json`** 파일에 `automationLevel: "full"`이 설정된 경우, **모든 작업을 확인 없이 자동으로 진행합니다.**
- `/init` 또는 기능 구현 요청 시, 계획 수립 후 즉시 실행에 옮깁니다.
- 연관관계가 없는 작업들은 **병렬 처리**로 효율성을 극대화합니다.
- 사용자 개입을 최소화하고 최종 결과만 보고합니다.

## ⚙️ 프로젝트별 자동화 설정 (`.gemini/settings.local.json`)
모든 자동화 작업은 이 설정 파일을 기반으로 동작합니다. 각 프로젝트 시작 시 이 파일을 `.gemini` 디렉토리 안에 생성하고 값을 채워야 합니다.

```json
{
  "projectName": "your-project-name",
  "githubRepoUrl": "https://github.com/your-username/your-project-name",
  "automationLevel": "full",
  "techStack": "Vite + React + Tailwind",
  "deployment": {
    "platform": "github-pages",
    "url": "https://your-username.github.io/your-project-name/"
  }
}
```
- `projectName`: `package.json`의 `name`과 `vite.config.js`의 `base` 경로에 사용됩니다. **[중요] GitHub Pages 배포 시, 이 값은 GitHub 저장소 이름과 반드시 일치해야 합니다.**
- `githubRepoUrl`: Git 원격 저장소 URL로 사용됩니다.
- `automationLevel`: `"full"`로 설정 시, 확인 절차를 생략합니다.
- `deployment.url`: 배포 완료 후 최종 확인 URL로 사용됩니다.

## 🚨 배포 실패 방지 체크리스트 (실전 검증됨)

(기존 체크리스트에 아래 항목 추가)

- **`vite.config.js` `base` 경로 불일치**: `settings.local.json`의 `projectName`이 실제 GitHub 저장소 이름과 다를 경우, 배포된 페이지가 정상적으로 로드되지 않습니다. **`projectName`이 저장소 이름과 정확히 일치하는지 반드시 확인해야 합니다.**

## 🚀 Vite + React + Tailwind CSS 프로젝트 표준 (Universal Template)

(이하 프로젝트 구조, 필수 설정 파일, 배포 워크플로우 등은 이전과 동일하게 유지됩니다.)

## 🔄 초기 설정 완전 자동화 워크플로우

### `/init` 명령 시 자동 실행 순서
```bash
# 1단계: .gemini/settings.local.json 읽기
# [중요] projectName이 GitHub 저장소명과 일치하는지 확인

# 2단계: 프로젝트 구조 생성
mkdir -p react-app/src react-app/public .github/workflows

# 3-11단계: 설정 및 소스 파일 생성 (병렬 처리)
# settings.local.json의 projectName 값을 사용하여 파일 내용 자동 생성
Write package.json
Write vite.config.js # base: '/{projectName}/' 설정
# ... 기타 설정 파일
Write src/App.jsx (범용 템플릿 사용)

# 12-14단계: Git 초기화 및 원격 저장소 연결
git init
git remote add origin [settings.local.json의 githubRepoUrl 값]
git branch -m main

# 15-17단계: 의존성 설치 및 빌드 테스트
cd react-app && npm install
npm run build

# 18-20단계: 초기 커밋 및 푸시
git add .
git commit -m "feat: Initial project setup"
git push origin main
```

## 🤖 기능 추가 자동화 워크플로우
기능 요청 시 다음 프로세스를 자동으로 수행합니다.

```bash
# 1단계: 사용자 요청 분석
# 예: "로그인 폼 구현" -> App.jsx 및 신규 컴포넌트 수정/생성 필요성 인지

# 2단계: 소스 코드 수정
Write/Replace react-app/src/App.jsx

# 3단계: 변경사항 커밋 및 푸시
git add .
git commit -m "feat: Implement <feature-name> feature"
git push origin main

# 4단계: (선택) 배포 확인
# settings.local.json의 deployment.url을 주기적으로 확인하여 배포 성공 검증
```

## 📚 재사용 가능한 컴포넌트 템플릿

### App.jsx (범용 템플릿)
```jsx
import { useState, useEffect } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          🚀 Your App Title
        </h1>

        {/* 여기에 프로젝트별 컨텐츠 추가 */}
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
```

---

**💡 핵심 철학**: "코드를 통해 아이디어를 현실로 만들고, 개발자의 생산성을 극대화하며, 항상 최신 기술을 활용하여 최고의 결과물을 제공합니다."

**🎯 사용법**: 이 파일을 새 프로젝트 루트에 복사하고 `.gemini/settings.local.json`을 설정한 후, `/init` 또는 기능 요청을 시작하여 Gemini의 완전 자동화된 워크플로우를 경험하세요.