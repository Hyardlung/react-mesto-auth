import {useState, useEffect, useContext} from 'react';
import PopupWithForm from './PopupWithForm';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

export default function EditProfilePopup({isOpen, onClose, onCloseOverlay, onUpdateUser}) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // обновление стейта при изменении контекста
  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  const handleChangeName = evt => {
    setName(evt.target.value);
  }
  const handleChangeDescription = evt => {
    setDescription(evt.target.value);
  }
  // обработчик отправки формы
  const handleSubmit = evt => {
    evt.preventDefault();   // сброс дефолтного поведения формы
    onUpdateUser({    // передача значений управляемых компонентов во внешний обработчик
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
        name="editProfileForm"
        formTitle="Редактировать профиль"
        submitButtonTitle="Сохранить"
        isOpen={isOpen}
        onClose={onClose}
        onCloseOverlay={onCloseOverlay}
        onSubmit={handleSubmit}
    >
    <fieldset className="popup__form-fieldset">
      <input
          className="popup__input"
          name="profileName"
          type="text"
          value={name}
          onChange={handleChangeName}
          id="profile-name-input"
          minLength="2"
          maxLength="40"
          autoComplete="off"
          placeholder="Ваше имя"
          required
      />
      <span className="popup__input-error" id="profile-name-input-error"> </span>
      <input
          className="popup__input"
          name="profileAbout"
          type="text"
          value={description}
          onChange={handleChangeDescription}
          id="profile-about-input"
          minLength="2"
          maxLength="200"
          autoComplete="off"
          placeholder="О себе"
          required
      />
      <span className="popup__input-error" id="profile-about-input-error"> </span>
    </fieldset>
  </PopupWithForm>
  )
}