import React, { useState } from 'react';

export default function Payment(props: {paymentOpened: boolean,
  updateParent: Function}) {
  const [selected, setSelected] = useState(0);
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
        <div className="modal-background" onClick={() => props.updateParent(false)}>
        </div>
        <div className="modal resp-container">
          <h3>Buy messages:</h3>
          <div className="resp-row">
            <div className={classNames[0]} onClick={() => setSelected(0)}>
              <div>100 messages</div>
              <div><span className="price-title">$2</span></div>
            </div>
            <div className={classNames[1]} onClick={() => setSelected(1)}>
              <div>400 messages</div>
              <div>
                <span className="price-title">$5</span>
                <span className="text-danger">(38% off!)</span>
              </div>
            </div>
            <div className={classNames[2]} onClick={() => setSelected(2)}>
              <div>1000 messages</div>
              <div>
                <span className="price-title">$10</span>
                <span className="text-danger">(50% off!)</span>
              </div>
            </div>
          </div>
          <div className="button" onClick={() => props.updateParent(false)}>
            Credit/debit card
            </div>
          <div className="button" onClick={() => props.updateParent(false)}>
            Paypal
          </div>
        </div>
      </div>
    );
  }
  return null;
}
