import React, { createContext, useState } from 'react';

// Kontekst yaratish
export const UserContext = createContext();

// Kontekst Provider komponenti
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('viewer'); // 'viewer' yoki 'editor'
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, role, setRole, isModalOpen, setIsModalOpen }}>
      {children}
    </UserContext.Provider>
  );
};
