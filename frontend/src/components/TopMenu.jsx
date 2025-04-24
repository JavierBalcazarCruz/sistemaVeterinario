import React, { useState, useEffect, useRef } from "react";
import { Bell, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const TopMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { cerrarSesion, auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    navigate("/admin/EditarPerfilDoc");
    setIsMenuOpen(false);
  };

  return (
    <div className="top-menu">
      <div className="menu-icons">
        <Bell size={24} className="bell-icon desktop-only" />
        <div className="profile-avatar" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <img
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${auth.nombre}`}
            alt="Avatar"
          />
        </div>
      </div>
      {isMenuOpen && (
        <div className="menu-dropdown" ref={menuRef}>
          <div className="menu-item" onClick={handleProfileClick}>
            <User size={18} />
            <span>Ver perfil</span>
          </div>
          <div className="menu-item mobile-only">
            <Bell size={18} />
            <span>Notificaciones</span>
          </div>
          <div className="menu-item" onClick={cerrarSesion}>
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopMenu;