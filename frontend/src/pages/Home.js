import React from 'react';
import { Link } from 'react-router-dom';

function Home({ isAuthenticated }) {
  return (
    <div>
      <h1>Welcome to StudyNotes!</h1>
      {isAuthenticated ? (
        <div>Bun venit, autentificat!</div>
      ) : (
        <div>
          <h2>Te rugăm să te autentifici</h2>
          <a href="http://localhost:9000/auth/google">
            <button>Login with Google</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default Home;
