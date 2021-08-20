import React, { useEffect } from 'react';
import ProductItem from '../ProductItem';
import {connect} from "react-redux";
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';

function ProductList(props) {

  const { currentCategory, dispatch } = props;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products,
        });
      });
    }
  }, [data, loading, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return props.products;
    }

    return props.products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {props.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              item={{
                _id: product._id,
                image: product.image,
                name: product.name,
                price: product.price,
                quantity: product.quantity
              }}
              key={product._id}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

const mapStateToProps =(state) => {
  return {...state.products};
};

export default connect( mapStateToProps )(ProductList);
