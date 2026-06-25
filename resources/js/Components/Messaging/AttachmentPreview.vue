<script setup>
defineProps({
    attachment: { type: Object, required: true }
});

const isImage = (mime) => mime?.startsWith('image/');
const isPdf = (mime) => mime === 'application/pdf';

const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
</script>

<template>
    <div class="mt-2 overflow-hidden rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
        <a :href="attachment.file_url" target="_blank" class="block">
            <!-- Image Preview -->
            <img 
                v-if="isImage(attachment.mime_type)" 
                :src="attachment.file_url" 
                :alt="attachment.file_name"
                class="max-h-64 w-full object-cover transition-transform hover:scale-105" 
                loading="lazy"
            />
            
            <!-- Document/PDF Preview -->
            <div v-else class="flex items-center gap-3 p-3 transition hover:bg-black/5 dark:hover:bg-white/5">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/10 dark:bg-white/10">
                    <!-- PDF Icon -->
                    <svg v-if="isPdf(attachment.mime_type)" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <!-- Generic Document Icon -->
                    <svg v-else class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium">{{ attachment.file_name }}</p>
                    <p class="text-xs opacity-70">{{ formatSize(attachment.file_size) }} • {{ attachment.mime_type.split('/')[1]?.toUpperCase() || 'FILE' }}</p>
                </div>
            </div>
        </a>
    </div>
</template>
