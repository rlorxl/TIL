# Graphql

## REST api의 문제점

**1. overfetching**
필요보다 많은 data fetching을 해결.
graphql은 url로 data를 받지 않고 필요한 데이터만을 요청한다.

**2. underfetching**
필요보다 덜 받는 것.
필요한 data에 따라 하나의 url이 주는 data이상의 정보가 필요할 때 여러 api에 요청을 해야하는 상황이 생긴다. 이는 로딩이 길어질고 여러요청 중 하나가 실패될 가능성도 있다.
graphql은 여러 리소스를 한번의 요청으로 얻을 수 있다.

---

## Graphql schema정의

### Query Type

- 아폴로 서버를 실행하기 위해서는 반드시 최소 1개의 query가 필요하다.
- Query type은 rest API에서 url과 같은것인데 어떤 필드가 return될지에대한 정의이다.
- Query에 넣는 필드들은 request할 수 있는 것이 된다.

```
type Query {
  text: String
  hello: String
  allFilms: X
}
>>
GET /text
GET /hello
GET /allFilms
```

```js
// server.js
import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    text: String
    hello: String
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
```

여기까지 작성 후 실행하면 studio.apollographql.com으로 연결되고 작성한 스키마를 테스트할 수 있다.

<img width="962" alt="스크린샷 2023-01-25 오후 8 21 25" src="https://user-images.githubusercontent.com/90922593/214550713-c7707204-2d4b-4a07-aee6-7444ef831b4d.png">

<br/>

### scalar type

GraphQL 객체 타입에는 이름과 필드가 있지만 이 필드는 더욱 구체적인 데이터로 해석되어야 합니다. 그 때 스칼라 타입을 사용할 수 있습니다.

GraphQL은 기본 스칼라 타입 세트와 함께 제공됩니다.
ex) ID: ID 스칼라 타입은 객체를 다시 가져오거나 캐시의 키로 자주 사용되는 고유 식별자를 나타냅니다.

```
const typeDefs = gql`
  type Tweet {
    id: ID
    text: String
  }

  // query type
  type Query {
    allTweets: [Tweet] // 정의된 Tweet타입의 배열로 타입 지정
    hello: String
  }
`;
```

### Mutations

GraphQL에 대한 대부분은 데이터 fetching이지만, 서버 측 데이터를 수정할 수 있는 방법이 필요합니다. 서버 측 데이터를 수정하는 모든 작업은 mutation을 통해 규칙을 설정할 수 있습니다.

```
type Mutation {
  postTweet(text: String!, userId: ID!): Tweet!
  deleteTweet(id: ID!): Boolean!
}

// request
mutation {
  postTweet(text: "im new!", userId: "1") {
    id
    text
  }
}
```

### Lists and Non-Null

아래 Character에 name에 String 타입을 사용하고 느낌표 !를 추가하여 Non-Null로 표시합니다.
Non-Null로 표시하게 되면 서버가 항상 이 필드에 대해 null이 아닌 값을 반환할 것으로 예상합니다. 그래서 null 값을 얻게 되면 클라이언트에게 문제가 있음을 알립니다.

```
type Character {
name: String!
appearsIn: [Episode]!
}
```

### resolvers

- `const server = new ApolloServer({ typeDefs, resolvers });`
- resolvers에 속한 함수는 요청했을 때 실제 수행될 작업과 return값을 지정할 수 있다.
- `args`는 필드에 제공한 인수이다.

```
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, args) {
      console.log(args);
      return tweets.find((tweet) => tweet.id === args.id);
    },
  },
};
```

<img width="610" alt="스크린샷 2023-01-25 오후 9 28 29" src="https://user-images.githubusercontent.com/90922593/214563405-f8e90f0d-c773-4527-b7d3-881242a1106f.png">

### Mutaion resolvers

mutation에 대한 resolver

```
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, args) {
      console.log(args);
      return tweets.find((tweet) => tweet.id === args.id);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
};
```

### Type resolvers

필드에는 지정되어 있지만 실제 해당하는 데이터가 없다면 graphql은 resolvers에서 해당 데이터와 이름이 일치하는 resolver함수를 찾아서 실행한다.
(필드에 지정되어 있는 데이터를 resolver함수로 지정해도 resolver함수가 실행됨.)

```
  let users = [ // users에 fullName이 존재하지 않음. fullName은 required이다.
  {
    id: '1',
    firstName: 'nico',
    lastName: 'las',
  },
  ];

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }

   type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }

  ...

  const resolvers = {
  Query: {
   ...
  },
  Mutation: {
    ...
  },
  User: {
    fullName(root) {
      console.log('fullName called');
      console.log(root);
      return 'hello!';
    },
  },
};
```

첫번째 인수인 root에는 User객체가 전달된다.

```
// console.log

fullName called
{ id: '1', firstName: 'nico', lastName: 'las' } // fullName은 포함되지 않았다.
fullName called
{ id: '2', firstName: 'Elon', lastName: 'Mask' }
```

---

## Documentation

apollo에서 지정한 스키마들에 대한 reference문서를 제공하는데 필드를 만들때 지정한 모든 Query, Mutation, Types에 대한 설명도 함께 적으면 이곳에서 볼 수 있다.
작성하고자 하는 필드 상단에 `"""`안쪽에 작성한다.

```
type User {
  id: ID!
  firstName: String!
  lastName: String!
  """
  Is the sum of firstName + lastName as a string
  """
  fullName: String!
}
```
