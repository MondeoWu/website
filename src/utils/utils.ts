import { message } from 'antd';
import { KV } from 'module-reaction'

const LOCAL_STORAGE_ACCESS = 'canvas-recruit-ls';
export const API_CODE_SUCCESS = 200

// allow key contans '.' to specific deeper structure
export function getValueOfKV(key: string, obj: KV) {
    if (key.includes('.')) {
        const keyChains = key.split('.').map(_ => _.trim())
        let res = obj, k;
        while (keyChains.length) {
            k = keyChains.shift()
            if (res[k!]) {
                res = res[k!]
            }
        }

        return res === obj ? undefined : res
    } else {
        return obj[key]
    }
}

export function setValueOfKV(key: string, v: any, obj: KV) {
    if (key.includes('.')) {
        const keyChains = key.split('.').map(_ => _.trim())
        let res = obj, k;
        while (keyChains.length) {
            k = keyChains.shift()
            if (keyChains.length) {
                res[k!] = res[k!] || {}
                res = res[k!]
            } else {
                res[k!] = v
            }
        }
    } else {
        obj[key] = v
    }
}
export function localStorageGet(key: string) {
    const str = localStorage.getItem(LOCAL_STORAGE_ACCESS)
    if (str) {
        const store = JSON.parse(str)
        return getValueOfKV(key, store)
    }
    return null
}
export function localStorageSet(key: string, v: any) {
    const str = localStorage.getItem(LOCAL_STORAGE_ACCESS)
    const store = str ? JSON.parse(str) : {}
    setValueOfKV(key, v, store)
    localStorage.setItem(LOCAL_STORAGE_ACCESS, JSON.stringify(store))
}

function getType(obj: any) {
    var type = Object.prototype.toString.call(obj)!.match(/^\[object (.*)\]$/)![1].toLowerCase();
    if (obj === null)
        return 'null'; // PhantomJS has type "DOMWindow" for null
    if (obj === undefined)
        return 'undefined'; // PhantomJS has type "DOMWindow" for undefined
    return type;
}

export function deepClone(val: any): any {
    var type = getType(val);
    switch (type) {
        case 'array':
            return (val as any[]).map(_ => deepClone(_));
        case 'map':
            return new Map(val);
        case 'set':
            return new Set(val);
        case 'object':
            var res: KV = {};
            for (var k in val) {
                res[k] = deepClone(val[k]);
            }
            return res;
        default:
            return val;
    }
}
export function maxCommonDivisor(m: number, n: number) {
    var u = +m, v = +n, t = v;
    while (v !== 0) {
        t = u % v;
        u = v;
        v = t;
    }
    return u
}

const LOCAL_TOKEN_KEY = 'cvsTkn'
const RES_TOKEN_KEY = 'jwt_token'
let memToken: string
function setToken(token: string) {
    localStorageSet(LOCAL_TOKEN_KEY, token)
    memToken = token
}

function getToken(): string {
    return memToken || localStorageGet(LOCAL_TOKEN_KEY) || ''
}

export class Net {
    private static async get(url: string, query?: { [k: string]: any }) {
        return await this.toFetch(this.encodeQuery(url, query), {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        })
    }

    private static async post(url: string, data: any, type: 'post' | 'put' | 'form' | 'multipart' = 'post') {
        let body: string | FormData;
        const headers: KV = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }

        if (type === 'form' || type === 'multipart') {
            body = new FormData();
            for (const k in data) {
                body.append(k, data[k]);
            }
            // Content-Type will add by browser automaticly
        } else {
            body = JSON.stringify(data)
            headers['Content-Type'] = 'application/json'
        }

        return await this.toFetch(url, {
            method: 'POST',
            mode: 'cors',
            headers,
            body
        })
    }

    private static async toFetch(url: string, req: RequestInit) {
        try {
            const res = await fetch(url, req);
            const data = await res.json()
            // if error, data.status will be >=400, if success, data has no 'status'
            if (data.status && data.status >= 400 && data.message) {
                if (data.status === 401) {
                    window.location.pathname = '/sign-in'
                }
                message.error(data.message);
            }
            // record token here
            if (data[RES_TOKEN_KEY]) {
                setToken(data[RES_TOKEN_KEY])
            }
            return data;
        } catch (error) {
            message.error(error.message)
            return { error: error.message }
        }
    }

    /**
     * 
     * @param path router path
     * @param params datas of KV 
     * @param usePost post type, 'no' means use 'get' method, 'json' means use post by json format, 'form' means use post by form format
     */
    public static async req(path: string, params: KV = {}, method: 'get' | 'put' | 'post' | 'form' | 'multipart' = 'get') {
        const url = `${process.env.REACT_APP_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
        const res = method !== 'get' ? (await this.post(url, params, method)) : (await this.get(url, params));
        return res;
    }

    // call this when logout
    public static clearToken() {
        setToken('')
    }

    private static encodeQuery(url: string, query?: { [k: string]: any }): string {
        const preUrl = url;
        if (!query) {
            return preUrl;
        }

        let queryStr = '';
        const queryArr = [];
        for (const k in query) {
            const v = Array.isArray(query[k]) ? JSON.stringify(query[k]) : query[k];
            queryArr.push(`${k}=${encodeURIComponent(v)}`);
        }

        queryStr = queryArr.join('&');
        if (!preUrl.endsWith('?')) {
            queryStr = '?' + queryStr;
        }
        return preUrl + queryStr;

    }

}

interface IEvtNode {
    cb: (data?: any) => void;
    ctx?: any;
}
export class Events {
    private static _map = new Map<string, IEvtNode[]>();
    public static send(event: string, data?: any) {
        const nodes = this._map.get(event);
        if (nodes && nodes.length) {
            nodes.forEach(nd => {
                nd.ctx ? nd.cb.call(nd.ctx, data) : nd.cb(data);
            });
        }
    }

    public static on(event: string, cb: (data?: any) => void, ctx?: any) {
        let nodes = this._map.get(event);
        if (!nodes) {
            nodes = [];
            this._map.set(event, nodes);
        }
        if (nodes.find(nd => nd.cb === cb && nd.ctx === ctx)) {
            console.error('already has a same cb which listened to the event:' + event);
            return;
        }
        nodes.push({
            cb,
            ctx
        });
    }
    public static off(event: string, cb: (data?: any) => void, ctx?: any) {
        const nodes = this._map.get(event);
        if (nodes && nodes.length) {
            const idx = nodes.findIndex(nd => nd.cb === cb && nd.ctx === ctx);
            if (idx > -1) {
                nodes.splice(idx, 1);
            }
        }
    }
}

let flPicker: {
    ele?: HTMLInputElement
    cb?: (file: any, thumb?: string) => void
} = {
    ele: undefined,
    cb: undefined
};

export function upload_file(ext: string) {
    return new Promise((resolve, reject) => {
        if (!flPicker.ele) {
            flPicker.ele = document.createElement('input');
            flPicker.ele.type = 'file';
            flPicker.ele.accept = ext.startsWith('.') ? ext : `.${ext}`
        }
        flPicker.ele.dispatchEvent(new MouseEvent('click'))
        flPicker.ele.addEventListener('change', _onFileChosen);
        flPicker.cb = resolve

        flPicker.ele.addEventListener('cancel', _ => reject('canceled'))
    })
}
function _onFileChosen(e: any) {
    e.preventDefault();
    const file = e.target.files[0];
    const thumb = URL.createObjectURL(file) // valiable for images

    flPicker.ele!.value = '';

    flPicker.cb!(file, thumb)
}
