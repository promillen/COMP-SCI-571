import React, { useState } from "react";

export default function BakedGood(props) {
  const [quantity, setQuantity] = useState(0);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(quantity - 1);
  };

  const bakedGoodStyles = {
    backgroundColor: props.featured ? "antiquewhite" : "white"
  };

  return (
    <div style={bakedGoodStyles} className="card">
      <h2>{props.name}</h2>
      <p>{props.description}</p>
      <p>$ {props.price}</p>
      <div>
        <button className="inline" onClick={decreaseQuantity} disabled={quantity <= 0}>-</button>
        <p className="inline">{quantity}</p>
        <button className="inline" onClick={increaseQuantity}>+</button>
      </div>
    </div>
  );
}