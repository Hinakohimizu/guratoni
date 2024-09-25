import React, { useState, useEffect } from 'react';
import './Table.css'; // CSSファイルをインポート
import db from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import Order from './Order'; // order.jsからインポート

function TableManagement() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // order.jsからテーブルとカウンターのデータを取得
    const fetchTables = async () => {
      const orderData = collection(db, 'orders');
      const orderSnapshot = await getDocs(orderData);
      const orders = orderSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // テーブルとカウンターの情報を抽出
      const tableData = orders.map((order) => ({
        id: order.id,
        tables: order.tables,
        counters: order.counters,
        numGuests: order.orders.length,
      }));
      setTables(tableData);
    };

    fetchTables();
  }, []);

  const handleLongPress = (table) => {
    setSelectedTable(table);
    setShowMenu(true);
  };

  const handleMenuAction = (action) => {
    console.log(`${action} action selected for table ${selectedTable.tables}`);
    setShowMenu(false);
  };

  return (
    <div className="table-management">
      <h1>テーブル管理</h1>
      <div className="table-grid">
        {tables.map((table, index) => (
          <button
            key={index}
            className="table-button"
            onContextMenu={(e) => {
              e.preventDefault();
              handleLongPress(table);
            }}
          >
            <div>
              {`${table.tables.join(', ')}`}　{`${table.counters.join(', ')}`}
            </div>
            <div>
              {`${table.numGuests}人`}
            </div>
          </button>
        ))}
      </div>

      {showMenu && (
        <div className="menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="menu">
            <h3>{`テーブル ${selectedTable?.tables.join(', ')}`} の操作</h3>
            <button onClick={() => handleMenuAction('QRコード作成')}>セルフオーダーQRコード作成</button>
            <button onClick={() => handleMenuAction('人数編集')}>お客様人数編集</button>
            <button onClick={() => handleMenuAction('会計編集')}>会計編集</button>
            <button onClick={() => handleMenuAction('テーブル移動')}>テーブル移動</button>
            <button onClick={() => handleMenuAction('会計合算')}>会計合算</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableManagement;
