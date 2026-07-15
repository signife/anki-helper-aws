# ANKI-HELPER 스펙 요구 정의서

## 1. 문서 목적

본 문서는 기존 Anki Vocabulary Helper를 AWS 기반 AI 어휘 카드 생성 서비스인 **ANKI-HELPER**로 확장하기 위한 개발 목적, 사용자 범위, 핵심 기능, 서비스 흐름, Amazon Bedrock·Amazon Polly 연동, AnkiConnect 연동 및 MVP 개발 범위를 정의한다.

상세 기능 및 비기능 요구사항은 `02-requirements.md`에서 정의하고, 기술·보안·AWS 서비스·외부 연동 관련 제약사항은 `03-constraints.md`에서 정의한다.

---

## 2. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 프로젝트명 | ANKI-HELPER |
| 서비스 형태 | PC·모바일 반응형 웹 서비스 |
| 주요 목적 | 일본어 단어를 입력하면 AI가 Anki 카드 데이터를 생성하고, 음성을 합성하여 사용자의 로컬 Anki에 바로 추가할 수 있도록 한다. |
| 주요 사용자 | 일본어 학습자, Anki 사용자 |
| MVP 사용자 구분 | 이메일 인증을 완료한 회원 사용자 |
| 핵심 기능 | 일본어 단어 입력, AI 카드 데이터 생성, 카드 미리보기·수정, 일본어 음성 생성, Anki 노트 타입 자동 설정, Anki 카드 및 미디어 저장 |
| AI 연동 | Amazon Bedrock |
| 음성 합성 | Amazon Polly |
| 로컬 연동 | Anki Desktop 및 AnkiConnect |
| 프런트엔드 | React + TypeScript |
| 프런트엔드 배포 | Amazon S3 정적 웹 자산 저장 + Amazon CloudFront 배포 |
| 백엔드 | Amazon API Gateway + AWS Lambda 기반 Stateless API |
| 인프라 관리 | Terraform |
| CI/CD | GitHub Actions |
| 모니터링 | Amazon CloudWatch |
| 데이터베이스 | Amazon DynamoDB — 사용자 프로필, 설정, 카드 수집함, 상태 및 사용량 저장 |
| 초기 지원 언어 | 웹 UI: 한국어·영어·일본어·중국어 / 학습 대상: 일본어 |
| 운영 환경 | AWS 서버리스 환경 |

---

## 3. 프로젝트 추진 배경

기존 Anki Vocabulary Helper는 ChatGPT가 생성한 JSON을 사용자가 직접 복사하여 웹페이지에 붙여넣고, 로컬에서 실행 중인 AivisSpeech를 호출하여 음성을 생성한 뒤 AnkiConnect를 통해 카드와 음성을 저장하는 방식으로 동작한다.

기존 방식은 카드 템플릿, 후리가나, 한자 정보, 음성 재생 및 Anki 자동 설정 기능을 제공하지만, 일반 사용자가 실제로 사용하기 위해 다음과 같은 준비와 반복 작업을 수행해야 한다.

- ChatGPT에 정해진 프롬프트를 입력해야 한다.
- ChatGPT가 출력한 JSON을 복사해야 한다.
- JSON 형식이 올바른지 확인해야 한다.
- JSON을 웹페이지에 붙여넣어야 한다.
- AivisSpeech를 별도로 설치해야 한다.
- AivisSpeech를 카드 생성 시마다 실행해야 한다.
- 로컬 음성 엔진의 URL과 포트 및 CORS 허용 주소를 설정해야 한다.
- AnkiConnect와 음성 엔진의 연결 상태를 각각 확인해야 한다.
- 생성 과정 중 일부가 실패하면 어느 단계에서 실패했는지 사용자가 직접 확인해야 한다.

이 과정은 개발자에게는 이해할 수 있는 흐름이지만, 일반 일본어 학습자에게는 설치와 설정 부담이 크고 반복 작업이 많다.

본 프로젝트는 다음 두 작업을 AWS로 이전한다.

1. ChatGPT에 직접 요청하던 카드 JSON 생성 작업
2. 로컬 AivisSpeech가 담당하던 일본어 음성 생성 작업

사용자는 최종적으로 Anki Desktop과 AnkiConnect를 준비하고 Anki를 실행한 뒤, 웹사이트에서 일본어 단어를 입력하여 카드를 생성하고 Anki에 추가할 수 있어야 한다.

---

## 4. 해결하려는 문제

### 4.1 카드 데이터 생성의 불편

기존 방식에서는 사용자가 AI에게 카드 출력 형식을 직접 설명해야 한다.

AI 응답이 Markdown 코드 블록을 포함하거나, 필수 필드가 누락되거나, 배열과 객체의 형식이 달라지면 카드 추가에 실패할 수 있다.

