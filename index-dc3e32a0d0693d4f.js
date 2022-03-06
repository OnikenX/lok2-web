
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
function __wbg_adapter_28(arg0, arg1, arg2) {
    try {
        wasm._dyn_core__ops__function__FnMut___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h68d88957e58b1bbf(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function __wbg_adapter_31(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h787527e8317de1c6(arg0, arg1, addHeapObject(arg2));
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4);
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
/**
* Handler for `console.log` invocations.
*
* If a test is currently running it takes the `args` array and stringifies
* it and appends it to the current output of the test. Otherwise it passes
* the arguments to the original `console.log` function, psased as
* `original`.
* @param {Array<any>} args
*/
export function __wbgtest_console_log(args) {
    try {
        wasm.__wbgtest_console_log(addBorrowedObject(args));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
* Handler for `console.debug` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_debug(args) {
    try {
        wasm.__wbgtest_console_debug(addBorrowedObject(args));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
* Handler for `console.info` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_info(args) {
    try {
        wasm.__wbgtest_console_info(addBorrowedObject(args));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
* Handler for `console.warn` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_warn(args) {
    try {
        wasm.__wbgtest_console_warn(addBorrowedObject(args));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
* Handler for `console.error` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_error(args) {
    try {
        wasm.__wbgtest_console_error(addBorrowedObject(args));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function __wbg_adapter_44(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures__invoke0_mut__h19b7884c0b9a2f5d(arg0, arg1);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function __wbg_adapter_191(arg0, arg1, arg2, arg3, arg4) {
    wasm.wasm_bindgen__convert__closures__invoke3_mut__h00ca3d99b59a6e47(arg0, arg1, addHeapObject(arg2), arg3, addHeapObject(arg4));
}

function __wbg_adapter_208(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h53e2b0d26a3da722(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
* Runtime test harness support instantiated in JS.
*
* The node.js entry script instantiates a `Context` here which is used to
* drive test execution.
*/
export class WasmBindgenTestContext {

    static __wrap(ptr) {
        const obj = Object.create(WasmBindgenTestContext.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmbindgentestcontext_free(ptr);
    }
    /**
    * Creates a new context ready to run tests.
    *
    * A `Context` is the main structure through which test execution is
    * coordinated, and this will collect output and results for all executed
    * tests.
    */
    constructor() {
        var ret = wasm.wasmbindgentestcontext_new();
        return WasmBindgenTestContext.__wrap(ret);
    }
    /**
    * Inform this context about runtime arguments passed to the test
    * harness.
    *
    * Eventually this will be used to support flags, but for now it's just
    * used to support test filters.
    * @param {any[]} args
    */
    args(args) {
        var ptr0 = passArrayJsValueToWasm0(args, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.wasmbindgentestcontext_args(this.ptr, ptr0, len0);
    }
    /**
    * Executes a list of tests, returning a promise representing their
    * eventual completion.
    *
    * This is the main entry point for executing tests. All the tests passed
    * in are the JS `Function` object that was plucked off the
    * `WebAssembly.Instance` exports list.
    *
    * The promise returned resolves to either `true` if all tests passed or
    * `false` if at least one test failed.
    * @param {any[]} tests
    * @returns {Promise<any>}
    */
    run(tests) {
        var ptr0 = passArrayJsValueToWasm0(tests, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.wasmbindgentestcontext_run(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('index-dc3e32a0d0693d4f_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        var ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_log_60dbaec18ba13580 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_String_2d0525b0a2d8952b = function(arg0, arg1) {
        var ret = String(getObject(arg1));
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_getElementById_ee61fa45acb16cdd = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_settextcontent_53a1006422d713a1 = function(arg0, arg1, arg2) {
        getObject(arg0).textContent = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        var ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_wbgtestinvoke_58c0b584f460c90f = function() { return handleError(function (arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = () => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_44(a, state0.b, );
                } finally {
                    state0.a = a;
                }
            };
            __wbg_test_invoke(cb0);
        } finally {
            state0.a = state0.b = 0;
        }
    }, arguments) };
    imports.wbg.__wbg_self_9483edc55533b26c = function(arg0) {
        var ret = getObject(arg0).self;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        var ret = getObject(arg0) === getObject(arg1);
        return ret;
    };
    imports.wbg.__wbg_static_accessor_document_39679a3ba0227499 = function() {
        var ret = document;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_textcontent_1a07877650d85fba = function(arg0, arg1) {
        var ret = getObject(arg1).textContent;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_stack_30cc108d2806ec8e = function(arg0) {
        var ret = getObject(arg0).stack;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_f5294cdf5024f4e8 = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_getRandomValues_99bbe8a65f4aef87 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_randomFillSync_378e02b85af41ab6 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_process_5729605ce9d34ea8 = function(arg0) {
        var ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        var ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_versions_531e16e1a776ee97 = function(arg0) {
        var ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_18b58a160b60d170 = function(arg0) {
        var ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        var ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_static_accessor_NODE_MODULE_bdc5ca9096c68aeb = function() {
        var ret = module;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_require_edfaedd93e302925 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_crypto_2bc4d5b05161de5b = function(arg0) {
        var ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_msCrypto_d003eebe62c636a9 = function(arg0) {
        var ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_new_693216e109162396 = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbg_instanceof_Window_434ce1849eb4e0fc = function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__wbg_document_5edd43643d1060d9 = function(arg0) {
        var ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_body_7538539844356c1c = function(arg0) {
        var ret = getObject(arg0).body;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_head_7628a94275baa197 = function(arg0) {
        var ret = getObject(arg0).head;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_createElement_d017b8d2af99bab9 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_createElementNS_fd4a7e49f74039e1 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        var ret = getObject(arg0).createElementNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_createTextNode_39a0de25d14bcde5 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).createTextNode(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getElementById_b30e88aff96f66a1 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_getElementsByClassName_25f6fcd08ea5b08c = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getElementsByClassName(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getElementsByTagName_530c79f8c38f0ec3 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getElementsByTagName(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_querySelector_cc714d0aa0b868ed = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).querySelector(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_e1664a5b0f2f4e5f = function() { return handleError(function (arg0, arg1) {
        var ret = new MouseEvent(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlTextAreaElement_16f2c6ca1b8ccd65 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLTextAreaElement;
        return ret;
    };
    imports.wbg.__wbg_value_d3a30bc2c7caf357 = function(arg0, arg1) {
        var ret = getObject(arg1).value;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_setvalue_6a34bab301f38bf2 = function(arg0, arg1, arg2) {
        getObject(arg0).value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_instanceof_HtmlButtonElement_f55e1463a3587288 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLButtonElement;
        return ret;
    };
    imports.wbg.__wbg_settype_51cf717ae09f8fd6 = function(arg0, arg1, arg2) {
        getObject(arg0).type = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_instanceof_HtmlInputElement_8969541a2a0bded0 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLInputElement;
        return ret;
    };
    imports.wbg.__wbg_setchecked_f6ead3490df88a7f = function(arg0, arg1) {
        getObject(arg0).checked = arg1 !== 0;
    };
    imports.wbg.__wbg_files_8b6cfde5a191ea71 = function(arg0) {
        var ret = getObject(arg0).files;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_settype_4e5334adf65b1641 = function(arg0, arg1, arg2) {
        getObject(arg0).type = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_value_fc1c354d1a0e9714 = function(arg0, arg1) {
        var ret = getObject(arg1).value;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_setvalue_ce4a23f487065c07 = function(arg0, arg1, arg2) {
        getObject(arg0).value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_namespaceURI_e9a971e6c1ce68db = function(arg0, arg1) {
        var ret = getObject(arg1).namespaceURI;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_tagName_46df689351536098 = function(arg0, arg1) {
        var ret = getObject(arg1).tagName;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_id_79dca31d8297faf1 = function(arg0, arg1) {
        var ret = getObject(arg1).id;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_setid_73be37238eaa05be = function(arg0, arg1, arg2) {
        getObject(arg0).id = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setclassName_579da04a76182ffb = function(arg0, arg1, arg2) {
        getObject(arg0).className = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_firstElementChild_f626b9fe89401ac6 = function(arg0) {
        var ret = getObject(arg0).firstElementChild;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_getAttribute_25ddac571fec98e1 = function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg1).getAttribute(getStringFromWasm0(arg2, arg3));
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_removeAttribute_1adaecf6b4d35a09 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).removeAttribute(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_setAttribute_1776fcc9b98d464e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlElement_d3e8f1c1d6788b24 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLElement;
        return ret;
    };
    imports.wbg.__wbg_style_16f5dd9624687c8f = function(arg0) {
        var ret = getObject(arg0).style;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_offsetWidth_bc683e2f57ea2d6b = function(arg0) {
        var ret = getObject(arg0).offsetWidth;
        return ret;
    };
    imports.wbg.__wbg_preventDefault_fa00541ff125b78c = function(arg0) {
        getObject(arg0).preventDefault();
    };
    imports.wbg.__wbg_addEventListener_55682f77717d7665 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4));
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_9cd36e5806463d5d = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), arg4 !== 0);
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlSelectElement_e3dbe2a40aa03cfe = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLSelectElement;
        return ret;
    };
    imports.wbg.__wbg_new_e066c08cf24ff1e3 = function() { return handleError(function (arg0, arg1) {
        var ret = new FocusEvent(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_nodeName_af57dac2f0dea1c9 = function(arg0, arg1) {
        var ret = getObject(arg1).nodeName;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_parentElement_96e1e07348340043 = function(arg0) {
        var ret = getObject(arg0).parentElement;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_firstChild_de0c7cdd47485282 = function(arg0) {
        var ret = getObject(arg0).firstChild;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_lastChild_e2b014abab089e08 = function(arg0) {
        var ret = getObject(arg0).lastChild;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_setnodeValue_f175b74a390f8fda = function(arg0, arg1, arg2) {
        getObject(arg0).nodeValue = arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_textContent_dbe4d2d612abcd96 = function(arg0, arg1) {
        var ret = getObject(arg1).textContent;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_settextContent_07dfb193b5deabbc = function(arg0, arg1, arg2) {
        getObject(arg0).textContent = arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_appendChild_3fe5090c665d3bb4 = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).appendChild(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_insertBefore_4f09909023feac91 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).insertBefore(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_removeChild_f4a83c9698136bbb = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).removeChild(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_getPropertyValue_fd6ae3726bda9d7f = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        var ret = getObject(arg1).getPropertyValue(getStringFromWasm0(arg2, arg3));
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    }, arguments) };
    imports.wbg.__wbg_setProperty_ebb06e7fa941d6a8 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_getwithindex_5caaba1b5b3e6e18 = function(arg0, arg1) {
        var ret = getObject(arg0)[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_newnoargs_f579424187aa1717 = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_89558c3e96703ca1 = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_d3138911a89329b0 = function() {
        var ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_forEach_2d9db89598d5001a = function(arg0, arg1, arg2) {
        try {
            var state0 = {a: arg1, b: arg2};
            var cb0 = (arg0, arg1, arg2) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_191(a, state0.b, arg0, arg1, arg2);
                } finally {
                    state0.a = a;
                }
            };
            getObject(arg0).forEach(cb0);
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_message_1dfe93b595be8811 = function(arg0) {
        var ret = getObject(arg0).message;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_name_66305ab387468967 = function(arg0) {
        var ret = getObject(arg0).name;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_94697a95cb7e239c = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_is_3d73f4d91adacc37 = function(arg0, arg1) {
        var ret = Object.is(getObject(arg0), getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_new_4beacc9c71572250 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_208(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            var ret = new Promise(cb0);
            return addHeapObject(ret);
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_resolve_4f8f547f26b30b27 = function(arg0) {
        var ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_a6860c82b90816ca = function(arg0, arg1) {
        var ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_e23d74ae45fb17d1 = function() { return handleError(function () {
        var ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_b4be7f48b24ac56e = function() { return handleError(function () {
        var ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_d61b1f48a57191ae = function() { return handleError(function () {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_e7669da72fd7f239 = function() { return handleError(function () {
        var ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_buffer_5e74a88a1424a2e0 = function(arg0) {
        var ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_e3b800e570795b3c = function(arg0) {
        var ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_5b8081e9d002f0df = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_length_30803400a8f15c59 = function(arg0) {
        var ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_5f4ce114a24dfe1e = function(arg0) {
        var ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_a68f835ca2af506f = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_c42875065132a932 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        var ret = debugString(getObject(arg1));
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        var ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1443 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 498, __wbg_adapter_28);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1676 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 567, __wbg_adapter_31);
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    wasm.__wbindgen_start();
    return wasm;
}

export default init;

