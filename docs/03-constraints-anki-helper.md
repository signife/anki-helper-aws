# ANKI-HELPER 제약사항 정의서

## 1. 문서 목적

본 문서는 AWS 기반 AI 어휘 카드 생성 서비스 **ANKI-HELPER**를 개발하고 운영할 때 반드시 준수해야 하는 기술적, 구조적, 인증·보안, 생성형 AI, 음성 합성, 데이터 관리, AnkiConnect 연동, 성능, 비용, 배포 및 MVP 범위상의 제약사항을 정의한다.

프로젝트의 목적, 사용자 구분 및 전체 서비스 범위는 `01-spec-overview-anki-helper.md`에서 정의한다.

기능적·비기능적 요구사항은 `02-requirements-anki-helper.md`에서 정의한다.

본 문서는 다음 구성을 전제로 한다.

```text
React + TypeScript
    ↓
Amazon S3 + Amazon CloudFront
    ↓
사용자 브라우저
    ├─ Amazon Cognito
    ├─ Amazon API Gateway
    │      ↓
    │   AWS Lambda
    │      ├─ Amazon Bedrock
    │      ├─ Amazon Polly
    │      └─ Amazon DynamoDB
    │
    └─ http://localhost:8765
           ↓
       AnkiConnect
           ↓
       사용자 로컬 Anki
```

---

## 2. 제약사항 ID 체계

| 접두어 | 구분 |
|---|---|
| `CON_TECH` | 기술 환경 제약사항 |
| `CON_ARCH` | 시스템 구조 제약사항 |
| `CON_FRONT` | 프런트엔드 제약사항 |
| `CON_AUTH` | Cognito 인증 및 계정 제약사항 |
| `CON_API` | API Gateway 및 Lambda 제약사항 |
| `CON_BEDROCK` | Amazon Bedrock 제약사항 |
| `CON_POLLY` | Amazon Polly 제약사항 |
| `CON_DDB` | Amazon DynamoDB 제약사항 |
| `CON_ANKI` | AnkiConnect 및 로컬 연동 제약사항 |
| `CON_CARD` | 카드 데이터·노트 타입·템플릿 제약사항 |
| `CON_USAGE` | 사용량 및 비용 통제 제약사항 |
| `CON_PER` | 성능 제약사항 |
| `CON_SEC` | 일반 보안 제약사항 |
| `CON_PRIV` | 개인정보 및 데이터 보호 제약사항 |
| `CON_UI` | 브라우저·화면·접근성 제약사항 |
| `CON_OBS` | 로그·모니터링·알람 제약사항 |
| `CON_IAC` | Terraform 및 인프라 제약사항 |
| `CON_CICD` | CI/CD 제약사항 |
| `CON_OPS` | 배포·운영·장애 대응 제약사항 |
| `CON_SCOPE` | MVP 업무 범위 제약사항 |
| `CON_DEV` | 개발 원칙 및 코드 품질 제약사항 |
| `CON_TEST` | 테스트 제약사항 |

---

# 3. 기술 환경 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_TECH_001 | 프런트엔드는 React와 TypeScript를 사용한다. |
| CON_TECH_002 | 프런트엔드 빌드 도구는 Vite를 사용하며, Node.js·Vite 및 주요 플러그인 버전을 프로젝트에서 고정한다. |
| CON_TECH_003 | Lambda 백엔드의 기본 개발 언어는 Java 21로 한다. |
| CON_TECH_004 | Java Lambda는 Spring Boot를 사용하지 않고 AWS Lambda Handler 중심의 경량 구조로 구현한다. |
| CON_TECH_005 | Java 빌드 및 의존성 관리는 Maven을 사용한다. |
| CON_TECH_006 | AWS 서비스 연동에는 AWS SDK for Java 2.x를 사용한다. |
| CON_TECH_007 | 프런트엔드와 백엔드의 문자 인코딩은 UTF-8로 통일한다. |
| CON_TECH_008 | API 요청 및 응답의 기본 데이터 형식은 JSON으로 한다. |
| CON_TECH_009 | 음성 데이터는 요구되는 응답 방식에 따라 바이너리 또는 Base64로 전달하되 카드 JSON과 무조건 하나의 대형 응답으로 묶지 않는다. |
| CON_TECH_010 | React 정적 파일은 Amazon S3에 배포하고 Amazon CloudFront를 통해 제공한다. |
| CON_TECH_011 | 백엔드 공개 진입점은 Amazon API Gateway를 사용한다. |
| CON_TECH_012 | 백엔드 실행 환경은 AWS Lambda를 사용한다. |
| CON_TECH_013 | 회원가입, 이메일 인증, 로그인 및 비밀번호 재설정에는 Amazon Cognito User Pool을 사용한다. |
| CON_TECH_014 | 사용자 프로필, 설정, 카드 수집함, 카드 상태 및 사용량 저장에는 Amazon DynamoDB를 사용한다. |
| CON_TECH_015 | 일본어 카드 데이터 생성에는 Amazon Bedrock을 사용한다. |
| CON_TECH_016 | 일본어 음성 합성에는 Amazon Polly를 사용한다. |
| CON_TECH_017 | 운영 로그와 기본 지표 및 알람에는 Amazon CloudWatch를 사용한다. |
| CON_TECH_018 | 인프라 구성에는 Terraform을 사용한다. |
| CON_TECH_019 | CI/CD에는 GitHub Actions를 사용한다. |
| CON_TECH_020 | 사용자의 로컬 Anki 연동에는 Anki Desktop과 AnkiConnect를 사용한다. |
| CON_TECH_021 | 네이티브 Android 및 iOS 애플리케이션은 MVP에서 개발하지 않는다. |
| CON_TECH_022 | 로컬 AivisSpeech는 AWS 버전의 필수 구성요소로 사용하지 않는다. |
| CON_TECH_023 | 별도의 관계형 데이터베이스를 사용하지 않는다. |
| CON_TECH_024 | Amazon RDS, MySQL, JPA 및 Hibernate를 MVP 기술 스택에 포함하지 않는다. |
| CON_TECH_025 | Amazon ElastiCache for Redis를 MVP 기술 스택에 포함하지 않는다. |
| CON_TECH_026 | EC2, Application Load Balancer 및 Auto Scaling Group을 MVP 실행 환경에 포함하지 않는다. |
| CON_TECH_027 | Docker와 Amazon ECR을 Lambda 배포의 필수 구성요소로 사용하지 않는다. |
| CON_TECH_028 | 별도의 Jenkins 서버를 상시 실행하지 않는다. |
| CON_TECH_029 | AWS 서비스의 실제 지원 리전, 모델 및 음성 목록은 배포 시점의 공식 지원 범위 안에서 선택한다. |
| CON_TECH_030 | 특정 Bedrock 모델이나 Polly 음성이 변경되더라도 코드 전체 수정 없이 설정을 교체할 수 있어야 한다. |

---

# 4. 시스템 구조 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_ARCH_001 | 시스템은 정적 프런트엔드, 인증, API, AI 생성, 음성 생성, 데이터 저장 및 로컬 Anki 연동 영역을 분리한다. |
| CON_ARCH_002 | React는 화면 처리와 사용자 상호작용 및 로컬 AnkiConnect 호출을 담당한다. |
| CON_ARCH_003 | API Gateway는 공개 API 진입점, 라우팅, JWT 검증 및 요청 제한의 일부를 담당한다. |
| CON_ARCH_004 | Lambda는 입력 검증, 권한 확인, 비즈니스 규칙, Bedrock·Polly 호출 및 DynamoDB 접근을 담당한다. |
| CON_ARCH_005 | Cognito는 비밀번호 저장, 이메일 인증, 로그인 및 JWT 발급을 담당한다. |
| CON_ARCH_006 | DynamoDB는 회원별 클라우드 데이터와 사용량을 저장하고 로컬 Anki 데이터 자체를 대체하지 않는다. |
| CON_ARCH_007 | AWS 백엔드는 사용자의 로컬 AnkiConnect에 직접 접속하지 않는다. |
| CON_ARCH_008 | AnkiConnect 호출은 사용자의 PC에서 실행되는 브라우저 JavaScript가 수행한다. |
| CON_ARCH_009 | `localhost`는 요청을 실행하는 기기를 의미하므로 Lambda에서 `localhost:8765`를 호출하지 않는다. |
| CON_ARCH_010 | 카드 생성과 카드 저장 API는 특정 Lambda 실행 환경의 메모리 상태에 의존하지 않는 Stateless 구조로 구현한다. |
| CON_ARCH_011 | 로그인 상태를 EC2 메모리나 Redis 세션에 저장하지 않는다. |
| CON_ARCH_012 | 회원 전용 API의 사용자 식별은 검증된 Cognito JWT의 `sub` 값을 기준으로 한다. |
| CON_ARCH_013 | 클라이언트가 요청 본문에 보낸 사용자 ID를 데이터 소유권 판정에 사용하지 않는다. |
| CON_ARCH_014 | Bedrock, Polly, DynamoDB 및 Cognito 연동 코드는 서비스 또는 Client·Adapter 계층으로 분리한다. |
| CON_ARCH_015 | 외부 AWS 서비스 요청·응답 모델을 React 화면 모델 및 내부 카드 모델과 직접 결합하지 않는다. |
| CON_ARCH_016 | Bedrock 원본 응답은 내부 카드 DTO로 변환하고 검증한 뒤 사용한다. |
| CON_ARCH_017 | Polly 원본 응답은 내부 음성 응답 모델로 변환한 뒤 클라이언트에 전달한다. |
| CON_ARCH_018 | 카드 생성과 음성 생성을 별도 API 또는 별도 처리 단계로 분리할 수 있는 구조를 유지한다. |
| CON_ARCH_019 | 모바일 단어 수집 시 Polly 음성을 미리 생성하거나 장기 저장하지 않는다. |
| CON_ARCH_020 | 음성은 사용자가 미리듣기 또는 Anki 추가를 요청할 때 지연 생성한다. |
| CON_ARCH_021 | 일부 음성 생성 실패가 텍스트 카드 전체를 삭제하거나 무효화하지 않도록 한다. |
| CON_ARCH_022 | Anki 추가 성공 후 DynamoDB 상태 갱신이 실패할 수 있는 분산된 부분 성공 상황을 고려한다. |
| CON_ARCH_023 | `ADDED` 상태는 클라이언트가 AnkiConnect 성공을 보고한 상태이며 AWS가 로컬 Anki를 독립적으로 검증한 결과로 간주하지 않는다. |
| CON_ARCH_024 | 프런트엔드 배포와 Lambda 배포는 서로 독립적으로 수행할 수 있어야 한다. |
| CON_ARCH_025 | 개발 환경과 운영 환경의 Cognito, DynamoDB, API Gateway 및 Lambda 리소스를 분리한다. |
| CON_ARCH_026 | 서비스 확장 전까지 VPC, Private Subnet 및 NAT Gateway에 Lambda를 연결하지 않는다. |
| CON_ARCH_027 | VPC 연결이 필요한 기능을 도입하는 경우 비용, 콜드 스타트 및 네트워크 의존성을 별도로 검토한다. |
| CON_ARCH_028 | 관리형 AWS 서비스를 우선 사용하고 서버 운영이 필요한 구성요소의 도입을 최소화한다. |

---

