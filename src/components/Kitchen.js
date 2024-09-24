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

  // タイムスタンプをフォーマットする関数
  const formatTimestamp = (timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
      return "無効なタイムスタンプ";
    }
    
    const date = timestamp.toDate();
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div className="kitchen-container">
      <h1>キッチン画面</h1>
      <h3>調理中のオーダー</h3>
      <div className="tickets">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="ticket">
              {/* tables と counters の情報を1行目に表示 */}
              <h3>
                {order.tables ? `${order.tables}` : ""}
                {order.counters ? (order.tables ? `${order.counters}` : `Counter: ${order.counters}`) : ""}
              </h3>

              {/* タイムスタンプを表示 */}
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
