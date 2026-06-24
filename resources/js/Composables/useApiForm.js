import axios from 'axios';
import { computed, reactive, ref } from 'vue';

function setNestedValue(target, path, value) {
    const segments = path.split('.');
    let current = target;

    segments.forEach((segment, index) => {
        if (index === segments.length - 1) {
            current[segment] = value;
            return;
        }

        if (!current[segment] || typeof current[segment] !== 'object') {
            current[segment] = {};
        }

        current = current[segment];
    });
}

export function useApiForm(initialState = {}) {
    const form = reactive(structuredClone(initialState));
    const errors = reactive({});
    const processing = ref(false);
    const message = ref('');
    const messageTone = ref('info');

    const clearErrors = () => {
        Object.keys(errors).forEach((key) => delete errors[key]);
    };

    const setMessage = (value, tone = 'info') => {
        message.value = value;
        messageTone.value = tone;
    };

    const setErrors = (payload = {}) => {
        clearErrors();
        Object.entries(payload).forEach(([key, value]) => {
            errors[key] = Array.isArray(value) ? value[0] : value;
        });
    };

    const submit = async (config) => {
        processing.value = true;
        clearErrors();
        message.value = '';

        try {
            const response = await axios({
                method: config.method ?? 'post',
                url: config.url,
                data: config.data ?? form,
                headers: config.headers ?? {},
            });

            if (config.onSuccess) {
                await config.onSuccess(response);
            }

            return response;
        } catch (error) {
            const response = error.response;

            if (response?.status === 422) {
                setErrors(response.data?.errors ?? {});
            }

            setMessage(
                response?.data?.message || error.message || 'Something went wrong. Please try again.',
                'danger',
            );

            if (config.onError) {
                await config.onError(error);
            }

            throw error;
        } finally {
            processing.value = false;
        }
    };

    const reset = () => {
        const next = structuredClone(initialState);

        Object.keys(form).forEach((key) => delete form[key]);
        Object.assign(form, next);
        clearErrors();
        message.value = '';
    };

    const errorFor = computed(() => (path) => errors[path] ?? '');

    return {
        form,
        errors,
        processing,
        message,
        messageTone,
        submit,
        reset,
        setMessage,
        clearErrors,
        setErrors,
        setNestedValue,
        errorFor,
    };
}