# 5. 프런트엔드 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_FRONT_001 | React 애플리케이션은 SPA 방식으로 구현한다. |
| CON_FRONT_002 | 정적 산출물 이외의 서버 코드를 S3에 배포하지 않는다. |
| CON_FRONT_003 | S3 버킷은 직접 웹 공개하지 않고 CloudFront Origin으로만 사용한다. |
| CON_FRONT_004 | CloudFront와 S3 사이에는 Origin Access Control 또는 동등한 비공개 접근 방식을 적용한다. |
| CON_FRONT_005 | S3 Public Access Block을 활성화한다. |
| CON_FRONT_006 | SPA 내부 경로 접근 시 `index.html`로 연결되는 오류 응답 또는 라우팅 정책을 구성한다. |
| CON_FRONT_007 | 파일명이 해시된 JavaScript·CSS 정적 자산에는 장기 캐시를 적용할 수 있다. |
| CON_FRONT_008 | `index.html`에는 새 배포가 지연되지 않도록 짧은 캐시 또는 재검증 정책을 적용한다. |
| CON_FRONT_009 | React 코드에 AWS Access Key, Secret Key, Terraform 변수 원문 및 서버용 비밀정보를 포함하지 않는다. |
| CON_FRONT_010 | 프런트엔드 환경변수는 브라우저 사용자에게 공개될 수 있는 값만 포함한다. |
| CON_FRONT_011 | Cognito App Client를 SPA에서 사용하는 경우 Client Secret을 사용하지 않는다. |
| CON_FRONT_012 | API 기본 URL, Cognito 식별값 및 CloudFront 도메인은 환경별 설정으로 분리한다. |
| CON_FRONT_013 | 로그인 토큰을 URL Query String이나 Hash에 장기간 노출하지 않는다. |
| CON_FRONT_014 | 토큰 저장과 갱신은 검증된 Cognito 클라이언트 라이브러리 또는 명시적으로 검토한 인증 모듈을 사용한다. |
| CON_FRONT_015 | JWT, 비밀번호, 인증 코드 및 전체 카드 데이터를 브라우저 콘솔에 출력하지 않는다. |
| CON_FRONT_016 | 브라우저 `localStorage`에는 AnkiConnect URL, 테마 등 기기별 비민감 설정만 저장한다. |
| CON_FRONT_017 | 사용자 계정 공통 설정의 기준 저장소는 DynamoDB로 한다. |
| CON_FRONT_018 | 카드 미리보기에서 AI가 생성한 HTML을 `dangerouslySetInnerHTML`로 무검증 출력하지 않는다. |
| CON_FRONT_019 | 허용된 ruby 관련 태그를 제외한 위험한 HTML과 이벤트 속성을 제거한다. |
| CON_FRONT_020 | React에서 Bedrock 및 Polly AWS SDK를 직접 호출하지 않는다. |
| CON_FRONT_021 | Bedrock·Polly 호출용 임시 AWS 자격증명을 브라우저에 발급하지 않는다. |
| CON_FRONT_022 | AnkiConnect 요청 모듈은 일반 AWS API 요청 모듈과 분리한다. |
| CON_FRONT_023 | AnkiConnect URL은 기본적으로 `http://localhost:8765`를 사용하되 사용자가 기기별로 변경할 수 있다. |
| CON_FRONT_024 | Anki 추가 버튼은 로컬 AnkiConnect 연결 확인 후 활성화하는 것을 원칙으로 한다. |
| CON_FRONT_025 | 브라우저 뒤로가기 또는 재렌더링으로 카드 생성과 Anki 추가가 자동 재실행되지 않도록 한다. |
| CON_FRONT_026 | 비동기 요청에는 오래된 응답이 최신 화면을 덮어쓰지 않도록 요청 식별 또는 취소 처리를 적용한다. |
| CON_FRONT_027 | 여러 카드 일괄 추가 중 페이지 이탈 시 미완료 작업이 존재함을 안내한다. |
| CON_FRONT_028 | 모바일 환경에서는 카드 생성·저장 기능과 로컬 Anki 추가 기능의 차이를 명확히 표시한다. |
| CON_FRONT_029 | 생성된 음성 Object URL은 사용 후 해제한다. |
| CON_FRONT_030 | 프런트엔드 번들 크기가 불필요하게 증가하지 않도록 사용하지 않는 라이브러리를 포함하지 않는다. |

---

# 6. Cognito 인증 및 계정 제약사항

## 6.1 회원가입 및 이메일 인증

| 제약사항 ID | 제약사항 |
|---|---|
| CON_AUTH_001 | 회원가입과 인증 계정 관리는 Amazon Cognito User Pool을 사용한다. |
| CON_AUTH_002 | 로그인 식별자는 이메일 주소를 사용한다. |
| CON_AUTH_003 | 동일 Cognito User Pool에서 하나의 이메일 주소가 중복 활성 계정으로 사용되지 않도록 구성한다. |
| CON_AUTH_004 | 이메일 인증을 완료하지 않은 사용자는 회원 전용 API를 사용할 수 없다. |
| CON_AUTH_005 | 인증 코드는 Cognito가 생성하고 검증하며 애플리케이션이 별도 평문 토큰 테이블을 만들지 않는다. |
| CON_AUTH_006 | 이메일 인증 코드와 비밀번호 재설정 코드 원문을 DynamoDB에 저장하지 않는다. |
| CON_AUTH_007 | 인증 코드 원문을 CloudWatch 로그, 브라우저 콘솔 및 오류 화면에 출력하지 않는다. |
| CON_AUTH_008 | 인증 코드 재전송은 Cognito 제한과 애플리케이션의 재요청 방지 정책을 함께 고려한다. |
| CON_AUTH_009 | 사용자는 Cognito 비밀번호 정책을 만족해야 한다. |
| CON_AUTH_010 | 비밀번호 정책 값은 개발·운영 환경에서 일관되게 관리한다. |
| CON_AUTH_011 | 회원가입 화면에서 비밀번호 원문을 서버 애플리케이션 로그로 전송하지 않는다. |
| CON_AUTH_012 | 소셜 로그인은 MVP에서 제공하지 않는다. |
| CON_AUTH_013 | 전화번호 기반 회원가입과 SMS 인증은 MVP에서 제공하지 않는다. |
| CON_AUTH_014 | 사용자 표시 이름과 학습 설정은 Cognito 사용자 속성에 과도하게 저장하지 않고 DynamoDB에서 관리한다. |
| CON_AUTH_015 | Cognito에는 인증에 필요한 최소 사용자 속성만 사용한다. |

## 6.2 로그인 및 JWT

| 제약사항 ID | 제약사항 |
|---|---|
| CON_AUTH_016 | 회원 전용 API에는 API Gateway Cognito JWT Authorizer 또는 동등한 JWT 검증을 적용한다. |
| CON_AUTH_017 | JWT 서명, 발급자, 대상 및 만료 여부가 검증되지 않은 요청을 Lambda 비즈니스 로직에 전달하지 않는다. |
| CON_AUTH_018 | Lambda는 JWT의 검증된 Claim만 사용한다. |
| CON_AUTH_019 | `sub`를 서비스 내부의 불변 사용자 식별값으로 사용한다. |
| CON_AUTH_020 | 이메일 주소를 DynamoDB 파티션 키의 영구 사용자 식별값으로 사용하지 않는다. |
| CON_AUTH_021 | 로그인 오류에서 계정 존재 여부를 불필요하게 상세히 노출하지 않는다. |
| CON_AUTH_022 | 비밀번호 재설정 완료 후 기존 인증정보를 무효화하거나 재로그인을 요구한다. |
| CON_AUTH_023 | 로그아웃 시 브라우저의 인증 상태를 제거하고 회원 전용 화면을 사용할 수 없도록 한다. |
| CON_AUTH_024 | Access Token, ID Token 및 Refresh Token 원문을 로그에 기록하지 않는다. |
| CON_AUTH_025 | JWT를 카드 데이터나 DynamoDB 사용자 설정 항목에 저장하지 않는다. |
| CON_AUTH_026 | 토큰 갱신 실패 시 무한 재시도를 수행하지 않고 로그인 화면으로 이동한다. |
| CON_AUTH_027 | 인증 라이브러리 오류 원문을 사용자 화면에 그대로 노출하지 않는다. |
| CON_AUTH_028 | 비회원은 서비스 소개, 회원가입, 인증, 로그인 및 Anki 설치 안내만 사용할 수 있다. |
| CON_AUTH_029 | 비회원이 Bedrock·Polly API를 호출할 수 있는 공개 우회 경로를 만들지 않는다. |
| CON_AUTH_030 | 운영자가 사용자의 비밀번호 원문을 조회하거나 임의로 복구할 수 있는 기능을 제공하지 않는다. |

## 6.3 계정 탈퇴

| 제약사항 ID | 제약사항 |
|---|---|
| CON_AUTH_031 | 계정 탈퇴는 로그인 상태에서 재확인 절차를 거쳐 수행한다. |
| CON_AUTH_032 | Cognito 사용자 삭제를 위한 관리자 권한 API를 프런트엔드에서 직접 호출하지 않는다. |
| CON_AUTH_033 | 계정 탈퇴 Lambda만 필요한 Cognito 사용자 삭제 권한을 가진다. |
| CON_AUTH_034 | 탈퇴 시 DynamoDB의 사용자 프로필, 설정, 카드 및 사용량 데이터를 삭제한다. |
| CON_AUTH_035 | 탈퇴 후 사용자의 로컬 Anki 카드와 미디어를 원격으로 삭제하지 않는다. |
| CON_AUTH_036 | 탈퇴 화면에서 AWS 데이터 삭제와 로컬 Anki 데이터 유지 사실을 구분해 안내한다. |
| CON_AUTH_037 | 탈퇴 처리 중 일부 단계가 실패하면 성공으로 표시하지 않고 복구 가능한 상태를 기록한다. |
| CON_AUTH_038 | 탈퇴 데이터 보존기간이 필요한 경우 이용약관과 개인정보 처리방침에 명시한다. |

---

# 7. API Gateway 및 Lambda 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_API_001 | API Gateway는 Lambda API의 유일한 공개 진입점으로 사용한다. |
| CON_API_002 | 기본적으로 비용과 기능을 고려해 HTTP API를 우선 검토하되 필수 기능이 부족하면 REST API를 선택할 수 있다. |
| CON_API_003 | API 유형은 개발 중 임의로 혼용하지 않고 환경별로 일관되게 관리한다. |
| CON_API_004 | 회원 전용 라우트에는 JWT Authorizer를 적용한다. |
| CON_API_005 | CORS 허용 Origin은 개발 및 운영 프런트엔드 도메인으로 제한한다. |
| CON_API_006 | 운영 CORS 설정에 불필요한 와일드카드 Origin을 사용하지 않는다. |
| CON_API_007 | 허용 HTTP Method와 Header를 실제 사용 범위로 제한한다. |
| CON_API_008 | API 요청 본문 크기와 각 입력 필드 길이를 제한한다. |
| CON_API_009 | 동일한 오류 범주에 일관된 HTTP 상태 코드와 오류 코드를 사용한다. |
| CON_API_010 | AWS SDK 예외 메시지와 내부 Stack Trace를 응답 본문에 그대로 반환하지 않는다. |
| CON_API_011 | 각 요청에 요청 식별값을 부여하거나 API Gateway·Lambda 식별값을 추적 가능하게 유지한다. |
| CON_API_012 | Lambda는 입력 DTO 검증 후에만 Bedrock, Polly 및 DynamoDB를 호출한다. |
| CON_API_013 | Lambda Handler에 모든 비즈니스 로직을 직접 작성하지 않는다. |
| CON_API_014 | 인증 Claim 해석, 입력 검증, 카드 서비스, 음성 서비스 및 저장소 접근을 분리한다. |
| CON_API_015 | Lambda는 실행 환경의 로컬 파일 시스템을 영구 저장소로 사용하지 않는다. |
| CON_API_016 | Lambda 전역 객체 캐시는 성능 최적화에만 사용하고 데이터 정확성에 의존하지 않는다. |
| CON_API_017 | Lambda 환경변수에는 비민감 설정값만 저장하고 민감정보는 별도 보안 저장소를 사용한다. |
| CON_API_018 | Lambda 함수별 IAM Role을 분리하거나 기능별 최소 권한을 적용한다. |
| CON_API_019 | 카드 조회 Lambda에는 Bedrock·Polly 호출 권한을 부여하지 않는다. |
| CON_API_020 | 음성 생성 Lambda에는 필요하지 않은 Cognito 관리자 권한을 부여하지 않는다. |
| CON_API_021 | API Gateway와 Lambda 타임아웃 안에 완료하기 어려운 대량 요청을 동기식 단일 요청으로 처리하지 않는다. |
| CON_API_022 | 장시간 일괄 생성이 필요해지면 비동기 작업 구조를 별도 요구사항으로 도입한다. |
| CON_API_023 | 동일 요청 재전송으로 카드와 사용량이 중복 생성되지 않도록 멱등성 키를 지원한다. |
| CON_API_024 | 멱등성 키는 사용자와 요청 종류 범위 안에서만 유효하게 사용한다. |
| CON_API_025 | 일시적 AWS 서비스 오류에만 제한적 재시도를 적용한다. |
| CON_API_026 | 입력 오류, 권한 오류 및 모델 출력 검증 오류를 무조건 재시도하지 않는다. |
| CON_API_027 | 재시도에는 최대 횟수와 지수 백오프를 적용하고 무한 재시도하지 않는다. |
| CON_API_028 | 음성 응답이 API Gateway 또는 Lambda 응답 한계에 접근하면 항목별 요청으로 분리한다. |
| CON_API_029 | Lambda 동시 실행을 비정상적으로 증가시키는 클라이언트 병렬 요청을 제한한다. |
| CON_API_030 | 운영 환경에서 함수 메모리, 타임아웃 및 예약 동시성은 CloudWatch 지표를 근거로 조정한다. |
| CON_API_031 | MVP에서 Provisioned Concurrency를 기본 활성화하지 않는다. |
| CON_API_032 | Lambda를 VPC에 연결하지 않는 기본 구조를 유지하여 NAT Gateway 고정 비용을 발생시키지 않는다. |
| CON_API_033 | API 버전 변경 시 기존 프런트엔드와의 호환성을 고려한다. |
| CON_API_034 | 카드 데이터 구조 변경에는 `schemaVersion`을 사용한다. |

