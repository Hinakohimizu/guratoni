// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Order from './components/Order';
import Auth from './components/Admin/Auth';
import Kitchen from './components/Kitchen';
import SalesManagement from './components/SalesManagement'; // インポートを確認
import CustomerSurvey from './components/Customer';
import MenuManager from './components/MenuManager';
import SecondOrder from './components/SecondOrder';
import Table from './components/Table';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>オーダー管理システム</h1>
        <nav>
          <ul>
            <li><Link to="/">ホーム</Link></li>
            <li><Link to="/order">ファーストオーダー画面(ホール)</Link></li>
            <li><Link to="/secondorder">追加オーダー画面(ホール)</Link></li>
            <li><Link to="/table">テーブル管理(ホール)</Link></li>
            <li><Link to="/auth">オーダー管理(ホール)</Link></li>
            <li><Link to="/auth">会計確認</Link></li>
            <li><Link to="/kitchen">キッチンモニター(厨房)</Link></li>
            <li><Link to="/salesmanagement">売上管理画面(ログイン)</Link></li>
            <li><Link to="/customer">顧客情報入力(ホール)</Link></li>
            <li><Link to="/menumanager">メニュー情報登録・編集</Link></li>
          </ul>
        </nav>
        <Routes>
        <Route path="/order" element={<Order />} />
        <Route path="/secondorder" element={<SecondOrder />} />
        <Route path="/table" element={<Table />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/customer" element={<CustomerSurvey />} />
        <Route path="/salesmanagement" element={<SalesManagement />} />
        <Route path="/menumanager" element={<MenuManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
