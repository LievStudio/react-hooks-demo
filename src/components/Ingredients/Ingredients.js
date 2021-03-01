import React, { useCallback, useReducer, useMemo, useEffect } from "react";
import useHttp from "../../hooks/http";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((i) => i.id !== action.id);
    default:
      throw new Error("Should not be here!");
  }
};

const Ingredients = (props) => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, data, error, sendRequest, reqExtra, reqIdentifier, reset } = useHttp();

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest(
      "https://react-hooks-backend-3cb2e-default-rtdb.firebaseio.com/ingredients.json",
      "POST",
      JSON.stringify(ingredient),
      ingredient,
      "ADD_INGREDIENT"
    );
  }, [sendRequest]);

  const onRemoveIngredientHandler = useCallback(
    (ingId) => {
      sendRequest(
        `https://react-hooks-backend-3cb2e-default-rtdb.firebaseio.com/ingredients/${ingId}.json`,
        "DELETE",
        null,
        ingId,
        'REMOVE_INGREDIENT'
      )
    },
    [sendRequest]
  );

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  useEffect(() => {
    if (!isLoading && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: "DELETE", id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT'){
      dispatch({
        type: "ADD",
        ingredient: { ...reqExtra, id: data.name },
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const ingredientList = useMemo(
    () => (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={onRemoveIngredientHandler}
      />
    ),
    [userIngredients, onRemoveIngredientHandler]
  );

  return (
    <div className="App">
      {error && <ErrorModal onClose={reset}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
