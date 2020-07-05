export declare type FuncEmptyVoid = () => void;
export declare type FuncEmptyReturn = () => any;
export declare type FuncArgVoid = (...args: any[]) => void;
export declare type FuncArgReturn = (...args: any[]) => any;

export declare type FuncCallback = FuncEmptyVoid | FuncEmptyReturn | FuncArgVoid | FuncArgReturn;
