import React, { useState, useEffect, useRef } from "react";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import "./App.css";
import * as XLSX from "xlsx";

const Epoch = () => {
  const [books, setBooks] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [quote, setQuote] = useState("");
  const [title, setTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const initialLoad = useRef(true);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/Stru1.xls")
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const randomIndex = Math.floor(Math.random() * jsonData.length);
        const randomQuote = jsonData[randomIndex].quote;
        const randomTitle = jsonData[randomIndex].title;

        setQuote(randomQuote);
        setTitle(randomTitle);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/books/v1/volumes?q=inauthor:strugatsky+brothers&maxResults=20"
        );
        const data = await response.json();

        if (data && data.items) {
          const bookList = data.items.map(({ volumeInfo }) => ({
            title: volumeInfo.title,
            authors: volumeInfo.authors,
            description: volumeInfo.description? volumeInfo.description: 'Unknown',
            printType: volumeInfo.printType,
          }));
          if (initialLoad.current) {
            setBooks(bookList);
            initialLoad.current = false;
          }
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    getBooks();
  }, [books]);

  const uniqueAuthors = [
    ...new Set(books.map((book) => book.authors.sort().join(", "))),
  ];

  const [selectedAuthor, setSelectedAuthor] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectPublisher = (event) => {
    setSelectedAuthor(event.target.value);
  };
  const handleClearFields = () => {
    setSearchTerm('');
  };

  const handleSort = () => {
    const booksCopy = [...books];
    const sortedBooks = [...booksCopy].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

    setBooks(sortedBooks);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div>
      <div className="container">
        <figure className="text-end">
          <blockquote className="blockquote">
            <p> {quote} </p>
          </blockquote>
          <figcaption className="blockquote-footer">
            <cite title="Source Title">{title}</cite>
          </figcaption>
        </figure>
      </div>
      <select style={{ justifyContent: "center", textAlign: "center" }} className="form-select-sm" onClick={handleSelectPublisher}>
        <option value="" >Author</option>
        {uniqueAuthors.map((author) => (
          <option key={books.id}>{author}</option>
        ))}
      </select>
      <Button variant="outline-secondary float-end" size="sm" onClick={handleClearFields}>Clear Fields</Button>
      <input className="form-control-sm float-end" type="text" value={searchTerm} onChange={handleChange} placeholder="Enter book title" style={{ marginLeft: "40px" }}/>
      
      <Table className="table" striped bordered hover variant="dark">
        <thead style={{ textAlign: "center" }}>
          <tr style={{textAlign: "center", verticalAlign: "middle"}}>
            <th onClick={handleSort}> Book</th>
            <th>Authors</th>
            <th>Description</th>
            <th>Print Type</th>
          </tr>
        </thead>
        <tbody style={{ justifyContent: "center", textAlign: "center" }}>
          {books
            .filter((book) => {
              if (
                !selectedAuthor.length ||
                selectedAuthor == book.authors.join(", ")
              ) {
                return true;
              }
            })
            .filter((book) => {
              if (searchTerm === "") {
                return book;
              } else if (
                book.title.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return book;
              }
            })
            .map((book) => {
              return (
                <tr style={{textAlign: "center", verticalAlign: "middle"}} key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.authors.join(", ")}</td>
                  <td>{book.description}</td>
                  <td>{book.printType}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
};

export default Epoch;
