import React, { useState } from 'react';
import db from '../firebase'; // Firebaseの設定をインポート
import { addDoc, collection } from 'firebase/firestore';

const CustomerSurvey = () => {
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [productName, setProductName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // データをFirebaseに保存する処理
    await addDoc(collection(db, 'customer_data'), {
      isNewCustomer,
      paymentMethod,
      productName,
      remarks,
      age,
      gender,
      timestamp: new Date(),
    });

    // フォームのリセット
    setIsNewCustomer(true);
    setPaymentMethod('');
    setRemarks('');
    setAge('');
    setGender('');
    
    alert('データが送信されました！');
  };

  return (
    <div>
      <h1>顧客アンケート</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              value="新規"
              checked={isNewCustomer}
              onChange={() => setIsNewCustomer(true)}
            />
            新規顧客
          </label>
          <label>
            <input
              type="radio"
              value="リピータ"
              checked={!isNewCustomer}
              onChange={() => setIsNewCustomer(false)}
            />
            リピーター
          </label>
        </div>

        <div>
          <label>支払い方法:</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="">選択してください</option>
            <option value="現金">現金</option>
            <option value="クレジットカード">クレジットカード</option>
            <option value="電子マネー">電子マネー</option>
          </select>
        </div>

        <div>
          <label>年齢:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div>
          <label>性別:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">選択してください</option>
            <option value="男性">男性</option>
            <option value="女性">女性</option>
            <option value="その他">その他</option>
          </select>
        </div>

        <div>
          <label>備考:</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <button type="submit">送信</button>
      </form>
    </div>
  );
};

export default CustomerSurvey;
