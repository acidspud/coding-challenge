import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTimes } from '@fortawesome/free-solid-svg-icons'

const ListItem = ({ item, nodeRef, handleEditItem, handleDeleteItem }) => {
    const belowThreshold = (item) => {
        return item.threshold - item.qty
    }

    return (
        <div
            ref={nodeRef}
            className={`grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5 items-center p-5 rounded-lg shadow-md ${
                belowThreshold(item) >= 0 ? 'bg-warning text-secondary' : 'bg-success text-white'
            }`}
        >
            <div className="flex justify-between items-start md:col-span-1">
                <p className="text-lg font-semibold">
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </p>
                <div className="flex md:hidden gap-2">
                    <button
                        className="bg-transparent border-none text-white cursor-pointer hover:text-primary-light transition-colors duration-200"
                        onClick={() => handleEditItem(item)}
                    >
                        <FontAwesomeIcon size="lg" icon={faPenToSquare} />
                    </button>
                    <button
                        className="bg-transparent border-none text-white cursor-pointer hover:text-error transition-colors duration-200"
                        onClick={() => handleDeleteItem(item.id)}
                    >
                        <FontAwesomeIcon size="lg" icon={faTimes} />
                    </button>
                </div>
            </div>
            <div className="flex flex-wrap justify-between gap-x-4 md:col-span-3">
                <p className="text-base">
                    {belowThreshold(item) >= 0
                        ? `${belowThreshold(item)} Item/s Below Threshold of ${
                            item.threshold
                        }`
                        : 'In Stock'}
                </p>
                <p className="text-base">{`${item.qty} In Stock`}</p>
                <p className="text-base">{`R ${(item.price / 100).toFixed(2)}`}</p>
            </div>
            <div className="hidden md:flex justify-end gap-2 md:col-span-1">
                <button
                    className="bg-transparent border-none text-white cursor-pointer hover:text-primary-light transition-colors duration-200"
                    onClick={() => handleEditItem(item)}
                >
                    <FontAwesomeIcon size="2x" icon={faPenToSquare} />
                </button>
                <button
                    className="bg-transparent border-none text-white cursor-pointer hover:text-error transition-colors duration-200"
                    onClick={() => handleDeleteItem(item.id)}
                >
                    <FontAwesomeIcon size="2x" icon={faTimes} />
                </button>
            </div>
        </div>
    )
}

ListItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        qty: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        threshold: PropTypes.number.isRequired,
    }).isRequired,
    nodeRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]).isRequired,
    handleEditItem: PropTypes.func.isRequired,
    handleDeleteItem: PropTypes.func.isRequired,
}

export default ListItem
