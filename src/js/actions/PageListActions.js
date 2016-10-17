import * as types from '../constants/ActionTypes';

export function addPage(content="default") {
  return {
    type: types.ADD_PAGE,
    content
  };
}

export function selectPage(id){
  return {
    type: types.SELECT_PAGE,
    id
  }
}


export function movePageUp(index){
  return {
    type: types.MOVE_PAGE_UP,
    index
  }
}

export function movePageDown(index){
  return {
    type: types.MOVE_PAGE_DOWN,
    index
  }
}

export function copyPage(index){
  return {
    type: types.COPY_PAGE,
    index
  }
}

export function pastePage(index){
  return {
    type: types.PASTE_PAGE,
    index
  }
}

export function delPage(index){
  return {
    type: types.DEL_PAGE,
    index
  }
}
