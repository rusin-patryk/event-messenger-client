import ApiService from './ApiService';

export default class AuthService {
  static async GetConversation(obj) {
    return ApiService.post('message/get-conversations', obj);
  }

  static async GetMessages(obj) {
    return ApiService.post('message/get-messages', obj);
  }

  static async sendMessage(obj) {
    return ApiService.post('message/send', obj);
  }
}