---
# 8. Amazon Bedrock 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_BEDROCK_001 | Bedrock은 Lambda의 IAM Role을 통해서만 호출한다. |
| CON_BEDROCK_002 | Bedrock 모델 호출 권한을 브라우저나 사용자에게 직접 부여하지 않는다. |
| CON_BEDROCK_003 | 사용할 모델 ID와 리전은 환경 설정으로 관리한다. |
| CON_BEDROCK_004 | 특정 모델에 전체 서비스가 강하게 결합되지 않도록 Bedrock Client와 카드 생성 Service를 분리한다. |
| CON_BEDROCK_005 | 시스템 프롬프트와 카드 생성 규칙은 버전 관리한다. |
| CON_BEDROCK_006 | 사용자가 시스템 프롬프트를 직접 변경할 수 없도록 한다. |
| CON_BEDROCK_007 | 사용자 입력을 시스템 명령으로 취급하지 않고 학습 대상 데이터로 경계 표시하여 전달한다. |
| CON_BEDROCK_008 | 사용자 입력에 포함된 프롬프트 인젝션 문장이 내부 규칙과 출력 스키마를 변경하지 못하도록 한다. |
| CON_BEDROCK_009 | Bedrock에 전달하는 입력 길이를 제한한다. |
| CON_BEDROCK_010 | 일본어 단어 또는 문법 표현 생성 목적과 무관한 대량 문서 입력을 허용하지 않는다. |
| CON_BEDROCK_011 | Bedrock의 출력은 JSON 또는 프로젝트에서 정의한 구조화 형식으로 제한한다. |
| CON_BEDROCK_012 | Markdown 코드 블록과 설명 문장이 포함된 경우 정규화하거나 검증 실패 처리한다. |
| CON_BEDROCK_013 | 필수 필드, 자료형, 배열 길이 및 최대 문자열 길이를 검증한다. |
| CON_BEDROCK_014 | `word`, `reading`, `furiganaWord`, `definition` 등 필수 필드가 없으면 `READY` 상태로 저장하지 않는다. |
| CON_BEDROCK_015 | 배열 정보가 없을 때 `null`보다 빈 배열을 사용하도록 정규화한다. |
| CON_BEDROCK_016 | 한자 정보가 없을 때 빈 객체를 사용하도록 정규화한다. |
| CON_BEDROCK_017 | 표현과 예문의 읽기 배열은 원문 배열과 동일한 순서로 대응되어야 한다. |
| CON_BEDROCK_018 | 표현 수와 표현 읽기 수가 불일치하면 검증 실패 또는 보정 정책을 적용한다. |
| CON_BEDROCK_019 | 예문 수와 예문 읽기 수가 불일치하면 검증 실패 또는 보정 정책을 적용한다. |
| CON_BEDROCK_020 | AI가 생성한 ruby HTML은 허용된 태그와 속성만 남기도록 정제한다. |
| CON_BEDROCK_021 | AI 출력의 `<script>`, 이벤트 속성, 외부 이미지, iframe 및 임의 링크를 허용하지 않는다. |
| CON_BEDROCK_022 | Bedrock 결과를 사용자 검토 없이 자동으로 Anki에 추가하지 않는다. |
| CON_BEDROCK_023 | 생성형 AI의 정의, 예문, 읽기 및 한자 정보가 항상 정확하다고 보장하지 않는다. |
| CON_BEDROCK_024 | 화면에 AI 생성 결과임과 사용자 확인 필요성을 안내한다. |
| CON_BEDROCK_025 | Bedrock 원본 응답 전체를 CloudWatch에 기본 기록하지 않는다. |
| CON_BEDROCK_026 | 내부 시스템 프롬프트를 사용자 오류 응답에 노출하지 않는다. |
| CON_BEDROCK_027 | 모델 호출 시 필요한 최소 사용자 데이터만 전달한다. |
| CON_BEDROCK_028 | 이메일, Cognito `sub`, JWT 및 Anki 덱 목록을 Bedrock 프롬프트에 전달하지 않는다. |
| CON_BEDROCK_029 | 모델 응답의 Token 사용량 또는 비용 관련 메타데이터는 필요 범위에서만 기록한다. |
| CON_BEDROCK_030 | 모델 교체 시 동일 카드 스키마 검증 테스트를 통과해야 한다. |
| CON_BEDROCK_031 | 모델 호출 실패와 모델 출력 검증 실패를 서로 다른 오류 범주로 관리한다. |
| CON_BEDROCK_032 | 동일 단어 재생성은 사용자 확인 후 실행하며 불필요한 반복 호출을 방지한다. |
| CON_BEDROCK_033 | 한 번의 요청으로 생성하는 예문과 표현 개수에 상한을 둔다. |
| CON_BEDROCK_034 | 대량 단어 생성 시 모든 단어를 하나의 거대한 프롬프트에 무제한으로 포함하지 않는다. |
| CON_BEDROCK_035 | 서비스에 적합하지 않은 입력은 Bedrock 호출 전에 검증하거나 정책에 따라 거부한다. |
| CON_BEDROCK_036 | Bedrock Guardrails 또는 동등한 안전 기능의 적용 여부는 모델과 비용 및 서비스 목적을 검토해 결정한다. |

---

# 9. Amazon Polly 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_POLLY_001 | Polly는 Lambda의 IAM Role을 통해서만 호출한다. |
| CON_POLLY_002 | Polly 호출 권한을 React에 직접 부여하지 않는다. |
| CON_POLLY_003 | Polly 음성은 카드 초안 생성 시 자동으로 영구 생성하지 않는다. |
| CON_POLLY_004 | 음성은 미리듣기 또는 Anki 추가 시점에 생성한다. |
| CON_POLLY_005 | 단어 음성은 가능한 경우 `reading`의 전체 히라가나를 사용한다. |
| CON_POLLY_006 | 표현 음성은 가능한 경우 `expressionReadings`를 사용한다. |
| CON_POLLY_007 | 예문 음성은 가능한 경우 `exampleReadings`를 사용한다. |
| CON_POLLY_008 | 검증되지 않은 AI 읽기 값으로 무조건 음성을 생성하지 않는다. |
| CON_POLLY_009 | 지원되는 일본어 음성 및 엔진 조합만 허용한다. |
| CON_POLLY_010 | Polly Voice ID와 Engine은 서버의 허용 목록으로 검증한다. |
| CON_POLLY_011 | 사용자가 임의의 Polly Voice ID를 요청하여 다른 언어 또는 비지원 값을 실행하지 못하도록 한다. |
| CON_POLLY_012 | 음성 속도는 서비스에서 정한 허용 범위 안에서만 설정한다. |
| CON_POLLY_013 | 사용자 입력 SSML을 그대로 Polly에 전달하지 않는다. |
| CON_POLLY_014 | SSML이 필요한 경우 서버가 안전한 템플릿으로 생성한다. |
| CON_POLLY_015 | Polly 요청 텍스트의 길이를 제한한다. |
| CON_POLLY_016 | 매우 긴 예문은 음성 생성을 거부하거나 분할 정책을 적용한다. |
| CON_POLLY_017 | 음성 출력 형식은 Anki와 주요 브라우저에서 재생 가능한 형식을 사용한다. |
| CON_POLLY_018 | 음성 데이터는 S3와 DynamoDB에 영구 저장하지 않는다. |
| CON_POLLY_019 | 생성된 음성 전체를 CloudWatch 로그에 기록하지 않는다. |
| CON_POLLY_020 | 음성은 요청 응답과 브라우저 미리보기 및 Anki 전송에 필요한 시간만 유지한다. |
| CON_POLLY_021 | 음성 파일명에는 운영체제와 Anki 미디어에서 문제가 되는 특수문자를 포함하지 않는다. |
| CON_POLLY_022 | 음성 파일명은 `cardId`, 음성 종류, 순번 및 설정 해시 등을 사용해 충돌 가능성을 줄인다. |
| CON_POLLY_023 | 이메일 주소와 Cognito `sub` 원문을 음성 파일명에 포함하지 않는다. |
| CON_POLLY_024 | 동일 카드와 동일 음성 설정의 재시도에서 불필요한 중복 미디어를 줄이는 파일명 정책을 사용한다. |
| CON_POLLY_025 | 일부 예문 음성 실패가 단어 음성과 성공한 예문 음성을 무효화하지 않도록 한다. |
| CON_POLLY_026 | 음성 생성 실패 항목만 다시 요청할 수 있도록 항목 식별값을 유지한다. |
| CON_POLLY_027 | 일괄 음성 생성은 무제한 병렬 처리하지 않는다. |
| CON_POLLY_028 | Polly 오류 원문과 내부 AWS 식별값을 사용자에게 그대로 표시하지 않는다. |
| CON_POLLY_029 | 음성 생성 횟수 또는 문자 수를 사용자별 사용량에 반영한다. |
| CON_POLLY_030 | Polly 음질과 발음이 항상 사전적·문맥적으로 완벽하다고 보장하지 않는다. |

---

# 10. Amazon DynamoDB 제약사항

## 10.1 데이터 모델

| 제약사항 ID | 제약사항 |
|---|---|
| CON_DDB_001 | DynamoDB 데이터 모델은 화면 중심이 아니라 실제 조회 패턴을 기준으로 설계한다. |
| CON_DDB_002 | 사용자 식별에는 Cognito `sub`를 사용한다. |
| CON_DDB_003 | 이메일 주소를 데이터 소유권의 기본 파티션 키로 사용하지 않는다. |
| CON_DDB_004 | 카드에는 충돌 가능성이 낮은 고유 `cardId`를 부여한다. |
| CON_DDB_005 | 사용자 프로필, 설정, 카드 및 사용량은 동일 사용자 범위에서 효율적으로 조회할 수 있어야 한다. |
| CON_DDB_006 | 단일 테이블 또는 소수 테이블 중 하나를 선택하되 조회 패턴과 유지보수성을 문서화한다. |
| CON_DDB_007 | 단일 테이블을 사용하는 경우 엔터티별 Sort Key 접두어를 일관되게 정의한다. |
| CON_DDB_008 | 카드 목록은 생성시각 또는 수정시각 기준으로 페이지 조회할 수 있어야 한다. |
| CON_DDB_009 | 카드 상태별 조회가 필요한 경우 GSI 또는 별도 정렬 키 구조를 사용한다. |
| CON_DDB_010 | DynamoDB Scan을 기본 카드 목록 조회 방식으로 사용하지 않는다. |
| CON_DDB_011 | 페이지 처리는 Offset 방식이 아닌 `LastEvaluatedKey` 기반 Cursor를 사용한다. |
| CON_DDB_012 | 클라이언트에 내부 DynamoDB 키 전체를 불필요하게 노출하지 않는다. |
| CON_DDB_013 | 시간 값은 UTC 기준 ISO 8601 문자열 또는 일관된 Epoch 형식으로 저장한다. |
| CON_DDB_014 | 카드 데이터에는 `schemaVersion`을 저장한다. |
| CON_DDB_015 | 카드 상태는 정의된 `GENERATING`, `READY`, `FAILED`, `ADDED` 값만 사용한다. |
| CON_DDB_016 | `ADDING`은 브라우저의 일시 상태로 사용하고 서버 영구 상태로 저장할지 여부를 명확히 구분한다. |
| CON_DDB_017 | Bedrock 검증이 완료되지 않은 카드를 `READY`로 저장하지 않는다. |
| CON_DDB_018 | DynamoDB 항목 크기 제한을 초과하지 않도록 예문, 표현, 한자 정보 및 문자열 길이를 제한한다. |
| CON_DDB_019 | Polly 음성 바이너리와 Base64 데이터를 DynamoDB에 저장하지 않는다. |
| CON_DDB_020 | JWT, 비밀번호 및 인증 코드 원문을 DynamoDB에 저장하지 않는다. |

