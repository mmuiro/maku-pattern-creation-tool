const createDebouncedFunction = (f: Function, delay = 500) => {
    let timeout: NodeJS.Timeout;
    const debouncedF = (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => f(...args), delay);
    };
    return debouncedF;
};

export { createDebouncedFunction };
