import {useContext} from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

export default function Card({card, onCardClick, onCardLike, onCardDelete}) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;    // определение владельца карточки
  const cardDeleteButtonClassName = (   // переменная для кнопки удаления
      `card__remove-button ${isOwn && 'card__remove-button_active'}`
  );
  const isLiked = card.likes.some(like => like._id === currentUser._id);   // проверка наличия лайка текущего юзера
  const cardLikeButtonClassName = (   // переменная для кнопки лайка
      `card__like-button ${isLiked && 'card__like-button_active'}`
  );

  const cardClickHandler = () => {
    onCardClick(card);
  };

  const cardLikeHandler = () => {
    onCardLike(card);
  }

  const cardDeleteHandler = () => {
    onCardDelete(card)
  }

  return (
      <li className="card">
        <div className="card__image-wrapper">
          <img
              className="card__image"
              src={card.link}
              alt={card.name}
              onClick={cardClickHandler}
          />
        </div>
        <button
            className={cardDeleteButtonClassName}
            type="button"
            onClick={cardDeleteHandler}
        />
        <div className="card__footer">
          <h2 className="card__heading">{card.name}</h2>
          <div className="card__like-wrapper">
            <button
                className={cardLikeButtonClassName}
                type="button"
                onClick={cardLikeHandler}
            />
            <span className="card__like-counter">{card.likes.length}</span>
          </div>
        </div>
      </li>
  )
}