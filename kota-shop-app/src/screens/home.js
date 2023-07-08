import React, { useEffect, useState,  useRef} from "react";
import { useDispatch, useSelector } from "react-redux"
import ReactModal from 'react-modal';
import { addItem, fetchItemList, deleteItem } from "../actions/item";
import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons'

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
    'border-radius': '15px'
  },
};

function Home() {
  const itemList = useSelector(state => state.itemList);
  const dispatch = useDispatch();
  const defaultItem = {
    name: '',
    qty: 1,
    threshold: 0,
    price: 0,
  }

  const [item, setItem] = useState({...defaultItem});
  const [isOpen, setIsOpen] = useState(false);


  useEffect(
    () => {
      dispatch(fetchItemList());
    },
    [dispatch, itemList.length]
  );

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

  const nameRef = useRef();

  const newItem = () => {
    const { name } = item

    // Quick validation on name field
    if (item && name && name.trim() !== '') {
      dispatch(addItem(item));
      setItem(defaultItem);
      setIsOpen(false)
    }

    setItem({
      ...item,
      name: ''
    });
    nameRef.current.focus();
  };

  return (
    <div className="screen home-container">
      <ReactModal
        style={customStyles}
        isOpen={isOpen}
        contentLabel="Example Modal"
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
          <button onClick={() => newItem(item)}>
            <p>Accept</p>
          </button>
          <button onClick={() => setIsOpen(false)}>
            <p>Cancel</p>
          </button>
        </div>
      </div>
  </ReactModal>
      <Fade top>
        <div className="add-item-button">
          <button onClick={() => setIsOpen(true)}>
            <FontAwesomeIcon icon={faAdd} />
              <p>Add Item</p>
          </button>
        </div>
      </Fade>
      <Fade bottom cascade>
        <div className="item-list">
          {itemList.map(item => (
            <div key={item.id} className="item-item">
              <p>{item.name}</p>
              <p>{item.qty} In Stock</p>
              <p>R {(item.price/100).toFixed(2)}</p>
              <div className="item-item-buttons">
                <button onClick={() => dispatch(deleteItem(item.id))}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </Fade>
    </div>
  );
}

export default Home;
