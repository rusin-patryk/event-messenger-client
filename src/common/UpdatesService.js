import ApiService from './ApiService';

export default class UpdatesService {
  static async editUpdate(id, obj) {
    return ApiService.put(`statement/update/${id}`, obj);
  }

  static async deleteUpdate(id) {
    return ApiService.remove(`statement/delete/${id}`);
  }

  static async createUpdate(obj) {
    return ApiService.post('statement/create', obj);
  }
}
