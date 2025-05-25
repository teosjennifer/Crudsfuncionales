import { useState, useEffect } from 'react';
import '../styles/Alert.css';

const Alert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Estilos según el tipo de alerta
  const getAlertStyles = () => {
    switch(type) {
      case 'success':
        return {
          backgroundColor: '#f8bbd0', // Rosa claro
          color: '#880e4f', // Rosa oscuro
          borderLeft: '5px solid #ec407a' // Rosa intenso
        };
      case 'danger':
        return {
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderLeft: '5px solid #f44336'
        };
      case 'warning':
        return {
          backgroundColor: '#fff8e1',
          color: '#ff6f00',
          borderLeft: '5px solid #ffc107'
        };
      default:
        return {
          backgroundColor: '#e1f5fe',
          color: '#0277bd',
          borderLeft: '5px solid #03a9f4'
        };
    }
  };

  return (
    <div 
      style={{
        padding: '15px 20px',
        borderRadius: '4px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        animation: 'fadeIn 0.5s',
        ...getAlertStyles()
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {type === 'success' && (
          <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Success" style={{ width: '20px', height: '20px' }} />
        )}
        {type === 'danger' && (
          <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="Error" style={{ width: '20px', height: '20px' }} />
        )}
        {type === 'warning' && (
          <img src="https://cdn-icons-png.flaticon.com/512/1041/1041728.png" alt="Warning" style={{ width: '20px', height: '20px' }} />
        )}
        {type !== 'success' && type !== 'danger' && type !== 'warning' && (
          <img src="https://cdn-icons-png.flaticon.com/512/471/471664.png" alt="Info" style={{ width: '20px', height: '20px' }} />
        )}
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          color: 'inherit',
          padding: '0 5px'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Alert;
