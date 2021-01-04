export default class AuthFactory {
  static toCheckMail(email) {
    return {
      email,
    };
  }

  static toRegister({email, password}) {
    return {
      email,
      password,
    };
  }

  static toResetPassword({password}) {
    return {
      password,
    };
  }

  static toUserInfo({email}, response) {
    return {
      email,
      ...response,
    };
  }

  static toUpdateUserInfo({acceptance_email, accounting_email, nip}, {email, token}) {
    return {
      acceptance_email,
      accounting_email,
      nip,
      email,
      token,
    };
  }
}
