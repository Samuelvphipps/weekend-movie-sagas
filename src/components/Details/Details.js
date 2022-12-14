import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './Details.css';

function Details(){
    //import useParams and dispatch
    const dispatch = useDispatch();
    const params = useParams();
    
    //useHistory setup
    const history=useHistory();

    //get active movie from redux
    const activeMovie = useSelector(store => store.activeMovie);

    //get movies genres from redux
    const movieGenres = useSelector(store => store.genres);


    // console.log('params.id', params.id);

    useEffect(()=>{
        //send id to saga
        //get the selected movie! ⬇️
        dispatch({
            type: 'FETCH_SINGLE_MOVIE',
            payload: params.id
        });
        //dispatch to saga to get the genres for each movie ⬇️
        dispatch({
            type: 'FETCH_MOVIE_GENRES',
            payload: params.id,
        });
        //set the params id here so use effect runs if params.id changes in url to fetch new movie details and genres
    }, [params.id]);


    // return loading if no active movie exists in store
    if (!activeMovie.id){
        console.log('activeMovie', activeMovie)
        return <h1>loading...</h1>
    }

    const goHome = () => {
        console.log('in goHome fn');

        history.push('/');
    };

    return(
        <article key={activeMovie.id} className="movie-detail-container">
            <div className="movie-container-details">
                <h3 className="movie-title"> {activeMovie.title} </h3>
                <img src={activeMovie.poster}></img>
                <p className='movie-description'>{activeMovie.description}</p>

                <div className='genre-list'>    
                    {/* if movie genres true map and render all genres */}
                    <h3 className='movie-title'>Genres:</h3>
                    {movieGenres && movieGenres.map((genre, i) => {
                        return <p key={i}>{genre.name}</p>
                    })}
                </div>
            </div>
            

            <button onClick={goHome} class="backBtn">Back To List</button>

        </article>
    )
};


export default Details;