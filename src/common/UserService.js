import ApiService from './ApiService';

export default class UserService {
  static async updateUser(obj) {
    return ApiService.put(`user/update`, obj, 'multipart/form-data');
  }

  static async updateFile(obj) {
    return ApiService.uploadPost('user/avatar', obj, '*/*', 'multipart/form-data; boundary=<calculated when request is sent>');
  }

  static async deleteFile() {
    return ApiService.remove('user/avatar');
  }

  static async deleteUser(id) {
    return ApiService.remove(`user/${id}`);
  }

  static async updatePassword(obj) {
    return ApiService.put('user/new-password', obj);
  }

  static async getAllUsers(obj) {
    return ApiService.post('user/get-all', obj);
  }

  static async assignEvents(id, obj) {
    return ApiService.post(`user/assign-events/${id}`, obj);
  }

  static async createUser(obj) {
    return ApiService.post('register', obj);
  }

  static async activateUser(id) {
    return ApiService.get(`user/activate/${id}`);
  }
}
