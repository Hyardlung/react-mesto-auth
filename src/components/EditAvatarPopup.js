import {useRef} from 'react';
import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup({isOpen, onClose, onCloseOverlay, onUpdateAvatar}) {
  const avatarInputRef = useRef();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: avatarInputRef.current.value,
    });
    avatarInputRef.current.value = null;
  }

  return (
      <PopupWithForm
          name="updateAvatarForm"
          formTitle="Обновить аватар"
          submitButtonTitle="Сохранить"
          isOpen={isOpen}
          onClose={onClose}
          onCloseOverlay={onCloseOverlay}
          onSubmit={handleSubmit}
      >
        <fieldset className="popup__form-fieldset">
          <input
              className="popup__input"
              name="avatarLink"
              type="url"
              id="avatar-input"
              autoComplete="off"
              placeholder="Ссылка на картинку"
              required
              ref={avatarInputRef}
          />
          <span className="popup__input-error" id="avatar-input-error"> </span>
        </fieldset>
      </PopupWithForm>
  )
}