## 10.2 쓰기·동시성·삭제

| 제약사항 ID | 제약사항 |
|---|---|
| CON_DDB_021 | 사용자별 카드 소유권 조건 없이 수정·삭제 Update를 수행하지 않는다. |
| CON_DDB_022 | 동일 카드의 동시 수정 충돌을 방지하기 위해 버전 값 또는 조건부 쓰기를 적용한다. |
| CON_DDB_023 | 사용량 증가는 원자적 증가 또는 조건부 쓰기로 처리한다. |
| CON_DDB_024 | 사용자별 일일 한도 초과 여부 확인과 사용량 증가는 경쟁 상태가 발생하지 않도록 처리한다. |
| CON_DDB_025 | 멱등성 레코드는 사용자와 요청 유형 및 요청 식별값을 포함한다. |
| CON_DDB_026 | 단기 멱등성 레코드와 임시 오류 데이터에는 TTL을 적용할 수 있다. |
| CON_DDB_027 | TTL 삭제가 즉시 실행된다고 가정하지 않는다. |
| CON_DDB_028 | 카드 생성 실패 상세에는 사용자에게 필요한 최소 오류 범주만 저장한다. |
| CON_DDB_029 | Bedrock 원본 응답 전체를 장기간 저장하지 않는다. |
| CON_DDB_030 | 카드 수정 시 `updatedAt`과 버전 값을 갱신한다. |
| CON_DDB_031 | Anki 추가 성공 보고 시 `addedAt`과 `ADDED` 상태를 함께 갱신한다. |
| CON_DDB_032 | Anki 추가 성공 후 상태 갱신 실패에 대비한 수동 상태 수정 또는 재동기화 방법을 제공한다. |
| CON_DDB_033 | 카드 삭제는 현재 인증 사용자의 파티션 범위 안에서만 수행한다. |
| CON_DDB_034 | 계정 탈퇴 시 사용자 파티션의 관련 데이터를 모두 조회하고 삭제하는 절차를 적용한다. |
| CON_DDB_035 | 여러 항목 삭제 중 일부 실패 시 재처리할 수 있도록 실패 키를 추적한다. |
| CON_DDB_036 | 운영 환경에서는 필요에 따라 Point-in-Time Recovery를 활성화한다. |
| CON_DDB_037 | 개발 환경의 백업 기능은 비용을 고려해 운영 환경과 다르게 설정할 수 있다. |
| CON_DDB_038 | 데이터 암호화는 AWS 관리형 암호화를 기본으로 사용하고 별도 요구가 있으면 고객 관리형 키를 검토한다. |
| CON_DDB_039 | DynamoDB On-Demand 용량 모드를 MVP 기본값으로 사용한다. |
| CON_DDB_040 | Provisioned 용량으로 변경할 경우 실제 트래픽과 비용 근거를 남긴다. |

---

# 11. AnkiConnect 및 로컬 연동 제약사항

## 11.1 연결 구조

| 제약사항 ID | 제약사항 |
|---|---|
| CON_ANKI_001 | 실제 Anki 카드 저장은 Anki Desktop과 AnkiConnect가 실행 중인 PC에서만 수행한다. |
| CON_ANKI_002 | 모바일 웹에서는 카드 생성과 클라우드 저장을 지원하되 데스크톱 Anki 직접 추가를 기본 보장하지 않는다. |
| CON_ANKI_003 | AWS Lambda는 사용자의 `localhost:8765`에 접근할 수 없다. |
| CON_ANKI_004 | 브라우저가 AnkiConnect에 직접 HTTP 요청을 전송한다. |
| CON_ANKI_005 | AnkiConnect 포트를 공인 인터넷에 공개하도록 사용자에게 안내하지 않는다. |
| CON_ANKI_006 | 사용자의 공유기 포트포워딩이나 공인 IP 노출을 요구하지 않는다. |
| CON_ANKI_007 | 기본 AnkiConnect URL은 `http://localhost:8765`로 한다. |
| CON_ANKI_008 | `127.0.0.1` 또는 사용자가 지정한 로컬 URL 지원 여부는 기기별 설정으로 관리한다. |
| CON_ANKI_009 | CloudFront 서비스 Origin을 AnkiConnect `webCorsOriginList`에 등록해야 할 수 있음을 안내한다. |
| CON_ANKI_010 | AnkiConnect CORS 설정은 사용자의 로컬 애드온 설정이며 AWS가 자동으로 수정할 수 있다고 가정하지 않는다. |
| CON_ANKI_011 | HTTPS 사이트에서 로컬 HTTP AnkiConnect 호출이 브라우저별로 다르게 동작할 수 있으므로 지원 브라우저에서 실제 테스트한다. |
| CON_ANKI_012 | 브라우저 정책으로 로컬 호출이 차단되면 안전하지 않은 브라우저 보안 해제를 일반 해결책으로 안내하지 않는다. |
| CON_ANKI_013 | 표준 AnkiConnect로 해결하기 어려운 설정 문제는 향후 전용 Anki 애드온으로 분리한다. |
| CON_ANKI_014 | AnkiConnect API 버전을 확인하고 지원하지 않는 버전에는 명확한 안내를 표시한다. |
| CON_ANKI_015 | AnkiConnect 요청의 HTTP 성공만으로 처리 성공을 판단하지 않고 `error`와 `result`를 함께 확인한다. |

## 11.2 카드 및 미디어 저장

| 제약사항 ID | 제약사항 |
|---|---|
| CON_ANKI_016 | 덱 목록은 AWS가 아니라 로컬 AnkiConnect에서 조회한다. |
| CON_ANKI_017 | 사용자의 전체 덱 목록을 DynamoDB에 영구 동기화하지 않는다. |
| CON_ANKI_018 | 기본 덱 이름은 계정 설정으로 저장할 수 있으나 실제 존재 여부는 AnkiConnect에서 확인한다. |
| CON_ANKI_019 | 덱이 없을 때 자동 생성 전 사용자에게 대상 덱 이름을 확인시킨다. |
| CON_ANKI_020 | 노트 타입 생성과 업데이트는 사용자 명시적 실행 또는 카드 추가 전 확인 단계에서 수행한다. |
| CON_ANKI_021 | 기존 동일 이름 노트 타입을 무조건 삭제하거나 재생성하지 않는다. |
| CON_ANKI_022 | 누락 필드는 추가하되 기존 사용자의 다른 필드와 카드를 불필요하게 삭제하지 않는다. |
| CON_ANKI_023 | 템플릿 업데이트가 기존 카드 표시 방식에 영향을 줄 수 있음을 사용자에게 안내한다. |
| CON_ANKI_024 | 미디어 파일을 먼저 저장하고 카드 추가가 실패할 수 있는 부분 성공 상황을 처리한다. |
| CON_ANKI_025 | 재시도에서 동일 파일명을 사용해 불필요한 중복 미디어를 줄이는 정책을 적용한다. |
| CON_ANKI_026 | AnkiConnect 미디어 저장 응답 파일명을 실제 `[sound:...]` 태그에 반영한다. |
| CON_ANKI_027 | 음성 필드에는 Base64 전체가 아니라 Anki 미디어 태그만 저장한다. |
| CON_ANKI_028 | 중복 카드 정책은 `allowDuplicate` 설정과 사용자 확인 흐름을 일관되게 적용한다. |
| CON_ANKI_029 | 서버의 동일 단어 카드 존재 여부와 로컬 Anki의 중복 여부를 동일한 것으로 간주하지 않는다. |
| CON_ANKI_030 | 다른 PC나 다른 Anki 프로필에는 동일 카드가 존재하지 않을 수 있음을 고려한다. |
| CON_ANKI_031 | Anki 추가 실패 시 DynamoDB 카드를 자동 삭제하지 않는다. |
| CON_ANKI_032 | 카드 추가 성공 후에만 `ADDED` 상태 갱신을 요청한다. |
| CON_ANKI_033 | `ADDED` 상태 카드도 사용자 선택 시 다른 덱이나 다른 PC에 다시 추가할 수 있다. |
| CON_ANKI_034 | AnkiConnect 오류와 AWS API 오류를 같은 오류 메시지로 처리하지 않는다. |
| CON_ANKI_035 | 사용자의 로컬 Anki 데이터 손상 가능성이 있는 대량 삭제 기능은 MVP에서 제공하지 않는다. |
| CON_ANKI_036 | Anki 컬렉션 전체 읽기·동기화·백업 기능은 MVP에서 제공하지 않는다. |

---

# 12. 카드 데이터·노트 타입·템플릿 제약사항

## 12.1 카드 데이터 구조

| 제약사항 ID | 제약사항 |
|---|---|
| CON_CARD_001 | 내부 카드 데이터는 기존 Anki Helper 기능과 호환되는 명시적 스키마를 사용한다. |
| CON_CARD_002 | 카드 스키마에는 `word`, `reading`, `furiganaWord`, `cardMode`, `definition`, `nativeMeaning`, `expressions`, `expressionReadings`, `examples`, `exampleReadings`, `synonyms`, `kanji` 및 음성 관련 정보를 포함한다. |
| CON_CARD_003 | 카드 스키마 변경 시 `schemaVersion`을 증가시키고 마이그레이션 또는 하위 호환 정책을 정의한다. |
| CON_CARD_004 | `cardMode`는 `jp-jp` 또는 `jp-native`만 허용한다. |
| CON_CARD_005 | `jp-jp` 모드에서는 일본어 정의를 기본 뒷면 의미로 사용한다. |
| CON_CARD_006 | `jp-native` 모드에서는 사용자가 선택한 모국어 뜻을 기본 뒷면 의미로 사용한다. |
| CON_CARD_007 | 카드의 필수 문자열은 빈 문자열로 저장하지 않도록 검증한다. |
| CON_CARD_008 | 표현, 예문 및 유의어 배열의 최대 개수를 제한한다. |
| CON_CARD_009 | 각 문자열 필드의 최대 길이를 제한한다. |
| CON_CARD_010 | `kanji` 데이터는 표제어에 포함된 한자 범위에서 생성하는 것을 원칙으로 한다. |
| CON_CARD_011 | 사용자 수정값도 AI 출력과 동일한 HTML 정제 규칙을 적용한다. |
| CON_CARD_012 | 사용자가 수정한 카드와 원본 AI 결과의 보관 정책을 명확히 한다. |
| CON_CARD_013 | MVP에서는 무제한 카드 버전 이력을 저장하지 않는다. |
| CON_CARD_014 | 재생성 시 기존 카드를 덮어쓸지 새 카드로 저장할지 사용자에게 명확히 표시한다. |
| CON_CARD_015 | AI 카드의 언어학적 정확성과 교육적 적합성을 서비스가 완전히 보증하지 않는다. |

## 12.2 Anki 노트 타입

| 제약사항 ID | 제약사항 |
|---|---|
| CON_CARD_016 | 기본 Anki 노트 타입 이름은 `signife_anki_helper`를 사용한다. |
| CON_CARD_017 | 기본 노트 타입은 다음 18개 필드를 사용한다: `Word`, `Reading`, `FuriganaWord`, `CardMode`, `Definition`, `NativeMeaning`, `Expressions`, `ExpressionReadings`, `Examples`, `ExampleReadings`, `Synonyms`, `KanjiData`, `WordAudio`, `ExamplesAudio`, `ExpressionsAudio`, `WordAudioSource`, `ExamplesAudioSource`, `ExpressionsAudioSource`. |
| CON_CARD_018 | 필드 이름의 대소문자와 순서를 임의로 변경하지 않는다. |
| CON_CARD_019 | 카드 추가 전 노트 타입과 필드 존재 여부를 확인한다. |
| CON_CARD_020 | 기존 노트 타입에 누락 필드가 있으면 추가하되 기존 데이터를 삭제하지 않는다. |
| CON_CARD_021 | 카드 앞면과 뒷면 템플릿 및 CSS는 별도 버전으로 관리한다. |
| CON_CARD_022 | 템플릿에는 외부 CDN 스크립트에 의존하는 기능을 포함하지 않는다. |
| CON_CARD_023 | 템플릿의 JavaScript는 Anki 카드 실행 환경에서 동작 가능한 범위로 제한한다. |
| CON_CARD_024 | 템플릿에서 위험한 네트워크 요청과 사용자 데이터 외부 전송을 수행하지 않는다. |
| CON_CARD_025 | 후리가나 표시·숨김 기능은 Anki Desktop과 지원 모바일 환경에서 테스트한다. |
| CON_CARD_026 | 한자 팝업은 `KanjiData`에 정보가 없는 경우 오류 없이 동작해야 한다. |
| CON_CARD_027 | 예문과 표현 음성 순번이 카드 데이터 순번과 일치해야 한다. |
| CON_CARD_028 | 사용자가 지정한 글꼴이 설치되지 않은 환경을 고려해 대체 글꼴 스택을 제공한다. |
| CON_CARD_029 | 템플릿 업데이트 전 기존 템플릿에 미칠 영향을 안내한다. |
| CON_CARD_030 | 서비스가 사용자의 모든 커스텀 Anki 노트 타입을 자동 지원한다고 보장하지 않는다. |

