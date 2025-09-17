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
- `/init` 또는 기능 구현 요청 시, 계획 수pr립 후 즉시 실행에 옮깁니다.
- 모든 코드 수정, 커밋, 푸시 작업은 별도의 확인 절차 없이 즉시 실행됩니다. 사용자의 개입을 최소화하고 빠른 개발 속도를 보장합니다.
- 연관관계가 없는 작업들은 **병렬 처리**로 효율성을 극대화합니다.

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
- `automationLevel`: `"full"`로 설정 시, 확인 절차를 생략하고 모든 커밋/푸시를 자동으로 진행합니다.
- `deployment.url`: 배포 완료 후 최종 확인 URL로 사용됩니다.

## 🚨 배포 실패 방지 체크리스트 (실전 검증됨)

- **`vite.config.js` `base` 경로 불일치**: `settings.local.json`의 `projectName`이 실제 GitHub 저장소 이름과 다를 경우, 배포된 페이지가 정상적으로 로드되지 않습니다. **`projectName`이 저장소 이름과 정확히 일치하는지 반드시 확인해야 합니다.**
- **Vite 정적 파일 경로 오류**: `public` 폴더의 파일을 코드에서 `fetch` 등으로 참조할 때, 배포 환경의 기본 경로(base path)를 고려해야 합니다. `fetch('/data/file.json')` 대신 `fetch(`${import.meta.env.BASE_URL}data/file.json`)`과 같이 Vite의 환경 변수를 사용하여 절대 경로를 만들어주세요.
- **구식 배포 워크플로우 사용**: `peaceiris/actions-gh-pages`와 같은 액션 대신, GitHub의 공식 `actions/deploy-pages`를 사용하는 최신 워크플로우를 적용하세요. 이 방식은 별도 브랜치 관리가 필요 없으며 더 안정적입니다.
- **저장소 설정**: 배포 워크플로우 실행 전, 저장소의 **Settings > Pages**에서 "Build and deployment" 소스를 **"GitHub Actions"**로 설정했는지 확인하세요.

## 🚀 표준 GitHub Pages 배포 워크플로우 (`.github/workflows/deploy.yml`)
(내용은 이전과 동일하게 유지)

## 🔄 초기 설정 완전 자동화 워크플로우
(내용은 이전과 동일하게 유지)

## 🤖 기능 추가 자동화 워크플로우
기능 요청 시 다음 프로세스를 자동으로 수행합니다.

```bash
# 1단계: 사용자 요청 분석 및 필요 라이브러리 파악
# 예: "YAML 변환 기능 추가" -> 'js-yaml' 라이브러리 필요성 인지

# 2단계: (필요시) 신규 라이브러리 설치
cd react-app && npm install <library-name> --save

# 3단계: 소스 코드 수정
Write/Replace react-app/src/App.jsx

# 4단계: 변경사항 커밋 및 푸시 (package.json, package-lock.json 포함)
git add .
git commit -m "feat: Implement <feature-name> feature"
git push origin main

# 5단계: (선택) 배포 확인
# settings.local.json의 deployment.url을 주기적으로 확인하여 배포 성공 검증
```

## 📚 재사용 가능한 컴포넌트 템플릿
(내용은 이전과 동일하게 유지)
