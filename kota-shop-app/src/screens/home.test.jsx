import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { useSelector, useDispatch } from 'react-redux'
import Home, { sortItems } from '@/screens/home'

// Mock the useSelector and useDispatch hooks
vi.mock('react-redux', () => ({
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
}))

describe('Home', () => {
    // Mock the itemList data for useSelector
    const mockItemList = [
        { id: 1, name: 'Apple', qty: 5, threshold: 10, price: 1.0 },
        { id: 2, name: 'Banana', qty: 2, threshold: 5, price: 0.5 },
        { id: 3, name: 'Orange', qty: 8, threshold: 8, price: 0.75 },
        { id: 4, name: 'Grape', qty: 1, threshold: 1, price: 2.0 },
        { id: 5, name: 'Cherry', qty: 3, threshold: 5, price: 1.5 },
    ]

    beforeEach(() => {
        useSelector.mockReturnValue(mockItemList)
        useDispatch.mockReturnValue(vi.fn())
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('renders without crashing', () => {
        render(<Home />)
    })

    describe('sortItems', () => {
        it('should sort items by low stock ascending', () => {
            const items = [
                { name: 'Item C', qty: 5, threshold: 10 }, // lowStock = 5
                { name: 'Item A', qty: 2, threshold: 5 },  // lowStock = 3
                { name: 'Item B', qty: 8, threshold: 8 },  // lowStock = 0
            ]
            const sortedItems = [...items].sort(sortItems)
            expect(sortedItems).toEqual([
                { name: 'Item B', qty: 8, threshold: 8 },
                { name: 'Item A', qty: 2, threshold: 5 },
                { name: 'Item C', qty: 5, threshold: 10 },
            ])
        })

        it('should sort items by name alphabetically if low stock is equal', () => {
            const items = [
                { name: 'Banana', qty: 5, threshold: 10 }, // lowStock = 5
                { name: 'Apple', qty: 5, threshold: 10 },  // lowStock = 5
                { name: 'Cherry', qty: 5, threshold: 10 }, // lowStock = 5
            ]
            const sortedItems = [...items].sort(sortItems)
            expect(sortedItems).toEqual([
                { name: 'Apple', qty: 5, threshold: 10 },
                { name: 'Banana', qty: 5, threshold: 10 },
                { name: 'Cherry', qty: 5, threshold: 10 },
            ])
        })

        it('should handle mixed sorting criteria', () => {
            const items = [
                { name: 'Banana', qty: 2, threshold: 5 },  // lowStock = 3
                { name: 'Apple', qty: 5, threshold: 10 },  // lowStock = 5
                { name: 'Orange', qty: 8, threshold: 8 },  // lowStock = 0
                { name: 'Grape', qty: 1, threshold: 1 },   // lowStock = 0
                { name: 'Cherry', qty: 3, threshold: 5 },  // lowStock = 2
            ]
            const sortedItems = [...items].sort(sortItems)
            expect(sortedItems).toEqual([
                { name: 'Grape', qty: 1, threshold: 1 },
                { name: 'Orange', qty: 8, threshold: 8 },
                { name: 'Cherry', qty: 3, threshold: 5 },
                { name: 'Banana', qty: 2, threshold: 5 },
                { name: 'Apple', qty: 5, threshold: 10 },
            ])
        })

        it('should handle empty item list', () => {
            const items = []
            const sortedItems = [...items].sort(sortItems)
            expect(sortedItems).toEqual([])
        })

        it('should handle items with same low stock and same name', () => {
            const items = [
                { name: 'Apple', qty: 5, threshold: 10 },
                { name: 'Apple', qty: 5, threshold: 10 },
            ]
            const sortedItems = [...items].sort(sortItems)
            expect(sortedItems).toEqual([
                { name: 'Apple', qty: 5, threshold: 10 },
                { name: 'Apple', qty: 5, threshold: 10 },
            ])
        })
    })
})
