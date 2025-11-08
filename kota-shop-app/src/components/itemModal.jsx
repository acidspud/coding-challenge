import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import propTypes from 'prop-types'
import ReactModal from 'react-modal'
import { addItem, updateItem } from '@/actions/item'

function ItemModal(props) {
    const dispatch = useDispatch()
    const defaultItem = {
        name: '',
        qty: 1,
        threshold: 0,
        price: 0,
    }

    const { setIsOpen } = props

    const [item, setItem] = useState(defaultItem)
    const [displayPrice, setDisplayPrice] = useState('0.00')

    useEffect(() => {
        const formatPriceIn = (oldPrice) => {
            return oldPrice ? (oldPrice / 100).toFixed(2) : '0.00'
        }

        if (props.isOpen) {
            const initialPrice = formatPriceIn(props.item.price)
            setItem({
                ...props.item,
                price: initialPrice,
            })
            setDisplayPrice(initialPrice)
        }
    }, [props.isOpen, props.item])

    const handleSetItem = ({ key, value }) => {
        if (key && key !== 'price') {
            setItem((prevItem) => ({
                ...prevItem,
                [key]: value,
            }))
        }
    }

    // Quick validation on the name field
    const validateFields = (item) => {
        const { name } = item

        return item && name && name.trim() !== ''
    }

    const handleAcceptButton = () => {
        if (validateFields(item)) {
            if (item.id) {
                dispatch(updateItem(item))
            } else {
                dispatch(addItem(item))
            }
            handleCancelButton()
            return
        }

        setItem({
            ...item,
            name: '',
        })

        nameRef.current.focus()
    }

    const handleCancelButton = () => {
        setIsOpen(false)
    }

    const nameRef = useRef()

    return (
        <ReactModal
            isOpen={props.isOpen}
            contentLabel="Item"
            ariaHideApp={false}
            closeTimeoutMS={500}
            overlayClassName={{
                base: 'fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:70%] flex justify-center items-center transition-opacity duration-500 ease-in-out opacity-0',
                afterOpen: 'modal-overlay-after-open',
                beforeClose: 'modal-overlay-before-close',
            }}
            className={{
                base: 'relative w-11/12 max-w-md h-auto max-h-[90vh] p-0 border-none rounded-xl overflow-y-auto outline-none transition-all duration-500 ease-in-out opacity-0 scale-95',
                afterOpen: 'modal-content-after-open',
                beforeClose: 'modal-content-before-close',
            }}
        >
            <div className="flex flex-col justify-center items-center bg-surface text-text-primary border-none rounded-lg shadow-lg p-4 sm:p-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                    {item.id ? 'Edit Item' : 'Add New Item'}
                </h2>
                <form className="w-full p-4">
                    <label className="block mb-4">
                        <p className="text-sm mb-1 text-secondary">Item Name</p>
                        <input
                            className="block w-full p-2 sm:p-3 text-sm sm:text-base font-semibold text-text-primary bg-white border border-border transition-all focus:border-primary-light focus:ring-2 focus:ring-primary-light rounded"
                            id="name"
                            type="text"
                            ref={nameRef}
                            placeholder="Item name here"
                            onChange={(e) =>
                                handleSetItem({
                                    key: e.target.id,
                                    value: e.target.value,
                                })
                            }
                            onBlur={(e) =>
                                handleSetItem({
                                    key: e.target.id,
                                    value: e.target.value.trim(),
                                })
                            }
                            value={item.name}
                            required
                        />
                    </label>
                    <label className="block mb-4">
                        <p className="text-sm mb-1 text-secondary">Amount In Stock</p>
                        <input
                            className="block w-full p-2 sm:p-3 text-sm sm:text-base font-semibold text-text-primary bg-white border border-border transition-all focus:border-primary-light focus:ring-2 focus:ring-primary-light rounded"
                            id="qty"
                            type="text"
                            inputMode="numeric"
                            pattern="^(\d{1,4})$"
                            placeholder="0"
                            onChange={(e) =>
                                handleSetItem({
                                    key: e.target.id,
                                    value: e.target.validity.valid ? e.target.value : item.qty,
                                })
                            }
                            onBlur={(e) =>
                                handleSetItem({
                                    key: e.target.id,
                                    value: e.target.value === '' ? 0 : parseFloat(e.target.value),
                                })
                            }
                            value={item.qty}
                        />
                    </label>
                    <label className="block mb-4">
                        <p className="text-sm mb-1 text-secondary">Threshold</p>
                        <input
                            className="block w-full p-2 sm:p-3 text-sm sm:text-base font-semibold text-text-primary bg-white border border-border transition-all focus:border-primary-light focus:ring-2 focus:ring-primary-light rounded"
                            id="threshold"
                            type="text"
                            inputMode="numeric"
                            pattern="^(\d{1,4})$"
                            placeholder="0"
                            onChange={(e) =>
                                handleSetItem({
                                    key: e.target.id,
                                    value: e.target.validity.valid
                                        ? e.target.value
                                        : item.threshold,
                                })
                            }
                            onBlur={(e) =>
                                handleSetItem({
                                    key: e.target.id,
                                    value: e.target.value === '' ? 0 : parseFloat(e.target.value),
                                })
                            }
                            value={item.threshold}
                        />
                    </label>
                    <label className="block mb-4">
                        <p className="text-sm mb-1 text-secondary">Price</p>
                        <input
                            className="block w-full p-2 sm:p-3 text-sm sm:text-base font-semibold text-text-primary bg-white border border-border transition-all focus:border-primary-light focus:ring-2 focus:ring-primary-light rounded"
                            id="price"
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            onChange={(e) => {
                                const value = e.target.value
                                if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                                    setDisplayPrice(value)
                                }
                            }}
                            onBlur={(e) => {
                                let value = e.target.value.trim()
                                let parsedPrice = parseFloat(value)

                                if (isNaN(parsedPrice) || value === '') {
                                    parsedPrice = 0
                                }

                                // Ensure two decimal places for display
                                const formattedDisplayPrice = parsedPrice.toFixed(2)
                                setDisplayPrice(formattedDisplayPrice)

                                setItem((prevItem) => ({
                                    ...prevItem,
                                    price: parsedPrice,
                                }))
                            }}
                            value={displayPrice}
                        />
                    </label>
                </form>
                <div className="grid grid-cols-2 gap-4 mt-4 w-full p-4">
                    <button
                        className="rounded-md p-3 sm:p-4 flex justify-center items-center bg-primary text-white cursor-pointer hover:bg-primary-light transition-colors duration-200 text-base sm:text-lg shadow-md"
                        onClick={() => handleAcceptButton(item)}
                    >
                        <span>Accept</span>
                    </button>
                    <button
                        className="rounded-md p-3 sm:p-4 flex justify-center items-center bg-secondary text-white cursor-pointer hover:bg-text-secondary transition-colors duration-200 text-base sm:text-lg shadow-md"
                        onClick={() => handleCancelButton()}
                    >
                        <span>Cancel</span>
                    </button>
                </div>
            </div>
        </ReactModal>
    )
}

export default ItemModal

ItemModal.propTypes = {
    item: propTypes.shape({
        id: propTypes.number,
        name: propTypes.string,
        qty: propTypes.number,
        threshold: propTypes.number,
        price: propTypes.number,
    }),
    isOpen: propTypes.bool,
    setIsOpen: propTypes.func,
}
