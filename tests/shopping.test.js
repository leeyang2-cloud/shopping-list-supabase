import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShoppingListManager } from '../js/components/ShoppingList.js';

// localStorage 모킹
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn(key => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        })
    };
})();

global.localStorage = localStorageMock;

describe('ShoppingListManager 테스트', () => {
    let manager;

    beforeEach(() => {
        localStorage.clear();
        manager = new ShoppingListManager();
    });

    it('새로운 아이템을 추가할 수 있어야 함', () => {
        const text = '사과';
        const newItem = manager.addItem(text);
        
        expect(newItem.text).toBe(text);
        expect(newItem.completed).toBe(false);
        expect(manager.getItems().length).toBe(1);
    });

    it('아이템을 삭제할 수 있어야 함', () => {
        const item = manager.addItem('오렌지');
        manager.deleteItem(item.id);
        
        expect(manager.getItems().length).toBe(0);
    });

    it('아이템 완료 상태를 토글할 수 있어야 함', () => {
        const item = manager.addItem('포도');
        manager.toggleComplete(item.id);
        
        expect(manager.getItems()[0].completed).toBe(true);
        
        manager.toggleComplete(item.id);
        expect(manager.getItems()[0].completed).toBe(false);
    });

    it('빈 텍스트는 추가되지 않아야 함', () => {
        manager.addItem('   ');
        expect(manager.getItems().length).toBe(0);
    });
});
