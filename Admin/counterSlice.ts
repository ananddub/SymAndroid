import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
    username: string;
    data: any;
    empid: string;
}

const initialState: CounterState = {
    username: '',
    data: '',
    empid: '',
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setUsername: (state, action: PayloadAction<any>) => {
            state.username = action.payload;
        },
        setData: (state, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
    },
});

export const { setUsername, setData } = counterSlice.actions;

export const selectUsername = (state: { counter: CounterState }) => state.counter.username;
export const selectData = (state: { counter: CounterState }) => state.counter.data;

export default counterSlice.reducer;

