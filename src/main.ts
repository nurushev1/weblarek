import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { TPayment, IOrderRequest } from './types'

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { ServerConnector } from './components/communication/ServerConnector';

import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL } from './utils/constants';
import { IProduct } from './types';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { Success } from './components/View/Success';

import { CardCatalog } from './components/View/CardCatalog';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';

import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';

const events = new EventEmitter()
const api = new Api(API_URL)
const communication = new ServerConnector(api)
const catalog = new ProductCatalog(events)
const cart = new Cart(events)
const buyer = new Buyer(events)

const galleryElement = ensureElement<HTMLElement>('.gallery')
const modalElement = ensureElement<HTMLElement>(".modal")
const headerElement = ensureElement<HTMLElement>('.header')
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket")
const orderFormTemplate = ensureElement<HTMLTemplateElement>("#order")
const contactsFormTemplate = ensureElement<HTMLTemplateElement>("#contacts")
const successTemplate = ensureElement<HTMLTemplateElement>("#success")

const gallery = new Gallery(galleryElement)
const modal = new Modal(modalElement, events)
const header = new Header(events, headerElement)
const basket = new Basket(cloneTemplate(basketTemplate), events)
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events)
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events)
const success = new Success(cloneTemplate(successTemplate), events)


communication.fetchProducts().then(el => {
  catalog.updateItemList(el)
  console.log(`Массив товаров из каталога:`,catalog.getItemList())
}).catch((error) => console.error("Ошибка API:", error))

events.on('catalog:change', () => {
  const products = catalog.getItemList();
  const cardElements = products.map((product) => {
    const card = new CardCatalog(events, () => {
      events.emit('product:select', product)
    })
    return card.render(product)
  })

  gallery.render({ catalog: cardElements })
})

events.on('product:select', (product: IProduct) => {
  catalog.setSelectedItem(product)
})

events.on('catalog:item-selected', (product: IProduct) => {
  const preview = new PreviewCard(events, () => {
    if (cart.hasProduct(product.id)) {
      cart.removeProduct(product)
    } else {
      cart.addProduct(product)
    }
    modal.close() 
  })

  const element = preview.render(product)

  if (product.price === null) {
    preview.setButtonText('Недоступно')
    preview.setButtonDisabled(true)
  } else {
    preview.setButtonDisabled(false)
      if (cart.hasProduct(product.id)) {
        preview.setButtonText('Удалить из корзины')
      } else {
        preview.setButtonText('Купить')
      }
  }

  modal.open(element)
})

events.on('basket:open', () => {
  modal.open(basket.render())
})

events.on('cart:change', () => {
  header.counter = cart.getItemCount()
  const items = cart.getProducts().map((product, index) => {
    return new BasketCard(events, () => {
      cart.removeProduct(product)
    }).render({ ...product, index })
  })

  basket.render({
    items,
    total: cart.getTotalPrice()
  })
})

events.on('basket:order', () => {
  const errors = buyer.validation()
  const data = buyer.getData()

  orderForm.setErrors([errors.payment, errors.address].filter(Boolean).join('. '))
  orderForm.setSubmitEnabled(!errors.payment && !errors.address)
  orderForm.togglePaymentButtonStatus(data.payment)
  orderForm.setAddress(data.address)

  modal.open(orderForm.render())
})

events.on('payment:change', (data: { payment: TPayment }) => {
  buyer.setPayment(data.payment)
})

events.on('address:change', (data: { address: string }) => {
  buyer.setAddress(data.address)
})

events.on('order:submit', () => {
  const errors = buyer.validation()
  const data = buyer.getData()

  contactsForm.setErrors([errors.email, errors.phone].filter(Boolean).join('. '))
  contactsForm.setSubmitEnabled(!errors.email && !errors.phone)
  contactsForm.setEmail(data.email)
  contactsForm.setPhone(data.phone)

  modal.open(contactsForm.render())
})

events.on('contacts:email', (data: { email: string }) => {
  buyer.setEmail(data.email)
})

events.on('contacts:phone', (data: { phone: string }) => {
  buyer.setPhone(data.phone)
})

events.on('buyer:changed', () => {
  const errors = buyer.validation()
  const data = buyer.getData()

  orderForm.setErrors([errors.payment, errors.address].filter(Boolean).join('. '))
  orderForm.setSubmitEnabled(!errors.payment && !errors.address)
  orderForm.togglePaymentButtonStatus(data.payment)
  orderForm.setAddress(data.address)

  contactsForm.setErrors([errors.email, errors.phone].filter(Boolean).join('. '))
  contactsForm.setSubmitEnabled(!errors.email && !errors.phone)
  contactsForm.setEmail(data.email)
  contactsForm.setPhone(data.phone)
})

events.on('contacts:submit', () => {
  const orderData: IOrderRequest = { ...buyer.getData(), items: cart.getProducts().map(product => product.id), total: cart.getTotalPrice(),}

  communication.createOrder(orderData)
    .then(result => {
      if (!result) return

      cart.clear()
      buyer.clearData()

      success.total = result.total
      modal.open(success.render())
    })
    .catch(error => {
      console.error('Ошибка оформления заказа:', error)
    })
})

events.on('success:close', () => {
  modal.close()
})