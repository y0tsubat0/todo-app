# Todo App

이 프로젝트는 [Next.js](https://nextjs.org) 애플리케이션으로, 모던 웹 기술을 활용한 투두 리스트 관리 애플리케이션입니다.

## 기술 스택

- **프론트엔드**: Next.js 14, React 18
- **스타일링**: Tailwind CSS, Shadcn UI, Radix UI
- **상태 관리**: Zustand
- **백엔드/데이터베이스**: Supabase
- **인증**: Supabase Auth

## 프로젝트 구조

```
src/
├── app/               # Next.js App Router 구조
│   ├── page.js        # 메인 페이지
│   ├── layout.js      # 앱 레이아웃
│   ├── auth/          # 인증 관련 페이지
│   ├── api/           # API 라우트
│   └── globals.css    # 전역 스타일
├── components/        # 재사용 가능한 컴포넌트
│   ├── AuthForm.jsx   # 인증 폼 컴포넌트
│   ├── Navbar.js      # 네비게이션 바
│   ├── TodoList.js    # 할 일 리스트 컴포넌트
│   ├── TodoItem.jsx   # 개별 할 일 아이템 컴포넌트
│   ├── TodoForm.jsx   # 할 일 추가 폼
│   └── ui/            # UI 컴포넌트 (Shadcn)
├── store/             # Zustand 상태 관리
├── lib/               # 유틸리티 및 헬퍼 함수
└── data/              # 데이터 모델 및 API 클라이언트
```

## 기능

- 사용자 인증 (로그인/회원가입)
- 할 일 추가, 수정, 삭제
- 할 일 완료 상태 토글
- 사용자별 할 일 데이터 저장

## 시작하기

### 선행 조건

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/todo-app.git
cd todo-app

# 의존성 설치
npm install
# 또는
yarn install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
# 또는
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드 및 프로덕션 실행

```bash
# 프로덕션 빌드
npm run build
# 또는
yarn build

# 프로덕션 서버 실행
npm run start
# 또는
yarn start
```

## 배포

이 프로젝트는 [Vercel Platform](https://vercel.com)을 통해 쉽게 배포할 수 있습니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참조하세요.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
