import { createAsyncThunk } from '@reduxjs/toolkit';
import { ACTION_TYPE } from '../types';
import { emitWithAck, socket } from '../../utils/socket.io';

export const socketEmitSigInJoin = createAsyncThunk(
    ACTION_TYPE.SOCKET_SIGNIN_JOIN,
    async (payload: {email: string, name: string}, thunkAPI) => {
      try {
        const response = await emitWithAck(socket, "USER_JOIN", payload);
        return response;
      } catch (error) {
        return thunkAPI.rejectWithValue(error); 
      }
    }
  );