ANKI-HELPER는 카드 생성 프롬프트와 출력 스키마를 서버에서 관리하여 사용자가 JSON 구조를 알 필요가 없도록 한다.

### 4.2 로컬 음성 엔진 설치의 불편

기존 방식에서는 단어와 예문 음성을 만들기 위해 AivisSpeech를 사용자의 PC에 설치하고 실행해야 한다.

ANKI-HELPER는 Amazon Polly를 이용하여 AWS에서 일본어 음성을 생성하고, 생성된 음성을 브라우저에 전달한다.

이에 따라 사용자는 AivisSpeech 설치, 실행, 포트 확인 및 CORS 설정을 수행하지 않아도 된다.

### 4.3 Anki 카드 저장 과정의 반복

기존 방식에서는 JSON 복사, 붙여넣기, 검증, 음성 생성 및 저장 단계를 사용자가 순서대로 처리해야 한다.

ANKI-HELPER는 단어 입력부터 카드 생성, 미리보기, 음성 생성 및 Anki 저장까지 하나의 화면 흐름으로 통합한다.

### 4.4 생성형 AI 응답의 불확실성

Amazon Bedrock이 생성한 결과가 항상 정확하다고 보장할 수 없다.

따라서 AI 결과는 즉시 Anki에 저장하지 않고 다음 단계를 거친다.

```text
Amazon Bedrock 응답
    ↓
Lambda에서 JSON 형식 및 필수값 검증
    ↓
브라우저에서 카드 미리보기
    ↓
사용자 확인 또는 수정
    ↓
AnkiConnect로 최종 저장
```

---

## 5. 프로젝트 목표

### 5.1 핵심 목표

1. 사용자는 일본어 단어 또는 문법 표현을 입력할 수 있어야 한다.
2. 사용자는 JSON 프롬프트를 직접 작성하거나 ChatGPT 결과를 복사하지 않아도 되어야 한다.
3. Amazon Bedrock은 입력된 일본어 표현을 정해진 카드 데이터 형식으로 생성해야 한다.
4. 생성된 카드 데이터에는 읽기, 일본어 정의, 모국어 뜻, 자주 쓰이는 표현, 예문, 유의어 및 한자 정보가 포함되어야 한다.
5. 생성된 데이터는 서버와 클라이언트에서 검증되어야 한다.
6. 사용자는 생성된 카드를 Anki에 추가하기 전에 미리 확인하고 수정할 수 있어야 한다.
7. Amazon Polly는 단어, 표현 및 예문에 사용할 일본어 음성을 생성해야 한다.
8. 사용자는 AivisSpeech를 설치하거나 실행하지 않아도 되어야 한다.
9. 생성된 카드와 음성은 브라우저를 통해 사용자의 로컬 AnkiConnect에 전달되어야 한다.
10. 사용자는 지정한 Anki 덱에 카드를 추가할 수 있어야 한다.
11. 필요한 Anki 노트 타입, 필드, 카드 템플릿 및 CSS를 자동으로 생성하거나 업데이트할 수 있어야 한다.
12. PC와 모바일 브라우저에서 카드 생성과 미리보기를 사용할 수 있어야 한다.
13. 실제 Anki 저장은 Anki Desktop과 AnkiConnect가 실행 중인 PC 환경에서 수행할 수 있어야 한다.
14. AWS 인증정보와 Bedrock·Polly 호출 권한을 프런트엔드에 노출해서는 안 된다.
15. 카드 데이터와 음성은 AWS에 영구 저장하지 않고 최종적으로 사용자의 Anki에 저장해야 한다.

### 5.2 부가 목표

- 일본어 학습자가 단어를 발견한 뒤 Anki 카드로 만드는 데 필요한 시간을 줄인다.
- 카드마다 일정한 필드 구조와 디자인을 유지한다.
- AI 응답 형식 오류로 인한 카드 생성 실패를 줄인다.
- 일본어 한자의 오독을 줄이기 위해 히라가나 읽기를 음성 합성 입력에 사용한다.
- 후리가나가 포함된 자연스러운 예문과 표현을 제공한다.
- 프런트엔드와 AWS API를 분리하여 각 영역을 독립적으로 배포할 수 있도록 한다.
- 서버를 상시 운영하지 않는 서버리스 구조를 사용하여 토이 프로젝트의 고정 비용을 줄인다.
- Terraform으로 AWS 인프라를 재현할 수 있도록 한다.
- GitHub Actions를 통해 테스트, 빌드 및 배포를 자동화한다.
- CloudWatch를 통해 AI 생성 실패, 음성 생성 실패, API 오류 및 응답시간을 확인할 수 있도록 한다.

---

## 6. 사용자 구분

### 6.1 비회원 사용자

