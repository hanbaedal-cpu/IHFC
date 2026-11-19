# 근로복지공단 인천병원 장례식장 홈페이지 (IHFC)

Next.js + MongoDB + Render 배포용 장례식장 홈페이지입니다.

## 주요 기능

- 공개 홈페이지 (소개, 시설, 이용안내, 빈소현황, 오시는 길, 상담 신청)
- 관리자 로그인 후 홈페이지 관리 메뉴
  - 홈페이지 문구 관리
  - 상담 신청 리스트
  - 문자 메시지 개인/단체 발송 (Solapi, 키 없으면 모의 발송)
  - 빈소 등록 + 달력 일정표
  - 추모글 관리
- 방문객 추모글 작성
- 빈소 이용객(유가족) 계정으로 추모글 조회 및 PDF 다운로드

## 로컬 실행

1. MongoDB 준비 (로컬 또는 Atlas)
2. `.env.local` 설정 (`.env.example` 참고)
3. 설치 및 실행

```bash
npm install
npm run seed
npm run dev
```

- 사이트: http://localhost:3000
- 관리자: http://localhost:3000/admin/login
- 기본 관리자: `ADMIN_USERNAME` / `ADMIN_PASSWORD` (기본 admin / admin1234)

## Render 배포

1. GitHub에 푸시
2. Render Web Service 생성 후 저장소 연결
3. 환경변수 등록: `MONGODB_URI`, `AUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
4. (선택) Solapi: `SOLAPI_API_KEY`, `SOLAPI_API_SECRET`, `SOLAPI_SENDER`
5. 배포 후 `xxx.onrender.com`으로 접속
6. 도메인 구매 후 Render Custom Domain 연결

`render.yaml`을 Blueprint로 사용할 수 있습니다.

## 문자 발송

Solapi 계정과 발신번호 사전등록이 필요합니다. 키가 없으면 실제 발송 없이 로그에 모의 발송으로 기록됩니다.

## 유가족 계정

관리자가 빈소를 등록하면 유가족 전용 아이디/비밀번호가 자동 발급됩니다.
유가족은 `/guest/login`에서 로그인해 추모글 리스트를 보고 PDF로 저장할 수 있습니다.
