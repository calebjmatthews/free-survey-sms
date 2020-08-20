import React, { useState, useEffect } from 'react';

const products = [
  { index: 0, price: 2, caption: '100 messages', sale: null },
  { index: 1, price: 5, caption: '400 messages', sale: '(38% off!)' },
  { index: 2, price: 10, caption: '1000 messages', sale: '(50% off!)' }
]

export default function Payment(props: {paymentOpened: boolean,
  updateParent: Function}) {
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState('init');

  useEffect(() => {
    if (status != 'init') {
      return;
    }
    else if (props.paymentOpened) {
      setStatus('loaded');
      // @ts-ignore
      paypal.Buttons({
        createOrder: function(data, actions) {
          // This function sets up the details of the transaction, including the amount and line item details.
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: (products[selected].price + '.00')
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          // This function captures the funds from the transaction.
          return actions.order.capture().then(function(details) {
            // This function shows a transaction success message to your buyer.
            alert('Transaction completed by ' + details.payer.name.given_name);
          });
        }
      }).render('#paypal-button-container');
    }
  })

  function closeModal() {
    props.updateParent(false);
    setStatus('init');
  }

  let classNames = [];
  for (let index = 0; index < 3; index++) {
    if (index == selected) {
      classNames[index] = ('resp-row-child resp-container price-container selected');
    }
    else {
      classNames[index] = ('resp-row-child resp-container price-container');
    }
  }
  if (props.paymentOpened) {
    return (
      <div className="modal-container">
        <div className="modal-background" onClick={closeModal}>
        </div>
        <div className="modal resp-container">
          <h3>Buy messages:</h3>
          <div className="resp-row">
            {products.map((product, index) => {
              return renderProduct(index);
            })}
          </div>
          <div className="paypal-button-wrapper">
            <div id="paypal-button-container"></div>
          </div>
        </div>
      </div>
    );
  }
  return null;

  function renderProduct(index: number) {
    return (
      <div key={index} className={classNames[index]} onClick={() => setSelected(index)}>
        <div>{products[index].caption}</div>
        <div>
          <span className="price-title">${products[index].price}</span>
          {renderSale(products[index].sale)}
        </div>
      </div>
    );
  }

  function renderSale(saleText: string) {
    if (saleText) {
      return <span className="text-danger">{saleText}</span>;
    }
    return null;
  }
}
