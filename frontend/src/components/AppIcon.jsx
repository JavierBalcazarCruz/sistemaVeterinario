// AppIcon.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AppIcon = ({ to, imageUrl, name }) => (
  <Link to={to} className="app">
    <div className="icon" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
    <h3>{name}</h3>
  </Link>
);

export default AppIcon;