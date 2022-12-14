import React from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import BookFormModal from "./BookFormModal";
import BookUpdateModal from "./BookUpdateModal";

class BestBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      showCreate: false,
      showUpdate: false,
      selectedBook: {},
    };
  }

  /* TODO: Make a GET request to your API to fetch all the books from the database  */
  getBooks = async () => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_SERVER}/books`);
      this.setState({ books: response.data });
    } catch (error) {
      console.log("error: " + error);
    }
  };

  createBooks = async (data) => {
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_SERVER}/books`,
        data
      );
      console.log(response);
      this.setState({ books: this.state.books.concat(response.data) });
    } catch (error) {
      console.log("error posting new book");
    }
  };

  deleteBook = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER}/books/${id}`);
      let filteredBooks = this.state.books.filter((book) => {
        return book._id !== id;
      });
      this.setState({ books: filteredBooks });
    } catch (error) {
      console.log("error: " + error);
    }
  };

  updateBook = async (bookToBeUpdated) => {
    try {
      let updatedBook = await axios.put(
        `${process.env.REACT_APP_SERVER}/books/${bookToBeUpdated._id}`,
        bookToBeUpdated
      );
      let filteredBooks = this.state.books.map((book) => {
        if (book._id === updatedBook.data._id) {
          return updatedBook.data;
        }
        return book;
      });
      this.setState({ books: filteredBooks });
    } catch (error) {
      console.log("error: " + error);
    }
  };

  componentDidMount() {
    this.getBooks();
  }

  showCreateModal = () => {
    this.setState((prevState) => ({ showCreate: !prevState.showCreate }));
  };

  showUpdateModal = () => {
    this.setState((prevState) => ({ showUpdate: !prevState.showUpdate }));
  };

  render() {
    /* TODO: render all the books in a Carousel */

    return (
      <Container className="d-flex justify-content-center">
        {this.state.books.length ? (
          <Carousel
            slide={false}
            className="h-auto d-flex justify-content-center"
          >
            {this.state.books.map((book) => {
              return (
                <Carousel.Item key={book._id}>
                  <img
                    // className="w-"
                    src="https://via.placeholder.com/800x400"
                    alt="HELLO WORLD!"
                  />
                  <Carousel.Caption>
                    <h2>{book.title}</h2>
                    <p>{book.description}</p>
                    <Button onClick={() => {this.showUpdateModal(); this.setState({selectedBook: book})}}>UPDATE</Button>
                    <Button onClick={() => this.deleteBook(book._id)}>DELETE</Button>
                  </Carousel.Caption>
                </Carousel.Item>
              );
            })}
          </Carousel>
        ) : (
          <h3>No Books Found :(</h3>
        )}
        {this.state.showUpdate && (
          <BookUpdateModal
            show={this.state.showUpdate}
            handleClose={this.showUpdateModal}
            update={this.updateBook}
            book={this.state.selectedBook}
          />
        )}
        {this.state.showCreate && (
          <BookFormModal
            show={this.state.showCreate}
            handleClose={this.showCreateModal}
            update={this.createBooks}
          />
        )}
        {!this.state.showCreate && (
          <Button className="btn-secondary m-2" onClick={this.showCreateModal}>
            Add a Book
          </Button>
        )}
      </Container>
    );
  }
}

export default BestBooks;
