import ApiService from './ApiService';

export default class FilesService {
  static async deleteFile(id) {
    return ApiService.remove(`file/delete/${id}`);
  }

  static async createFile(obj) {
    return ApiService.uploadPost('file/upload', obj, '*/*', 'multipart/form-data; boundary=<calculated when request is sent>');
  }

  static async getFiles(obj) {
    return ApiService.post('/file/get-all', obj);
  }

  static async downloadFile(id, fileName) {
    return ApiService.downloadGet(`/file/download/${id}`, 'arraybuffer', fileName);
  }
}