비회원 사용자는 다음 기능을 사용할 수 있다.

- 서비스 소개 및 기능 안내 확인
- 회원가입
- 이메일 인증
- 로그인
- 비밀번호 재설정
- AnkiConnect 설치 및 초기 설정 안내 확인

비회원은 Amazon Bedrock과 Amazon Polly를 사용하는 카드 생성 기능 및 개인 카드 수집함에 접근할 수 없다.

### 6.2 MVP 회원 사용자

MVP에서는 이메일 인증을 완료하고 로그인한 회원 사용자를 기본 사용자로 한다.

회원 사용자는 다음 기능을 사용할 수 있다.

- 일본어 단어 또는 문법 표현 입력
- 카드 모드와 모국어 선택
- Amazon Bedrock 카드 데이터 생성
- 생성 결과 미리보기 및 수정
- 생성된 카드 초안을 개인 수집함에 저장
- 모바일이나 다른 PC에서 저장한 카드 조회
- 카드 상태별 조회 및 즐겨찾기
- 단어·표현·예문 음성 생성
- Amazon Polly 음성 미리듣기
- PC에서 여러 대기 카드를 선택해 Anki에 일괄 추가
- AnkiConnect 연결 확인
- Anki 덱 선택 또는 덱 이름 입력
- Anki 노트 타입 및 카드 템플릿 자동 생성·업데이트
- 화면 언어, 카드 모드, 모국어, 덱, 글꼴, 음성 및 속도 설정 동기화
- 사용자별 일일 카드 생성 및 음성 생성 사용량 확인
- 로그아웃, 비밀번호 변경 및 계정 탈퇴

사용자의 프로필, 클라우드 설정, 카드 초안, 카드 상태 및 사용량은 Amazon DynamoDB에 저장한다.

AnkiConnect URL처럼 특정 PC에 종속되는 값은 브라우저 `localStorage`에 저장한다.

로그인 기능은 Amazon Cognito로 구현하며, API Gateway는 Cognito JWT를 검증한 후 Lambda를 호출한다.


---

## 7. 기존 서비스와 개선 서비스 비교

| 구분 | 기존 Anki Vocabulary Helper | ANKI-HELPER |
|---|---|---|
| 카드 데이터 생성 | 사용자가 ChatGPT에 직접 요청 | Amazon Bedrock이 API에서 생성 |
| JSON 처리 | 사용자가 복사·붙여넣기 | 서버가 자동 생성·검증 |
| 음성 생성 | 로컬 AivisSpeech | Amazon Polly |
| 음성 엔진 설치 | 필요 | 불필요 |
| 음성 엔진 실행 | 카드 생성 시 필요 | 불필요 |
| 음성 엔진 포트 설정 | 필요 | 불필요 |
| Anki 연동 | AnkiConnect | AnkiConnect 유지 |
| 카드 미리보기 | 제공 | 유지·개선 |
| Anki 자동 설정 | 제공 | 유지 |
| 후리가나 | 제공 | 유지 |
| 한자 정보 팝업 | 제공 | 유지 |
| 웹 배포 | GitHub Pages | Amazon S3 + CloudFront |
| 백엔드 | 없음 | API Gateway + Lambda |
| 영구 데이터베이스 | 없음 | Amazon DynamoDB — 회원별 카드 수집함·설정·상태·사용량 저장 |
| 운영 모니터링 | 제한적 | CloudWatch |
| 인프라 자동화 | 없음 | Terraform |
| CI/CD | 제한적 | GitHub Actions |

---

## 8. 기본 서비스 흐름

### 8.1 최초 준비 및 회원가입 흐름

```text
사용자가 ANKI-HELPER 웹사이트 접속
    ↓
회원가입
    ↓
Cognito 이메일 인증
    ↓
로그인
    ↓
기본 모국어·카드 모드·음성 설정 저장
    ↓
PC 사용자는 Anki Desktop과 AnkiConnect 설치
    ↓
필요한 경우 서비스 도메인을 AnkiConnect 허용 목록에 등록
    ↓
Anki 재시작
    ↓
AnkiConnect 연결 확인
    ↓
추천 Anki 설정 생성
    ↓
사용 준비 완료
```

### 8.2 카드 생성 및 클라우드 저장 흐름

```text
로그인 사용자가 일본어 단어 입력
    ↓
카드 모드와 모국어 선택
    ↓
브라우저가 Cognito JWT와 함께 API Gateway에 요청
    ↓
API Gateway가 JWT 검증 후 Lambda 호출
    ↓
Lambda가 입력값과 사용자별 사용량 검증
    ↓
Lambda가 Amazon Bedrock 호출
    ↓
Bedrock이 카드 데이터 생성
    ↓
Lambda가 필수 필드와 데이터 형식 검증
    ↓
정규화된 카드 데이터를 DynamoDB 개인 수집함에 READY 상태로 저장
    ↓
브라우저가 카드 미리보기 표시
    ↓
사용자가 결과 확인 또는 수정
    ↓
수정 결과를 DynamoDB에 저장
```