---

# 13. 사용량 및 비용 통제 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_USAGE_001 | Bedrock과 Polly API는 로그인 사용자만 호출할 수 있다. |
| CON_USAGE_002 | 로그인 기능만으로 악용이 방지된다고 가정하지 않는다. |
| CON_USAGE_003 | 사용자별 일일 카드 생성 횟수 제한을 적용한다. |
| CON_USAGE_004 | 사용자별 음성 생성 횟수 또는 합성 문자 수 제한을 적용한다. |
| CON_USAGE_005 | 일괄 생성 한 번에 처리할 수 있는 단어 수에 상한을 둔다. |
| CON_USAGE_006 | 일괄 Anki 추가 한 번에 처리할 수 있는 카드 수에 상한을 둔다. |
| CON_USAGE_007 | 동일 사용자의 동시 Bedrock 생성 요청 수를 제한한다. |
| CON_USAGE_008 | 동일 사용자의 동시 Polly 생성 요청 수를 제한한다. |
| CON_USAGE_009 | 사용량 한도는 환경 설정으로 변경할 수 있어야 한다. |
| CON_USAGE_010 | 개발과 운영 환경의 사용량 한도를 다르게 설정할 수 있어야 한다. |
| CON_USAGE_011 | 사용량 증가와 한도 검사는 DynamoDB 조건부 쓰기로 원자적으로 처리한다. |
| CON_USAGE_012 | 입력 검증 전에 사용량을 차감하지 않는다. |
| CON_USAGE_013 | 실제 Bedrock 또는 Polly 호출이 시작된 이후 실패한 요청의 차감·복구 정책을 명확히 한다. |
| CON_USAGE_014 | 동일 멱등성 키 요청의 재전송으로 사용량이 중복 증가하지 않도록 한다. |
| CON_USAGE_015 | API Gateway의 기본 Throttling과 애플리케이션 사용자별 제한을 함께 적용한다. |
| CON_USAGE_016 | 인증·비밀번호 재설정·인증 코드 재전송에도 별도의 요청 제한을 적용한다. |
| CON_USAGE_017 | 동일 IP만으로 사용자를 식별하거나 정상 사용자를 영구 차단하지 않는다. |
| CON_USAGE_018 | 비용 급증 시 Bedrock·Polly API를 일시 중지할 수 있는 운영 절차를 마련한다. |
| CON_USAGE_019 | AWS Budgets 또는 비용 알람을 구성한다. |
| CON_USAGE_020 | Bedrock 모델 변경 시 단가와 품질 및 지연시간을 함께 검토한다. |
| CON_USAGE_021 | Polly 음성을 미리 대량 생성하여 사용되지 않는 비용을 발생시키지 않는다. |
| CON_USAGE_022 | CloudWatch 로그 보존기간을 무기한으로 두지 않는다. |
| CON_USAGE_023 | 개발 환경에 불필요한 고비용 알람·백업·고정 용량을 동일하게 적용하지 않는다. |
| CON_USAGE_024 | MVP에서 NAT Gateway, ALB 및 상시 EC2 비용을 발생시키지 않는다. |
| CON_USAGE_025 | MVP에서 Lambda Provisioned Concurrency를 기본 사용하지 않는다. |
| CON_USAGE_026 | DynamoDB는 On-Demand를 기본으로 사용하고 실제 사용량 증가 후 재평가한다. |
| CON_USAGE_027 | S3에는 React 정적 파일만 저장하고 사용자 음성 저장 비용을 만들지 않는다. |
| CON_USAGE_028 | CloudFront는 정적 파일 배포에 사용하고 사용자별 API 응답을 무분별하게 캐시하지 않는다. |
| CON_USAGE_029 | 비용 알람 임계값과 대응 담당 작업을 운영 문서에 기록한다. |
| CON_USAGE_030 | 무료 이용 범위가 영구적으로 유지된다고 가정하여 설계하지 않는다. |

---
# 14. 성능 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_PER_001 | CloudFront 캐시 가능한 정적 파일과 사용자별 API 응답을 구분한다. |
| CON_PER_002 | 인증된 사용자 카드 응답을 CloudFront 공개 캐시에 저장하지 않는다. |
| CON_PER_003 | 카드 목록은 전체 항목을 한 번에 반환하지 않고 페이지 처리한다. |
| CON_PER_004 | 카드 목록 정렬과 상태 필터를 위해 DynamoDB Scan을 반복 사용하지 않는다. |
| CON_PER_005 | 단일 카드 생성 요청에서 생성하는 표현과 예문 수를 제한한다. |
| CON_PER_006 | 단일 Polly 요청 텍스트 길이를 제한한다. |
| CON_PER_007 | 일괄 작업은 카드별 진행률과 부분 성공 결과를 제공한다. |
| CON_PER_008 | 브라우저가 Bedrock과 Polly 요청을 무제한 병렬로 전송하지 않는다. |
| CON_PER_009 | AnkiConnect 요청도 제한된 동시성 또는 순차 처리한다. |
| CON_PER_010 | Lambda 콜드 스타트를 줄이기 위해 불필요한 의존성과 초기화 코드를 제거한다. |
| CON_PER_011 | AWS SDK Client는 실행 환경 재사용이 가능한 범위에서 재사용할 수 있다. |
| CON_PER_012 | 전역 Client 재사용이 사용자 데이터 공유로 이어지지 않도록 한다. |
| CON_PER_013 | Bedrock 응답 대기 중 사용자 화면에 진행 상태를 즉시 표시한다. |
| CON_PER_014 | AI 생성 목표시간은 성능 목표이며 외부 서비스 상황에 따라 항상 보장되는 SLA로 표현하지 않는다. |
| CON_PER_015 | Polly 생성 목표시간도 외부 서비스 지연에 따라 달라질 수 있음을 고려한다. |
| CON_PER_016 | API 타임아웃 직전까지 무제한 재시도하지 않는다. |
| CON_PER_017 | Lambda 메모리 증설은 비용과 실행시간 측정 결과를 근거로 결정한다. |
| CON_PER_018 | 카드 미리보기에서 대량 음성 데이터를 동시에 메모리에 적재하지 않는다. |
| CON_PER_019 | 프런트엔드 목록에는 필요한 카드 요약만 먼저 전송하고 상세는 선택 시 조회할 수 있다. |
| CON_PER_020 | 장기적으로 동기식 요청 한계를 넘는 대량 작업은 SQS·Step Functions 등 비동기 구조를 별도 검토한다. |

---

# 15. 일반 보안 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_SEC_001 | 사용자와 CloudFront 및 API Gateway 사이의 통신은 HTTPS를 사용한다. |
| CON_SEC_002 | 운영 환경에서 HTTP로 서비스 도메인을 제공하지 않는다. |
| CON_SEC_003 | S3 버킷의 공개 읽기 권한을 허용하지 않는다. |
| CON_SEC_004 | Lambda IAM Role에는 필요한 Action과 Resource만 허용한다. |
| CON_SEC_005 | `Action: "*"`와 `Resource: "*"` 조합을 운영 정책에 무분별하게 사용하지 않는다. |
| CON_SEC_006 | Bedrock 모델 호출 권한은 선택한 모델과 기능 범위로 제한한다. |
| CON_SEC_007 | Polly 권한은 음성 합성에 필요한 범위로 제한한다. |
| CON_SEC_008 | DynamoDB 권한은 해당 환경의 대상 테이블과 필요한 작업으로 제한한다. |
| CON_SEC_009 | Cognito 관리자 권한은 계정 탈퇴 등 필요한 Lambda에만 부여한다. |
| CON_SEC_010 | GitHub 저장소에 AWS Access Key와 Secret Key를 저장하지 않는다. |
| CON_SEC_011 | GitHub Actions는 OIDC 기반 임시 AWS 권한을 우선 사용한다. |
| CON_SEC_012 | Terraform State에 민감정보가 포함될 가능성을 고려해 원격 상태 저장소 접근을 제한한다. |
| CON_SEC_013 | `.env`, Terraform 변수 파일, 배포 산출물 및 로컬 AWS 설정 파일을 Git에 커밋하지 않는다. |
| CON_SEC_014 | CloudWatch 로그에 JWT, 비밀번호, 인증 코드, AWS 키 및 전체 음성 데이터를 기록하지 않는다. |
| CON_SEC_015 | 이메일 주소는 로그 목적에 필요한 경우 마스킹한다. |
| CON_SEC_016 | Cognito `sub`도 외부 사용자 메시지에 불필요하게 노출하지 않는다. |
| CON_SEC_017 | API 응답에 DynamoDB 내부 키와 AWS 리소스 ARN을 노출하지 않는다. |
| CON_SEC_018 | 카드 HTML은 허용 목록 기반으로 정제한다. |
| CON_SEC_019 | React 미리보기와 Anki 템플릿에서 임의 스크립트 실행을 허용하지 않는다. |
| CON_SEC_020 | 사용자 입력을 Bedrock 시스템 명령으로 직접 결합하지 않는다. |
| CON_SEC_021 | 오류 화면에 Stack Trace와 내부 프롬프트를 표시하지 않는다. |
| CON_SEC_022 | Content-Security-Policy에서 필요한 서비스 도메인과 로컬 AnkiConnect 연결만 허용한다. |
| CON_SEC_023 | CSP의 `connect-src`에 운영 API Origin과 필요한 `localhost:8765` 범위를 명시적으로 검토한다. |
| CON_SEC_024 | 무분별한 `unsafe-eval`과 외부 스크립트 Origin을 허용하지 않는다. |
| CON_SEC_025 | CloudFront에 기본 보안 헤더 정책을 적용한다. |
| CON_SEC_026 | X-Content-Type-Options, Referrer-Policy 등 필요한 응답 헤더를 구성한다. |
| CON_SEC_027 | 카드 삭제, 계정 탈퇴 및 설정 변경 API는 HTTP Method와 권한 검사를 명확히 한다. |
| CON_SEC_028 | Cross-user 데이터 접근을 방지하는 테스트를 필수로 작성한다. |
| CON_SEC_029 | 사용자 입력과 경로 변수를 DynamoDB 표현식에 문자열 결합으로 직접 삽입하지 않는다. |
| CON_SEC_030 | 의존성 취약점 검사를 CI에서 수행한다. |
| CON_SEC_031 | 운영 환경에 디버그 모드와 상세 오류 출력을 활성화하지 않는다. |
| CON_SEC_032 | AWS WAF는 악용 위험과 비용을 검토하여 운영 환경에 선택적으로 적용한다. |
| CON_SEC_033 | WAF를 적용하지 않더라도 API Gateway 제한과 사용자별 사용량 제한을 반드시 적용한다. |
| CON_SEC_034 | AnkiConnect 로컬 포트에 외부 인증정보를 전송하지 않는다. |
| CON_SEC_035 | AnkiConnect 응답을 신뢰할 수 있는 서버 인증으로 간주하지 않는다. |
| CON_SEC_036 | 서비스가 로컬 AnkiConnect의 보안을 대신 보장한다고 표현하지 않는다. |

---

