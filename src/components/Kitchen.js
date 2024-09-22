// src/components/Kitchen.js
import React, { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import './Kitchen.css';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersCollection = collection(db, "orders");
    const unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
      const fetchedOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(fetchedOrders);
    });

    // クリーンアップ関数
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    try {
      await updateDoc(orderRef, {
        status: newStatus,
      });
      console.log(`Order ${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  return (
    <div className="Kitchen">
      <h1>キッチン画面</h1>
      <h3>調理中のオーダー</h3>
      {orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>オーダーID</th>
              <th>注文内容</th>
              <th>ステータス</th>
              <th>アクション</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {order.orders && order.orders.map((item, idx) => (
                    <div key={idx}>
                      {item.food} - {item.topping}
                    </div>
                  ))}
                </td>
                <td>{order.status || "未設定"}</td>
                <td>
                  {order.status === "cooking" && (
                    <button onClick={() => handleUpdateStatus(order.id, "cooked")}>
                      調理済みに変更
                    </button>
                  )}
                  {order.status === "cooked" && (
                    <button onClick={() => handleUpdateStatus(order.id, "served")}>
                      提供済みに変更
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>オーダーがありません</p>
      )}
    </div>
  );
};

export default Kitchen;
