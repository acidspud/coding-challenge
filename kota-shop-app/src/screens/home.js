import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux"
import ItemModal from "../components/itemModal";
import { fetchItemList, deleteItem } from "../actions/item";
import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faPenToSquare, faTimes  } from '@fortawesome/free-solid-svg-icons'

function Home() {
  const itemList = useSelector(state => state.itemList);
  const dispatch = useDispatch();
  const defaultItem = {
    name: '',
    qty: 1,
    threshold: 0,
    price: 0,
  }

  const [item, setItem] = useState(defaultItem);
  const [isModalOpen, setModalIsOpen] = useState(false);

  useEffect(
    () => {
      dispatch(fetchItemList());
    },
    [dispatch, itemList.length]
  );

  const handleAddItem = () => {

  }

  const handleEditItem = (item) => {
    if (item) {
      setItem({...item})
    } else {
      setItem({...defaultItem})

    }
    setModalIsOpen(true)
  }

  return (
    <div className="screen home-container">
      <ItemModal
        item={ item }
        isOpen={ isModalOpen }
        setIsOpen={ setModalIsOpen }
      />
      <Fade top>
        <div className="add-item-button">
          <button onClick={() => handleEditItem()}>
            <FontAwesomeIcon icon={ faAdd } />
              <p>Add Item</p>
          </button>
        </div>
      </Fade>
      <Fade bottom cascade>
        <div className="item-list">
          { itemList.map(item => (
            <div key={ item.id } className="item-item">
              <p>{ item.name.charAt(0).toUpperCase() + item.name.slice(1) }</p>
              <p>{ item.qty } In Stock</p>
              <p>R { (item.price/100).toFixed(2) }</p>
              <div className="item-item-buttons">
              <button onClick={ () => handleEditItem(item) }>
                  <FontAwesomeIcon size="2x" icon={ faPenToSquare } />
                </button>
                <button onClick={() => dispatch(deleteItem(item.id))}>
                  <FontAwesomeIcon size="2x" icon={ faTimes } />
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
