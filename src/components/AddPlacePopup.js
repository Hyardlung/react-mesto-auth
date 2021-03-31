import {useState} from 'react';
import PopupWithForm from './PopupWithForm';


export default function AddPlacePopup ({isOpen, onClose, onCloseOverlay, onAddPlace}) {
  const [cardName, setCardName] = useState('');
  const [cardLink, setCardLink] = useState('');


  const handleCardNameInput = evt => {
    setCardName(evt.target.value);
  }
  const handleCarLinkInput = evt => {
    setCardLink(evt.target.value);
  }

  const handleSubmit = evt => {
    evt.preventDefault();
    onAddPlace({
      name: cardName,
      link: cardLink,
    });
  }

  return (
      <PopupWithForm
          name="addPlaceForm"
          formTitle="Новое место"
          submitButtonTitle="Создать"
          isOpen={isOpen}
          onClose={onClose}
          onCloseOverlay={onCloseOverlay}
          onSubmit={handleSubmit}
      >
        <fieldset className="popup__form-fieldset">
          <input
              className="popup__input"
              name="cardName"
              type="text"
              value={cardName}
              onChange={handleCardNameInput}
              id="card-name-input"
              minLength="2"
              maxLength="30"
              autoComplete="off"
              placeholder="Название"
              required
          />
          <span className="popup__input-error" id="card-name-input-error"> </span>
          <input
              className="popup__input"
              name="cardImage"
              type="url"
              value={cardLink}
              onChange={handleCarLinkInput}
              id="card-link-input"
              autoComplete="off"
              placeholder="Ссылка на картинку"
              required
          />
          <span className="popup__input-error" id="card-link-input-error"> </span>
        </fieldset>
      </PopupWithForm>
  )
}