import axios, { AxiosError } from 'axios';

export type RequestResponse = {
  result?: any,
  success: boolean;
  error?: AxiosError;
}

class ApiService {
  private rpc: string | undefined = undefined;
  constructor() {}

  setRpc(rpc: string) {
    this.rpc = rpc;
  }

  async makeGetRequest<T>(path: string): Promise<RequestResponse>{
    try {
      const response = await axios.get(`${this.rpc}${path}`);
      return {
        success: true,
        result: response.data as T & { err?: string },
      }
    } catch (err) {
      return {
        success: false,
        error: err as AxiosError,
      }
    }
  }

  async makePostRequest<T>(path: string, postData: any) {
    try {
      const response = await axios.post(`${this.rpc}/${path}`, postData);
      return {
        success: true,
        result: response.data as T & { err?: string },
      }
    } catch (err) {
      return {
        success: false,
        error: err as AxiosError,
      }
    }
  }

  // async withdraw(payload: { chainId: number; rawTx: string }) {
  //   return await this.makePostRequest<WithdrawResponse>('withdraw', payload);
  // }

}

export default ApiService;