### 8.3 PC에서 Anki 추가 흐름

```text
사용자가 PC에서 로그인
    ↓
DynamoDB 개인 수집함의 READY 카드 조회
    ↓
Anki Desktop 실행 및 AnkiConnect 연결 확인
    ↓
사용자가 카드 한 장 또는 여러 장 선택
    ↓
Lambda가 필요한 읽기 텍스트를 Amazon Polly에 전달
    ↓
Polly가 단어·표현·예문 음성 생성
    ↓
Lambda가 음성 데이터를 브라우저에 반환
    ↓
브라우저가 localhost:8765의 AnkiConnect 호출
    ↓
음성 파일을 Anki 미디어에 저장
    ↓
카드 필드를 지정한 Anki 덱에 저장
    ↓
성공한 카드 상태를 DynamoDB에서 ADDED로 갱신
    ↓
카드별 성공·실패 결과 표시
```

### 8.4 오류 발생 흐름

```text
입력값 오류
→ 입력 필드에 수정 안내 표시

Bedrock 호출 실패
→ 카드 생성 실패 안내 및 재시도 제공

Bedrock 응답 검증 실패
→ 잘못된 필드 안내 또는 제한적 재생성

Polly 호출 실패
→ 음성 없이 카드 생성 또는 음성만 재시도 선택

AnkiConnect 연결 실패
→ Anki 실행 여부와 애드온 설치 상태 안내

중복 카드
→ 기존 카드 가능성 안내 및 중복 추가 정책 적용
```

---

## 9. 카드 데이터 범위

### 9.1 카드 모드

ANKI-HELPER는 다음 두 가지 카드 모드를 지원한다.

| 카드 모드 | 설명 |
|---|---|
| `jp-jp` | 카드 뒷면에 자연스러운 일본어 사전식 정의를 표시한다. |
| `jp-native` | 카드 뒷면에 사용자가 선택한 모국어 뜻을 표시한다. |

### 9.2 기본 카드 필드

| 필드 | 설명 |
|---|---|
| `Word` | 일본어 표제어 또는 문법 표현 |
| `Reading` | 표제어 전체 히라가나 읽기 |
| `FuriganaWord` | Anki 후리가나 필터에 사용할 표제어 |
| `CardMode` | `jp-jp` 또는 `jp-native` |
| `Definition` | 일본어 사전식 정의 |
| `NativeMeaning` | 사용자의 모국어 뜻 |
| `Expressions` | 자주 사용하는 결합 표현 또는 관용 표현 |
| `ExpressionReadings` | 표현별 전체 읽기 |
| `Examples` | 자연스러운 일본어 예문 |
| `ExampleReadings` | 예문별 전체 히라가나 읽기 |
| `Synonyms` | 유의어 또는 유사 표현 |
| `KanjiData` | 표제어에 포함된 한자별 음독·훈독·의미 정보 |
| `WordAudio` | 단어 음성 Anki 미디어 태그 |
| `ExamplesAudio` | 예문 음성 Anki 미디어 태그 |
| `ExpressionsAudio` | 표현 음성 Anki 미디어 태그 |
| `WordAudioSource` | 단어 음성 생성에 사용한 텍스트와 설정 |
| `ExamplesAudioSource` | 예문 음성 생성에 사용한 텍스트와 설정 |
| `ExpressionsAudioSource` | 표현 음성 생성에 사용한 텍스트와 설정 |

### 9.3 생성 규칙

- `Word`는 사용자가 입력한 학습 대상 표현을 포함해야 한다.
- `Reading`은 전체 히라가나 읽기를 사용해야 한다.
- `Definition`은 자연스러운 일본어 사전식 설명이어야 한다.
- `NativeMeaning`은 선택한 모국어에 맞게 생성해야 한다.
- `Expressions`와 `Examples`에는 허용된 HTML ruby 태그를 사용할 수 있다.
- 한자가 포함된 표현과 예문에는 가능한 범위에서 후리가나를 생성해야 한다.
- 배열 필드에 정보가 없는 경우 `null`이 아니라 빈 배열을 사용해야 한다.
- 한자 정보가 없는 경우 빈 객체를 사용해야 한다.
- AI가 생성한 HTML은 허용 태그와 속성만 남기도록 정제해야 한다.
- 사용자가 최종 저장 전에 생성 결과를 수정할 수 있어야 한다.

---

## 10. Amazon Bedrock 역할

Amazon Bedrock은 다음 작업을 담당한다.