# 16. 개인정보 및 데이터 보호 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_PRIV_001 | 서비스 제공에 필요한 최소 개인정보만 수집한다. |
| CON_PRIV_002 | 기본 개인정보는 이메일, 표시 이름 및 사용자 설정으로 제한한다. |
| CON_PRIV_003 | 주민등록번호, 전화번호, 주소 및 결제정보를 MVP에서 수집하지 않는다. |
| CON_PRIV_004 | 회원가입 시 개인정보 수집 목적과 처리 항목을 고지한다. |
| CON_PRIV_005 | 카드 수집함 동기화를 위해 일본어 입력과 생성 카드가 AWS에 저장됨을 고지한다. |
| CON_PRIV_006 | 일본어 입력이 Bedrock에 전달됨을 고지한다. |
| CON_PRIV_007 | 읽기 및 예문 텍스트가 Polly에 전달됨을 고지한다. |
| CON_PRIV_008 | 사용자의 이메일과 인증정보를 Bedrock 및 Polly 입력에 포함하지 않는다. |
| CON_PRIV_009 | 사용자 카드 데이터는 해당 사용자만 조회할 수 있어야 한다. |
| CON_PRIV_010 | 운영자가 일반적인 서비스 운영 목적으로 사용자 카드 전체를 무분별하게 열람하지 않는다. |
| CON_PRIV_011 | 지원 문의에 필요한 경우에도 최소 범위의 로그와 요청 식별값을 사용한다. |
| CON_PRIV_012 | 생성된 Polly 음성은 AWS에 영구 저장하지 않는다. |
| CON_PRIV_013 | 사용자의 실제 Anki 컬렉션을 AWS로 업로드하지 않는다. |
| CON_PRIV_014 | 사용자의 전체 덱 목록과 학습 기록을 AWS에 동기화하지 않는다. |
| CON_PRIV_015 | AnkiConnect URL은 기기별 로컬 설정으로 처리한다. |
| CON_PRIV_016 | 계정 탈퇴 시 AWS에 저장된 사용자별 데이터를 삭제한다. |
| CON_PRIV_017 | 계정 탈퇴가 사용자의 로컬 Anki 카드를 삭제하지 않음을 안내한다. |
| CON_PRIV_018 | 삭제된 데이터의 백업 잔존 기간이 존재하면 정책에 명시한다. |
| CON_PRIV_019 | CloudWatch 로그 보존기간을 정의하고 무기한 보관하지 않는다. |
| CON_PRIV_020 | 카드 실패 원인 기록에는 전체 사용자 입력 대신 오류 범주와 필요한 최소 메타데이터를 사용한다. |
| CON_PRIV_021 | 개인정보를 포함할 수 있는 API 응답을 브라우저 또는 CDN 공개 캐시에 저장하지 않는다. |
| CON_PRIV_022 | 데이터 저장 리전과 AWS 서비스 리전을 문서화한다. |
| CON_PRIV_023 | 다국어 개인정보 처리방침 제공 범위는 실제 서비스 대상과 운영 역량을 고려해 결정한다. |
| CON_PRIV_024 | 생성형 AI 결과의 학습 활용 여부를 서비스가 임의로 단정하지 않고 사용하는 AWS 서비스 정책을 기준으로 고지한다. |
| CON_PRIV_025 | 사용자 데이터를 제3자 광고 또는 마케팅 목적으로 사용하지 않는다. |

---

# 17. 브라우저·화면·접근성 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_UI_001 | 서비스는 PC와 모바일 반응형 웹으로 제공한다. |
| CON_UI_002 | 최소 지원 화면 너비는 360px을 기준으로 한다. |
| CON_UI_003 | 최신 Chrome과 Edge를 AnkiConnect PC 연동의 우선 지원 브라우저로 한다. |
| CON_UI_004 | Safari와 Firefox는 일반 웹 기능을 지원하되 로컬 AnkiConnect 동작은 별도 검증한다. |
| CON_UI_005 | Internet Explorer는 지원하지 않는다. |
| CON_UI_006 | 브라우저별 로컬 네트워크 및 Mixed Content 정책 차이로 AnkiConnect 연결이 제한될 수 있음을 안내한다. |
| CON_UI_007 | 로그인, 단어 입력, 수집함 및 미리보기는 모바일에서 사용할 수 있어야 한다. |
| CON_UI_008 | 모바일에서 로컬 데스크톱 Anki 추가가 가능한 것처럼 오해시키지 않는다. |
| CON_UI_009 | 주요 버튼과 입력 요소는 키보드로 접근할 수 있어야 한다. |
| CON_UI_010 | 포커스 표시를 제거하지 않는다. |
| CON_UI_011 | 오류와 상태를 색상만으로 구분하지 않는다. |
| CON_UI_012 | 폼 입력 요소에 라벨과 오류 설명을 제공한다. |
| CON_UI_013 | 로딩 중 버튼을 비활성화하여 중복 제출을 방지한다. |
| CON_UI_014 | 긴 Bedrock 처리 중 진행 상태와 취소 가능 여부를 표시한다. |
| CON_UI_015 | 일괄 Anki 추가에서는 현재 카드, 완료 수, 실패 수를 표시한다. |
| CON_UI_016 | 카드 미리보기에서 앞면과 뒷면을 구분한다. |
| CON_UI_017 | AI 생성 데이터 수정 후 저장되지 않은 변경사항을 안내한다. |
| CON_UI_018 | 계정 탈퇴와 여러 카드 삭제에는 확인 절차를 제공한다. |
| CON_UI_019 | 비밀번호 오류 메시지에서 실제 비밀번호 정책을 이해할 수 있게 안내하되 내부 보안 정보를 과도하게 노출하지 않는다. |
| CON_UI_020 | UI는 한국어, 영어, 일본어 및 중국어 번역 구조를 유지한다. |
| CON_UI_021 | 번역 키가 없을 때 화면에 내부 키 문자열만 노출하지 않도록 기본 문구를 제공한다. |
| CON_UI_022 | 일본어 표제어, 후리가나 및 한자 정보에 적절한 글꼴 스택을 적용한다. |
| CON_UI_023 | 다크 모드와 라이트 모드 모두에서 읽을 수 있는 대비를 확보한다. |
| CON_UI_024 | 음성 재생 기능에는 재생 중 상태와 실패 안내를 제공한다. |
| CON_UI_025 | AnkiConnect 설치와 CORS 설정 안내는 일반 사용자도 따라 할 수 있는 단계로 제공한다. |
| CON_UI_026 | AWS 내부 서비스명만 표시하는 오류보다 사용자가 수행할 수 있는 조치를 함께 안내한다. |
| CON_UI_027 | 요청 식별값은 문제 해결용으로 제공하되 AWS 내부 비밀정보를 포함하지 않는다. |
| CON_UI_028 | AI 정의와 예문이 부정확할 수 있음을 미리보기 화면에 안내한다. |

---

# 18. 로그·모니터링·알람 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_OBS_001 | Lambda 로그는 CloudWatch Logs에 기록한다. |
| CON_OBS_002 | 로그는 JSON 등 구조화된 형식을 우선 사용한다. |
| CON_OBS_003 | 로그에는 요청 식별값, 기능명, 결과, 오류 코드 및 처리시간을 포함할 수 있다. |
| CON_OBS_004 | 비밀번호, 인증 코드, JWT 및 AWS 인증정보를 로그에 기록하지 않는다. |
| CON_OBS_005 | 전체 Bedrock Prompt와 원본 Response를 기본 로그에 기록하지 않는다. |
| CON_OBS_006 | Polly 음성 바이너리와 Base64를 로그에 기록하지 않는다. |
| CON_OBS_007 | 사용자 이메일은 필요 시 마스킹한다. |
| CON_OBS_008 | 카드 내용은 장애 분석에 꼭 필요한 최소 범위만 기록한다. |
| CON_OBS_009 | API Gateway 요청 수, 4xx, 5xx 및 지연시간을 확인한다. |
| CON_OBS_010 | Lambda 호출 수, 오류, Throttle, 실행시간 및 동시 실행을 확인한다. |
| CON_OBS_011 | Bedrock 호출 성공, 실패, 출력 검증 실패 및 처리시간을 구분한다. |
| CON_OBS_012 | Polly 호출 성공, 실패, 생성 항목 수 및 처리시간을 구분한다. |
| CON_OBS_013 | DynamoDB 오류, Throttle 및 조건부 쓰기 실패를 확인한다. |
| CON_OBS_014 | Cognito 로그인 실패 증가와 인증 오류를 확인할 수 있어야 한다. |
| CON_OBS_015 | AnkiConnect 오류는 브라우저에서 발생하므로 필요 시 사용자가 제공한 요청 요약으로 추적한다. |
| CON_OBS_016 | 사용자의 로컬 Anki 카드 내용과 미디어 파일을 자동 수집하지 않는다. |
| CON_OBS_017 | API 5xx와 Lambda 오류율이 기준을 넘으면 알람을 발생시킨다. |
| CON_OBS_018 | Bedrock·Polly 오류율이 기준을 넘으면 알람을 발생시킬 수 있어야 한다. |
| CON_OBS_019 | DynamoDB Throttle이 발생하면 알람 또는 대시보드에서 확인할 수 있어야 한다. |
| CON_OBS_020 | AWS 비용과 예산 초과 가능성에 대한 알람을 구성한다. |
| CON_OBS_021 | 로그 그룹별 보존기간을 Terraform으로 지정한다. |
| CON_OBS_022 | 개발 환경 로그 보존기간은 운영 환경보다 짧게 설정할 수 있다. |
| CON_OBS_023 | 알람이 같은 장애로 과도하게 반복 발송되지 않도록 정책을 설정한다. |
| CON_OBS_024 | CloudWatch Dashboard에는 핵심 API, Lambda, DynamoDB, Bedrock 및 Polly 지표를 포함할 수 있다. |
| CON_OBS_025 | 사용자별 사용량 분석이 개인정보 과다 수집으로 이어지지 않도록 집계 단위를 제한한다. |
| CON_OBS_026 | 요청 식별값으로 프런트 오류와 Lambda 로그를 연결할 수 있도록 한다. |

---

# 19. Terraform 및 인프라 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_IAC_001 | 운영에 필요한 AWS 리소스는 가능한 한 Terraform으로 관리한다. |
| CON_IAC_002 | 콘솔에서 임의로 만든 리소스를 운영의 유일한 구성으로 남기지 않는다. |
| CON_IAC_003 | 개발과 운영 환경의 Terraform State를 분리한다. |
| CON_IAC_004 | Terraform State는 로컬 개인 PC에만 저장하지 않고 안전한 원격 저장소를 사용한다. |
| CON_IAC_005 | 원격 State 저장소의 공개 접근을 차단하고 암호화를 적용한다. |
| CON_IAC_006 | Terraform State 동시 변경 방지 기능을 적용한다. |
| CON_IAC_007 | State 파일에 민감정보가 포함될 가능성을 고려해 접근 권한을 제한한다. |
| CON_IAC_008 | Terraform 변수 기본값에 실제 비밀정보를 작성하지 않는다. |
| CON_IAC_009 | S3, CloudFront, Cognito, API Gateway, Lambda, DynamoDB, IAM 및 CloudWatch를 Terraform 관리 대상으로 한다. |
| CON_IAC_010 | 필요 시 Route 53, ACM, WAF 및 Budgets 관련 리소스를 Terraform 관리 대상으로 추가한다. |
| CON_IAC_011 | S3 Public Access Block과 CloudFront 전용 접근 정책을 코드로 적용한다. |
| CON_IAC_012 | Lambda IAM Policy는 기능별 최소 권한으로 작성한다. |
| CON_IAC_013 | Cognito App Client에 SPA용 Client Secret을 생성하지 않는다. |
| CON_IAC_014 | DynamoDB On-Demand, 암호화 및 필요 인덱스를 코드로 관리한다. |
| CON_IAC_015 | CloudWatch Log Group을 미리 생성하고 보존기간을 지정한다. |
| CON_IAC_016 | Terraform `fmt`, `validate` 및 `plan`을 Pull Request에서 실행한다. |
| CON_IAC_017 | 운영 `apply`는 보호된 브랜치와 승인된 환경에서만 실행한다. |
| CON_IAC_018 | 운영 리소스 삭제가 포함된 Plan은 별도 확인 없이 자동 적용하지 않는다. |
| CON_IAC_019 | Terraform Output에 비밀번호, Token 및 Secret 원문을 출력하지 않는다. |
| CON_IAC_020 | 리소스 이름과 Tag에 환경, 프로젝트 및 관리 주체를 식별할 수 있는 규칙을 사용한다. |
| CON_IAC_021 | AWS 리전은 환경 변수와 Terraform 변수로 명확히 지정한다. |
| CON_IAC_022 | Bedrock 모델 지원 리전과 Polly 지원 범위를 배포 전 검증한다. |
| CON_IAC_023 | MVP Terraform에 EC2, ALB, Auto Scaling Group, RDS, ElastiCache 및 NAT Gateway를 포함하지 않는다. |
| CON_IAC_024 | Lambda ZIP 또는 런타임 패키지 배포를 기본으로 하며 ECR 리포지토리를 필수 생성하지 않는다. |
| CON_IAC_025 | Terraform Module은 재사용 가치가 있는 범위에서만 분리하고 과도하게 세분화하지 않는다. |
| CON_IAC_026 | 수동 긴급 변경을 수행한 경우 Terraform 코드와 State에 반영하여 Drift를 방치하지 않는다. |

