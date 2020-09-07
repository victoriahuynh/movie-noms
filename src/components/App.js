import React, {useEffect, useReducer, useState} from 'react';
import '../App.css';
import placeholder from '../placeholder.png';
import Header from "./Header";
import Search from "./Search";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Spinner from "react-bootstrap/Spinner";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Button from "react-bootstrap/Button";

const MOVIE_API_URL = "https://www.omdbapi.com/";
const API_KEY = process.env.REACT_APP_API_KEY;

const initialState = {
    loading: false,
    movies: [],
    errorMessage: null
};


const reducer = (state, action) => {
    switch (action.type) {
        case "SEARCH_MOVIES_REQUEST":
            return {
                ...state,
                loading: true,
                errorMessage: null
            };
        case "SEARCH_MOVIES_SUCCESS":
            return {
                ...state,
                loading: false,
                movies: action.payload
            };
        case "SEARCH_MOVIES_FAILURE":
            return {
                ...state,
                loading: false,
                errorMessage: action.error
            };
        case "GET_MOVIE_PREVIEW":
            return {
                ...state
            }
        default:
            return state;
    }
};

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [moviePreview, setMoviePreview] = useState();
    const [nominations, setNominations] = useState([]);

    useEffect(() => {

        fetch(MOVIE_API_URL)
            .then(response => response.json())
            .then(jsonResponse => {

                dispatch({
                    type: "SEARCH_MOVIES_SUCCESS",
                    payload: jsonResponse.Search
                });
            });
    }, []);

    const search = searchValue => {
        dispatch({
            type: "SEARCH_MOVIES_REQUEST"
        });
        console.log(API_KEY);
        fetch(`${MOVIE_API_URL}?apikey=${API_KEY}&s=${searchValue}&type=movie`)
            .then(response => response.json())
            .then(jsonResponse => {
                if (jsonResponse.Response === "True") {
                    dispatch({
                        type: "SEARCH_MOVIES_SUCCESS",
                        payload: jsonResponse.Search
                    });
                } else {
                    dispatch({
                        type: "SEARCH_MOVIES_FAILURE",
                        error: jsonResponse.Error
                    });
                }
            });
    };

    const handleMovie = movie => {
        fetch(`${MOVIE_API_URL}?apikey=${API_KEY}&t=${movie.Title}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setMoviePreview( () => data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const nominateMovie = movie => {
        if (nominations.indexOf(movie) === -1) {
            setNominations(prevState => [movie, ...prevState]);
        }

    }

    const removeMovie = loseMovie => {
        let results = nominations.filter(movie => movie.Title !== loseMovie.Title);
        setNominations(results);
    }

    const { movies, errorMessage, loading } = state;

    return (
        <div className="App">
            <Container fluid>
                <Row>
                    <Col><Header text="The Shoppies" /></Col>
                </Row>
                <Row>
                    <Col>
                        <Search search={search} /></Col>
                </Row>
                <Row>
                    <CardGroup className="movieDisplay">
                        <Card>
                            <Card.Header>Movie List</Card.Header>
                            <ListGroup variant="flush">
                                {loading && !errorMessage ? (
                                    <Spinner animation="border" role="status" className="spinner">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                ) : errorMessage ? (
                                    <div className="errorMessage">{errorMessage}</div>
                                ) : (
                                    movies.map((movie, index) => (
                                        <ListGroupItem key={index} action onClick={() => handleMovie(movie)}>
                                            {movie.Title}
                                        </ListGroupItem>
                                    ))
                                )}
                            </ListGroup>
                        </Card>
                        <Card>
                            <Card.Header>Movie Preview</Card.Header>
                            {moviePreview !== undefined &&
                                <Card.Body>
                                    <Card.Img variant='top' src={moviePreview.Poster !== "N/A" ? moviePreview.Poster : placeholder} style={{height: '10vw', objectFit:'scale-down'}} />
                                    <Card.Title>{moviePreview.Title}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{moviePreview.Year}</Card.Subtitle>
                                    <Card.Text>
                                        {moviePreview.Plot}
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => nominateMovie(moviePreview)}>Nominate Movie</Button>
                                </Card.Body>
                            }
                        </Card>
                    </CardGroup>
                </Row>
                <Row>
                    <Card style={{ width: '40rem', marginLeft: 'auto', marginRight: 'auto' }}>
                        <Card.Header>Nomination List</Card.Header>
                        <ListGroup variant="flush">
                            {nominations.map((movie, index) =>
                                <ListGroupItem key={index} action onClick={() => removeMovie(movie)}>
                                    {movie.Title}
                                </ListGroupItem>
                            )}
                        </ListGroup>
                    </Card>
                </Row>
            </Container>
        </div>
    );
};

export default App;
