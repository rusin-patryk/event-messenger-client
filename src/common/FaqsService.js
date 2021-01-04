import ApiService from './ApiService';

export default class FaqsService {
  static async editFaq(id, obj) {
    return ApiService.put(`faq/update/${id}`, obj);
  }

  static async deleteFaq(id) {
    return ApiService.remove(`faq/delete/${id}`);
  }

  static async createFaq(obj) {
    return ApiService.post('faq/create', obj);
  }
}
