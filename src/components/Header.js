import {Link, Route, Switch} from 'react-router-dom';

export default function Header({loggedIn, handleSignOut, userEmail}) {
  return (
      <header className="header page__header">
        <a href="#!" target="_self" className="logo header__logo"> </a>
        <div className="header__box">
          {loggedIn ?
              (
                <>
                  <span className="header__email">{userEmail}</span>
                  <Link to="" className="header__link header__link_signout" onClick={handleSignOut}>Выйти</Link>
                </>
              ) : (
                  <Switch>
                    <Route path="/sign-up">
                      <Link to="/sign-in" className="header__link">Войти</Link>
                    </Route>
                    <Route path="/sign-in">
                      <Link to="/sign-up" className="header__link">Регистрация</Link>
                    </Route>
                  </Switch>
              )
          }
        </div>
      </header>
  )
}