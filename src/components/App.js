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
import tooltipDeny from '../images/tooltip-deny.svg';
import tooltipSuccess from '../images/tooltip-success.svg'

export default function App() {
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isInfoToolTip, setInfoToolTip] = useState(false);
  const [infoMessage, setInfoMessage] = useState({icon: '', caption: ''})
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({name: '', about: '', avatar: ''});
  const [userData, setUserData] = useState({email: '', password: ''});
  const [userEmail, setUserEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

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

  useEffect(() => {
    tokenCheck()
  }, [])

  useEffect(() => {
    if (loggedIn) {
      history.push('/main')
    }
  }, [history, loggedIn])

  // Регистрация
  const handleRegister = ({email, password}) => {
    return auth.register({email, password})
        .then(res => {
          if (res) {
            handleInfoToolTipStatus({icon: tooltipSuccess, caption: 'Вы успешно зарегистрировались!'});
            handleInfoToolTipVisible(true);
            history.push('/sign-in');
          }
        }).catch(err => {
          handleInfoToolTipStatus({icon: tooltipDeny, caption: 'Что-то пошло не так! Попробуйте ещё раз.'});
          handleInfoToolTipVisible(true);
          console.log(err);
        })
  };

  // Авторизация
  const handleLogin = ({email, password}) => {
    auth.authorize(email, password)
        .then(data => {
          console.log(data)
          if (!data) throw new Error('Неверные имя пользователя или пароль')
          if (data.token) {
            setLoggedIn(true);
            auth.getContent(data.token)
                .then(res => {
                  if (res) {
                    setLoggedIn(true);
                    setUserEmail(res.data.email);
                  }
                })
            localStorage.setItem('jwt', data.token);
            history.push('/main')
            handleInfoToolTipStatus({icon: tooltipSuccess, caption: 'Вы успешно авторизовались!'});
            handleInfoToolTipVisible(true);
          }
        }).catch(err => {
          handleInfoToolTipStatus({icon: tooltipDeny, caption: 'Что-то пошло не так! Попробуйте ещё раз.'});
          handleInfoToolTipVisible(true);
          console.log(err);
        });
  };

  // Проверка токена
  const tokenCheck = () => {
    if (localStorage.getItem('jwt')) {    // если токен есть в localStorage,
      let jwt = localStorage.getItem('jwt');    // берём его оттуда
      auth.getContent(jwt)
          .then(res => {
            if (res) {
              setLoggedIn(true);
              setUserEmail(res.data.email);
            }
          })
          .catch(err => console.log(err));
    }
  };
  // Выход
  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setUserData({email: ''});
    history.push('/sign-in');
  };

  // ОБРАБОТЧИКИ СОБЫТИЙ
  // открытие попапа редактирования профиля
  const handleEditProfileClick = () => {
    setEditProfilePopupOpen(true);
  }
  // открытие попапа добавления новой карточки
  const handleAddPlaceClick = () => {
    setAddPlacePopupOpen(true);
  }
  // открытие попапа обновления аватара пользователя
  const handleEditAvatarClick = () => {
    setEditAvatarPopupOpen(true);
  }
  // открытие попапа предпросмотра карточки
  const handleCardClick = ({name, link}) => {
    setSelectedCard({name, link});
    setImagePopupOpen(true);
  }
  // открытие тултипа со статусом регистрации
  const handleInfoToolTipVisible = () => {
    setInfoToolTip(true)
  }
  // изменение контента тултипа в зависимости от статуса регистрации
  const handleInfoToolTipStatus = ({icon, caption}) => {
    setInfoMessage({icon: icon, caption: caption})
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
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard(false);
    setImagePopupOpen(false);
    setInfoToolTip(false);
  }

  return (
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page root__page" onKeyDown={handleEscClose}>
          <Header loggedIn={loggedIn} userEmail={userEmail} handleSignOut={handleSignOut}/>
          <Switch>
            <ProtectedRoute exact path="/main" loggedIn={loggedIn} component={Main}
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
              {loggedIn ? <Redirect to="/"/> : <Redirect to="/sign-in"/>}
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
            infoMessage={infoMessage}
            isOpen={isInfoToolTip}
            onClose={closeAllPopups}
            onCloseOverlay={handleCloseOverlay}
        />
      </CurrentUserContext.Provider>
  );
}