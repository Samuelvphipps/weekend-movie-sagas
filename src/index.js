import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';



// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Used to store movies returned from the server
const movies = (state = [], action) => {
    switch (action.type) {
        case 'SET_MOVIES':
            return action.payload;
        default:
            return state;
    }
}

//stores the selected movie
const activeMovie = (state={}, action) => {
    // console.log('active movie payload:', action.payload);
    //set state of active book
    switch(action.type){
        case 'SET_ACTIVE_MOVIE':
            return action.payload;
    }
    return state;
}

// Used to store the movie genres
const genres = (state = [], action) => {
    switch (action.type) {
        case 'SET_GENRE':
            return action.payload;
        default:
            return state;
    }
}



function* fetchAllMovies() {
    // get all movies from the DB and assign to redux
    try {
        const movies = yield axios.get('/api/movie');
        console.log('get all:', movies.data);
        //sends response from server and DB to the redux store
        yield put({ type: 'SET_MOVIES', payload: movies.data });

    } catch {
        console.log('get all error');
    }
};

function* fetchSingleMovie(action){
    // console.log('in fetchSingleMovie with id of:', action.payload);

    //get single move and assign to response variable
    const response = yield axios.get(`/api/movie/${action.payload}`);

    console.log('Single move response from server is:', response.data);

    //'yield put' to activeMovie redux store
    yield put({
        type: 'SET_ACTIVE_MOVIE',
        payload: response.data
    });
}

function* fetchSingleMovieGenres(action){
    console.log('in fetchSingleMovieGenres and id is:', action.payload);

    // //get genres for the movie from genreRouter
    const response = yield axios.get(`/api/genre/${action.payload}`);
    console.log('response from server for singlemoviegenres:', response.data);
    // send genre information to redux store
    yield put({
        type: 'SET_GENRE',
        payload: response.data
    })
}


// Create the rootSaga generator function
function* rootSaga() {
    //get all movies for render
    yield takeEvery('FETCH_MOVIES', fetchAllMovies);

    //get single movie information
    yield takeEvery('FETCH_SINGLE_MOVIE', fetchSingleMovie);

    //fetch genre for singlemovie
    yield takeEvery('FETCH_MOVIE_GENRES', fetchSingleMovieGenres);

    //empty store
    // yield takeEvery('EMPTY_STORE', emptyStore);
    
}

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        movies,
        genres,
        activeMovie,
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
        <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
