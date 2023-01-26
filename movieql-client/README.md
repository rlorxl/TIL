## ApolloProvider

graphql로 서버를 만들었다면 다음 할일은 데이터를 fetch해오는 것이다.
프로젝트 폴더의 root에 `client.js`를 만들고 `ApolloClient`를 import하자.

```
// client.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

export default client;
```

그리고 `index.js`에서는 `client`와 `ApolloProvider`를 import하여 client에 어디서든 접근할 수 있도록 만들어주자.

```
// index.js
import client from './client';
import { ApolloProvider } from '@apollo/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
```

<br/>

## useQuery

가장 기초적으로 client에 접근하는 방법은 컴포넌트 안에서 useEffect로 접근하는 방법일 것이다.
하지만 이 방법은 번거롭고 그다지 추천되지 않는다. 대신 `useQuery`라는 hook을 사용할 수 있다.
`useQuery`는 이런것들을 결과로 반환한다.

<img width="864" alt="스크린샷 2023-01-26 오후 8 42 41" src="https://user-images.githubusercontent.com/90922593/214827138-8cfaf8be-329c-4d76-b6a9-5050c3df6844.png">

useQuery를 사용함으로써 선언적인 코드를 작성할 수 있게 되었다.

> 선언형 : 원하는걸 설명하기 위한 코드만 적는것. / 명령형 : 모든 단계의 코드를 적는 것.

> useQuery 훅을 사용하여 React에서 GraphQL 데이터를 가져오고 그 결과를 UI에 연결할 수 있습니다. useQuery 훅은 Apollo 애플리케이션에서 쿼리를 실행하기 위한 기본 API입니다. 컴포넌트가 렌더링될 때 useQuery는 UI를 렌더링하는 데 사용할 수 있는 loading, error, data 속성이 포함된 Apollo Client의 객체를 반환합니다.

```
// Movies.js
const { data, loading, error } = useQuery(ALL_MOVIES);

  if (loading) {
    return <h1>loading...</h1>;
  }

  if (error) {
    return <h1>Could not fetch :(</h1>;
  }

  return (
    <ul>
      {data.allMovies.map((movie) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  );
```

### query에 변수 보내기

`useQuery`의 두번째 인자로 객체를 전달할 수 있고 `variables`의 값으로 지정된 변수명을 작성한다.

```
// Movie.js
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

const GET_MOVIE = gql`
  query getMovie($movieId: String!) {
    movie(id: $movieId) {
      id
      title
    }
  }
`;

const Movie = () => {
  const { id } = useParams();
  const { data, loading } = useQuery(GET_MOVIE, {
    variables: {
      movieId: id,
    },
  });
  console.log(data, loading);

  if (loading) {
    return <h1>Fetching movies...</h1>;
  }

  return <div>{data.movie.title}</div>;
};

export default Movie;
```

<br/>

## Local only fields

사전에 graphql서버의 스키마에 정의되지 않은 필드외에 Apollo cache에만 존재하는 로컬전용 필드를 추가하고 가져올 수 있다.
정의되지 않은 필드이름을 작성하고 옆에 `@client`만 추가해주면 된다.
가져오는 방법은 일반적으로 remote데이터에 접근하는 방법과 동일하다.

```
const GET_MOVIE = gql`
  query getMovie($movieId: String!) {
    movie(id: $movieId) {
      id
      title
      medium_cover_image
      rating
      isLiked @client
    }
  }
`;
```

apollo devtools의 캐시를 확인해보면 이전에는 isLiked필드가 없다가 추가가된것을 확인할 수 있다.

<br/>

## writeFragment

writeFragment 메서드를 사용하여 캐시에 데이터를 쓸 수 있습니다.
Apollo 클라이언트 캐시의 모든 구독자(모든 활성 쿼리 포함)는 이 변경 사항을 확인하고 그에 따라 애플리케이션의 UI를 업데이트합니다.

```
const Movie = () => {
  const { id } = useParams();
  const {
    data,
    loading,
    client: { cache },
  } = useQuery(GET_MOVIE, {
    variables: {
      movieId: id,
    },
  });

  const changeLike = () => {
    cache.writeFragment({
      id: `Movie:${id}`,
      fragment: gql`
        fragment MyFragment on Movie {
          isLiked
        }
      `,
      data: {
        isLiked: !data.movie.isLiked,
      },
    });
  };

  return (
    <>
      <div>
        <h1>{loading ? 'Loading...' : `${data.movie?.title}`}</h1>
        <h4>rating: {data?.movie?.rating}</h4>
      </div>
      <div>
        <img src={data?.movie?.medium_cover_image} />
      </div>
      <button onClick={changeLike}>
        {data?.movie?.isLiked ? 'Unlike' : 'Like'}
      </button>
    </>
  );
};

export default Movie;
```

> writeFragment를 사용하여 캐시된 데이터에 대한 변경 사항은 GraphQL 서버에 푸시되지 않습니다. 환경을 다시 로드하면 이러한 변경 사항이 사라집니다.
