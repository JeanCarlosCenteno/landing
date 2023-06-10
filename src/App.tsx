import "./App.css";
import Category from "./components/Category";
import Productos from "./components/Product";
import { LandingComponent } from "./components/Landing";
import ProductComponent from "./components/Product";
import CustomersComponent from "./components/Customers";
import Nav from "./components/nav/Nav";
import StoreComponent from "./components/Store";

function App() {
  return (
    <>
      <ProductComponent />
      <Category />
      <LandingComponent />
      <CustomersComponent />
      <StoreComponent />
    </>
  );
}

export default App;
