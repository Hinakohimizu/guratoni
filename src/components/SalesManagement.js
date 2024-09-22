import React, { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const SalesManagement = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalesData = () => {
            const salesCollection = collection(db, "sales"); // "sales" コレクションを参照
            onSnapshot(salesCollection, (snapshot) => {
                const sales = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setSalesData(sales);
                setLoading(false);
            });
        };

        fetchSalesData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>売上管理</h1>
            {salesData.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>金額</th>
                            <th>支払い方法</th>
                            <th>オーダー内容</th>
                            <th>日付</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.map((sale) => (
                            <tr key={sale.id}>
                                <td>{sale.id}</td>
                                <td>{sale.amount}円</td> {/* amount を表示 */}
                                <td>{sale.paymentMethod}</td> {/* 支払い方法を表示 */}
                                <td>
                                    {sale.items && sale.items.map((item, idx) => (
                                        <div key={idx}>
                                            {item.food} - {item.quantity} 個, {item.price}円
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {sale.date && new Date(sale.date.seconds * 1000).toLocaleString()} {/* Firestore Timestamp 形式の処理 */}
                                </td>
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
