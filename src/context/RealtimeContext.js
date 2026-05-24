import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { listenToFirebase } from '../utils/firebaseListener';

/**
 * RealtimeContext — MatchTeaManager
 * Cung cấp dữ liệu realtime từ Firebase cho toàn bộ app.
 * Các màn hình chỉ cần gọi useRealtime() để lấy dữ liệu.
 */

const RealtimeContext = createContext(null);

export function RealtimeProvider({ children }) {
  const [realtimeTables, setRealtimeTables] = useState({}); // { [idBan]: { idBan, tinhTrang, ... } }
  const [realtimeOrders, setRealtimeOrders] = useState({}); // { [idHoaDon]: { idHoaDon, trangThai, tongThanhToan, ... } }
  const [lastTableUpdate, setLastTableUpdate] = useState(null);
  const [lastOrderUpdate, setLastOrderUpdate] = useState(null);

  const prevTableSnapshotRef = useRef(null);
  const prevOrderSnapshotRef = useRef(null);

  useEffect(() => {
    // Lắng nghe node /tables
    const tableListener = listenToFirebase('tables', (firebaseTables) => {
      if (!firebaseTables || typeof firebaseTables !== 'object') return;
      const tableMap = {};
      Object.values(firebaseTables).forEach(t => {
        if (t && t.idBan != null) tableMap[t.idBan] = t;
      });

      const snapshot = JSON.stringify(tableMap);
      if (snapshot === prevTableSnapshotRef.current) return;
      prevTableSnapshotRef.current = snapshot;

      setRealtimeTables(tableMap);
      setLastTableUpdate(Date.now());
    });

    // Lắng nghe node /orders
    const orderListener = listenToFirebase('orders', (firebaseOrders) => {
      if (!firebaseOrders || typeof firebaseOrders !== 'object') return;
      const orderMap = {};
      Object.values(firebaseOrders).forEach(o => {
        if (o && o.idHoaDon != null) orderMap[o.idHoaDon] = o;
      });

      const snapshot = JSON.stringify(orderMap);
      if (snapshot === prevOrderSnapshotRef.current) return;
      prevOrderSnapshotRef.current = snapshot;

      setRealtimeOrders(orderMap);
      setLastOrderUpdate(Date.now());
    });

    return () => {
      tableListener.stop();
      orderListener.stop();
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ realtimeTables, realtimeOrders, lastTableUpdate, lastOrderUpdate }}>
      {children}
    </RealtimeContext.Provider>
  );
}

/**
 * Hook để lấy dữ liệu realtime từ bất kỳ component nào.
 */
export function useRealtime() {
  return useContext(RealtimeContext);
}
