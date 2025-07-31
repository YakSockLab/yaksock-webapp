# 약속(YakSock) - 약물 상호작용 검사 웹앱

약과 약 사이 안 맞는 조합을 알려주는 스마트한 약물 안전성 검사 서비스입니다.

## 📱 주요 기능

### 🔍 사진 기반 약물 인식

- 약 포장지나 처방전 사진을 업로드하여 자동으로 약물명 추출
- OCR 기술을 활용한 정확한 텍스트 인식
- 최대 2장의 사진 동시 업로드 지원

### 🧬 성분 분석 및 상호작용 검사

- 약물명을 기반으로 성분 정보 자동 조회
- DUR(Drug Utilization Review) 시스템을 통한 상호작용 검사
- AI 기반 자연어 해석으로 이해하기 쉬운 결과 제공

### ✏️ 수동 입력 및 편집

- OCR 결과 확인 및 수정 기능
- 약물 추가/삭제/편집 인터페이스
- 직관적인 탭 기반 UI로 여러 약물 그룹 관리

### 📊 상세한 결과 리포트

- 상호작용이 발견된 약물 조합 시각화
- 주의사항 및 복용 가이드 제공
- 아코디언 형태의 상세 정보 표시

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Framework**: Tailwind CSS, shadcn/ui
- **상태 관리**: React Hooks (useState, useEffect)
- **이미지 처리**: Next.js Image 컴포넌트
- **API 통신**: Axios API
- **개발 도구**: Prettier, ESLint, TypeScript

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- pnpm

### 설치 및 실행

1. 저장소 클론

```bash
git clone https://github.com/YakSockLab/yaksock-webapp.git
cd yaksock-webapp
```

2. 의존성 설치

```bash
pnpm i
pnpm approve-builds # -a -y
```

3. 개발 서버 실행

```bash
pnpm run dev
```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드 및 배포

```bash
# 프로덕션 빌드
pnpm run build

# 빌드된 앱 실행
pnpm start
```

## 📁 프로젝트 구조

```
yaksock-webapp/
├── app/
│   ├── globals.css         # 전역 스타일
│   ├── layout.tsx          # 전체 레이아웃 컴포넌트
│   └── page.tsx            # 메인 애플리케이션 컴포넌트
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트들
│   └── splash-screen.tsx   # 스플래시 화면 컴포넌트
├── hooks/
│   └── use-privacy-consent.ts  # 개인정보 동의 관리 훅
├── public/
│   ├── mascot.svg          # 약속 마스코트 이미지
│   └── ...                 # 기타 정적 파일들
├── .prettierrc             # Prettier 설정
├── next.config.mjs         # Next.js 설정
├── tailwind.config.ts      # Tailwind CSS 설정
└── package.json
```

## 🔧 API 엔드포인트

애플리케이션은 다음 API 엔드포인트들을 사용합니다:

- `POST /api/upload-image` - 이미지 업로드
- `POST /api/ocr-extract` - OCR을 통한 텍스트 추출
- `POST /api/drug-to-ingredient` - 약물명을 성분으로 변환
- `POST /api/check-drug-interaction` - 약물 상호작용 검사
- `POST /api/llm-interpretation` - AI 기반 결과 해석

## 📱 화면 구성

### 1. 홈 화면

- 서비스 소개 및 시작 버튼
- 개인정보 처리방침 링크

### 2. 사진 업로드 화면

- 드래그 앤 드롭 또는 클릭으로 이미지 업로드
- 최대 2장까지 업로드 가능
- JPG/PNG 형식, 10MB 이하 제한

### 3. OCR 로딩 화면

- 약물명 추출 진행 상황 표시
- 로딩 애니메이션

### 4. 수동 입력 화면

- OCR 결과 확인 및 수정
- 약물 추가/삭제/편집 기능
- 탭 기반 인터페이스

### 5. DUR 로딩 화면

- 성분 분석 및 상호작용 검사 진행 상황
- 단계별 진행 표시

### 6. 결과 화면

- 상호작용 검사 결과 표시
- 주의사항 및 상세 정보 제공
- 아코디언 형태의 상세 보기

## 🎨 디자인 시스템

### 반응형 디자인

- 모바일 우선 설계
- 가로/세로 모드 지원
- 동적 폰트 크기 조정

## 🔒 개인정보 보호

- 로컬 스토리지를 통한 동의 상태 관리
- 전송된 이미지는 분석 이후 즉시 폐기
- 개인정보 처리방침 및 이용약관 제공

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feat/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feat/amazing-feature`)
5. Pull Request를 생성합니다

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**약속(YakSock)** - 안전한 복약을 위한 스마트한 선택 🏥💊
