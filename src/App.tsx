import "./App.css";
import Category from "./components/Category";
import Productos from "./components/Product";
import { LandingComponent } from "./components/Landing";
import Store from "./components/Store";
import ProductComponent from "./components/Product";
import CustomersComponent from "./components/Customers";
import Nav from "./components/nav/Nav";

function App() {
  return (
    <>
      <ProductComponent />
      <Category />
      {/* <LandingComponent />
      <Store />
      <CustomersComponent /> */}
    </>
  );
}

export default App;
