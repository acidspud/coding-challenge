import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux"
import ItemModal from "../components/itemModal";
import { fetchItemList, deleteItem } from "../actions/item";
import {Fade} from "react-swift-reveal";
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

  const handleEditItem = (item) => {
    if (item) {
      setItem({...item})
    } else {
      setItem({...defaultItem})
    }
    setModalIsOpen(true)
  }

  const sortItems = (a, b) => {
    const fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    const lowStockA = (a.threshold - a.qty),
      lowStockB = (b.threshold - b.qty)

    if (lowStockA >= lowStockB ){
      if (lowStockA === lowStockB) {
        if (fa < fb) return -1
        if (fa > fb) return 1
        return 0
      }
      return -1;
    }

    return 0;
  }

  const belowThreshold = (item) => (item.threshold - item.qty)

  return (
    <div className="screen home-container">
      <ItemModal
        item={ item }
        isOpen={ isModalOpen }
        setIsOpen={ setModalIsOpen }
      />
      <Fade top duration={500} delay={200}>
        <div className="add-item-button">
          <button onClick={() => handleEditItem(null)}>
            <FontAwesomeIcon icon={ faAdd } />
              <p>Add Item</p>
          </button>
        </div>
      </Fade>
      <Fade bottom cascade duration={500} delay={200}>
        <div className="item-list">
          { itemList
            .sort(sortItems)
            .map(item => (
            <div key={ item.id }
              className={ `item-item ${belowThreshold(item) >= 0 ? 'outofstock' : '' }`}>

                <p>{ item.name.charAt(0).toUpperCase() + item.name.slice(1) }</p>
                <p>{ belowThreshold(item) >= 0 ? `${belowThreshold(item)} Item/s Below Threshold of ${ item.threshold }` : ''}</p>
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
