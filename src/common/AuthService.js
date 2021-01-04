import ApiService from './ApiService';

export default class AuthService {
  static async login(loginApi) {
    return ApiService.post('login', loginApi);
  }

  static async logout() {
    return ApiService.remove('logout');
  }

  static async register(registerApi) {
    return ApiService.post('register', registerApi);
  }

  static async remindPassword(remindPasswordApi) {
    return ApiService.post('send-reset-password-email', remindPasswordApi);
  }

  static async resetPassword(resetPasswordApi) {
    return ApiService.post('reset', resetPasswordApi);
  }

  static async activateAccount() {
    return ApiService.get('verify');
  }
}