- 일본어 표제어 읽기 생성
- 일본어 사전식 정의 생성
- 사용자의 모국어 뜻 생성
- 자주 쓰이는 표현 생성
- 자연스러운 예문 생성
- 표현과 예문의 전체 읽기 생성
- 유의어 또는 유사 표현 생성
- 표제어에 포함된 한자 정보 생성
- 정해진 카드 데이터 구조로 결과 반환

Amazon Bedrock은 다음 작업을 담당하지 않는다.

- Anki 연결 상태 확인
- Anki 덱 생성
- Anki 노트 타입 생성
- Anki 카드 저장
- Anki 미디어 파일 저장
- 사용자 브라우저 설정 저장
- AWS 권한 검증
- API 사용량 제한
- 생성 결과의 최종 정확성 보장

Bedrock 결과는 항상 애플리케이션 검증과 사용자 확인을 거쳐야 한다.

---

## 11. Amazon Polly 역할

Amazon Polly는 다음 음성을 생성한다.

- 표제어 음성
- 자주 쓰이는 표현 음성
- 예문 음성

음성 합성에는 가능한 한 한자 원문보다 `Reading`, `ExpressionReadings`, `ExampleReadings`의 히라가나 텍스트를 우선 사용한다.

사용자는 다음 설정을 선택할 수 있다.

- 지원되는 일본어 음성
- 음성 생성 여부
- 단어 음성 생성 여부
- 표현 음성 생성 여부
- 예문 음성 생성 여부
- 지원 범위 내 말하기 속도

생성된 음성은 AWS에 영구 저장하지 않는다.

Lambda는 음성 데이터를 브라우저에 반환하고, 브라우저는 AnkiConnect의 미디어 저장 기능을 이용하여 사용자의 Anki 미디어 컬렉션에 저장한다.

---

## 12. AnkiConnect 연동

### 12.1 연동 원칙

AWS Lambda는 사용자의 로컬 Anki에 직접 접근할 수 없다.

AnkiConnect는 사용자의 PC에서 `localhost:8765`로 실행되므로, 최종 Anki 저장 요청은 사용자 PC에서 실행되는 브라우저 JavaScript가 담당한다.

```text
AWS Lambda
→ 카드 데이터와 음성 반환
→ 사용자 브라우저
→ http://localhost:8765
→ AnkiConnect
→ 사용자 Anki
```

### 12.2 AnkiConnect 주요 기능

ANKI-HELPER는 AnkiConnect를 통해 다음 작업을 수행한다.

- 연결 버전 확인
- 덱 목록 조회
- 덱 생성
- 노트 타입 목록 조회
- 노트 타입 생성
- 누락된 필드 추가
- 카드 앞면·뒷면 템플릿 업데이트
- 카드 CSS 업데이트
- 음성 미디어 파일 저장
- 카드 추가
- 중복 카드 정책 적용

### 12.3 Anki 실행 조건

- 카드 생성과 미리보기는 Anki가 실행되지 않아도 사용할 수 있다.
- 실제 카드 저장은 Anki Desktop과 AnkiConnect가 실행 중일 때만 가능하다.
- 모바일 브라우저에서는 카드 생성과 미리보기를 지원하되, 로컬 Anki Desktop 저장은 지원 환경에 따라 제한될 수 있다.

---

## 13. 카드 화면 및 학습 기능

기존 카드 디자인에서 다음 기능을 유지한다.

- 앞면에 일본어 표제어 표시
- 앞면 길게 누르기 동작
- 표제어 읽기 표시
- 단어 음성 재생
- 뒷면에 일본어 정의 또는 모국어 뜻 표시
- 예문 표시
- 자주 쓰이는 표현 표시
- 유의어 표시
- 표현과 예문에 ruby 후리가나 표시
- 후리가나 표시·숨김 전환
- 표제어 한자 클릭 시 한자 정보 팝업 표시
- 예문과 표현 선택 시 관련 음성 재생
- 데스크톱과 모바일 Anki 화면에 대응하는 반응형 카드 레이아웃

---

## 14. 웹 화면 구성

### 14.1 기본 화면

기본 화면은 다음 영역으로 구성한다.

1. 서비스 소개
2. AnkiConnect 연결 상태
3. 일본어 단어 입력
4. 카드 모드 선택
5. 모국어 선택
6. 음성 설정
7. AI 카드 생성 버튼
8. 생성 진행 상태
9. 카드 미리보기
10. 생성 데이터 수정
11. Anki 덱 및 노트 타입 설정
12. Anki에 추가 버튼
13. 처리 결과 안내

### 14.2 제거할 기존 화면 요소

AWS 버전에서는 일반 사용자 화면에서 다음 요소를 제거한다.

