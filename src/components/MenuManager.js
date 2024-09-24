import React, { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import './MenuManager.css'; // CSSファイルのインポート

const MenuManager = () => {
  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState({ name: "", price: 0, category: "" });
  const [editingMenu, setEditingMenu] = useState(null);
  const [editedMenu, setEditedMenu] = useState({ name: "", price: 0, category: "" });

  useEffect(() => {
    const menusCollection = collection(db, "menu");
    const unsubscribe = onSnapshot(menusCollection, (snapshot) => {
      const fetchedMenus = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenus(fetchedMenus);
    });

    return () => unsubscribe();
  }, []);

  const handleAddMenu = async () => {
    await addDoc(collection(db, "menu"), newMenu);
    setNewMenu({ name: "", price: 0, category: "" });
  };

  const handleUpdateMenu = async (menuId) => {
    const menuRef = doc(db, "menu", menuId);
    await updateDoc(menuRef, editedMenu);
    setEditingMenu(null); // 編集モードを終了
    setEditedMenu({ name: "", price: 0, category: "" }); // 入力をリセット
  };

  const handleDeleteMenu = async (menuId) => {
    const menuRef = doc(db, "menu", menuId);
    await deleteDoc(menuRef);
  };

  return (
    <div className="MenuManager">
      <h1>メニュー管理</h1>
      <div>
        <h2>新しいメニューを追加</h2>
        <input 
          type="text" 
          placeholder="料理名" 
          value={newMenu.name} 
          onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })} 
        />
        <input 
          type="number" 
          placeholder="価格" 
          value={newMenu.price} 
          onChange={(e) => setNewMenu({ ...newMenu, price: Number(e.target.value) })} 
        />
        <input 
          type="text" 
          placeholder="カテゴリ" 
          value={newMenu.category} 
          onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })} 
        />
        <button onClick={handleAddMenu}>追加</button>
      </div>

      <h2>メニュー一覧</h2>
      <table>
        <thead>
          <tr>
            <th>料理名</th>
            <th>価格</th>
            <th>カテゴリ</th>
            <th>編集</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id}>
              <td>
                {editingMenu === menu.id ? (
                  <input 
                    type="text" 
                    value={editedMenu.name} 
                    onChange={(e) => setEditedMenu({ ...editedMenu, name: e.target.value })} 
                  />
                ) : (
                  menu.name
                )}
              </td>
              <td>
                {editingMenu === menu.id ? (
                  <input 
                    type="number" 
                    value={editedMenu.price} 
                    onChange={(e) => setEditedMenu({ ...editedMenu, price: Number(e.target.value) })} 
                  />
                ) : (
                  menu.price
                )}
              </td>
              <td>
                {editingMenu === menu.id ? (
                  <input 
                    type="text" 
                    value={editedMenu.category} 
                    onChange={(e) => setEditedMenu({ ...editedMenu, category: e.target.value })} 
                  />
                ) : (
                  menu.category
                )}
              </td>
              <td>
                {editingMenu === menu.id ? (
                  <button onClick={() => handleUpdateMenu(menu.id)}>保存</button>
                ) : (
                  <button onClick={() => {
                    setEditingMenu(menu.id);
                    setEditedMenu({ name: menu.name, price: menu.price, category: menu.category });
                  }}>編集</button>
                )}
              </td>
              <td>
                <button onClick={() => handleDeleteMenu(menu.id)}>
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuManager;
