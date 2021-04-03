import {useState} from 'react';
import {Link} from 'react-router-dom';
import './../blocks/register/register.css';

export const Register = ({onRegister}) => {
  // const [userData, setUserData] = ({
  //   email: '',
  //   password: '',
  // });

  // const [message, setMessage] = useState();

  // const handleChange = (evt) => {
  //   const {name, value} = evt.target;
  //   setUserData({
  //     ...userData,
  //     [name]: value
  //   });
  // }

  // const handleSubmit = (evt) => {
  //   let {email, password} = userData;
  //   evt.preventDefault();
  //   console.log()
  // }

  return (
      <section className="auth page__auth">
        <h2 className="auth__title">Регистрация</h2>
        <form
            className="auth__form"
            action="#"
            noValidate
            // onSubmit={handleSubmit}
        >
          <fieldset className="auth__form-fieldset">
            <input
                className="auth__input"
                name="email"
                type="email"
                // value={userData.email}
                id="email-input"
                // minLength="2"
                // maxLength="40"
                autoComplete="off"
                placeholder="Email"
                required
                // onChange={handleChange}
            />
            <span className="auth__input-error" id="auth-email-input-error"> </span>
            <input
                className="auth__input"
                name="password"
                type="password"
                // value={userData.password}
                id="password-input"
                minLength="2"
                maxLength="30"
                autoComplete="off"
                placeholder="Пароль"
                required
                // onChange={handleChange}
            />
            <span className="auth__input-error" id="auth-password-input-error"> </span>
          </fieldset>
          <button className="auth__submit-button" type="submit">
            Зарегистрироваться
          </button>
        </form>
        <div className="auth__signin">
          <span>Уже зарегистрированы?</span>
          <Link to="sign-in" className="auth__login-link">Войти</Link>
        </div>
      </section>
  )
}