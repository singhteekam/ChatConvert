import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Header from './components/Header';

// const BASE_URL = "http://localhost:5000";


function App() {

  const fileInput = useRef();

  const handleSubmit = event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', fileInput.current.files[0]);

    axios.post('/process-file', formData).then(response => {
      console.log(response);
      setMessages(response.data);
      setSenderOnRight(response.data[1].sender);
      // fetchMessages();
      // window.location.reload(true);
    });
  };

  const [messages, setMessages] = useState([]);

  const [senderOnRight, setSenderOnRight]=useState("");
  
    // async function fetchMessages() {
    //   try {
    //     await axios.get("/").then((res) => {
    //       console.log(res.data);
    //       setMessages(res.data);
    //       setSenderOnRight(res.data[1].sender);
    //     });
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }

  // useEffect(() => {
  //   async function fetchMessages() {
  //     try {
  //       await axios.get("http://localhost:5000/").then((res) => {
  //         // console.log(res.data);
  //         setMessages(res.data);
  //         setSenderOnRight(res.data[1].sender);
  //       })
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  //   fetchMessages();
  // }, []);

  let previousSender = null;

  function refreshPage(){
    return window.location.reload();
  }
 

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit} className="form">
        <input type="file" ref={fileInput} className="file-input" />
        <button type="submit">Upload</button>
        <button onClick={refreshPage} id="refreshbtn">Clear Chat</button>
      </form>

      
      <div>
        {messages.map(message => {
          const sender = message.sender;
          const showSender = sender !== previousSender;
          previousSender = sender;
          
          console.log(sender+":"+message);

          return (
            <div key={message.id} className="message">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {showSender && (
                  <div className="message-sender" style={{ color: '#a3a3c2' }}>
                    {sender}
                  </div>
                )}
                <div
                  className={`message-bubble ${sender === senderOnRight ? 'sent-by-me' : 'sent-by-other'
                    }`}
                >
                  {message.message}
                  <div className="message-time" style={{ color: '#a3a3c2' }}>
                    {message.date}, {message.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