---

# 20. CI/CD 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_CICD_001 | CI/CD는 GitHub Actions를 사용한다. |
| CON_CICD_002 | Jenkins EC2 서버를 별도로 운영하지 않는다. |
| CON_CICD_003 | Pull Request에서 프런트엔드 Lint, Type Check 및 Test를 실행한다. |
| CON_CICD_004 | Pull Request에서 Java Compile, Unit Test 및 정적 검사를 실행한다. |
| CON_CICD_005 | Pull Request에서 Terraform `fmt`, `validate` 및 `plan`을 실행한다. |
| CON_CICD_006 | 테스트 실패 시 배포를 진행하지 않는다. |
| CON_CICD_007 | 운영 배포는 보호된 브랜치 또는 태그를 기준으로 실행한다. |
| CON_CICD_008 | GitHub Actions에 장기 AWS Access Key를 저장하지 않는다. |
| CON_CICD_009 | GitHub Actions는 AWS OIDC와 AssumeRole을 사용한다. |
| CON_CICD_010 | GitHub Actions Role은 프런트 배포, Lambda 배포 및 Terraform 적용 권한을 필요 범위로 분리할 수 있다. |
| CON_CICD_011 | React 빌드 결과만 S3 배포 버킷에 업로드한다. |
| CON_CICD_012 | S3 동기화 시 사용자 업로드 데이터 삭제 옵션을 사용하지 않는다. |
| CON_CICD_013 | CloudFront 캐시 무효화 범위는 필요한 파일로 제한하는 것을 우선한다. |
| CON_CICD_014 | Lambda 배포 패키지에는 테스트 파일과 로컬 설정 및 실제 비밀정보를 포함하지 않는다. |
| CON_CICD_015 | Lambda Artifact에는 버전 또는 Commit 식별값을 추적할 수 있어야 한다. |
| CON_CICD_016 | 프런트엔드와 Lambda는 독립 배포가 가능해야 한다. |
| CON_CICD_017 | API 스키마 변경 시 호환되는 프런트엔드 배포 순서를 고려한다. |
| CON_CICD_018 | 운영 Terraform Apply에는 GitHub Environment 승인 절차를 적용할 수 있다. |
| CON_CICD_019 | 의존성 취약점이 심각한 경우 운영 배포를 차단할 수 있어야 한다. |
| CON_CICD_020 | 배포 실패 시 이전 정상 프런트 산출물과 Lambda 버전으로 복구할 수 있어야 한다. |
| CON_CICD_021 | 배포 성공 후 기본 API와 정적 페이지 Smoke Test를 실행할 수 있어야 한다. |
| CON_CICD_022 | Cognito 실제 사용자 이메일로 테스트 인증 코드를 반복 발송하지 않도록 테스트 계정과 환경을 분리한다. |
| CON_CICD_023 | 운영 Bedrock과 Polly를 무제한 호출하는 통합 테스트를 모든 Commit마다 실행하지 않는다. |
| CON_CICD_024 | 외부 AWS 서비스 통합 테스트는 수동 또는 제한된 전용 Workflow로 분리한다. |
| CON_CICD_025 | GitHub Actions 로그에도 JWT, 인증 코드 및 AWS 비밀정보를 출력하지 않는다. |

---

# 21. 배포·운영·장애 대응 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_OPS_001 | 개발과 운영 환경의 CloudFront, Cognito, API Gateway, Lambda 및 DynamoDB를 분리한다. |
| CON_OPS_002 | 운영 환경 변경 전 Terraform Plan을 검토한다. |
| CON_OPS_003 | Cognito 장애를 비밀번호 오류로 표시하지 않는다. |
| CON_OPS_004 | Bedrock 장애와 모델 출력 검증 실패를 서로 다른 사용자 안내로 처리한다. |
| CON_OPS_005 | Polly 장애 시 텍스트 카드 조회와 편집 기능을 계속 사용할 수 있어야 한다. |
| CON_OPS_006 | DynamoDB 저장 실패 시 카드 생성이 완료된 것처럼 표시하지 않는다. |
| CON_OPS_007 | API Gateway 또는 Lambda 장애 시 재시도 가능 여부를 안내한다. |
| CON_OPS_008 | AnkiConnect 장애는 AWS 서비스 장애와 구분한다. |
| CON_OPS_009 | 사용자의 Anki 미실행, 애드온 미설치, CORS 오류 및 노트 타입 오류를 구분해 안내한다. |
| CON_OPS_010 | Bedrock·Polly 오류에 무한 자동 재시도를 적용하지 않는다. |
| CON_OPS_011 | 카드 생성 실패 데이터는 사용자가 재시도할 수 있는 상태로 유지한다. |
| CON_OPS_012 | Anki 미디어 저장 성공 후 카드 추가 실패 시 동일 카드를 재시도할 수 있어야 한다. |
| CON_OPS_013 | Anki 추가 성공 후 AWS 상태 갱신 실패 시 사용자가 상태를 정정할 수 있어야 한다. |
| CON_OPS_014 | 운영 문서에는 배포, 롤백, 알람 확인, 비용 확인 및 장애 대응 절차를 포함한다. |
| CON_OPS_015 | 비용 급증 시 생성 API를 중지하거나 한도를 낮추는 절차를 포함한다. |
| CON_OPS_016 | Cognito 사용자 삭제와 DynamoDB 사용자 데이터 삭제가 일부 실패한 경우 재처리 절차를 마련한다. |
| CON_OPS_017 | DynamoDB 백업에서 복구할 수 있는 범위와 복구 시간이 보장되지 않는 범위를 문서화한다. |
| CON_OPS_018 | 로컬 Anki 데이터 복구는 서비스 운영자의 AWS 복구 범위에 포함하지 않는다. |
| CON_OPS_019 | Anki 카드와 미디어 손상에 대비해 사용자가 Anki 자체 백업을 사용해야 함을 안내할 수 있다. |
| CON_OPS_020 | 신규 Bedrock 모델이나 Polly 음성으로 전환하기 전에 개발 환경에서 카드 스키마와 발음을 검증한다. |
| CON_OPS_021 | CloudFront 정적 파일 롤백과 Lambda 코드 롤백을 별도 절차로 관리한다. |
| CON_OPS_022 | API 계약 변경으로 구버전 프런트엔드가 오류를 일으키지 않도록 배포 순서를 관리한다. |
| CON_OPS_023 | AWS 서비스 Quota와 사용 가능 여부를 운영 전에 확인한다. |
| CON_OPS_024 | 운영 환경에서 사용하지 않는 AWS 리소스를 방치하지 않는다. |
| CON_OPS_025 | 서비스 종료 시 Cognito, DynamoDB 사용자 데이터 및 정적 자산 삭제·보존 정책을 마련한다. |

---
# 22. MVP 업무 범위 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_SCOPE_001 | MVP의 학습 대상 언어는 일본어로 제한한다. |
| CON_SCOPE_002 | UI는 한국어, 영어, 일본어 및 중국어 번역 구조를 제공한다. |
| CON_SCOPE_003 | 회원가입은 이메일과 비밀번호 방식으로 제한한다. |
| CON_SCOPE_004 | 이메일 인증은 Cognito 기본 인증 흐름을 사용한다. |
| CON_SCOPE_005 | Google, Apple, Kakao 등 소셜 로그인은 MVP에서 제외한다. |
| CON_SCOPE_006 | SMS 인증과 전화번호 로그인은 MVP에서 제외한다. |
| CON_SCOPE_007 | 관리자 전용 웹 페이지는 MVP에서 제외한다. |
| CON_SCOPE_008 | 사용자는 모바일에서 단어를 생성하고 클라우드 수집함에 저장할 수 있다. |
| CON_SCOPE_009 | 사용자는 PC에서 동일 계정으로 대기 카드를 조회할 수 있다. |
| CON_SCOPE_010 | 실제 Anki 추가는 Anki Desktop이 실행 중인 PC 환경을 기준으로 한다. |
| CON_SCOPE_011 | 모바일 Anki 앱에 직접 카드를 추가하는 전용 연동은 MVP에서 제외한다. |
| CON_SCOPE_012 | 사용자의 AnkiWeb 계정과 직접 연동하지 않는다. |
| CON_SCOPE_013 | Anki 컬렉션 전체 동기화는 제공하지 않는다. |
| CON_SCOPE_014 | 사용자의 전체 Anki 덱과 학습 통계를 AWS에 수집하지 않는다. |
| CON_SCOPE_015 | 카드 생성은 Amazon Bedrock을 사용한다. |
| CON_SCOPE_016 | 음성 생성은 Amazon Polly를 사용한다. |
| CON_SCOPE_017 | AivisSpeech 설치와 실행은 MVP 필수 조건에서 제외한다. |
| CON_SCOPE_018 | 카드 데이터는 DynamoDB 개인 수집함에 저장한다. |
| CON_SCOPE_019 | Polly 음성은 AWS에 영구 저장하지 않는다. |
| CON_SCOPE_020 | S3는 React 정적 파일 배포 용도로만 사용한다. |
| CON_SCOPE_021 | 사용자가 생성 결과를 확인하고 수정한 후 Anki에 추가한다. |
| CON_SCOPE_022 | AI 결과를 사용자의 확인 없이 자동으로 대량 Anki 추가하지 않는다. |
| CON_SCOPE_023 | AI 결과의 정확성을 완전히 보장하지 않는다. |
| CON_SCOPE_024 | AnkiConnect 설치와 기본 CORS 설정은 사용자가 수행해야 할 수 있다. |
| CON_SCOPE_025 | 전용 Anki 애드온 개발은 MVP 이후 확장 범위로 한다. |
| CON_SCOPE_026 | 카드 수집함, 상태 필터, 즐겨찾기 및 일괄 추가를 MVP에 포함한다. |
| CON_SCOPE_027 | 공개 단어장과 사용자 간 공유는 MVP에서 제외한다. |
| CON_SCOPE_028 | 댓글, 좋아요, 친구 추가 및 커뮤니티 기능은 MVP에서 제외한다. |
| CON_SCOPE_029 | 결제와 유료 구독은 MVP에서 제외한다. |
| CON_SCOPE_030 | 광고와 뉴스레터 기능은 MVP에서 제외한다. |
| CON_SCOPE_031 | 네이티브 모바일 앱과 앱 푸시 알림은 MVP에서 제외한다. |
| CON_SCOPE_032 | EC2, ALB, ASG 및 Spring Boot 서버는 MVP에서 사용하지 않는다. |
| CON_SCOPE_033 | RDS, MySQL, JPA 및 Redis는 MVP에서 사용하지 않는다. |
| CON_SCOPE_034 | Docker, ECR 및 Jenkins 서버는 MVP 필수 구성에서 제외한다. |
| CON_SCOPE_035 | 서버리스 구조를 유지하며 요청 기반 Lambda 실행을 사용한다. |
| CON_SCOPE_036 | 대규모 상용 서비스 수준의 SLA를 MVP에서 보장하지 않는다. |
| CON_SCOPE_037 | 대량 카드 가져오기와 무제한 생성은 MVP에서 제공하지 않는다. |
| CON_SCOPE_038 | 사용자 카드의 무제한 버전 이력은 MVP에서 제공하지 않는다. |
| CON_SCOPE_039 | 삭제 카드 휴지통과 장기 복구 기능은 MVP 이후로 분류할 수 있다. |
| CON_SCOPE_040 | 일본어 이외 학습 언어 확대는 MVP 이후 범위로 한다. |

---

