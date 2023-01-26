import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

const ALL_MOVIES = gql`
  query getMovies {
    allMovies {
      title
      id
      medium_cover_image
    }
  }
`;

const Movies = () => {
  // const [movies, setMovies] = useState([]);
  // const client = useApolloClient();

  // useEffect(() => {
  //   client
  //     .query({
  //       query: gql`
  //         {
  //           allMovies {
  //             title
  //           }
  //         }
  //       `,
  //     })
  //     .then((res) => setMovies(res.data.allMovies));
  // }, [client]);

  const { data, loading, error } = useQuery(ALL_MOVIES);

  if (loading) {
    return <h1>loading...</h1>;
  }

  if (error) {
    return <h1>Could not feetch :(</h1>;
  }

  return (
    <ul>
      <h1>Movies</h1>
      {data?.allMovies?.map((movie) => (
        <li key={movie.id}>
          <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Movies;
