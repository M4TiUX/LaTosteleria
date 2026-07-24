import * as React from 'react';
import { createContext, useReducer } from 'react';
import {
  cartReducer,
  cartInitialState,
  getTotal,
  getCountItems,
  CART_ACTION,
} from '../reducers/cart';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

export const CartContext = createContext();

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);
  const getLabel = (item) => item.title || item.name || item.nombre || 'El elemento';

  const addItem = (movie) =>{
    dispatch({
      type: CART_ACTION.ADD_ITEM,
      payload: movie,
    });
    toast.success(`${getLabel(movie)} fue añadido al pedido`
    )
  }
  const decreaseItem = (movie) =>{
    dispatch({
      type: CART_ACTION.DECREASE_ITEM,
      payload: movie,
    });
  }
  const removeItem = (movie) =>{
    dispatch({
      type: CART_ACTION.REMOVE_ITEM,
      payload: movie,
    });
    toast(`${getLabel(movie)} fue eliminado del pedido`,
      {
        icon: <RemoveShoppingCartIcon color='warning' />
      }
    )
  }
  const cleanCart = () =>{
    dispatch({
      type: CART_ACTION.CLEAN_CART,
    });
    toast(`El pedido fue reiniciado`,
      {
        icon: <DeleteIcon color='warning' />
      }
    )
  }
  return (
    <CartContext.Provider
      value={{
        cart: state,
        addItem,
        decreaseItem,
        removeItem,
        cleanCart,
        getTotal,
        getCountItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