# 23. 개발 원칙 및 코드 품질 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_DEV_001 | 기능 구현 전 `REQ_*` 요구사항 ID와 대응되는 개발 작업을 정의한다. |
| CON_DEV_002 | 제약사항 위반 가능성이 있는 구현은 코드 리뷰에서 확인한다. |
| CON_DEV_003 | Lambda Handler에 모든 비즈니스 로직을 작성하지 않는다. |
| CON_DEV_004 | 인증 Claim 처리, 입력 검증, 카드 생성, 음성 생성 및 저장소 접근을 분리한다. |
| CON_DEV_005 | Bedrock, Polly, Cognito 및 DynamoDB SDK 호출을 각각의 Client 또는 Adapter로 분리한다. |
| CON_DEV_006 | AWS SDK 응답 객체를 React API 응답에 그대로 반환하지 않는다. |
| CON_DEV_007 | 사용자에게 반환하는 API DTO와 DynamoDB 저장 모델을 필요에 따라 분리한다. |
| CON_DEV_008 | 카드 스키마를 한 곳에서 정의하고 프런트엔드와 백엔드 검증 규칙의 불일치를 줄인다. |
| CON_DEV_009 | Java에서는 Record, DTO 및 Validator 등 명확한 자료형을 사용한다. |
| CON_DEV_010 | `Map<String, Object>`만으로 전체 비즈니스 모델을 구현하지 않는다. |
| CON_DEV_011 | TypeScript에서 핵심 카드 데이터를 `any`로 처리하지 않는다. |
| CON_DEV_012 | API 오류 코드와 사용자 메시지를 분리한다. |
| CON_DEV_013 | 사용자 입력과 AI 출력에 동일한 Sanitization 정책을 적용한다. |
| CON_DEV_014 | 로그 출력 전에 민감정보 마스킹을 적용한다. |
| CON_DEV_015 | 실제 AWS 키와 Cognito 토큰을 소스 코드와 테스트 Fixture에 포함하지 않는다. |
| CON_DEV_016 | 개발, 테스트 및 운영 설정을 분리한다. |
| CON_DEV_017 | 환경별 설정 변경을 위해 소스 코드에 조건문을 반복 작성하지 않는다. |
| CON_DEV_018 | Bedrock 모델 ID, Polly Voice ID 및 사용량 제한값을 설정으로 관리한다. |
| CON_DEV_019 | 하드코딩된 서비스 도메인 대신 환경별 설정을 사용한다. |
| CON_DEV_020 | 카드 생성 Prompt와 출력 Schema를 버전 관리한다. |
| CON_DEV_021 | Prompt 변경은 샘플 단어 회귀 테스트 후 반영한다. |
| CON_DEV_022 | Anki 노트 타입 템플릿과 CSS를 별도 파일 또는 명확한 모듈로 관리한다. |
| CON_DEV_023 | 템플릿 문자열을 여러 소스 파일에 중복 작성하지 않는다. |
| CON_DEV_024 | 18개 Anki 필드 목록을 한 곳에서 관리한다. |
| CON_DEV_025 | 비동기 요청에는 중복 실행과 오래된 응답 덮어쓰기를 방지한다. |
| CON_DEV_026 | 카드 추가 일괄 작업은 일부 실패를 처리할 수 있어야 한다. |
| CON_DEV_027 | 사용하지 않는 클래스, 디버그 코드 및 임시 인증정보를 운영 배포물에 포함하지 않는다. |
| CON_DEV_028 | 모든 소스 파일과 문서는 UTF-8 인코딩을 사용한다. |
| CON_DEV_029 | 공개 API와 내부 함수에 필요한 수준의 문서와 주석을 작성한다. |
| CON_DEV_030 | README에 로컬 실행, AWS 배포, Cognito 설정, AnkiConnect 설정 및 테스트 절차를 포함한다. |
| CON_DEV_031 | 실제 사용하지 않는 AWS 서비스를 포트폴리오 설명에 포함하지 않는다. |
| CON_DEV_032 | EC2, ALB, RDS 및 Redis를 사용하지 않는 이유를 아키텍처 결정 기록에 남긴다. |
| CON_DEV_033 | 서버리스 선택 이유와 비용·운영상 Trade-off를 문서화한다. |
| CON_DEV_034 | MVP 범위에 없는 기능을 임의로 추가하기 전에 01·02·03 문서를 수정한다. |
| CON_DEV_035 | API 또는 카드 스키마 변경 시 관련 요구사항과 제약사항 문서를 함께 갱신한다. |
| CON_DEV_036 | 운영 배포 전 불필요한 CloudWatch 상세 로그와 디버그 설정을 제거한다. |
| CON_DEV_037 | 예외를 빈 Catch로 무시하지 않는다. |
| CON_DEV_038 | 사용자에게 실패를 성공으로 표시하는 Fallback을 구현하지 않는다. |
| CON_DEV_039 | 외부 AWS 서비스 장애 시 임의의 가짜 카드나 음성을 실제 결과처럼 반환하지 않는다. |
| CON_DEV_040 | 한자 읽기와 뜻을 코드에 무분별하게 하드코딩하지 않는다. |

---

# 24. 테스트 제약사항

| 제약사항 ID | 제약사항 |
|---|---|
| CON_TEST_001 | 요구사항 ID와 대응되는 테스트 케이스를 작성한다. |
| CON_TEST_002 | 프런트엔드 단위 테스트에는 입력 검증, 인증 상태, 카드 편집 및 진행 상태를 포함한다. |
| CON_TEST_003 | Java Lambda 단위 테스트에는 입력 검증, 권한 Claim 해석, 카드 정규화 및 오류 변환을 포함한다. |
| CON_TEST_004 | Bedrock Client와 Polly Client 단위 테스트에는 실제 호출 대신 Mock을 사용할 수 있다. |
| CON_TEST_005 | DynamoDB Repository 테스트에는 조건부 쓰기, 페이지 처리 및 사용자 격리를 포함한다. |
| CON_TEST_006 | 다른 사용자의 `cardId`를 이용한 조회·수정·삭제가 거부되는지 테스트한다. |
| CON_TEST_007 | JWT가 없거나 만료되거나 잘못된 경우 회원 전용 API가 거부되는지 테스트한다. |
| CON_TEST_008 | 이메일 인증을 완료하지 않은 계정의 접근 제한을 테스트한다. |
| CON_TEST_009 | Bedrock이 잘못된 JSON을 반환하는 경우를 테스트한다. |
| CON_TEST_010 | 필수 필드 누락, 잘못된 자료형 및 배열 길이 불일치를 테스트한다. |
| CON_TEST_011 | AI 출력에 Script와 이벤트 속성이 포함된 경우 제거되는지 테스트한다. |
| CON_TEST_012 | Polly 일부 항목 실패 시 성공 항목이 유지되는지 테스트한다. |
| CON_TEST_013 | 사용자별 일일 사용량 한도의 경쟁 상태를 테스트한다. |
| CON_TEST_014 | 동일 멱등성 키 요청이 중복 카드와 중복 사용량을 만들지 않는지 테스트한다. |
| CON_TEST_015 | DynamoDB 페이지 Cursor가 정상 동작하는지 테스트한다. |
| CON_TEST_016 | 동시에 수정된 카드의 충돌 처리 방식을 테스트한다. |
| CON_TEST_017 | AnkiConnect가 실행되지 않은 경우의 화면 안내를 테스트한다. |
| CON_TEST_018 | AnkiConnect HTTP 성공이지만 `error` 값이 있는 경우를 테스트한다. |
| CON_TEST_019 | 미디어 저장 성공 후 카드 저장 실패 상황을 테스트한다. |
| CON_TEST_020 | 카드 저장 성공 후 DynamoDB `ADDED` 갱신 실패 상황을 테스트한다. |
| CON_TEST_021 | 18개 Anki 필드가 정확한 이름으로 전달되는지 테스트한다. |
| CON_TEST_022 | 기존 노트 타입에 일부 필드가 없는 경우 추가되는지 테스트한다. |
| CON_TEST_023 | 기존 노트 타입의 사용자 데이터를 삭제하지 않는지 테스트한다. |
| CON_TEST_024 | 데스크톱 Chrome과 Edge에서 CloudFront Origin의 AnkiConnect 호출을 실제 검증한다. |
| CON_TEST_025 | 모바일 화면에서 생성과 수집함 저장이 가능한지 테스트한다. |
| CON_TEST_026 | 모바일 화면에서 Anki 추가 제한 안내가 표시되는지 테스트한다. |
| CON_TEST_027 | 한국어, 영어, 일본어 및 중국어 UI에서 레이아웃이 깨지지 않는지 테스트한다. |
| CON_TEST_028 | 다크 모드와 라이트 모드의 주요 화면을 테스트한다. |
| CON_TEST_029 | 실제 Bedrock·Polly 통합 테스트는 호출 횟수를 제한하고 전용 테스트 계정을 사용한다. |
| CON_TEST_030 | 실제 인증 이메일 테스트는 운영 사용자에게 발송되지 않도록 환경을 분리한다. |
| CON_TEST_031 | Terraform Plan에 예상하지 못한 운영 리소스 삭제가 없는지 검토한다. |
| CON_TEST_032 | 배포 후 CloudFront 정적 페이지, 인증, 카드 목록 및 기본 API Smoke Test를 수행한다. |
| CON_TEST_033 | 보안 테스트에는 XSS, 잘못된 JWT, Cross-user 접근 및 과도한 요청을 포함한다. |
| CON_TEST_034 | 테스트 로그에도 비밀번호, 인증 코드, JWT 및 전체 음성 데이터를 남기지 않는다. |
| CON_TEST_035 | 실제 AWS 장애를 유발하는 파괴적 테스트는 운영 환경에서 수행하지 않는다. |

---

# 25. 최종 확정 기술 구성

| 영역 | 확정 구성 |
|---|---|
| 프런트엔드 | React + TypeScript |
| 프런트엔드 빌드 | Vite |
| 정적 웹 배포 | Amazon S3 + Amazon CloudFront |
| 인증 | Amazon Cognito User Pool |
| API 진입점 | Amazon API Gateway |
| 백엔드 실행 | AWS Lambda |
| 백엔드 언어 | Java 21 |
| Java 빌드 | Maven |
| 사용자 데이터 | Amazon DynamoDB |
| 카드 생성 | Amazon Bedrock |
| 음성 합성 | Amazon Polly |
| 로컬 Anki 연동 | Anki Desktop + AnkiConnect |
| 모니터링 | Amazon CloudWatch |
| 인프라 관리 | Terraform |
| CI/CD | GitHub Actions |
| AWS 배포 인증 | GitHub Actions OIDC |
| AWS 카드 음성 영구 저장 | 사용하지 않음 |
| 관계형 데이터베이스 | 사용하지 않음 |
| Redis | 사용하지 않음 |
| EC2·ALB·ASG | 사용하지 않음 |
| Spring Boot | 사용하지 않음 |
| Docker·ECR | 필수로 사용하지 않음 |
| Jenkins | 사용하지 않음 |
| AivisSpeech | AWS 버전에서 사용하지 않음 |

---

# 26. 제약사항 완료 판단 기준

다음 조건을 충족해야 ANKI-HELPER MVP가 본 제약사항을 준수한다고 판단한다.

1. React 정적 파일이 비공개 S3와 CloudFront를 통해 배포된다.
2. Cognito 인증을 완료한 사용자만 Bedrock·Polly 기능을 호출할 수 있다.
3. API Gateway가 JWT를 검증하고 Lambda가 Cognito `sub`를 기준으로 사용자 데이터를 처리한다.
4. Lambda에 Spring Boot, EC2 및 ALB가 필요하지 않은 Stateless 구조가 적용된다.
5. DynamoDB에 사용자별 카드와 설정 및 사용량이 분리되어 저장된다.
6. 다른 사용자의 카드 조회·수정·삭제가 거부된다.
7. Bedrock 응답이 정의된 카드 스키마로 검증되고 위험한 HTML이 제거된다.
8. Bedrock 결과가 사용자 검토 없이 자동으로 Anki에 저장되지 않는다.
9. Polly는 검증된 읽기를 사용하고 생성 음성을 S3와 DynamoDB에 영구 저장하지 않는다.
10. 브라우저가 로컬 AnkiConnect를 호출하며 Lambda는 `localhost:8765`를 호출하지 않는다.
11. Anki 노트 타입에 정의된 18개 필드가 유지된다.
12. Anki 추가의 부분 성공과 AWS 상태 갱신 실패를 복구할 수 있다.
13. 사용자별 생성 한도, API 제한 및 비용 알람이 적용된다.
14. JWT, 비밀번호, 인증 코드, AWS 키, 전체 Prompt·Response 및 음성 데이터가 로그에 노출되지 않는다.
15. 주요 AWS 리소스가 Terraform으로 재현 가능하다.
16. GitHub Actions가 장기 Access Key 없이 OIDC로 배포한다.
17. EC2, ALB, RDS, Redis, Docker/ECR 및 Jenkins 서버가 MVP 필수 구성에 포함되지 않는다.
18. CloudWatch에서 인증, API, Lambda, DynamoDB, Bedrock 및 Polly 오류를 확인할 수 있다.
19. 계정 탈퇴 시 AWS 사용자 데이터를 삭제하되 로컬 Anki 데이터는 삭제하지 않는다.
20. MVP 범위 밖 기능이 구현 전에 01·02·03 문서에 반영된다.
