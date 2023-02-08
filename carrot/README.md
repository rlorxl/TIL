# Carrot Market Clone

## Tailwind

`npm install -D tailwindcss postcss autoprefixer`

`npx tailwindcss init -p`

```
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}', // pages폴더 - 모든 폴더의 {}안에 있는 지정한 확장자를 가지는 모든 파일에서 사용
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

```
// globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### modifier

- hover
- focus
- transition
- first(first-child)
- last(last-child)
- odd(1,3,5..)
- even(2,4,6..)
- ring
- space : 자식요소의 사이 간격을 준다. 첫번째나 마지막요소에 margin을 신경쓰지 않아도된다.
- empty : 콘텐츠가 없는 경우 스타일을 지정. 빈 텍스트, undefined, null등과 같이 값이 없는 경우에 해당요소에 empty:hidden은 display: none과 같다.
- divide : 엘리먼트 사이의 border width를 제어하기 위한 유틸리티. 요소의 형제가 있으면 border를 추가해준다.
- inset-x-0 / inset-y-0 : absolute인 요소에 left:0 ,right:0 / top:0, bottom:0
- aspect-video : 화면 비율에 맞게 비디오의 높이가 자동으로 조절됨.
  .
  .
- group modifier : 부모상태를 기반으로 한 스타일 지정. 이 패턴은 group-focus, group-active 또는 group-odd와 같은 모든 유사 클래스 수정자와 함께 작동한다.
- peer modifier : 형제 상태를 기반으로 한 스타일 지정 (input의 상태에 기반한 형제요소의 스타일을 변경할 수 있다.)

더 다양한 modifier가 있으니 공식문서에서 확인!

### Plugins

클래스 자동 정렬 플러그인 `npm install -D prettier prettier-plugin-tailwindcss`

tailwind forms 플러그인 `npm install @tailwindcss/forms`

[Tailwind-Styled-Component](https://www.npmjs.com/package/tailwind-styled-components)

<br/>

---

## Prisma

[JS/TS] -- [Prisma] -- [Database]
(translator)

### Setup

```
npm i prisma -D (prisma 설치)
npx prisma init (prisma폴더 생성)
```

### Steps

1. Set the `database url` in the .env file to point to your existing database.

2. Set the provider of the datasource block in `schema.prisma` to match your database

```
// schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

3. Create model (스키마 정의)

```
// schema.prisma
model User {
  id Int @id @default(autoincrement())
  phone Int? @unique
  email String? @unique
  name String
  avatar String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## PlanetScale

mysql과 호환되는 serverless 데이터베이스 플랫폼

```
brew install planetscale/tap/pscale
brew install mysql-client
```

설치 후 vsc에서 `pscale`입력하여 확인.

**1. 로그인**
`pscale auth login`

**2. 데이터베이스 생성**
`pscale database create carrot-market --region ap-northeast`

**3. db와 prisma 연결**
`pscale connect <database name>`

```
// schema.prisma
DATABASE_URL="mysql://127.0.0.1:3306/carrot-market"
```

**4. 🔥db push (schema - planet scale 연동)**
`npx prisma db push`

Admin Pannel에 모델이 SQL로 생성된 것 확인. (prisma가 번역해준것)

**5. generate**
`npx prisma generate`

**prisma studio (관리자 패널)**
`npx prisma studio`

<br/>

### Prisma client

TypeScript 및 Node.js용 직관적인 데이터베이스 클라이언트
`npm install @prisma/client`

```
// client.ts
import { PrismaClient } from "@prisma/client";

export default new PrismaClient();
```

**server** - Nextjs api서버 생성

```
// api/client-test.tsx
import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await client.user.create({
    data: {
      email: "rlorxl@test.com",
      name: "rlorxl",
    },
  });

  res.json({
    ok: true,
  });
}
```
