import { PayloadAction, createSlice } from '@reduxjs/toolkit';
// import { tokensList } from '@/templates/Auth/TokensList';
import { Token } from '@/types';

interface TokenBalance {
  symbol: string; 
  name: string;
  balance: string; 
  price?: number;
  token?: string; 
  tokenAddress?: string;
  image?: string;
}

interface State {
  tokenBalances: Array<TokenBalance>;
  totalBalanceUsd: number;
  ethPrice: number;
  totalBalanceInEth: number;
  addresses: {
    [address: string]: {
      isDeployed: boolean;
    }
  };
  transactions: Array<any>;
  chosenToken: Token | null;
  tokens: Token[];
  isLoading: boolean;
}

const initialState: State = {
  tokenBalances: [],
  totalBalanceUsd: 0,
  ethPrice: 1760, 
  totalBalanceInEth: 0,
  addresses: {},
  transactions: [],
  chosenToken: null,
  tokens: [],
  isLoading: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setChosenToken: (state, action: PayloadAction<Token>) => {
      return {
        ...state,
        chosenToken: action.payload,
      }
    },
    setTokens: (state, action: PayloadAction<Token[]>) => {
      return {
        ...state,
        tokens: action.payload,
      }
    },
    setTransactions: (state, action: PayloadAction<Array<any>>) => { // Adjusted type
      state.transactions = [...action.payload];
    },
    reset: () => initialState,
    setIsLoadingStore: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  }
});

export const { setTokens, setChosenToken, reset, setIsLoadingStore } = walletSlice.actions;
export default walletSlice.reducer;
