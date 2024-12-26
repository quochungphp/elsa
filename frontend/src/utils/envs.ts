export const getEnv = () => {
    return process.env.REACT_APP_ENVIRONMENT;
};

export const getServerUrl = (): string | undefined => {
    return process.env.REACT_APP_SERVER_URL || 'http://localhost:8585';
};

export const getWsUrl = () => {
    return process.env.REACT_APP_WS_URL_BASE || "ws://localhost:9001";
};