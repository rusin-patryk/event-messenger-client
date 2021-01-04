import client from '../configs/axios';

export default class ApiService {
  static setHeader(token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  static removeHeader() {
    delete client.defaults.headers.common.Authorization;
  }

  static async get(url) {
    const response = await client.get(url);
    return response.data;
  }

  static async post(url, data, config) {
    const postConfig = (typeof config === 'undefined') ? {timeout: 0} : config;
    const response = await client.post(url, data, postConfig);
    return response.data;
  }

  static async put(url, data) {
    return client.put(url, data);
  }

  static async uploadPost(url, data, accept, contentType) {
    return client.post(url, data, {
      headers: {
        Accept: `${accept}`,
        'Content-Type': `"${contentType}"`,
      },
    });
  }

  static async downloadGet(url, responseType, fileName) {
    return client.get(url, {responseType: responseType}, {
      headers: {
        'Content-Disposition': `attachment;filename=${fileName}`,
      },
    });
  }

  static async remove(url, data) {
    const response = await client.delete(url, {data});
    return response.data;
  }
}
