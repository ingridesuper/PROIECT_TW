import React from 'react';
import { Link } from 'react-router-dom';

function Home({ isAuthenticated }) {
    const buttonStyle = {
        padding: '10px 20px',
        marginTop:"10px",
        backgroundColor:"rgb(33, 99, 206)",
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        fontSize: '16px',
        fontWeight:"bold"
      };
    
  return (
    <div>
      <h1>Bun venit!</h1>
      {isAuthenticated ? (
        <div>Ești autentificat!</div>
      ) : (
        <div>
          <h2>Te rugăm să te autentifici</h2>
          <a href="http://localhost:9000/auth/google">
            <button style={buttonStyle}>Login with Google</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default Home;
