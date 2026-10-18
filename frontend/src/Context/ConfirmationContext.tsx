import React, { createContext, useContext, useState } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';

interface ConfirmationContextProps {
  openModal: (message: string, onConfirm: () => void) => void;
}

const ConfirmationContext = createContext<ConfirmationContextProps | undefined>(undefined);

export const ConfirmationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {}
  });

  const openModal = (message: string, onConfirm: () => void) => {
    setModalState({
      isOpen: true,
      message,
      onConfirm
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, message: '', onConfirm: () => {} });
  };

  return (
    <ConfirmationContext.Provider value={{ openModal }}>
      {children}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        message={modalState.message}
        onConfirm={() => {
          modalState.onConfirm();
          closeModal();
        }}
        onCancel={closeModal}
      />
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};
