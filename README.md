![save](https://github.com/laetipark/budget-manager/assets/68440583/a9d1c114-d60e-425f-85b0-ae4a93d0d3b8)
# 💰 예산 관리 어플리케이션

본 서비스는 사용자들이 개인 재무를 관리하고 지출을 추적하는 데
도움을 주는 애플리케이션입니다. 이 앱은 사용자들이 예산을 설정하고
지출을 모니터링하며 재무 목표를 달성하는 데 도움이 됩니다.

# 🛠️ 기술 스택

![Typescript](https://img.shields.io/badge/Typescript-3178C6?style=flat&logo=Javascript&logoColor=FFFFFF)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=NestJS&logoColor=FFFFFFF)
![Node.js](https://img.shields.io/badge/Node.js-v18.18.2-DDDDDD?style=flat&logo=Node.js&logoColor=FFFFFF&labelColor=339933)
![Mysql](https://img.shields.io/badge/Mysql-8.0.35-DDDDDD?logo=mysql&labelColor=4479A1&logoColor=FFFFFF)
![Redis](https://img.shields.io/badge/Redis-2.1.0-DDDDDD?logo=redis&labelColor=DC382D&logoColor=FFFFFF)
![WebStorm](https://img.shields.io/badge/WebStorm-07B2F4?style=flat&logo=WebStorm&logoColor=FFFFFF)

# 🏷️ 목차

1. [:gear: 환경 설정 및 실행](#gear-환경-설정-및-실행)
2. [:cd: 데이터베이스 모델링](#cd-데이터베이스-모델링)

# :gear: 환경 설정 및 실행

데이터베이스 스키마를 생성합니다.

```sql
CREATE DATABASE `wanted`
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

서버 및 데이터베이스 연결을 위한 환경 변수를 설정합니다.

```dotenv
SERVER_PORT=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
JWT_SECRET=
```

데이터베이스 스키마 생성 후, 스크립트 파일 실행으로 초기 설정합니다.

```bash
> sh start.sh # 리눅스 스크립트 파일 실행
> ./start.bat # 윈도우 스크립트 파일 실행
```

# :cd: 데이터베이스 모델링
![Database-ERD](https://github.com/laetipark/budget-manager/assets/68440583/1bbb4f6e-0eda-49b2-b3f7-ae8762d18333)
