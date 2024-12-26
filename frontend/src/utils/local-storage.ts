const ONE_MONTH = 2629746000; // Milliseconds

export const setLocalStorage = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
};
export const getLocalStorage = <T>(key: string): T | null => {
    return JSON.parse(localStorage.getItem(key) as any);
};

export const setLocalStorageTTL = (key: string, value: any, ttl = ONE_MONTH) => {
    const now = new Date();
    localStorage.setItem(
        key,
        JSON.stringify({
            value: value,
            expiry: now.getTime() + ttl,
        }),
    );
};

export const getLocalStorageTTL = (key: string) => {
    const value = localStorage.getItem(key);

    if (!value) {
        return null;
    }

    const item = JSON.parse(value);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }

    return item.value;
};
