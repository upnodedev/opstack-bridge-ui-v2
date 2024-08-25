import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  [key: string]: boolean;
}

const initialState: ModalState = {};

export const ModalSlide = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, { payload }) => {
      state[payload] = true;
    },
    closeModal: (state, { payload }) => {
      state[payload] = false;
    },
  },
});

export const { openModal, closeModal } = ModalSlide.actions;
export default ModalSlide.reducer;
