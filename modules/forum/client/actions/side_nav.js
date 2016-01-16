import {
  OPEN_SIDE_NAV,
  CLOSE_SIDE_NAV
} from '../constants';

export function openSideNav() {
  return {
    type: OPEN_SIDE_NAV
  }
};

export function closeSideNav() {
  return {
    type: CLOSE_SIDE_NAV
  }
}
