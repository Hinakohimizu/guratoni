import React, { useState } from 'react';
import db from '../firebase'; // Firebaseの設定をインポート
import { addDoc, collection } from 'firebase/firestore';
import './Customer.css'; // CSSをインポート


const CustomerSurvey = () => {
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // データをFirebaseに保存する処理
    await addDoc(collection(db, 'customer_data'), {
      isNewCustomer,
      gender,
      age,
      job,
      paymentMethod,
      remarks,
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
    <div className="customer-survey">
    <h1>顧客アンケート</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>顧客 :　</label>
          <label>
            <input
              type="radio"
              value="新規"
              checked={isNewCustomer}
              onChange={() => setIsNewCustomer(true)}
            />
            新規
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
          <label>性別 :　</label>
          <label>
            <input
              type="radio"
              value="男性"
              checked={gender === "男性"}
              onChange={() => setGender("男性")}
            />
            男性
          </label>
          <label>
            <input
              type="radio"
              value="女性"
              checked={gender === "女性"}
              onChange={() => setGender("女性")}
            />
            女性
          </label>
          <label>
            <input
              type="radio"
              value="その他"
              checked={gender === "その他"}
              onChange={() => setGender("その他")}
            />
            その他
          </label>
        </div>

        <div>
          <label>年齢:</label>
          <select value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">選択してください</option>
            <option value="10代">10代</option>
            <option value="20代">20代</option>
            <option value="30代">30代</option>
            <option value="40代">40代</option>
            <option value="50代">50代</option>
            <option value="60代">60代</option>
            <option value="70代">70代</option>
            <option value="80代">80代</option>
            <option value="90代">90代</option>
          </select>
        </div>

        <div>
          <label>職業:</label>
          <select value={job} onChange={(e) => setJob(e.target.value)}>
            <option value="">選択してください</option>
            <option value="現金">現金</option>
            <option value="クレジットカード">クレジットカード</option>
            <option value="電子マネー">電子マネー</option>
          </select>
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
          <label>備考:</label>
          <div>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          </div>
        </div>

        <button type="submit">送信</button>
      </form>
    </div>
  );
};

export default CustomerSurvey;
