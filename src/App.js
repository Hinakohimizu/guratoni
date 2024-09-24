// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Order from './components/Order';
import Auth from './components/Admin/Auth'; // 正しいパスを確認
import Kitchen from './components/Kitchen'; // 正しいパスを確認
import CustomerSurvey from './components/Customer'; // 追加
import SalesManagement from './components/SalesManagement';



function App() {
  return (
    <Router>
      <div className="App">
        <h1>グラトニーオーダー管理システム</h1>
        <nav>
          <ul>
            <li><Link to="/">ホーム</Link></li>
            <li><Link to="/order">オーダー画面</Link></li>
            <li><Link to="/auth">オーダー管理画面</Link></li>
            <li><Link to="/kitchen">キッチンモニター</Link></li>
            <li><Link to="/salesManagement">売上管理画面</Link></li>
            <li><Link to="/customer">顧客情報入力</Link></li> {/* 追加 */}

          </ul>
        </nav>
        <Routes>
          <Route path="/order" element={<Order />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/customer" element={<CustomerSurvey />} /> {/* 追加 */}
          <Route path="/salesManagement" element={<SalesManagement />} /> {/* 追加 */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;
