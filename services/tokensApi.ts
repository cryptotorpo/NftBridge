import { Token } from '@/types';
import ApiService, { RequestResponse } from './apiService';

export interface TokensResponse extends RequestResponse {
  result: {
    tokens: Token[];
    timestamp: number;
    success: boolean;
  }
}

class TokensApi extends ApiService {
  private apiURI = 'https://tokens.coingecko.com/uniswap/all.json';
  
  constructor() {
    super();
    this.setRpc(this.apiURI);
  }

  async getTokens(): Promise<Array<Token>> {
    const tokensResp = await this.makeGetRequest('') as TokensResponse;
    return tokensResp?.result?.tokens ?? [];
  }
}

export default new TokensApi();