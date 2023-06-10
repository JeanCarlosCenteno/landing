
import './App.css';
import Category from './components/Category';
import Productos from './components/Product';
import { LandingComponent } from './components/Landing';
import Store from './components/Store';

function App() {
  return (
    <>
    <Productos/>
    <Category />
    <LandingComponent />
    <Store/>
    </>
   

  );
}

export default App;
