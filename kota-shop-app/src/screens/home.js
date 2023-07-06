import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, fetchItemList, deleteItem } from "../actions/item";
import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons'

function Home() {
  const itemList = useSelector(state => state.itemList);
  const dispatch = useDispatch();
  const [item, setItem] = useState("");

  useEffect(
    () => {
      dispatch(fetchItemList());
    },
    [dispatch, itemList.length]
  );

  const newItem = () => {
    if (item !== "") {
      dispatch(addItem(item));
      setItem("");
    }
  };

  return (
    <div className="screen home-container">
      <Fade top>
        <div className="add-item">
          <textarea
            placeholder="Add something..."
            onChange={e => setItem(e.target.value)}
            value={item}
          />
          <button onClick={() => newItem(item)}>
            <FontAwesomeIcon icon={faPlusCircle} />
            <p>Add item</p>
          </button>
        </div>
      </Fade>
      <Fade bottom cascade>
        <div className="item-list">
          {itemList.map(item => (
            <div key={item.id} className="item-item">
              <div className="item-item-buttons">
                <button onClick={() => dispatch(deleteItem(item.id))}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </Fade>
    </div>
  );
}

export default Home;
