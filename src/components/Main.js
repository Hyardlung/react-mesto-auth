import {useContext} from 'react';
import Card from './Card';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

export default function Main({cards, onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete}) {
  const currentUser = useContext(CurrentUserContext);

  return (
      <main className="main">
        <section className="profile page__profile">
          <div className="avatar profile__avatar">
            <img src={currentUser.avatar} alt="Аватар пользователя" className="avatar__image" />
            <button className="avatar__button" onClick={onEditAvatar}> </button>
          </div>
          <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <p className="profile__about">{currentUser.about}</p>
            <button className="profile__edit-button" type="button" onClick={onEditProfile}> </button>
          </div>
          <button className="profile__add-button" type="button" onClick={onAddPlace}> </button>
        </section>

        <section className="elements">
          <ul className="elements__list">
            {cards.map(item =>
                <Card
                    {...item}
                    card={item}
                    key={item._id}
                    onCardClick={onCardClick}
                    onCardLike={onCardLike}
                    onCardDelete={onCardDelete}
                />)
            }
          </ul>
        </section>
      </main>
  )
}