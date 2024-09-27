import React, { useEffect, useState } from 'react';
import './Fast.css';
import db from '../firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function SecondOrder() {
  const [foodmenu, setFoodmenu] = useState([]);
  const [orders, setOrders] = useState(['']); // 初期オーダーは一つのみ

  useEffect(() => {
    const fetchMenuData = async () => {
      const foodData = collection(db, 'menu');
      const foodSnapshot = await getDocs(foodData);
      setFoodmenu(foodSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchMenuData();
  }, []);

  const handleOrderChange = (index, value) => {
    const newOrders = [...orders];
    newOrders[index] = value;
    setOrders(newOrders);
  };

  const handleOrder = async () => {
    const newOrder = {
      orders: orders,
      timestamp: new Date().toLocaleString(),
      completed: false,
      type: '追加オーダー', // 追加オーダーの表示用
    };
    await addDoc(collection(db, 'orders'), newOrder);
    setOrders(['']); // オーダーをリセット
  };

  return (
      <div className="App">
        <h1>追加オーダー画面</h1>

        <h2>メイン料理の追加オーダー</h2>
        {orders.map((_, index) => (
          <div key={index} className="order-section">
            <h3>追加オーダー</h3>
            <div className="menu-grid">
              {foodmenu.map((item) => (
                <button 
                  key={item.id} 
                  className="menu-tile"
                  onClick={() => handleOrderChange(index, item.name)}
                >
                  {item.name} - {item.price}円
                </button>
              ))}
            </div>
            <p>選択された料理: {orders[index]}</p>
          </div>
        ))}

        <button
          className="menu-submit"
          onClick={handleOrder}
        >
          オーダーを送信
        </button>
      </div>
  );
}

export default SecondOrder;