- ChatGPT용 프롬프트 복사
- 카드 JSON을 직접 붙여넣는 것을 전제로 한 기본 흐름
- JSON/TXT 파일 업로드 중심 흐름
- AivisSpeech URL 입력
- AivisSpeech 설치 안내
- AivisSpeech 실행 상태 확인
- AivisSpeech CORS 설정 안내
- AivisSpeech 보이스 목록 조회

생성된 JSON을 확인하는 개발자용 상세 보기 또는 문제 해결용 보기 기능은 선택적으로 유지할 수 있다.

---

## 15. 시스템 구성

```text
사용자
    ↓
Amazon CloudFront
    ↓
Amazon S3
- React 정적 파일
- CSS
- JavaScript 번들
- 이미지 및 아이콘

사용자 브라우저
    ↓ HTTPS
Amazon API Gateway
    ↓
AWS Lambda
    ├─ Amazon Bedrock
    └─ Amazon Polly
    ↓
카드 JSON + 음성 데이터
    ↓
사용자 브라우저
    ↓ localhost:8765
AnkiConnect
    ↓
사용자 Anki
```

운영 및 배포 구성은 다음과 같다.

```text
Terraform
→ S3, CloudFront, API Gateway, Lambda, IAM, CloudWatch 구성

GitHub Actions
→ React 테스트 및 빌드
→ S3 배포
→ CloudFront 캐시 무효화
→ Lambda 빌드 및 배포
→ Terraform 검증 및 배포

CloudWatch
→ Lambda 로그
→ API Gateway 지표
→ Bedrock·Polly 호출 결과
→ 오류율 및 응답시간 알람
```

---

## 16. 데이터 저장 및 관리

### 16.1 DynamoDB에 영구 저장하는 데이터

MVP에서는 다음 데이터를 Amazon DynamoDB에 사용자별로 저장한다.

- Cognito `sub` 기반 사용자 프로필
- 표시 이름과 기본 모국어
- 기본 카드 모드, 덱, 글꼴, Polly 음성 및 속도 설정
- Bedrock이 생성하고 검증한 카드 데이터
- 카드의 `GENERATING`, `READY`, `FAILED`, `ADDED` 상태
- 즐겨찾기 여부
- 생성시각, 수정시각 및 Anki 추가시각
- 사용자별 일일 Bedrock·Polly 사용량
- 멱등성 처리와 단기 오류 복구에 필요한 최소 데이터

### 16.2 AWS에 영구 저장하지 않는 데이터

다음 데이터는 AWS에 불필요하게 장기간 저장하지 않는다.

- 사용자 비밀번호와 이메일 인증 코드
- Cognito JWT 원문
- Polly가 생성한 음성 바이너리 또는 Base64 전체
- 사용자의 실제 Anki 컬렉션
- Anki 미디어 컬렉션
- 사용자의 전체 학습 기록
- AnkiConnect URL
- Bedrock 원본 응답 전체와 내부 시스템 프롬프트

Polly 음성은 요청 시 생성하여 브라우저로 반환하고, 브라우저가 AnkiConnect를 통해 사용자의 로컬 Anki에 저장한다.

### 16.3 브라우저에 저장하는 기기별 설정

다음 값은 특정 PC 또는 브라우저에 종속되므로 `localStorage`에 저장할 수 있다.

- 테마
- 마지막으로 선택한 UI 언어
- AnkiConnect URL
- 해당 PC에서 마지막으로 선택한 Anki 덱
- Anki 연결 상태 확인에 필요한 비민감 설정

계정 공통 설정은 DynamoDB를 기준으로 동기화한다.

### 16.4 S3 사용 범위

Amazon S3는 React 프런트엔드 배포 용도로만 사용한다.

S3에는 다음 파일을 저장한다.

- `index.html`
- React JavaScript 번들
- CSS
- 아이콘
- 서비스 이미지
- 기타 정적 자산

사용자 카드 데이터는 DynamoDB에 저장하고, Polly 음성은 S3에 영구 저장하지 않는다.

### 16.5 사용하지 않는 데이터 계층

MVP에서는 다음 기술을 사용하지 않는다.

- Amazon RDS
- MySQL
- Spring Data JPA
- Hibernate
- Amazon ElastiCache for Redis
- 서버 세션 저장소


---

## 17. AWS 서비스 역할

