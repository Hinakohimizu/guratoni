import React, { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const SalesManagement = () => {
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalesData = () => {
            const salesCollection = collection(db, "orders"); 
            onSnapshot(salesCollection, (snapshot) => {
                const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setOrdersData(orders);
                setLoading(false);
            });
        };

        fetchSalesData();
        console.log(ordersData)
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>売上管理</h1>
            {ordersData.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>日時</th>

                            <th>金額</th>
                            <th>支払い方法</th>
                            <th>オーダー内容</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersData.map((order, index) => (
                            <tr key={index}>
                                <td>{order.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>売上データはありません</p>
            )}
        </div>
    );
};

export default SalesManagement;
