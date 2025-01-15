import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet کو درست طریقے سے امپورٹ کریں
import Headders from '../UI/Headers';


function AppLayout() {
  return (
    <div>
      {/* ہر پیج پر ہیڈر اور فوٹر سیم رکھنے کے لیے یہ کیا */}
      <Headders />
      
      <Outlet /> {/* Nested روٹس یہاں رینڈر ہوں گے */}
      
    </div>
  );
}

export default AppLayout;
