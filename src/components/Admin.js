import { useEffect, useState } from 'react';
import db from '../firebase';
import './Admin.css';
import { collection, onSnapshot, updateDoc, doc, getDoc, addDoc } from "firebase/firestore"; 
import { Link } from 'react-router-dom';

function Admin() {
  const [submittedOrders, setSubmittedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
      const ordersData = collection(db, "orders");
      onSnapshot(ordersData, (snapshot) => {
        const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSubmittedOrders(orders.reverse());
      });
    };

    fetchOrders();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      completed: true,
    });
    await saveSalesData(orderId);
  };

  const saveSalesData = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);
    const orderSnapshot = await getDoc(orderRef);
    const orderData = orderSnapshot.data();

    if (orderData) {
      const salesRef = collection(db, "sales");
      await addDoc(salesRef, {
        amount: calculateOrderAmount(orderData.orders),
        date: new Date(),
        paymentMethod: "credit",
      });
    }
  };

  const calculateOrderAmount = (orders) => {
    return orders?.reduce((total, item) => total + (item.price || 0), 0) || 0;
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: newStatus,
    });
  };

  return (
    <div className="Admin">
      <h1>管理画面</h1>
      <h3>受け付けたオーダー</h3>
      {submittedOrders.length > 0 ? (
        submittedOrders.map((order) => (
          <div key={order.id} className={`order-card ${order.completed ? 'completed' : ''}`}>
            <h4>オーダー {order.id}</h4>
            <p>日時: {new Date(order.timestamp).toLocaleString()}</p>
            <p>オーダー内容:</p>
            {order.orders?.map((item, idx) => (
              <div key={idx}>
                <p>客 {idx + 1}: メイン料理: {item.food || "未選択"}, トッピング: {item.topping || "未選択"}
                  {!order.completed && (
                    <div>
                      <button onClick={() => handleUpdateStatus(order.id, "cooking")}>調理中</button>
                      <button onClick={() => handleUpdateStatus(order.id, "cooked")}>調理済み</button>
                      <button onClick={() => handleUpdateStatus(order.id, "served")}>提供済み</button>
                    </div>
                  )}
                </p>
              </div>
            )) || 
              <p>オーダー内容はありません</p>
            }            
            <p>ステータス: {order.status || "未設定"}</p>
          </div>
        ))
      ) : (
        <p>オーダーはありません</p>
      )}
      <Link to="/sales">売上管理画面へ</Link>
    </div>
  );
}

export default Admin;
