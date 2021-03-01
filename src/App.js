import React, {useContext} from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import { AuthContext } from './context/auth-context';
import Auth from './components/Auth'

const App = props => {
  const authContext = useContext(AuthContext);

  let content = <Auth/>

  if (authContext.isAuth) {
    content = <Ingredients />
  }

  return(
    <React.Fragment>
      {content}
    </React.Fragment>
  ) 
};

export default App;
