import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import "./App.css";
import * as XLSX from "xlsx";

const Epoch = () => {
  const [books, setBooks] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [quote, setQuote] = useState('');
  const [title, setTitle] = useState('');
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/Stru1.xls')
      .then(response => response.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const randomIndex = Math.floor(Math.random() * jsonData.length);
        const randomQuote = jsonData[randomIndex].quote;
        const randomTitle = jsonData[randomIndex].title;

        setQuote(randomQuote);
        setTitle(randomTitle);
        console.log(jsonData[randomIndex].quote);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    fetch('https://www.googleapis.com/books/v1/volumes?q=strugatsky+brothers')
      .then(response => response.json())
      .then(data => {
        setBooks(data.items);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []);

  const handleSort = () => {
    const sortedBooks = [...books].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.volumeInfo.title.localeCompare(b.volumeInfo.title);
      } else {
        return b.volumeInfo.title.localeCompare(a.volumeInfo.title);
      }
    });

    setBooks(sortedBooks);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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

          <Button className="btn btn-danger" onClick={handleSort}>Sort by Title</Button>

      <Table className="table" striped bordered hover variant="dark">
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>Book</th>
            <th>Description</th>
            <th>Print Type</th>
          </tr>
        </thead>
        <tbody style={{ justifyContent: 'center', textAlign: 'center' }}>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.volumeInfo.title}</td>
              <td>{book.volumeInfo.description}</td>
              <td>{book.volumeInfo.printType}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Epoch;

    