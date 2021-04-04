import {useEffect, useState} from 'react';
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';

import '../index.css';
import {api} from '../utils/api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

import {ProtectedRoute} from './ProtectedRoute';
import * as auth from '../auth';
import {Register} from './Register';
import {Login} from './Login';
import {InfoTooltip} from "./InfoTooltip";


export default function App() {
  const [loggedIn, setLoggedIn] = useState({
    loggedIn: false
  });
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });
  const history = useHistory();

  useEffect(() => {
    tokenCheck()
  }, [])
  // useEffect(() => {
  //   if (loggedIn) {
  //     history.push('/')
  //   }
  // }, [loggedIn])

  const tokenCheck = () => {
    if (localStorage.getItem('jwt')) {    // если токен есть в localStorage,
      let jwt = localStorage.getItem('jwt');    // берём его оттуда
      if (jwt) {
        auth.getContent(jwt).then(({email, password}) => {
              if (email) {
                setLoggedIn(true);
                setUserData({email, password})
              }
            })
      }
    }
  }

  const handleLogin = ({email, password}) => {
    console.log({email, password});
    return auth.authorize(email, password)
        .then(data => {
          if (!data) throw new Error('Неверный емэйл или пароль')
          if (data.jwt) {
            setLoggedIn(true)
            localStorage.setItem('jwt', data.jwt)
            history.push('/');
          }
        })
  };

  const handleRegister = ({email, password}) => {
    console.log({email, password});
    return auth.register({email, password})
        .then(res => {
          if (!res || res.statusCode === 400) throw new Error('Что-то пошло не так');
          return res;
        }).catch()
  }

  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({
    name: '',
    about: '',
    avatar: '',
  });

  // хук, подтягивающий данные о пользователе и массив карточек с сервера
  useEffect(() => {
    Promise.all([
      api.getRemoteCards(),
      api.getUserData()
    ])
        .then(([remoteCards, userData]) => {
          setCards(remoteCards);
          setCurrentUser(userData);
        })
        .catch(err => console.log(err));
  }, []);

  // ОБРАБОТЧИКИ СОБЫТИЙ
  // открытие попапа редактирования профиля
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }
  // открытие попапа добавления новой карточки
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }
  // открытие попапа обновления аватара пользователя
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }
  // открытие попапа предпросмотра карточки
  const handleCardClick = ({name, link}) => {
    setSelectedCard({name, link});
    setIsImagePopupOpen(true);
  }
  // лайк карточки
  const handleCardLike = card => {
    const isLiked = card.likes.some(like => like._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked)
        .then(res => {
          setCards(state => state.map(c => c._id === card._id ? res : c))
        })
        .catch(err => console.log(err));
  }
  // удаление карточки
  const handleCardDelete = card => {
    api.deleteCard(card._id)
        .then(() => {
          setCards(state => state.filter(c => c._id !== card._id))
        })
        .catch(err => console.log(err));
  }

  // обработчик редактирования профиля
  const handleUpdateUser = newData => {
    api.editUserData(newData)
        .then(res => setCurrentUser(res))
        .then(() => closeAllPopups())
        .catch(err => console.log(err))
  }
  // обработчик редактирования аватара
  const handleUpdateAvatar = newData => {
    api.updateAvatar(newData)
        .then(res => setCurrentUser(res))
        .then(() => closeAllPopups())
        .catch(err => console.log(err))
  }
  // обработчик добавления карточки
  const handleAddPlaceSubmit = (card) => {
    api.sendCard(card)
        .then(newCard => setCards([newCard, ...cards]))
        .then(() => closeAllPopups())
        .catch(err => console.log(err))
  }
  // обработчик закрытия попапа по нажатию на Esc
  const handleEscClose = (evt) => {
    if (evt.key === 'Escape') {
      closeAllPopups()
    }
  }
  // обработчик закрытия попапа по клику на оверлей
  const handleCloseOverlay = (evt) => {
    if (evt.target.classList.contains('popup_opened')) {
      closeAllPopups()
    }
  }

  // закрытие любого из попапов
  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(false);
    setIsImagePopupOpen(false);
  }


  return (
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page root__page" onKeyDown={handleEscClose}>
          <Header/>
          <Switch>
            <ProtectedRoute exact path="/" loggedIn={loggedIn} component={Main}
                userData={userData}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                cards={cards}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
            />
            <Route path="/sign-in">
              <Login onLogin={handleLogin}/>
            </Route>
            <Route path="/sign-up">
              <Register onRegister={handleRegister}/>
            </Route>

            <Route>
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>
          {loggedIn && <Footer/>}
        </div>

        {/*попап редактирования профиля*/}
        <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onCloseOverlay={handleCloseOverlay}
            onUpdateUser={handleUpdateUser}
        />

        {/*попап редактирования аватара пользователя*/}
        <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onCloseOverlay={handleCloseOverlay}
            onUpdateAvatar={handleUpdateAvatar}
        />

        {/*попап добавления новой карточки*/}
        <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onCloseOverlay={handleCloseOverlay}
            onAddPlace={handleAddPlaceSubmit}
        />

        {/*попап предпросмотра изображения карточки*/}
        <ImagePopup
            isOpen={isImagePopupOpen}
            onClose={closeAllPopups}
            onCloseOverlay={handleCloseOverlay}
            {...selectedCard}
        />

        {/*попап подтверждения удаления карточки*/}
        <PopupWithForm
            name="confirmationDeleteCard"
            formTitle="Вы уверены?"
            submitButtonTitle="Да"
        >
        </PopupWithForm>

        <InfoTooltip
          onClose={closeAllPopups}
          onCloseOverlay={handleCloseOverlay}
        />
      </CurrentUserContext.Provider>
  );
}