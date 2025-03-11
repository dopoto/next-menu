export function obj2str(obj?: object): string {  
  return JSON.stringify(obj, null, 2);
}
