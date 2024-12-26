export const saveState = (state: any) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('appState', serializedState);
    } catch (err) {
        console.error('Error when save state:', err);
    }
};

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('appState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error when loading state:', err);
        return undefined;
    }
};
