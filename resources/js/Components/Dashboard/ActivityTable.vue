<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
    columns: {
        type: Array,
        default: () => [],
    },
    rows: {
        type: Array,
        default: () => [],
    },
});
</script>

<template>
    <div class="table-wrap">
        <div class="card-header">
            <div>
                <p class="card-title">{{ title }}</p>
                <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
            </div>
        </div>

        <table class="table-standard">
            <thead>
                <tr>
                    <th v-for="column in columns" :key="column.key">
                        {{ column.label }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, index) in rows" :key="row.id || index">
                    <td v-for="column in columns" :key="column.key">
                        <slot :name="column.key" :row="row">
                            {{ row[column.key] }}
                        </slot>
                    </td>
                </tr>

                <tr v-if="rows.length === 0">
                    <td :colspan="columns.length" class="table-empty">
                        No records found.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
