import React from 'react';
import tooltipSuccess from '../images/tooltip-success.svg';
import tooltipDeny from '../images/tooltip-deny.svg';

export const InfoTooltip = ({isOpen, onClose, onCloseOverlay, loggedIn}) => {
  return (
      <div className={`popup ${isOpen && "popup_opened"}`} onClick={onCloseOverlay}>
        <div className="popup__container">
          <img className="popup__tooltip-img" src={ loggedIn ? tooltipSuccess : tooltipDeny } alt="#"/>
          <h2 className="popup__caption">{loggedIn ?
                "Вы успешно зарегистрировались!" :
                "Что-то пошло не так! Попробуйте ещё раз."}
          </h2>
          <button
              className="popup__close-button"
              type="button"
              onClick={onClose}
          > </button>
        </div>
      </div>
  )
}