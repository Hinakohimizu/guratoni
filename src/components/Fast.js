import React, { useState, useEffect } from 'react';
import db from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

function Fast() {
  const [selectedTables, setSelectedTables] = useState([]); //テーブル
  const [selectedCounters, setSelectedCounters] = useState([]);//カウンター
  const [guests, setGuests] = useState(1);//お客様人数
  const [status, setStatus] = useState('active');//食事中か会計済みか
  const [createdAt, setCreatedAt] = useState('');//subitの時間=入店時間


  // テーブル選択処理
  const handleTableSelect = (event) => {
    const value = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedTables(value);
  };

  // カウンター選択処理
  const handleCounterSelect = (event) => {
    const value = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedCounters(value);
  };

  //食事開始時間
  const handleSubmit = async () => {
    const currentTimestamp = new Date().toLocaleString();
    setCreatedAt(currentTimestamp); // ファースト作成時間=入店時間をセット

    const newTableEntry = {
      tableNumber: selectedTables, 
      counterNumber: selectedCounters, 
      guests,
      status,
      createdAt: currentTimestamp,
    };

    try {
      await addDoc(collection(db, 'table'), newTableEntry); 
      alert('テーブルを作成しました！');
    } catch (error) {
      console.error('エラーが発生しました: ', error);
      alert('作成に失敗しました。');
    }
  };

  return (
    <div>
      <h1>ファーストオーダー</h1>

      <div>
        <h3>テーブルを選択:</h3>
        <select multiple={true} value={selectedTables} onChange={handleTableSelect}>
          {[1, 2, 3, 4, 5, 6].map(tableNumber => (
            <option key={tableNumber} value={tableNumber}>
              テーブル {tableNumber}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3>カウンターを選択:</h3>
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

      <button onClick={handleSubmit}>ファーストを作成</button>
    </div>
  );
}

export default Fast;
