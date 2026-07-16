# ANKI-HELPER

AI 기반 일본어 어휘 카드 생성 서비스. 단어를 입력하면 Amazon Bedrock이 카드 데이터를 생성하고, Amazon Polly가 음성을 합성하여, AnkiConnect를 통해 로컬 Anki에 저장한다.

## 프로젝트 구조
https://d1mqc9eqoybz0l.cloudfront.net/cards

```
anki-helper/
├─ frontend/          # React + TypeScript + Vite
├─ backend/           # Java 21 + Maven + Lambda
├─ infra/             # Terraform
├─ docs/              # 설계 문서 (스펙, 요구사항, 제약사항)
└─ .github/workflows/ # CI/CD
```

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프런트엔드 | React 19, TypeScript, Vite 8, Tailwind CSS |
| 백엔드 | Java 21, Maven, AWS Lambda |
| 인증 | Amazon Cognito |
| API | Amazon API Gateway |
| 데이터 | Amazon DynamoDB |
| AI | Amazon Bedrock |
| 음성 | Amazon Polly |
| Anki 연동 | AnkiConnect (localhost:8765) |
| 인프라 | Terraform |
| CI/CD | GitHub Actions (OIDC) |
| 모니터링 | Amazon CloudWatch |

## 로컬 개발

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
mvn clean package
```

### Terraform

```bash
cd infra
terraform init
terraform plan
```

## 문서

- [스펙 요구 정의서](docs/01-spec-overview-anki-helper.md)
- [요구사항 정의서](docs/02-requirements-anki-helper.md)
- [제약사항 정의서](docs/03-constraints-anki-helper.md)
- [디자인 참고](docs/DESIGN-apple.md)
