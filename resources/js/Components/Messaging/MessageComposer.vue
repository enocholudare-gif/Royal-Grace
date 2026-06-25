<script setup>
import { ref, onMounted, nextTick } from 'vue';

const emit = defineEmits(['send', 'typing']);
const content = ref('');
const textareaRef = ref(null);

const adjustHeight = () => {
    if (!textareaRef.value) return;
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`;
};

const handleInput = () => {
    adjustHeight();
    emit('typing');
};

const send = () => {
    const text = content.value.trim();
    if (!text) return;
    
    emit('send', text);
    content.value = '';
    
    nextTick(() => {
        if (textareaRef.value) {
            textareaRef.value.style.height = 'auto';
        }
    });
};

const handleKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
    }
};

onMounted(() => {
    adjustHeight();
});
</script>

<template>
    <div class="border-t border-border bg-surface p-4 sm:p-5">
        <div class="flex items-end gap-3 rounded-2xl border border-border bg-surface-subtle p-2 transition-colors focus-within:border-brand-300 focus-within:bg-surface focus-within:shadow-sm">
            <!-- Attachment Button -->
            <button type="button" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-muted transition hover:bg-black/5 hover:text-text dark:hover:bg-white/5" title="Attach file">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
            </button>

            <!-- Input -->
            <textarea
                ref="textareaRef"
                v-model="content"
                rows="1"
                class="max-h-[120px] min-h-[40px] w-full resize-none bg-transparent py-2.5 text-sm text-text placeholder:text-text-soft focus:outline-none focus:ring-0 border-none"
                placeholder="Type a message..."
                @input="handleInput"
                @keydown="handleKeydown"
            ></textarea>

            <!-- Send Button -->
            <button 
                type="button" 
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600"
                :disabled="!content.trim()"
                @click="send"
            >
                <svg class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            </button>
        </div>
    </div>
</template>
