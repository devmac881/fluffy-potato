import React from 'react';
import './AppShell.css';

interface AppShellProps {
  sidebar: React.ReactNode;
  map: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ sidebar, map }) => {
  return (
    <div className="app-shell">
      <aside className="sidebar">{sidebar}</aside>
      <main className="map-area">{map}</main>
    </div>
  );
};

export default AppShell;
