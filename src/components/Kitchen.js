import React, { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import './Kitchen.css';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
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
    };

    fetchOrders();
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
    <div className="kitchen-container">
      <h1>キッチン画面</h1>
      <h3>調理中のオーダー</h3>
      <div className="tickets">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="ticket">
              <h3>
                {order.tables ? `${order.tables}` : ""}
                {order.counters ? (order.tables ? `${order.counters}` : `Counter: ${order.counters}`) : ""}
              </h3>
              <p className="timestamp">
                {order.timestamp ? `注文時間: ${new Date(order.timestamp).toLocaleString()}` : "注文時間なし"}
              </p>
              <ul>
                {order.orders && order.orders.map((item, idx) => (
                  <li key={idx}>
                    {item.food} - {item.topping}
                  </li>
                ))}
              </ul>
              <div className="ticket-footer">
                <span>Status: {order.status || "未設定"}</span>
                <div className="actions">
                  <button 
                    className={`status-button cooking ${order.status === "cooking" ? "active" : ""}`} 
                    onClick={() => handleUpdateStatus(order.id, "cooking")}
                    disabled={order.status === "cooking"}
                  >
                    調理中
                  </button>
                  <button 
                    className={`status-button cooked ${order.status === "cooked" ? "active" : ""}`} 
                    onClick={() => handleUpdateStatus(order.id, "cooked")}
                    disabled={order.status === "cooked"}
                  >
                    調理済みに変更
                  </button>
                  <button 
                    className={`status-button served ${order.status === "served" ? "active" : ""}`} 
                    onClick={() => handleUpdateStatus(order.id, "served")}
                    disabled={order.status === "served"}
                  >
                    提供済みに変更
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>オーダーがありません</p>
        )}
      </div>
    </div>
  );
};

export default Kitchen;
