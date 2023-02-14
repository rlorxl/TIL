# Carrot Market Clone

## 1.Tailwind

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

## 2.Prisma

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

<br/>

## 3.PlanetScale

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
// .env
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

<br/>

---

## 4.React Hook Form

https://react-hook-form.com/

- Less & easier code
- Better validation
- Better errors (set, clear, display)
- input control

### methods

**1. register**

```
import { useForm } from "react-hook-form";

const Forms = () => {
  const { register } = useForm();
  console.log(register("name"));
  return (
    <form>
      <input {...register("username")} type="text" placeholder="username" required />
      <input {...register("email")} type="email" placeholder="Email" />
      <input {...register("password")} type="password" placeholder="Password" />
      <input type="submit" value="submit" />
    </form>
  );
};

export default Forms;
```

`register('name')`이 반환하는 것
<img width="477" alt="스크린샷 2023-02-08 오후 6 29 48" src="https://user-images.githubusercontent.com/90922593/217489997-953418e9-19f4-406f-9adb-3fdc18834625.png">

eventListener나 ref등을 가지고 있음.

**2. watch**

`watch`는 마치 value state처럼 input값을 입력할 때마다 key,value를 가지는 객체를 보여준다.

<img width="480" alt="스크린샷 2023-02-08 오후 6 31 40" src="https://user-images.githubusercontent.com/90922593/217490425-816c7552-0849-49f8-924c-ae0300427bb2.png">
<img width="498" alt="스크린샷 2023-02-08 오후 6 35 34" src="https://user-images.githubusercontent.com/90922593/217491426-29dd8e68-b122-4868-a0f2-05c16bdbd946.png">

### validation

html에서 required, minLength등으로 하는 유효성 검사는 사용자가 원한다면 개발자 도구에서 언제든지 변경할 수 있기 때문에 효용성이 떨어진다. html validation보다 실질적인 validation을 제공하려면 state를 사용해 일일히 체크해야하는 번거로운 작업을 거쳐야 한다.

**register 옵션**

register 두번째 인자로 객체를 전달하여 validation규칙을 정할 수 있다.

- required<boolean>
- min<number | string>
- max<number | string>
- maxLength<number>
- minLength<number>
- pattern<RegExp> : 정규식으로 입력값 필드 검증
- validate<FieldPathValue<TFieldValues, TFieldName>> | Record<string>

**handleSubmit**

```
const Forms = () => {
  const { register, handleSubmit } = useForm();
  onst onValid = (data: FormTypes) => {
    console.log(data);
  };
  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <input {...register("username", { required: true })} type="text" placeholder="username" />
      <input {...register("email", { required: true })} type="email" placeholder="Email" />
      <input {...register("password", { required: true })} type="password" placeholder="Password" />
      <input type="submit" value="submit" />
    </form>
  );
};
```

옵션지정외에 handleSubmit함수를 실행시켜야만 유효성 검사가 실행된다. handleSubmit은 두개의 인자를 가질 수 있다.  
(*첫번째 인자 : form이 유효할 때 실행시킬 함수, *두번째 인자 : form이 유효하지 않을 때 실행시킬 함수를 전달.)

onValid함수는 유효한 data를 인자로 받고 onValid함수는 error객체를 반환할 수 있다.

**message**
<img width="668" alt="스크린샷 2023-02-08 오후 7 11 00" src="https://user-images.githubusercontent.com/90922593/217500093-48587122-9c45-44f7-b1f1-c0bd525d54ec.png">
반환된 에러 객체를 살펴보면 지정한 validation규칙의 type외에 message가 있는 것을 볼 수 있는데 이 메시지도 input필드에 옵션으로 지정가능하다.

```
<input
  {...register("username", {
    required: "Username is required", // 에러 메시지 지정하기.
    minLength: { message: "The username should be longer than 5 chars.", value: 5 }, // 유효성검사 규칙과 메시지 함께 지정하기.
  })}
  type="text"
  placeholder="username"
/>
```

**custom validation (새로운 검사규칙 생성하기)**

```
<input
  {...register("email", {
    required: "Email is required",
    validate: {
      notGmail: value => !value.includes("@gmail.com") || "Gmail is not allowed!",
    }, // notGmail이라는 타입을 만들고 규칙과 에러메시지를 지정함.
  })}
  type="email"
  placeholder="Email"
/>
```

**formState**
formState메서드는 errors객체를 반환하고 error state에 따른 ui를 적용할 수 있다.
<img width="945" alt="스크린샷 2023-02-08 오후 7 37 27" src="https://user-images.githubusercontent.com/90922593/217506191-efdcc3f2-db54-49c7-9d39-00cc99a9af59.png">

```
const { register, handleSubmit, formState: { errors } } = useForm<FormTypes>({ mode: "onChange" });
// mode를 설정하면 유효성검사를 하는 시점을 지정할 수 있다. (onChange | onBlur | onSubmit | onTouched | all)
```
