import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Chat from './component/Chat/Chat';
import Join from './component/Join/Join';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;