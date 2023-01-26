import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

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

  if (loading) {
    return <h1>Fetching movies...</h1>;
  }

  console.log(data, loading);

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
