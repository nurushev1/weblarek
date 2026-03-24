import "./scss/styles.scss";
import { ProductCatalog } from "./components/Models/ProductCatalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { ServerConnector } from "./components/communication/ServerConnector";
import { Api } from "./components/base/Api";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";

const productCatalog = new ProductCatalog();
const cart = new Cart();
const buyer = new Buyer();

productCatalog.setProducts(apiProducts.items);
console.log(
  "Проверка методов setProducts и getProducts: ",
  productCatalog.getProducts(),
);
console.log(
  "Проверка метода getProductById: ",
  productCatalog.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390"),
);

const exampleProduct = {
  id: "example",
  description: "example",
  image: "example",
  title: "example",
  category: "example",
  price: 150,
};

productCatalog.setSelectedProduct(exampleProduct);
console.log(
  "Проверка методов setSelectedProduct и getSelectedProduct: ",
  productCatalog.getSelectedProduct(),
);

cart.addProduct(apiProducts.items[0]);
console.log("Проверка методов addProduct и getProducts ", cart.getProducts());
console.log(
  "Проверка метода removeProduct: ",
  cart.removeProduct("854cef69-976d-4c2a-a18c-2aa45046c390"),
);
cart.addProduct(apiProducts.items[1]);
console.log(
  "Проверка метода clearCart: ",
  cart.clearCart(),
  cart.getProducts(),
);
cart.addProduct(apiProducts.items[0]);
console.log("Проверка метода getAllCost: ", cart.getAllCost());
console.log("Проверка метода getQuantity: ", cart.getQuantity());
console.log(
  "Проверка метода hasProduct: ",
  cart.hasProduct("854cef69-976d-4c2a-a18c-2aa45046c390"),
);

const exampleDataBuyer = {
  address: "example",
  email: "exampe",
};
buyer.setData(exampleDataBuyer);
console.log("Проверка методов setData и getData: ", buyer.getData());
console.log("Проверка метода clearData: ", buyer.clearData(), buyer.getData());
console.log("Проверка метода validateData: ", buyer.validateData());

const api = new Api(API_URL);
const serverConnector = new ServerConnector(api);

serverConnector
  .fetchProducts()
  .then((response) => {
    productCatalog.setProducts(response.items);
    console.log("Каталог товаров с сервера: ", productCatalog.getProducts());
  })
  .catch((error) => {
    console.error("Ошибка при получении товаров с сервера: ", error);
  });
