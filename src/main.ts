import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { ServerConnector } from './components/communication/ServerConnector';

import { API_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { Gallery } from './components/View/Gallery';
import { CardCatalog } from './components/View/CardCatalog';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';

import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';

import { IProduct } from './types';
import { TPayment } from './types';
import { CDN_URL } from './utils/constants';

const events = new EventEmitter();

const catalog = new ProductCatalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const api = new Api(API_URL);
const server = new ServerConnector(api);

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

const modal = new Modal(ensureElement<HTMLElement>('.modal'), events);

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const basket = new Basket(
  basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement,
  events
);

const orderTemplate = ensureElement<HTMLTemplateElement>('#order');

const orderForm = new OrderForm(
  orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement,
  events
);

const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const contactsForm = new ContactsForm(
  contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement,
  events
);

events.on('catalog:changed', () => {
  const products = catalog.getProducts();

  const cards = products.map((product: IProduct) => {
    const template = document.getElementById(
      'card-catalog'
    ) as HTMLTemplateElement;

    const el = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const card = new CardCatalog(el, {
      onClick: () => events.emit('card:select', product),
    });

    return card.render(product);
  });

  gallery.catalog = cards;
});

events.on('card:select', (product: IProduct) => {
  catalog.setSelectedProduct(product);
  events.emit('product:selected', product);
});



events.on('product:selected', (product: IProduct) => {
  const template = document.getElementById('card-preview') as HTMLTemplateElement;
  const el = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const preview = new PreviewCard(el, events);

  preview.id = product.id;
  preview.title = product.title;
  preview.price = product.price;
  preview.image = CDN_URL + product.image;
  preview.inCart = cart.hasProduct(product.id);

  modal.content = preview.render();
  modal.open();
});



events.on('product:toggle', ({ id }: { id: string }) => {
  const product = catalog.getProductById(id);
  if (!product) return;

  if (cart.hasProduct(id)) {
    cart.removeProduct(id);
  } else {
    cart.addProduct(product);
  }
});

events.on('cart:changed', ({ products }: { products: IProduct[] }) => {
  const items = products.map((product: IProduct, index: number) => {
    const template = document.getElementById(
      'card-basket'
    ) as HTMLTemplateElement;

    const el = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const card = new BasketCard(el, events);

    card.id = product.id;
    card.index = index + 1;
    card.title = product.title;
    card.price = product.price;

    return card.render();
  });

  basket.items = items;
  basket.total = cart.getAllCost();
  basket.disabled = products.length === 0;
});

events.on('basket:open', () => {
  modal.content = basket.render();
  modal.open();
});

events.on('modal:close', () => {
  modal.clear();
});

events.on('order:start', () => {
  modal.content = orderForm.render();
  modal.open();
});

events.on('order:payment', ({ payment }: { payment: TPayment }) => {
  buyer.setData({ payment });
});

events.on('order:submit', () => {
  const errors = buyer.validateData();

  if (Object.keys(errors).length > 0) {
    orderForm.errors = Object.values(errors).join(', ');
    return;
  }

  modal.content = contactsForm.render();
});

events.on('form:change', ({ field, value }: { field: string; value: string }) => {
  buyer.setData({ [field]: value } as any);
});

events.on('contacts:submit', () => {
  const errors = buyer.validateData();

  if (Object.keys(errors).length > 0) {
    contactsForm.errors = Object.values(errors).join(', ');
    return;
  }

  cart.clearCart();
  buyer.clearData();

  modal.close();
});

server
  .fetchProducts()
  .then((response) => {
    catalog.setProducts(response.items);
  })
  .catch((err) => {
    console.error('API error:', err);
  });