import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';

const initialState: NavigationState = {
  drawerOpen: false,
  selectedLibrary: 0,
};

export type NavigationState = {
  drawerOpen: boolean;
  selectedLibrary: number;
};

export const navigationSliceKey = 'navigationStates';

// == REDUCER
export const navigationSlice = createSlice({
  name: navigationSliceKey,
  initialState,
  reducers: {
    setDrawerOpen(state, action: PayloadAction<boolean>) {
      state.drawerOpen = action.payload;
    },
    setSelectedLibrary(state, action: PayloadAction<number>) {
      state.selectedLibrary = action.payload;
    },
  },
});

// == ACTIONS
export const {setDrawerOpen, setSelectedLibrary} = navigationSlice.actions;

// == SELECTORS

export const getDrawerOpen = (state: RootState) => {
  return state[navigationSliceKey].drawerOpen;
};
export const getSelectedLibrary = (state: RootState) => {
  return state[navigationSliceKey].selectedLibrary;
};
