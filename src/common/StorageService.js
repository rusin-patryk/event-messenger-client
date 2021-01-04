import ApiService from '@/common/ApiService';

export default class StorageService {
  static pickEvent(toPickedEvent) {
    localStorage.setItem('pickedEvent', toPickedEvent.toString());
  }

  static getPickedEvent() {
    return parseInt(localStorage.getItem('pickedEvent'), 10);
  }

  static saveUserInfo(toUserInfo) {
    localStorage.setItem('user', JSON.stringify(toUserInfo));
  }

  static getUserInfo() {
    if (!localStorage.getItem('user') || localStorage.getItem('user') === 'undefined' || localStorage.getItem('user') === 'null') {
      ApiService.removeHeader();
      this.clearCredentials();
      return false;
    }
    return JSON.parse(localStorage.getItem('user'));
  }

  static async clearCredentials() {
    localStorage.removeItem('user');
  }

  static isLoggedIn() {
    return !!(this.getUserInfo() && this.getUserInfo().access_token);
  }

  static isAdmin() {
    return !!(this.getUserInfo() && this.getUserInfo().user && this.getUserInfo().user.is_admin);
  }

  static saveTabs(tabs) {
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }

  static getTabs() {
    return JSON.parse(localStorage.getItem('tabs'));
  }
}
