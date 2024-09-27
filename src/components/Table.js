import React, { useState, useEffect } from 'react';
import './Table.css';
import db from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';


function TableManagement() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]); // 選択されたテーブル
  const [selectedCounters, setSelectedCounters] = useState([]); // 選択されたカウンター
  const [guests, setGuests] = useState(1); // お客様人数の状態


  useEffect(() => {
    const fetchTables = async () => {
      const tableSnapshot = await getDocs(collection(db, 'table'));
      const tableData = tableSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      const formattedData = tableData.map((table) => ({
        id: table.id,
        tableNumber: table.tableNumber || '',
        counterNumber: table.counterNumber || '',
        guests: table.guests || '',
        status: table.status || 'active',
      }));
      setTables(formattedData);
    };

    fetchTables();
  }, []);

  const handleLongPress = (table) => {
    setSelectedTable(table);
    setShowMenu(true);
  };

  const handleMenuAction = async (action) => {
    if (action === 'お会計') {
      const newStatus = 'inactive';
      const tableId = selectedTable.id;
      const tableRef = doc(db, 'table', tableId);
      await updateDoc(tableRef, { status: newStatus });
      setTables(tables.map((table) => table.id === tableId ? { ...table, status: newStatus } : table));
    } else if (action === 'ファースト編集') {
      setEditingTable(selectedTable);
      
      // 初期値を設定
      setSelectedTables(selectedTable.tableNumber ? [selectedTable.tableNumber] : []); // テーブル番号を配列として設定
      setSelectedCounters(selectedTable.counterNumber ? [selectedTable.counterNumber] : []); // カウンター番号を配列として設定
      setGuests(selectedTable.guests || 1); // ゲスト数を設定
    }
  
    setShowMenu(false);
  };
  

  const handleUpdateFast = async () => {
    const tableId = editingTable.id;
    const tableRef = doc(db, 'table', tableId);
    
    await updateDoc(tableRef, {
      tableNumber: selectedTables.join(','), // 配列をカンマ区切りの文字列に変換
      counterNumber: selectedCounters.join(','), // 配列をカンマ区切りの文字列に変換
      guests: guests,
      status: editingTable.status,
    });
  
    setTables(tables.map((table) => table.id === tableId ? { 
      ...editingTable, 
      tableNumber: selectedTables.join(','), // 文字列として更新
      counterNumber: selectedCounters.join(','), // 文字列として更新
      guests: guests 
    } : table));
    
    setEditingTable(null);
  };
  

  const handleTableSelect = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTables(selectedValues);
  };

  const handleCounterSelect = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedCounters(selectedValues);
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
            onClick={(e) => {
              // '/secondorder' へリダイレクト
            }}
          >
            <div>
              {table.tableNumber && `T${table.tableNumber}`} 
              {table.counterNumber ? ` - C${table.counterNumber}` : ''}
            </div>
            <div>
              {`${table.guests} 人`}
            </div>
          </button>
        ))}
      </div>

      {showMenu && (
        <div className="menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="menu">
            <h3>{`テーブル ${selectedTable?.tableNumber}`} の操作</h3>
            <button onClick={() => handleMenuAction('セルフオーダーQRコード作成')}>セルフオーダーQRコード作成</button>
            <button onClick={() => handleMenuAction('ファースト編集')}>ファースト編集</button>
            <button onClick={() => handleMenuAction('お会計')}>お会計</button>
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {editingTable && (
        <div className="modal">
          <h2>ファーストを編集</h2>
            <div>
              <h3>テーブルを編集:</h3>
              <select multiple={true} value={selectedTables} onChange={handleTableSelect}>
                {[1, 2, 3, 4, 5, 6].map(tableNumber => (
                  <option key={tableNumber} value={tableNumber}>
                    テーブル {tableNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h3>カウンターを編集:</h3>
              <select multiple={true} value={selectedCounters} onChange={handleCounterSelect}>
                {[1, 2, 3, 4, 5, 6].map(counterNumber => (
                  <option key={counterNumber} value={counterNumber}>
                    カウンター {counterNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h3>お客様人数を選択:</h3>
              <select value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(guestNumber => (
                  <option key={guestNumber} value={guestNumber}>
                    {guestNumber} 人
                  </option>
                ))}
              </select>
            </div>
          <button onClick={handleUpdateFast}>ファーストを更新</button>
          <button onClick={() => setEditingTable(null)}>キャンセル</button>
        </div>
      )}
    </div>
  );
}

export default TableManagement;
