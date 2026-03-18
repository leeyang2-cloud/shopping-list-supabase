import { ShoppingListManager } from './components/ShoppingList.js';

/**
 * 앱 초기화 및 이벤트 리스너 설정
 */
document.addEventListener('DOMContentLoaded', async () => {
    const manager = new ShoppingListManager();
    const itemInput = document.getElementById('itemInput');
    const addButton = document.getElementById('addButton');
    const shoppingList = document.getElementById('shoppingList');
    const emptyMessage = document.getElementById('emptyMessage');

    // 초기 데이터 로드
    await manager.loadItems();

    /**
     * 리스트를 다시 렌더링
     */
    const render = () => {
        const items = manager.getItems();
        
        // 초기화
        shoppingList.innerHTML = '';
        
        // 빈 메시지 토글
        if (items.length === 0) {
            emptyMessage.classList.remove('hidden');
        } else {
            emptyMessage.classList.add('hidden');
        }

        // 아이템 렌더링
        items.forEach(item => {
            const li = createListItem(item);
            shoppingList.appendChild(li);
        });
    };

    /**
     * 리스트 아이템 엘리먼트 생성
     */
    const createListItem = (item) => {
        const li = document.createElement('li');
        li.className = `flex items-center justify-between p-3 border rounded-lg transition-all item-enter ${item.completed ? 'bg-gray-50 item-completed' : 'bg-white'}`;
        li.dataset.id = item.id;

        li.innerHTML = `
            <div class="flex items-center gap-3">
                <input type="checkbox" ${item.completed ? 'checked' : ''} 
                       class="w-5 h-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 toggle-checkbox">
                <span class="item-text font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}">${item.text}</span>
            </div>
            <button class="text-red-400 hover:text-red-600 delete-btn p-1 transition-colors" title="삭제">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        `;

        // 체크박스 이벤트 (완료 토글)
        const checkbox = li.querySelector('.toggle-checkbox');
        checkbox.addEventListener('change', async () => {
            checkbox.disabled = true;
            await manager.toggleComplete(item.id);
            render();
        });

        // 삭제 버튼 이벤트
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            if (confirm('이 항목을 삭제하시겠습니까?')) {
                deleteBtn.disabled = true;
                await manager.deleteItem(item.id);
                render();
            }
        });

        return li;
    };

    /**
     * 새로운 아이템 추가 핸들러
     */
    const handleAdd = async () => {
        const text = itemInput.value.trim();
        if (text) {
            addButton.disabled = true;
            await manager.addItem(text);
            itemInput.value = '';
            itemInput.focus();
            addButton.disabled = false;
            render();
        } else {
            alert('살 물건을 입력해 주세요!');
        }
    };

    // 이벤트 리스너 등록
    addButton.addEventListener('click', handleAdd);
    itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAdd();
    });

    // 초기 렌더링
    render();
});
