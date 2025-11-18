import { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import './Header.css';

interface HeaderProps {
  selectedUserId: string | null;
  onUserChange: (userId: string) => void;
}

export const Header = ({ selectedUserId, onUserChange }: HeaderProps) => {
  const { data: usersData, isLoading } = useUsers();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedUser = usersData?.users.find(u => u._id === selectedUserId);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="logo">🛒 E-Commerce AI</h1>
          <p className="tagline">Персоналізовані рекомендації з ML</p>
        </div>

        <div className="header-right">
          <div className="user-selector">
            <button
              className="user-selector-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isLoading}
            >
              <span className="user-icon">👤</span>
              <span className="user-name">
                {isLoading ? 'Завантаження...' : selectedUser?.name || 'Оберіть користувача'}
              </span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {isDropdownOpen && usersData && (
              <div className="user-dropdown">
                {usersData.users.map((user) => (
                  <button
                    key={user._id}
                    className={`user-option ${selectedUserId === user._id ? 'selected' : ''}`}
                    onClick={() => {
                      onUserChange(user._id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="user-option-name">{user.name}</div>
                    <div className="user-option-email">{user.email}</div>
                    {user.preferences.categories.length > 0 && (
                      <div className="user-preferences">
                        Інтереси: {user.preferences.categories.join(', ')}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
