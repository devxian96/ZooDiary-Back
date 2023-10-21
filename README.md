# zoodiary-back

반려동물의 일상 기록 및 공유

## 프로젝트 실행

```bash
bun install
bun dev
```

> 이 프로젝트는 bun v1.0.3. [Bun](https://bun.sh) 을 사용하여 개발이 되었습니다.

zoodiary-front(https://github.com/brom5033/ZooDiary)  
위 프로젝트는 프론트 프로젝트로,
zoodiary-back 레포와 함께 실행해야합니다.

## 기능

- JWT 로그인, 회원가입
- 게시판 CRUD
- 이미지 업로드

## 의존성

- bun
- eslint
- prettier
- commitlint
- husky
- lint-staged
- Prisma
- rand-token
- jsonwebtoken
- multer
- dotenv
- cors

## 코드 스타일

### `commitlint`

```
feat        새로운 기능을 제공합니다.
fix         버그 수정.
docs        문서만 변경됩니다.
style       코드 작동에 영향을 미치지 않는 스타일 변경(빈 공간, 코드 포멧팅, 누락된 세미콜론 등)
refactor    버그를 수정하거나 기능을 추가하지 않는 코드 변경입니다.
test        테스트 코드를 추가하거나 기존 테스트 코드를 수정합니다.
chore       빌드 프로세스 또는 보조 도구 및 라이브러리(예: 문서 생성)에 대한 변경 사항.
perf        성능을 향상시키는 코드 변경입니다.
ci          CI 구성 파일 및 스크립트의 변경 사항.
build       빌드 시스템 또는 외부 디펜던시에 영향을 미치는 변경 사항(예: gulp, broccli, npm).
temp        변경사항에 포함되지 않는 임시 커밋입니다.
```
