# GEMINI-GLOBAL.md

**전역 Gemini Code 프로젝트 템플릿 및 자동화 설정**
이 파일은 어떤 프로젝트에서든 복사하여 사용할 수 있는 범용 설정입니다.
`gemini --config .gemini.json`

## ⚠️ 버전 관리 제외 (.gitignore)
`GEMINI.md` 파일과 `.gemini` 디렉토리는 Gemini의 로컬 자동화 및 설정을 위한 파일입니다. 프로젝트의 소스 코드와는 무관하므로 Git 버전 관리에서 제외해야 합니다.

프로젝트 루트의 `.gitignore` 파일에 다음 내용을 추가하세요.

```gitignore
# Gemini-specific files
GEMINI.md
.gemini/
```

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

- **`vite.config.js` `base` 경로 불일치**: `settings.local.json`의 `projectName`이 실제 GitHub 저장소 이름과 다를 경우, 배포된 페이지가 정상적으로 로드되지 않습니다. **`projectName`이 저장소 이름과 정확히 일치하는지 반드시 확인해야 합니다.**
- **구식 배포 워크플로우 사용**: `peaceiris/actions-gh-pages`와 같은 액션 대신, GitHub의 공식 `actions/deploy-pages`를 사용하는 최신 워크플로우를 적용하세요. 이 방식은 별도 브랜치 관리가 필요 없으며 더 안정적입니다.
- **저장소 설정**: 배포 워크플로우 실행 전, 저장소의 **Settings > Pages**에서 "Build and deployment" 소스를 **"GitHub Actions"**로 설정했는지 확인하세요.

## 🚀 표준 GitHub Pages 배포 워크플로우 (`.github/workflows/deploy.yml`)
아래 내용을 복사하여 `.github/workflows/deploy.yml` 파일을 생성하세요.

```yaml
name: Deploy React App to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

# GITHUB_TOKEN의 권한을 설정하여 GitHub Pages에 배포할 수 있도록 합니다.
permissions:
  contents: read
  pages: write
  id-token: write

# 동시 배포를 하나만 허용하고, 진행 중인 실행과 최신 대기열 사이에 대기 중인 실행을 건너뜁니다.
# 하지만 진행 중인 실행은 프로덕션 배포가 완료되도록 취소하지 않습니다.
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        # 'react-app' 디렉토리로 이동하여 npm install 실행
        run: cd react-app && npm install
      - name: Build
        # 'react-app' 디렉토리로 이동하여 npm run build 실행
        run: cd react-app && npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # './react-app/dist' 디렉토리 업로드
          path: ./react-app/dist

  deploy:
    # 'build' 작업이 성공적으로 완료되어야 실행됩니다.
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 🔄 초기 설정 완전 자동화 워크플로우

### `/init` 명령 시 자동 실행 순서
```bash
# 1단계: .gemini/settings.local.json 읽기
# [중요] projectName이 GitHub 저장소명과 일치하는지 확인

# 2단계: 프로젝트 구조 생성
mkdir -p react-app/src react-app/public .github/workflows

# 3단계: 설정 및 소스 파일 생성 (병렬 처리)
# settings.local.json의 projectName 값을 사용하여 파일 내용 자동 생성
Write .gitignore # Gemini 관련 파일 제외
Write package.json
Write vite.config.js # base: '/{projectName}/' 설정
Write .github/workflows/deploy.yml # 표준 GitHub Pages 배포 워크플로우 사용
# ... 기타 설정 파일
Write src/App.jsx (범용 템플릿 사용)

# 4단계: Git 초기화 및 원격 저장소 연결
git init
git remote add origin [settings.local.json의 githubRepoUrl 값]
git branch -m main

# 5단계: 의존성 설치 및 빌드 테스트
cd react-app && npm install
npm run build

# 6단계: 초기 커밋 및 푸시
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
