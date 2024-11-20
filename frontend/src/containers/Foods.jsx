import React, { Fragment, useEffect, useReducer, useState } from 'react';
import {
  initialState as foodsInitialState,
  foodsActionTyps,
  foodsReducer,
} from '../reducers/foods';

import { fetchFoods } from '../apis/foods';

import { HTTP_STATUS_CODE, REQUEST_STATE } from '../constants';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { styled } from 'styled-components'

import { COLORS } from '../style_constants';
import { LocalMallIcon } from '../components/Icons'; 

import { FoodWrapper } from '../components/FoodWrapper';
import Skeleton from '@mui/material/Skeleton';

import MainLogo from '../images/logo.png';
import FoodImage from '../images/food-image.jpg';
import { FoodOrderDialog } from '../components/FoodOrderDialog';
import { postLineFoods, replaceLineFoods } from '../apis/line_foods';
import { NewOrderConfirmDialog } from '../components/NewOrderConfirmDialog';



const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 32px;
`;

const BagIconWrapper = styled.div`
  padding-top: 24px;
`;

const ColoredBagIcon = styled(LocalMallIcon)`
  color: ${COLORS.MAIN};
`;

const MainLogoImage = styled.img`
  height: 90px;
`


const FoodsList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;

const ItemWrapper = styled.div`
  margin: 16px;
`;



export const Foods = () => {
  const { restaurantsId } = useParams(); // URLパラメータを取得
  const navigate = useNavigate();
  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState);

  const initialState = {
    isOpenOrderDialog: false,
    selectedFood: null,
    selectedFoodCount: 1,
    isOpenNewOrderDialog: false,
    existingResutaurautName: '',
    newResutaurautName: '',
  }
  const [state, setState] = useState(initialState);

  useEffect(() => {
    dispatch({ type: foodsActionTyps.FETCHING });
    fetchFoods(restaurantsId)
      .then((data) => {
        dispatch({
          type: foodsActionTyps.FETCH_SUCCESS,
          payload: {
            foods: data.foods,
          },
        });
      });
  }, [restaurantsId]); // restaurantsIdを依存配列に追加

  const submitOrder = () => {
    postLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    }).then(() => navigate('/orders'))
      .catch((e) => {
        if (e.response.status === HTTP_STATUS_CODE.NOT_ACCEPTABLE) {
          setState({
            ...state,
            isOpenOrderDialog: false,
            isOpenNewOrderDialog: true,
            existingResutaurautName: e.response.data.existing_restaurant,
            newResutaurautName: e.response.data.new_restaurant,
          })
        } else {
          throw e;
        }
      })
  };

  const replaceOrder = () => {
    replaceLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    }).then(() => navigate('/orders'))
  };

  return (
    <Fragment>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
        <BagIconWrapper>
          <Link to="/orders">
            <ColoredBagIcon fontSize="large" />
          </Link>
        </BagIconWrapper>
      </HeaderWrapper>
      <FoodsList>
        {
          foodsState.fetchState === REQUEST_STATE.LOADING ?
            <Fragment>
              {
                [...Array(12).keys()].map(i =>
                  <ItemWrapper key={i}>
                    <Skeleton key={i} variant="rect" width={450} height={180} />
                  </ItemWrapper>
                )
              }
            </Fragment>
          :
            foodsState.foodsList.map(food =>
              <ItemWrapper key={food.id}>
                <FoodWrapper
                  food={food}
                  onClickFoodWrapper={
                    (food) => setState({
                      ...state,
                      isOpenOrderDialog: true,
                      selectedFood: food,
                    })
                  }
                  imageUrl={FoodImage}
                />
              </ItemWrapper>
            )
        }
      </FoodsList>
      {
        state.isOpenOrderDialog &&
        <FoodOrderDialog
          isOpen={state.isOpenOrderDialog}
          food={state.selectedFood}
          countNumber={state.selectedFoodCount}
          onClickCountUp={() => setState({
            ...state,
            selectedFoodCount: state.selectedFoodCount + 1,
          })}
          onClickCountDown={() => setState({
            ...state,
            selectedFoodCount: state.selectedFoodCount - 1,
          })}
          onClickOrder={() => submitOrder()}
          onClose={() => setState({
            ...state,
            isOpenOrderDialog: false,
            selectedFood: null,
            selectedFoodCount: 1,
          })}
        />
      }
      {
      state.isOpenNewOrderDialog &&
      <NewOrderConfirmDialog
        isOpen={state.isOpenNewOrderDialog}
        onClose={() => setState({ ...state, isOpenNewOrderDialog: false })}
        existingResutaurautName={state.existingResutaurautName}
        newResutaurautName={state.newResutaurautName}
        onClickSubmit={() => replaceOrder()}
      />
    }
    </Fragment>
  );
}