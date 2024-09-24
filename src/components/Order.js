import React, { useEffect, useState } from 'react';
import './Order.css';
import db from '../firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Admin from './Admin/Admin';

function Order() {
  const [foodmenu, setFoodmenu] = useState([]);
  const [toppingMenu, setToppingMenu] = useState([]);
  const [numGuests, setNumGuests] = useState(1);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedCounters, setSelectedCounters] = useState([]);
  const [orders, setOrders] = useState(Array(1).fill({ food: '', topping: '' }));

  useEffect(() => {
    const fetchMenuData = async () => {
      const foodData = collection(db, 'foodmenu');
      const toppingData = collection(db, 'toppingmenu');
      
      const foodSnapshot = await getDocs(foodData);
      setFoodmenu(foodSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const toppingSnapshot = await getDocs(toppingData);
      setToppingMenu(toppingSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchMenuData();
  }, []);

  const handleGuestChange = (e) => {
    const numberOfGuests = parseInt(e.target.value);
    setNumGuests(numberOfGuests);
    setOrders(Array(numberOfGuests).fill({ food: '', topping: '' }));
  };

  const handleTableChange = (e) => {
    const value = e.target.value;
    setSelectedTables(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const handleCounterChange = (e) => {
    const value = e.target.value;
    setSelectedCounters(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const handleOrderChange = (index, field, value) => {
    const newOrders = [...orders];
    newOrders[index] = { ...newOrders[index], [field]: value };
    setOrders(newOrders);
  };

  const handleOrder = async () => {
    const newOrder = {
      tables: selectedTables,
      counters: selectedCounters,
      orders: orders,
      timestamp: new Date().toLocaleString(),
      completed: false,
    };
    await addDoc(collection(db, 'orders'), newOrder);
    setOrders(Array(numGuests).fill({ food: '', topping: '' }));
    setSelectedTables([]);
    setSelectedCounters([]);
  };

  return (
      <div className="App">
        <h1>オーダー画面</h1>
        <nav>
          <Link to="/">オーダー画面</Link>
          <Link to="/admin">受付画面</Link>
          <Link to="/admin">支払い方法選択</Link>
        </nav>

        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={
            <div>
              <h2>テーブル番号 (複数選択可能)</h2>
              <div className="checkbox-group">
                {Array.from({ length: 5 }, (_, index) => (
                  <label key={index}>
                    <input 
                      type="checkbox" 
                      value={`テーブル ${index + 1}`} 
                      checked={selectedTables.includes(`テーブル ${index + 1}`)} 
                      onChange={handleTableChange} 
                    />
                    テーブル {index + 1}
                  </label>
                ))}
              </div>

              <h2>カウンター番号 (複数選択可能)</h2>
              <div className="checkbox-group">
                {Array.from({ length: 5 }, (_, index) => (
                  <label key={index}>
                    <input 
                      type="checkbox" 
                      value={`カウンター ${index + 1}`} 
                      checked={selectedCounters.includes(`カウンター ${index + 1}`)} 
                      onChange={handleCounterChange} 
                    />
                    カウンター {index + 1}
                  </label>
                ))}
              </div>

              <h2>入店した人数</h2>
              <select onChange={handleGuestChange}>
                {Array.from({ length: 10 }, (_, index) => (
                  <option key={index} value={index + 1}>{index + 1}人</option>
                ))}
              </select>

              {Array.from({ length: numGuests }).map((_, index) => (
                <div key={index} className="order-section">
                  <h3>客 {index + 1}</h3>
                  <h4>メイン料理</h4>
                  <select onChange={(e) => handleOrderChange(index, 'food', e.target.value)}>
                    <option value="">メイン料理を選択</option>
                    {foodmenu.map((item) => (
                      <option key={item.id} value={item.title}>
                        {item.title} - {item.fee}
                      </option>
                    ))}
                  </select>

                  <h4>トッピングメニュー</h4>
                  <select onChange={(e) => handleOrderChange(index, 'topping', e.target.value)}>
                    <option value="">トッピングを選択</option>
                    {toppingMenu.map((topping) => (
                      <option key={topping.id} value={topping.name}>
                        {topping.name} ({topping.price}円)
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <button onClick={handleOrder}>オーダーを送信</button>
            </div>
          } />
        </Routes>
      </div>
  );
}

export default Order;
