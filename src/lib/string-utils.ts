export function obj2str(obj?: object): string {
    return JSON.stringify(obj, null, 2);
}

export function lg(obj?: object) {
    console.log(obj2str(obj));
}