| AWS 서비스 | 역할 |
|---|---|
| Amazon S3 | React 정적 웹 자산 저장 |
| Amazon CloudFront | 정적 웹 자산 배포, HTTPS 및 캐시 |
| Amazon Cognito | 이메일 회원가입, 인증, 로그인, 비밀번호 재설정 및 JWT 발급 |
| Amazon API Gateway | JWT 검증과 브라우저 API 요청 수신 |
| AWS Lambda | 회원 데이터 처리, 입력 검증, DynamoDB 저장, Bedrock·Polly 호출 및 응답 조합 |
| Amazon DynamoDB | 사용자 프로필, 설정, 카드 수집함, 상태 및 사용량 저장 |
| Amazon Bedrock | 일본어 카드 데이터 생성 |
| Amazon Polly | 일본어 단어·표현·예문 음성 생성 |
| AWS IAM | Lambda에 필요한 최소 권한 부여 |
| Amazon CloudWatch | 로그, 지표, 오류 및 알람 관리 |
| AWS Systems Manager Parameter Store 또는 Secrets Manager | 필요한 비밀정보와 환경 설정 관리 |
| AWS WAF | 공개 API의 비정상 호출 차단을 위한 선택 기능 |

---

## 18. 배포 및 운영 방향

### 18.1 Terraform

Terraform은 다음 AWS 자원을 코드로 관리한다.

- S3 버킷
- CloudFront 배포
- Origin Access Control
- Amazon Cognito User Pool 및 App Client
- API Gateway 및 JWT Authorizer
- Lambda 함수
- Amazon DynamoDB 테이블 및 인덱스
- Lambda 실행 역할
- Bedrock 호출 권한
- Polly 호출 권한
- CloudWatch Log Group
- CloudWatch Alarm
- 필요 시 Route 53 및 ACM
- 필요 시 AWS WAF

### 18.2 GitHub Actions

GitHub Actions는 다음 자동화 작업을 수행한다.

- 프런트엔드 의존성 설치
- 정적 분석 및 테스트
- React 프로덕션 빌드
- 빌드 결과를 S3에 업로드
- CloudFront 캐시 무효화
- Lambda 코드 테스트 및 빌드
- Lambda 배포 패키지 생성
- Lambda 함수 업데이트
- Terraform `fmt`, `validate`, `plan`
- 승인된 운영 배포에서 Terraform `apply`

### 18.3 CloudWatch

CloudWatch에서는 다음 항목을 확인한다.

- API Gateway 요청 수
- API Gateway 4xx 및 5xx 오류
- Lambda 호출 수
- Lambda 오류 및 타임아웃
- Lambda 실행시간
- Bedrock 호출 성공·실패
- Bedrock 응답 검증 실패
- Polly 호출 성공·실패
- 전체 카드 생성 처리시간

사용자가 입력한 전체 단어 목록, 예문 원문, AWS 인증정보 및 불필요한 AI 원본 응답은 로그에 그대로 기록하지 않는다.

---

## 19. MVP 범위

### 19.1 MVP 포함 기능

- React + TypeScript 기반 반응형 웹
- S3 + CloudFront 프런트엔드 배포
- Amazon Cognito 이메일 회원가입
- 이메일 인증 코드
- 로그인·로그아웃
- 비밀번호 재설정
- 계정 설정 및 탈퇴
- API Gateway Cognito JWT 인증
- AWS Lambda 서버리스 백엔드
- Amazon DynamoDB 사용자 프로필·설정·카드·상태·사용량 저장
- 모바일에서 일본어 단어 또는 문법 표현 수집
- `jp-jp`, `jp-native` 카드 모드
- 한국어·영어·일본어·중국어 UI
- Amazon Bedrock 카드 데이터 생성
- 카드 데이터 형식 검증
- 카드 미리보기 및 수정
- 개인 카드 수집함
- 상태별 조회와 즐겨찾기
- 모바일에서 저장한 카드를 PC에서 이어서 조회
- Amazon Polly 일본어 음성 지연 생성
- 단어·예문·표현 음성
- 음성 미리듣기
- AnkiConnect 연결 확인
- Anki 덱 생성 및 선택
- Anki 노트 타입·18개 필드·템플릿·CSS 자동 생성 또는 업데이트
- Anki 미디어 저장
- 단일 및 일괄 Anki 카드 추가
- 카드 상태 `READY`, `FAILED`, `ADDED` 관리
- 사용자별 Bedrock·Polly 사용량 제한
- Terraform 인프라 구성
- GitHub Actions CI/CD
- CloudWatch 로그, 지표 및 기본 알람

### 19.2 MVP 제외 기능

- Amazon RDS 및 MySQL
- Spring Data JPA
- Hibernate
- Amazon ElastiCache for Redis
- Spring Boot
- EC2
- Application Load Balancer
- Auto Scaling Group
- NAT Gateway
- Docker 및 Amazon ECR
- Jenkins 서버
- AivisSpeech 설치 및 연동
- Google·Apple 소셜 로그인
- Anki 컬렉션 전체 동기화
- 공개 단어장
- 사용자 간 카드 공유
- 댓글, 좋아요 및 소셜 기능
- 결제 및 유료 요금제
- 네이티브 모바일 앱
- Polly 음성의 AWS 영구 저장
- AI가 생성한 정보의 사전적 정확성 완전 보장

