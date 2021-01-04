import ApiService from './ApiService';

export default class EventsService {
  static async getAllEvents(obj) {
    return ApiService.post('event/get-all', obj);
  }

  static async getUserEvents(obj) {
    return ApiService.post('user/get-events', obj);
  }

  static async createEvent(obj) {
    return ApiService.post('event/create', obj);
  }

  static async updateEvent(id, obj) {
    return ApiService.put(`event/update/${id}`, obj);
  }

  static async deleteEvent(id) {
    return ApiService.remove(`event/delete/${id}`);
  }

  static async addUsersToEvent(id, list) {
    return ApiService.post(`/event/add-users/${id}`, list);
  }

  static async removeUsersFromEvent(id, list) {
    return ApiService.post(`event/detach-users/${id}`, list);
  }

  static async getEvent(id) {
    return ApiService.get(`/event/get-one/${id}`);
  }

  static async getFaqs(obj) {
    return ApiService.post('/faq/get-all', obj);
  }
}
