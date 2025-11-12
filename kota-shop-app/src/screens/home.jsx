import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ItemModal from '@/components/itemModal'
import ListItem from '@/components/listItem'
import { fetchItemList } from '@/actions/item'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { deleteItem } from '@/actions/item'

export const sortItems = (a, b) => {
    const lowStockA = a.threshold - a.qty
    const lowStockB = b.threshold - b.qty

    // Primary sort: by low stock (ascending)
    if (lowStockA !== lowStockB) {
        return lowStockA - lowStockB
    }

    // Secondary sort: by name alphabetically (ascending) if low stock is equal
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()

    if (nameA < nameB) return -1
    if (nameA > nameB) return 1

    return 0
}

export const search = (itemList, searchterm) => {
    if (!searchterm || searchterm.length === 0)
        return itemList

    return itemList.filter((item) => {
        return item.name.includes(searchterm)
    })
}


function Home() {
    const itemList = useSelector((state) => state.itemList)
    const dispatch = useDispatch()

    const [searchTerm, setSearchTerm] = useState('')

    const defaultItem = {
        name: '',
        qty: 1,
        threshold: 0,
        price: 0,
    }

    const [item, setItem] = useState(defaultItem)
    const [isModalOpen, setModalIsOpen] = useState(false)

    const itemRefs = useRef(new Map())

    const sortedFilteredItems = search(itemList,searchTerm).sort(sortItems)

    useEffect(() => {
        dispatch(fetchItemList())
    }, [dispatch])

    const handleEditItem = (item) => {
        if (item) {
            setItem({ ...item })
        } else {
            setItem({ ...defaultItem })
        }
        setModalIsOpen(true)
    }

    const handleDeleteItem = (id) => {
        if (id) {
            dispatch(deleteItem(id))
        }
    }

    const getOrCreateRef = useCallback((id) => {
        if (!itemRefs.current.has(id)) {
            itemRefs.current.set(id, React.createRef())
        }
        return itemRefs.current.get(id)
    }, [])

    return (
        <div className="mt-[70px] min-h-[calc(100vh-140px)] max-w-5xl mx-auto px-4 py-8 md:px-8 lg:px-16">
            <ItemModal item={item} isOpen={isModalOpen} setIsOpen={setModalIsOpen} />
            <div className="mb-6 flex justify-end gap-4">
                <input
                    className="block grow px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded bg-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    type="search"
                    onChange={(e) => setSearchTerm(e.target.value)} />
                <button
                    className="flex items-center gap-2 text-lg bg-primary text-white px-5 py-2 rounded-full shadow-md hover:bg-primary-light transition-colors duration-200"
                    onClick={() => handleEditItem(null)}
                >
                    <FontAwesomeIcon icon={faAdd} />
                    <span>Add New Item</span>
                </button>
            </div>
            <TransitionGroup className="grid gap-5 mt-2">
                {sortedFilteredItems.sort(sortItems).map((item) => {
                    const nodeRef = getOrCreateRef(item.id)
                    return (
                        <CSSTransition
                            key={item.id}
                            timeout={500}
                            classNames="item-transition"
                            nodeRef={nodeRef}
                        >
                            <ListItem
                                item={item}
                                nodeRef={nodeRef}
                                handleEditItem={handleEditItem}
                                handleDeleteItem={handleDeleteItem}
                            />
                        </CSSTransition>
                    )
                })}
            </TransitionGroup>
        </div>
    )
}

export default Home
