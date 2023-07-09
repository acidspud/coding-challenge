import React, { useEffect, useState,  useRef} from "react";
import { useDispatch } from "react-redux"
import propTypes from "prop-types";
import ReactModal from 'react-modal';
import { addItem, updateItem } from "../actions/item";
import Fade from "react-reveal/Fade";

const customStyles = {
  content: {
    position: 'absolute',
    width: '300px',
    height: '450px',
    top: '50%',
    left: '50%',
    right: '50%',
    transform: 'translate(-50%, -50%)',
    padding:'0px',
    border: 'none',
    borderRadius: '15px'
  },
};


function ItemModal(props) {
  const dispatch = useDispatch();
  const defaultItem = {
    name: '',
    qty: 1,
    threshold: 0,
    price: 0,
  }

  const setIsOpen = props.setIsOpen

  const [item, setItem] = useState(defaultItem);

  useEffect(() => {
    const formatPriceIn = (oldPrice) => {
      return oldPrice ? (oldPrice/100).toFixed(2) : 0
    }

    if (props.isOpen) {

      setItem({
        ...props.item,
        price: formatPriceIn(props.item.price)
      })
    }
  },[props.isOpen, props.item])


  const handleSetItem = ({key, value}) => {
    let updateValue = {}

    if (key) {
      updateValue[key] = value;
      setItem({
        ...item,
        ...updateValue
      });
    }
  }

  // Quick validation on name field
  const validateFields = (item) => {
    const { name } = item

    return (item && name && name.trim() !== '')
  }

  const handleAcceptButton = () => {
    if (validateFields(item)) {
      if (item.id) {
        dispatch(updateItem(item));
      } else {
        dispatch(addItem(item));
      }
      cancel()
      return
    }

    setItem({
      ...item,
      name: ''
    });

    nameRef.current.focus();
  }

  const cancel = () => {
    setItem(defaultItem);
    setIsOpen(false)
  }

  const nameRef = useRef();

  return (
    <Fade top>
      <ReactModal
        style={customStyles}
        isOpen={props.isOpen}
        contentLabel="Item"
        ariaHideApp={false}
      >
      <div className="add-item">
        <form className="simple-form">

            <label>
              <p>Item Name</p>
              <input
                id="name"
                type="text"
                ref={nameRef}
                placeholder="Item name here"
                onChange={e => handleSetItem({
                  key: e.target.id,
                  value: e.target.value})
                }
                onBlur={e => handleSetItem({
                  key: e.target.id,
                  value: e.target.value.trim()})
                }
                value={item.name}
                required
              />
            </label>
            <label>
              <p>Amount In Stock</p>
              <input
                id="qty"
                type="text"
                inputMode="numeric"
                pattern="^(\d{1,4})$"
                placeholder=""
                onChange={e => handleSetItem({
                  key: e.target.id,
                  value: e.target.validity.valid ? e.target.value : item.qty})
                }
                onBlur={e => handleSetItem({
                  key: e.target.id,
                  value: e.target.value === ''? 0 : parseFloat(e.target.value)})
                }
                value={item.qty}
              />
            </label>
            <label>
              <p>Threshold</p>
              <input
                id="threshold"
                type="text"
                inputMode="numeric"
                pattern="^(\d{1,4})$"
                onChange={e => handleSetItem({
                  key: e.target.id,
                  value: e.target.validity.valid ? e.target.value : item.threshold})
                }
                onBlur={e => handleSetItem({
                  key: e.target.id,
                  value: e.target.value === ''? 0 : parseFloat(e.target.value)})
                }
                value={item.threshold}
                />
            </label>
            <label>
              <p>Price</p>
              <input
                id="price"
                type="text"
                placeholder=""
                pattern="^([0-9]+(\.?[0-9]?[0-9]?)?)"
                onChange={e => handleSetItem({
                  key: e.target.id,
                  value: e.target.validity.valid ? e.target.value : item.price})
                }
                onBlur={e => handleSetItem({
                  key: e.target.id,
                  value: e.target.value === '' ? 0 : parseFloat(e.target.value)})
                }
                value={item.price}
              />
            </label>
        </form>
        <div className="item-buttons">
          <button onClick={() => handleAcceptButton(item)}>
            <p>Accept</p>
          </button>
          <button onClick={() => cancel()}>
            <p>Cancel</p>
          </button>
        </div>
      </div>
    </ReactModal>
  </Fade>
  );
}

export default ItemModal;

ItemModal.propTypes = {
  item: propTypes.shape({
    id: propTypes.number,
    name: propTypes.string,
    qty: propTypes.number,
    threshold: propTypes.number,
    price: propTypes.number,
  }),
  isOpen: propTypes.bool,
  setIsOpen: propTypes.func
}