---

## 20. 향후 확장 범위

### 20.1 수집함 및 동기화 고도화

MVP 이후 다음 기능을 확장할 수 있다.

- 카드 폴더와 사용자 태그
- 생성 결과 버전 비교
- 삭제 카드 임시 복구
- 여러 단어 대량 가져오기
- 카드 생성 기록 내보내기
- 사용자별 고급 사용량 통계
- 지원 언어와 학습 대상 언어 확대

### 20.2 전용 Anki 애드온

표준 AnkiConnect의 수동 CORS 설정을 줄이기 위해 ANKI-HELPER 전용 Anki 애드온을 개발할 수 있다.

전용 애드온은 다음 역할을 수행할 수 있다.

- 허용된 서비스 도메인 기본 등록
- 연결 상태 확인
- 노트 타입 자동 설치
- 카드 및 미디어 저장
- 오류 메시지 개선
- 웹사이트 열기 버튼 제공

### 20.3 카드 생성 기능 확장

- 여러 단어 일괄 생성
- 예문만 다시 생성
- 표현만 다시 생성
- 한자 정보만 다시 생성
- 난이도별 예문 생성
- JLPT 등급별 설명
- 사용자 지정 필드 매핑
- 사용자 지정 카드 템플릿
- 문장 또는 문단에서 학습 단어 자동 추출

---

## 21. 성공 기준

MVP는 다음 조건을 만족하면 핵심 목적을 달성한 것으로 판단한다.

1. 사용자가 이메일로 가입하고 인증한 뒤 로그인할 수 있다.
2. 인증된 사용자만 Bedrock과 Polly 기반 기능을 사용할 수 있다.
3. 사용자가 JSON 프롬프트를 작성하거나 ChatGPT 결과를 복사하지 않고 카드를 생성할 수 있다.
4. 사용자가 AivisSpeech를 설치하거나 실행하지 않고 음성 카드를 만들 수 있다.
5. Bedrock 결과가 정의된 카드 필드 구조로 변환되고 검증된다.
6. 생성된 카드가 사용자별 DynamoDB 수집함에 저장된다.
7. 모바일에서 저장한 카드를 동일 계정의 PC에서 조회할 수 있다.
8. 사용자가 생성 결과를 미리 확인하고 수정할 수 있다.
9. Polly가 단어, 표현 및 예문에 사용할 수 있는 일본어 음성을 생성한다.
10. 브라우저가 생성된 카드와 음성을 로컬 AnkiConnect에 전달할 수 있다.
11. Anki에 노트 타입, 18개 필드, 카드 템플릿, 미디어 및 카드가 정상적으로 저장된다.
12. 여러 카드를 일괄 추가하고 카드별 성공·실패 결과를 확인할 수 있다.
13. 성공한 카드 상태가 `ADDED`로 갱신된다.
14. 사용자별 사용량 제한으로 Bedrock과 Polly의 비정상 호출을 통제할 수 있다.
15. AWS 인증정보, 비밀번호, JWT 및 인증 코드가 브라우저 코드와 로그에 노출되지 않는다.
16. Terraform을 통해 Cognito, DynamoDB를 포함한 동일 AWS 인프라를 재구성할 수 있다.
17. GitHub Actions를 통해 프런트엔드와 Lambda를 자동 배포할 수 있다.
18. CloudWatch에서 인증, API, Bedrock, Polly, Lambda 및 DynamoDB 오류를 확인할 수 있다.
19. 계정 탈퇴 시 Cognito 계정과 사용자별 DynamoDB 데이터를 삭제할 수 있다.
20. Polly 음성과 사용자의 실제 Anki 컬렉션은 AWS에 불필요하게 영구 저장되지 않는다.

---

## 22. 최종 서비스 정의

ANKI-HELPER는 사용자가 일본어 단어 또는 문법 표현을 입력하면 Amazon Bedrock이 읽기, 정의, 모국어 뜻, 표현, 예문, 유의어 및 한자 정보를 포함한 Anki 카드 데이터를 생성하고, Amazon Polly가 단어와 문장의 일본어 음성을 생성하는 AWS 기반 서버리스 웹 서비스이다.

생성 결과는 사용자의 확인을 거친 후 브라우저에서 실행되는 AnkiConnect 연동을 통해 사용자의 로컬 Anki에 저장된다.

MVP는 Amazon Cognito 로그인과 Amazon DynamoDB 개인 카드 수집함을 포함하며, Amazon S3는 React 프런트엔드 배포 용도로만 사용한다. 생성된 Polly 음성과 사용자의 실제 Anki 카드는 AWS에 영구 저장하지 않고 로컬 Anki에 저장한다.
