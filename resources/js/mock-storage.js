try {
    const _ = window.localStorage;
} catch (e) {
    const mockStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0,
    };
    Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        configurable: true,
        enumerable: true,
        writable: true
    });
    Object.defineProperty(window, 'sessionStorage', {
        value: mockStorage,
        configurable: true,
        enumerable: true,
        writable: true
    });
}
