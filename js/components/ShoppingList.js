import { supabase } from '../supabaseClient.js';

/**
 * 쇼핑 리스트 데이터 및 로직 관리 모듈 (Supabase 연동)
 */
export class ShoppingListManager {
    constructor() {
        this.items = [];
    }

    /**
     * Supabase에서 아이템 목록 불러오기
     */
    async loadItems() {
        try {
            const { data, error } = await supabase
                .from('shopping_items')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            this.items = data || [];
            return this.items;
        } catch (error) {
            console.error('데이터 로드 중 오류 발생:', error);
            alert('데이터를 불러오는데 실패했습니다.');
            return [];
        }
    }

    /**
     * 새로운 아이템 추가
     * @param {string} text - 추가할 아이템 텍스트
     */
    async addItem(text) {
        if (!text.trim()) return null;

        const newItem = {
            text: text.trim(),
            completed: false
        };

        try {
            const { data, error } = await supabase
                .from('shopping_items')
                .insert([newItem])
                .select()
                .single();

            if (error) throw error;
            this.items.push(data);
            return data;
        } catch (error) {
            console.error('아이템 추가 중 오류 발생:', error);
            alert('아이템 추가에 실패했습니다.');
            return null;
        }
    }

    /**
     * 아이템 삭제
     * @param {number|string} id - 삭제할 아이템의 ID
     */
    async deleteItem(id) {
        try {
            const { error } = await supabase
                .from('shopping_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            this.items = this.items.filter(item => item.id !== id);
        } catch (error) {
            console.error('아이템 삭제 중 오류 발생:', error);
            alert('아이템 삭제에 실패했습니다.');
        }
    }

    /**
     * 완료 상태 토글
     * @param {number|string} id - 상태를 변경할 아이템의 ID
     */
    async toggleComplete(id) {
        const item = this.items.find(item => item.id === id);
        if (!item) return;

        try {
            const { error } = await supabase
                .from('shopping_items')
                .update({ completed: !item.completed })
                .eq('id', id);

            if (error) throw error;
            item.completed = !item.completed;
        } catch (error) {
            console.error('상태 변경 중 오류 발생:', error);
            alert('상태 변경에 실패했습니다.');
        }
    }

    /**
     * 모든 아이템 반환
     */
    getItems() {
        return this.items;
    }
}
