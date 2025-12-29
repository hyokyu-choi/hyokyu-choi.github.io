let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => state.dtor(state.a, state.b));

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
    if (builtInMatches && builtInMatches.length > 1) {
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

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayI16FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len);
}

function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayI8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getArrayU16FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len);
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

let cachedInt16ArrayMemory0 = null;
function getInt16ArrayMemory0() {
    if (cachedInt16ArrayMemory0 === null || cachedInt16ArrayMemory0.byteLength === 0) {
        cachedInt16ArrayMemory0 = new Int16Array(wasm.memory.buffer);
    }
    return cachedInt16ArrayMemory0;
}

let cachedInt32ArrayMemory0 = null;
function getInt32ArrayMemory0() {
    if (cachedInt32ArrayMemory0 === null || cachedInt32ArrayMemory0.byteLength === 0) {
        cachedInt32ArrayMemory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32ArrayMemory0;
}

let cachedInt8ArrayMemory0 = null;
function getInt8ArrayMemory0() {
    if (cachedInt8ArrayMemory0 === null || cachedInt8ArrayMemory0.byteLength === 0) {
        cachedInt8ArrayMemory0 = new Int8Array(wasm.memory.buffer);
    }
    return cachedInt8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint16ArrayMemory0 = null;
function getUint16ArrayMemory0() {
    if (cachedUint16ArrayMemory0 === null || cachedUint16ArrayMemory0.byteLength === 0) {
        cachedUint16ArrayMemory0 = new Uint16Array(wasm.memory.buffer);
    }
    return cachedUint16ArrayMemory0;
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getObject(idx) { return heap[idx]; }

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export3(addHeapObject(e));
    }
}

let heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);

let heap_next = heap.length;

function isLikeNone(x) {
    return x === undefined || x === null;
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
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            state.dtor(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

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
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

function __wasm_bindgen_func_elem_7043(arg0, arg1, arg2) {
    wasm.__wasm_bindgen_func_elem_7043(arg0, arg1, addHeapObject(arg2));
}

function __wasm_bindgen_func_elem_8676(arg0, arg1, arg2) {
    wasm.__wasm_bindgen_func_elem_8676(arg0, arg1, addHeapObject(arg2));
}

function __wasm_bindgen_func_elem_7051(arg0, arg1) {
    wasm.__wasm_bindgen_func_elem_7051(arg0, arg1);
}

function __wasm_bindgen_func_elem_7046(arg0, arg1, arg2, arg3) {
    wasm.__wasm_bindgen_func_elem_7046(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

const __wbindgen_enum_GpuBlendFactor = ["zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant", "src1", "one-minus-src1", "src1-alpha", "one-minus-src1-alpha"];

const __wbindgen_enum_GpuBlendOperation = ["add", "subtract", "reverse-subtract", "min", "max"];

const __wbindgen_enum_GpuCanvasAlphaMode = ["opaque", "premultiplied"];

const __wbindgen_enum_GpuCompareFunction = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"];

const __wbindgen_enum_GpuCullMode = ["none", "front", "back"];

const __wbindgen_enum_GpuFrontFace = ["ccw", "cw"];

const __wbindgen_enum_GpuIndexFormat = ["uint16", "uint32"];

const __wbindgen_enum_GpuLoadOp = ["load", "clear"];

const __wbindgen_enum_GpuPowerPreference = ["low-power", "high-performance"];

const __wbindgen_enum_GpuPrimitiveTopology = ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"];

const __wbindgen_enum_GpuStencilOperation = ["keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap"];

const __wbindgen_enum_GpuStoreOp = ["store", "discard"];

const __wbindgen_enum_GpuTextureAspect = ["all", "stencil-only", "depth-only"];

const __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];

const __wbindgen_enum_GpuTextureViewDimension = ["1d", "2d", "2d-array", "cube", "cube-array", "3d"];

const __wbindgen_enum_GpuVertexFormat = ["uint8", "uint8x2", "uint8x4", "sint8", "sint8x2", "sint8x4", "unorm8", "unorm8x2", "unorm8x4", "snorm8", "snorm8x2", "snorm8x4", "uint16", "uint16x2", "uint16x4", "sint16", "sint16x2", "sint16x4", "unorm16", "unorm16x2", "unorm16x4", "snorm16", "snorm16x2", "snorm16x4", "float16", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4", "unorm10-10-10-2", "unorm8x4-bgra"];

const __wbindgen_enum_GpuVertexStepMode = ["vertex", "instance"];

const __wbindgen_enum_ResizeObserverBoxOptions = ["border-box", "content-box", "device-pixel-content-box"];

const __wbindgen_enum_VisibilityState = ["hidden", "visible"];

export function run_web() {
    wasm.run_web();
}

export function __wbg_Window_6419f7513544dd0b(arg0) {
    const ret = getObject(arg0).Window;
    return addHeapObject(ret);
};

export function __wbg_Window_d1bf622f71ff0629(arg0) {
    const ret = getObject(arg0).Window;
    return addHeapObject(ret);
};

export function __wbg_WorkerGlobalScope_147f18e856464ee4(arg0) {
    const ret = getObject(arg0).WorkerGlobalScope;
    return addHeapObject(ret);
};

export function __wbg___wbindgen_boolean_get_dea25b33882b895b(arg0) {
    const v = getObject(arg0);
    const ret = typeof(v) === 'boolean' ? v : undefined;
    return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
};

export function __wbg___wbindgen_debug_string_adfb662ae34724b6(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg___wbindgen_is_function_8d400b8b1af978cd(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

export function __wbg___wbindgen_is_null_dfda7d66506c95b5(arg0) {
    const ret = getObject(arg0) === null;
    return ret;
};

export function __wbg___wbindgen_is_undefined_f6b95eab589e0269(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

export function __wbg___wbindgen_number_get_9619185a74197f95(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbg___wbindgen_string_get_a2a31e16edf96e42(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg___wbindgen_throw_dd24417ed36fc46e(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbg__wbg_cb_unref_87dfb5aaa0cbcea7(arg0) {
    getObject(arg0)._wbg_cb_unref();
};

export function __wbg_abort_07646c894ebbf2bd(arg0) {
    getObject(arg0).abort();
};

export function __wbg_activeElement_b3e6b135325e4d5f(arg0) {
    const ret = getObject(arg0).activeElement;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_activeTexture_1db0722f00c3f843(arg0, arg1) {
    getObject(arg0).activeTexture(arg1 >>> 0);
};

export function __wbg_activeTexture_59810c16ea8d6e34(arg0, arg1) {
    getObject(arg0).activeTexture(arg1 >>> 0);
};

export function __wbg_addEventListener_6a82629b3d430a48() { return handleError(function (arg0, arg1, arg2, arg3) {
    getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
}, arguments) };

export function __wbg_addListener_32ac5b9ed9d2a521() { return handleError(function (arg0, arg1) {
    getObject(arg0).addListener(getObject(arg1));
}, arguments) };

export function __wbg_altKey_56d1d642f3a28c92(arg0) {
    const ret = getObject(arg0).altKey;
    return ret;
};

export function __wbg_altKey_e13fae92dfebca3e(arg0) {
    const ret = getObject(arg0).altKey;
    return ret;
};

export function __wbg_animate_6ec571f163cf6f8d(arg0, arg1, arg2) {
    const ret = getObject(arg0).animate(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export function __wbg_appendChild_7465eba84213c75f() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).appendChild(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_attachShader_bc2b53790fd12d3a(arg0, arg1, arg2) {
    getObject(arg0).attachShader(getObject(arg1), getObject(arg2));
};

export function __wbg_attachShader_ce575704294db9cc(arg0, arg1, arg2) {
    getObject(arg0).attachShader(getObject(arg1), getObject(arg2));
};

export function __wbg_beginQuery_71fca84d19c65fb1(arg0, arg1, arg2) {
    getObject(arg0).beginQuery(arg1 >>> 0, getObject(arg2));
};

export function __wbg_beginRenderPass_5959b1e03e4f545c() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).beginRenderPass(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_bindAttribLocation_2bf0ba75dbebbc07(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).bindAttribLocation(getObject(arg1), arg2 >>> 0, getStringFromWasm0(arg3, arg4));
};

export function __wbg_bindAttribLocation_4e8be7470dd8dd5a(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).bindAttribLocation(getObject(arg1), arg2 >>> 0, getStringFromWasm0(arg3, arg4));
};

export function __wbg_bindBufferRange_b775673f1d6f510c(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).bindBufferRange(arg1 >>> 0, arg2 >>> 0, getObject(arg3), arg4, arg5);
};

export function __wbg_bindBuffer_110b128c65a97376(arg0, arg1, arg2) {
    getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));
};

export function __wbg_bindBuffer_c24c31cbec41cb21(arg0, arg1, arg2) {
    getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));
};

export function __wbg_bindFramebuffer_302dbc9f62d8321e(arg0, arg1, arg2) {
    getObject(arg0).bindFramebuffer(arg1 >>> 0, getObject(arg2));
};

export function __wbg_bindFramebuffer_33b64eb9f536d2b2(arg0, arg1, arg2) {
    getObject(arg0).bindFramebuffer(arg1 >>> 0, getObject(arg2));
};

export function __wbg_bindRenderbuffer_032b12b73a396d8c(arg0, arg1, arg2) {
    getObject(arg0).bindRenderbuffer(arg1 >>> 0, getObject(arg2));
};

export function __wbg_bindRenderbuffer_43c98d43540f75ae(arg0, arg1, arg2) {
    getObject(arg0).bindRenderbuffer(arg1 >>> 0, getObject(arg2));
};

export function __wbg_bindSampler_b835d52aec542c4c(arg0, arg1, arg2) {
    getObject(arg0).bindSampler(arg1 >>> 0, getObject(arg2));
};

export function __wbg_bindTexture_4537240b278f1d53(arg0, arg1, arg2) {
    getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2));
};

export function __wbg_bindTexture_6ed714c0afe8b8d1(arg0, arg1, arg2) {
    getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2));
};

export function __wbg_bindVertexArrayOES_fdb7e747e386f55a(arg0, arg1) {
    getObject(arg0).bindVertexArrayOES(getObject(arg1));
};

export function __wbg_bindVertexArray_ced27387a0718508(arg0, arg1) {
    getObject(arg0).bindVertexArray(getObject(arg1));
};

export function __wbg_blendColor_e45c66bf83bef98c(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).blendColor(arg1, arg2, arg3, arg4);
};

export function __wbg_blendColor_f4107640d80916d6(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).blendColor(arg1, arg2, arg3, arg4);
};

export function __wbg_blendEquationSeparate_403e2a62d6e0d67f(arg0, arg1, arg2) {
    getObject(arg0).blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_blendEquationSeparate_e1eb0d0f32ef91af(arg0, arg1, arg2) {
    getObject(arg0).blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_blendEquation_493973ecbb09fe8c(arg0, arg1) {
    getObject(arg0).blendEquation(arg1 >>> 0);
};

export function __wbg_blendEquation_e3d6a981d832c9ff(arg0, arg1) {
    getObject(arg0).blendEquation(arg1 >>> 0);
};

export function __wbg_blendFuncSeparate_4cca29476893cc61(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};

export function __wbg_blendFuncSeparate_e5a1bacf4a0700cd(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};

export function __wbg_blendFunc_046483861de36edd(arg0, arg1, arg2) {
    getObject(arg0).blendFunc(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_blendFunc_5eed6dc03a180da2(arg0, arg1, arg2) {
    getObject(arg0).blendFunc(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_blitFramebuffer_02db7e02b81bd174(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    getObject(arg0).blitFramebuffer(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0);
};

export function __wbg_blockSize_6456aaf09f0ab287(arg0) {
    const ret = getObject(arg0).blockSize;
    return ret;
};

export function __wbg_body_544738f8b03aef13(arg0) {
    const ret = getObject(arg0).body;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_brand_9562792cbb4735c3(arg0, arg1) {
    const ret = getObject(arg1).brand;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_brands_a1e7a2bce052128f(arg0) {
    const ret = getObject(arg0).brands;
    return addHeapObject(ret);
};

export function __wbg_bufferData_69dbeea8e1d79f7b(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0);
};

export function __wbg_bufferData_ac5c7900b06f1517(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0);
};

export function __wbg_bufferData_c75947f383ca8992(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
};

export function __wbg_bufferData_cd7c1cdb1eb72df8(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
};

export function __wbg_bufferSubData_16db9d7d9f1c86bb(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferSubData(arg1 >>> 0, arg2, getObject(arg3));
};

export function __wbg_bufferSubData_e256855a0fda09a5(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferSubData(arg1 >>> 0, arg2, getObject(arg3));
};

export function __wbg_button_a54acd25bab5d442(arg0) {
    const ret = getObject(arg0).button;
    return ret;
};

export function __wbg_buttons_a37ff9ffacadddb5(arg0) {
    const ret = getObject(arg0).buttons;
    return ret;
};

export function __wbg_call_abb4ff46ce38be40() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_cancelAnimationFrame_1c2a3faf7be5aedd() { return handleError(function (arg0, arg1) {
    getObject(arg0).cancelAnimationFrame(arg1);
}, arguments) };

export function __wbg_cancelIdleCallback_ee06eb3dcf335b86(arg0, arg1) {
    getObject(arg0).cancelIdleCallback(arg1 >>> 0);
};

export function __wbg_cancel_09c394f0894744eb(arg0) {
    getObject(arg0).cancel();
};

export function __wbg_catch_b9db41d97d42bd02(arg0, arg1) {
    const ret = getObject(arg0).catch(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_clearBufferfv_d33b9af84c129287(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).clearBufferfv(arg1 >>> 0, arg2, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_clearBufferiv_ba2da32ddbdf9e20(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).clearBufferiv(arg1 >>> 0, arg2, getArrayI32FromWasm0(arg3, arg4));
};

export function __wbg_clearBufferuiv_e465a763e54627c1(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).clearBufferuiv(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4));
};

export function __wbg_clearDepth_0f3bb08f167cf1f0(arg0, arg1) {
    getObject(arg0).clearDepth(arg1);
};

export function __wbg_clearDepth_49b8cc204e46a1ff(arg0, arg1) {
    getObject(arg0).clearDepth(arg1);
};

export function __wbg_clearStencil_159eaeffc88e2487(arg0, arg1) {
    getObject(arg0).clearStencil(arg1);
};

export function __wbg_clearStencil_f1d7134551355df7(arg0, arg1) {
    getObject(arg0).clearStencil(arg1);
};

export function __wbg_clearTimeout_1ca823b279705d35(arg0, arg1) {
    getObject(arg0).clearTimeout(arg1);
};

export function __wbg_clear_00ac71df5db8ab17(arg0, arg1) {
    getObject(arg0).clear(arg1 >>> 0);
};

export function __wbg_clear_52caf9271911674b(arg0, arg1) {
    getObject(arg0).clear(arg1 >>> 0);
};

export function __wbg_clientWaitSync_42970d3aaa2e5351(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).clientWaitSync(getObject(arg1), arg2 >>> 0, arg3 >>> 0);
    return ret;
};

export function __wbg_close_8158530fc398ee2f(arg0) {
    getObject(arg0).close();
};

export function __wbg_code_b3ddfa90f724c486(arg0, arg1) {
    const ret = getObject(arg1).code;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_colorMask_27d9f83dd2189ed6(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
};

export function __wbg_colorMask_f000b510fac0bd7c(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
};

export function __wbg_compileShader_ac0bf6f0837881c3(arg0, arg1) {
    getObject(arg0).compileShader(getObject(arg1));
};

export function __wbg_compileShader_ba337110bed419e1(arg0, arg1) {
    getObject(arg0).compileShader(getObject(arg1));
};

export function __wbg_compressedTexSubImage2D_4ab2b43cacd95564(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8, arg9);
};

export function __wbg_compressedTexSubImage2D_bc669b55bfad0d12(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    getObject(arg0).compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, getObject(arg8));
};

export function __wbg_compressedTexSubImage2D_c9d1d1f196bce860(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    getObject(arg0).compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, getObject(arg8));
};

export function __wbg_compressedTexSubImage3D_376b9e3cdbccd59b(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    getObject(arg0).compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, getObject(arg10));
};

export function __wbg_compressedTexSubImage3D_bbc0d31582e3a014(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    getObject(arg0).compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10, arg11);
};

export function __wbg_configure_8d74ee79dc392b1f() { return handleError(function (arg0, arg1) {
    getObject(arg0).configure(getObject(arg1));
}, arguments) };

export function __wbg_contains_457d2fc195838bfa(arg0, arg1) {
    const ret = getObject(arg0).contains(getObject(arg1));
    return ret;
};

export function __wbg_contentRect_1806147dfdc380d8(arg0) {
    const ret = getObject(arg0).contentRect;
    return addHeapObject(ret);
};

export function __wbg_copyBufferSubData_74ad55c13c5b2ae2(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).copyBufferSubData(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
};

export function __wbg_copyTexSubImage2D_593b8653753bc7d3(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    getObject(arg0).copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
};

export function __wbg_copyTexSubImage2D_7f4e6e26c0eff156(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    getObject(arg0).copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
};

export function __wbg_copyTexSubImage3D_c66982c639aa21c4(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).copyTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
};

export function __wbg_createBuffer_465b645a46535184(arg0) {
    const ret = getObject(arg0).createBuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createBuffer_8601b8ec330ab49d(arg0) {
    const ret = getObject(arg0).createBuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createCommandEncoder_f91fd6a7bbb31da6(arg0, arg1) {
    const ret = getObject(arg0).createCommandEncoder(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_createElement_da4ed2b219560fc6() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_createFramebuffer_5d000a6cde602c77(arg0) {
    const ret = getObject(arg0).createFramebuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createFramebuffer_934b44643ffd067a(arg0) {
    const ret = getObject(arg0).createFramebuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createObjectURL_7d9f7f8f41373850() { return handleError(function (arg0, arg1) {
    const ret = URL.createObjectURL(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_createPipelineLayout_e218679853a4ec90(arg0, arg1) {
    const ret = getObject(arg0).createPipelineLayout(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_createProgram_023ba0fc6ff6efd6(arg0) {
    const ret = getObject(arg0).createProgram();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createProgram_ffe9d4a2cba210f4(arg0) {
    const ret = getObject(arg0).createProgram();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createQuery_427027f57b8d51cc(arg0) {
    const ret = getObject(arg0).createQuery();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createRenderPipeline_01226de8ac511c31() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).createRenderPipeline(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_createRenderbuffer_6b6220d1a07652a9(arg0) {
    const ret = getObject(arg0).createRenderbuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createRenderbuffer_f869ce6d85370a7a(arg0) {
    const ret = getObject(arg0).createRenderbuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createSampler_4c0a0f10a4d901b3(arg0) {
    const ret = getObject(arg0).createSampler();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createShaderModule_a7e2ac8c2d5bd874(arg0, arg1) {
    const ret = getObject(arg0).createShaderModule(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_createShader_4626088b63c33727(arg0, arg1) {
    const ret = getObject(arg0).createShader(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createShader_f88f9b82748ef6c0(arg0, arg1) {
    const ret = getObject(arg0).createShader(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createTexture_41211a4e8ae0afec(arg0) {
    const ret = getObject(arg0).createTexture();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createTexture_4d5934eb9772b5fe(arg0) {
    const ret = getObject(arg0).createTexture();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createVertexArrayOES_7bcc20082143e8f2(arg0) {
    const ret = getObject(arg0).createVertexArrayOES();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createVertexArray_997b3c5b1091afd9(arg0) {
    const ret = getObject(arg0).createVertexArray();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_createView_bb87ba5802a138dc() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).createView(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_ctrlKey_487597b9069da036(arg0) {
    const ret = getObject(arg0).ctrlKey;
    return ret;
};

export function __wbg_ctrlKey_b391e5105c3f6e76(arg0) {
    const ret = getObject(arg0).ctrlKey;
    return ret;
};

export function __wbg_cullFace_767c25333fcc7c8b(arg0, arg1) {
    getObject(arg0).cullFace(arg1 >>> 0);
};

export function __wbg_cullFace_88f07a3436967138(arg0, arg1) {
    getObject(arg0).cullFace(arg1 >>> 0);
};

export function __wbg_debug_9d0c87ddda3dc485(arg0) {
    console.debug(getObject(arg0));
};

export function __wbg_deleteBuffer_5ed1698208181e1f(arg0, arg1) {
    getObject(arg0).deleteBuffer(getObject(arg1));
};

export function __wbg_deleteBuffer_ba7f1164cc23b2ca(arg0, arg1) {
    getObject(arg0).deleteBuffer(getObject(arg1));
};

export function __wbg_deleteFramebuffer_71a99ec4adbfc3f2(arg0, arg1) {
    getObject(arg0).deleteFramebuffer(getObject(arg1));
};

export function __wbg_deleteFramebuffer_d25c0dc61ce8eda7(arg0, arg1) {
    getObject(arg0).deleteFramebuffer(getObject(arg1));
};

export function __wbg_deleteProgram_3bf297a31d0e6e48(arg0, arg1) {
    getObject(arg0).deleteProgram(getObject(arg1));
};

export function __wbg_deleteProgram_62774baacb13ff2b(arg0, arg1) {
    getObject(arg0).deleteProgram(getObject(arg1));
};

export function __wbg_deleteQuery_9ae103bb04e9a99d(arg0, arg1) {
    getObject(arg0).deleteQuery(getObject(arg1));
};

export function __wbg_deleteRenderbuffer_3e536cf09d672302(arg0, arg1) {
    getObject(arg0).deleteRenderbuffer(getObject(arg1));
};

export function __wbg_deleteRenderbuffer_ada437284f7fb4f2(arg0, arg1) {
    getObject(arg0).deleteRenderbuffer(getObject(arg1));
};

export function __wbg_deleteSampler_993727fa1d567ed5(arg0, arg1) {
    getObject(arg0).deleteSampler(getObject(arg1));
};

export function __wbg_deleteShader_c357bb8fbede8370(arg0, arg1) {
    getObject(arg0).deleteShader(getObject(arg1));
};

export function __wbg_deleteShader_c686dd351de5a068(arg0, arg1) {
    getObject(arg0).deleteShader(getObject(arg1));
};

export function __wbg_deleteSync_f5db5552febb6818(arg0, arg1) {
    getObject(arg0).deleteSync(getObject(arg1));
};

export function __wbg_deleteTexture_2a9b703dc2df5657(arg0, arg1) {
    getObject(arg0).deleteTexture(getObject(arg1));
};

export function __wbg_deleteTexture_875f8d84e74610a0(arg0, arg1) {
    getObject(arg0).deleteTexture(getObject(arg1));
};

export function __wbg_deleteVertexArrayOES_c17582be9fb07775(arg0, arg1) {
    getObject(arg0).deleteVertexArrayOES(getObject(arg1));
};

export function __wbg_deleteVertexArray_af80f68f0bea25b7(arg0, arg1) {
    getObject(arg0).deleteVertexArray(getObject(arg1));
};

export function __wbg_deltaMode_d74ec093e23ffeec(arg0) {
    const ret = getObject(arg0).deltaMode;
    return ret;
};

export function __wbg_deltaX_41f7678c94b10355(arg0) {
    const ret = getObject(arg0).deltaX;
    return ret;
};

export function __wbg_deltaY_3f10fd796fae2a0f(arg0) {
    const ret = getObject(arg0).deltaY;
    return ret;
};

export function __wbg_depthFunc_30cd9028f7f0cb4e(arg0, arg1) {
    getObject(arg0).depthFunc(arg1 >>> 0);
};

export function __wbg_depthFunc_eb0c2c825938bb33(arg0, arg1) {
    getObject(arg0).depthFunc(arg1 >>> 0);
};

export function __wbg_depthMask_317f5412242ac5d5(arg0, arg1) {
    getObject(arg0).depthMask(arg1 !== 0);
};

export function __wbg_depthMask_eabc1830c04e8fca(arg0, arg1) {
    getObject(arg0).depthMask(arg1 !== 0);
};

export function __wbg_depthRange_599ac7ebc9b76a2c(arg0, arg1, arg2) {
    getObject(arg0).depthRange(arg1, arg2);
};

export function __wbg_depthRange_7025983a507dd522(arg0, arg1, arg2) {
    getObject(arg0).depthRange(arg1, arg2);
};

export function __wbg_devicePixelContentBoxSize_4312b643ce19dcae(arg0) {
    const ret = getObject(arg0).devicePixelContentBoxSize;
    return addHeapObject(ret);
};

export function __wbg_devicePixelRatio_390dee26c70aa30f(arg0) {
    const ret = getObject(arg0).devicePixelRatio;
    return ret;
};

export function __wbg_disableVertexAttribArray_4c5c7214724209d0(arg0, arg1) {
    getObject(arg0).disableVertexAttribArray(arg1 >>> 0);
};

export function __wbg_disableVertexAttribArray_bcf2272b428ec9fc(arg0, arg1) {
    getObject(arg0).disableVertexAttribArray(arg1 >>> 0);
};

export function __wbg_disable_3af3e194392b0a83(arg0, arg1) {
    getObject(arg0).disable(arg1 >>> 0);
};

export function __wbg_disable_c05809e00765548d(arg0, arg1) {
    getObject(arg0).disable(arg1 >>> 0);
};

export function __wbg_disconnect_0078fed2ab427a04(arg0) {
    getObject(arg0).disconnect();
};

export function __wbg_disconnect_94d44092a36f9880(arg0) {
    getObject(arg0).disconnect();
};

export function __wbg_document_5b745e82ba551ca5(arg0) {
    const ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_drawArraysInstancedANGLE_5802f710395d6947(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).drawArraysInstancedANGLE(arg1 >>> 0, arg2, arg3, arg4);
};

export function __wbg_drawArraysInstanced_5a3cccf98d769264(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).drawArraysInstanced(arg1 >>> 0, arg2, arg3, arg4);
};

export function __wbg_drawArrays_a8ad03dae79ec56f(arg0, arg1, arg2, arg3) {
    getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3);
};

export function __wbg_drawArrays_c106ebe0234971d4(arg0, arg1, arg2, arg3) {
    getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3);
};

export function __wbg_drawBuffersWEBGL_f21a161dc8fb366c(arg0, arg1) {
    getObject(arg0).drawBuffersWEBGL(getObject(arg1));
};

export function __wbg_drawBuffers_dd9a3530aa5b71b2(arg0, arg1) {
    getObject(arg0).drawBuffers(getObject(arg1));
};

export function __wbg_drawElementsInstancedANGLE_a63eca97c72be45f(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).drawElementsInstancedANGLE(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};

export function __wbg_drawElementsInstanced_ad84faddf2b48335(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).drawElementsInstanced(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};

export function __wbg_draw_35bd445973b180dc(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};

export function __wbg_enableVertexAttribArray_2898de871f949393(arg0, arg1) {
    getObject(arg0).enableVertexAttribArray(arg1 >>> 0);
};

export function __wbg_enableVertexAttribArray_def9952d8426be95(arg0, arg1) {
    getObject(arg0).enableVertexAttribArray(arg1 >>> 0);
};

export function __wbg_enable_2d8bb952637ad17a(arg0, arg1) {
    getObject(arg0).enable(arg1 >>> 0);
};

export function __wbg_enable_52598759008d46ee(arg0, arg1) {
    getObject(arg0).enable(arg1 >>> 0);
};

export function __wbg_endQuery_81a855457c9a8807(arg0, arg1) {
    getObject(arg0).endQuery(arg1 >>> 0);
};

export function __wbg_end_ddc7a483fce32eed(arg0) {
    getObject(arg0).end();
};

export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_export4(deferred0_0, deferred0_1, 1);
    }
};

export function __wbg_error_7bc7d576a6aaf855(arg0) {
    console.error(getObject(arg0));
};

export function __wbg_error_d7f117185d9ffd19(arg0, arg1) {
    console.error(getObject(arg0), getObject(arg1));
};

export function __wbg_fenceSync_ae9efe266c01d1d4(arg0, arg1, arg2) {
    const ret = getObject(arg0).fenceSync(arg1 >>> 0, arg2 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_finish_7c3e136077cc2230(arg0) {
    const ret = getObject(arg0).finish();
    return addHeapObject(ret);
};

export function __wbg_finish_db51f74029254467(arg0, arg1) {
    const ret = getObject(arg0).finish(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_flush_25841159972acebf(arg0) {
    getObject(arg0).flush();
};

export function __wbg_flush_f0bf967fc4c8252e(arg0) {
    getObject(arg0).flush();
};

export function __wbg_focus_220a53e22147dc0f() { return handleError(function (arg0) {
    getObject(arg0).focus();
}, arguments) };

export function __wbg_framebufferRenderbuffer_c4e0a3741080e47d(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, getObject(arg4));
};

export function __wbg_framebufferRenderbuffer_d11b93c15d813b67(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, getObject(arg4));
};

export function __wbg_framebufferTexture2D_1c59ad9667ea1ea1(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, getObject(arg4), arg5);
};

export function __wbg_framebufferTexture2D_489e539476d29f49(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, getObject(arg4), arg5);
};

export function __wbg_framebufferTextureLayer_adaeec76c62e2293(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).framebufferTextureLayer(arg1 >>> 0, arg2 >>> 0, getObject(arg3), arg4, arg5);
};

export function __wbg_framebufferTextureMultiviewOVR_81e594036296c9b0(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).framebufferTextureMultiviewOVR(arg1 >>> 0, arg2 >>> 0, getObject(arg3), arg4, arg5, arg6);
};

export function __wbg_frontFace_9a8e14be7e21500f(arg0, arg1) {
    getObject(arg0).frontFace(arg1 >>> 0);
};

export function __wbg_frontFace_b516366b32ef6f00(arg0, arg1) {
    getObject(arg0).frontFace(arg1 >>> 0);
};

export function __wbg_fullscreenElement_e2e939644adf50e1(arg0) {
    const ret = getObject(arg0).fullscreenElement;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_getBufferSubData_1867a1050f5a6726(arg0, arg1, arg2, arg3) {
    getObject(arg0).getBufferSubData(arg1 >>> 0, arg2, getObject(arg3));
};

export function __wbg_getCoalescedEvents_21492912fd0145ec(arg0) {
    const ret = getObject(arg0).getCoalescedEvents;
    return addHeapObject(ret);
};

export function __wbg_getCoalescedEvents_43b8965761bb13ef(arg0) {
    const ret = getObject(arg0).getCoalescedEvents();
    return addHeapObject(ret);
};

export function __wbg_getComputedStyle_bbcd5e3d08077b71() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).getComputedStyle(getObject(arg1));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_getContext_01f42b234e833f0a() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_getContext_1a6877af6b5f04dc() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2), getObject(arg3));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_getContext_2f210d0a58d43d95() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_getContext_40a6fc6da6cacc21() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2), getObject(arg3));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_getCurrentTexture_b82524d31095411f() { return handleError(function (arg0) {
    const ret = getObject(arg0).getCurrentTexture();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_getElementById_e05488d2143c2b21(arg0, arg1, arg2) {
    const ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_getExtension_49a13df0dc150fab() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).getExtension(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_getIndexedParameter_46abff0edb598e22() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).getIndexedParameter(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
}, arguments) };

export function __wbg_getOwnPropertyDescriptor_b6aa5a2fa50d52c7(arg0, arg1) {
    const ret = Object.getOwnPropertyDescriptor(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_getParameter_08df3cb47d357cca() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).getParameter(arg1 >>> 0);
    return addHeapObject(ret);
}, arguments) };

export function __wbg_getParameter_1dfd667c33169fab() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).getParameter(arg1 >>> 0);
    return addHeapObject(ret);
}, arguments) };

export function __wbg_getPreferredCanvasFormat_92cc631581256e43(arg0) {
    const ret = getObject(arg0).getPreferredCanvasFormat();
    return (__wbindgen_enum_GpuTextureFormat.indexOf(ret) + 1 || 96) - 1;
};

export function __wbg_getProgramInfoLog_a0ff8b0971fcaf48(arg0, arg1, arg2) {
    const ret = getObject(arg1).getProgramInfoLog(getObject(arg2));
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_getProgramInfoLog_ea3064b153e4542a(arg0, arg1, arg2) {
    const ret = getObject(arg1).getProgramInfoLog(getObject(arg2));
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_getProgramParameter_c777611a448a6ccd(arg0, arg1, arg2) {
    const ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_getProgramParameter_ff1aee3815d6a8f9(arg0, arg1, arg2) {
    const ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_getPropertyValue_dcded91357966805() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = getObject(arg1).getPropertyValue(getStringFromWasm0(arg2, arg3));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_getQueryParameter_7f1971af9b820343(arg0, arg1, arg2) {
    const ret = getObject(arg0).getQueryParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_getShaderInfoLog_1affea8c74bd191c(arg0, arg1, arg2) {
    const ret = getObject(arg1).getShaderInfoLog(getObject(arg2));
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_getShaderInfoLog_862d8c35c68d02c8(arg0, arg1, arg2) {
    const ret = getObject(arg1).getShaderInfoLog(getObject(arg2));
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_getShaderParameter_1f86483b99db3dcc(arg0, arg1, arg2) {
    const ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_getShaderParameter_b8a41abb0d7d23c3(arg0, arg1, arg2) {
    const ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_getSupportedExtensions_bc23bc19c9dac45d(arg0) {
    const ret = getObject(arg0).getSupportedExtensions();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_getSupportedProfiles_d5636f8d10765e75(arg0) {
    const ret = getObject(arg0).getSupportedProfiles();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_getSyncParameter_20391c81e5e58c48(arg0, arg1, arg2) {
    const ret = getObject(arg0).getSyncParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_getUniformBlockIndex_1453ff945a9eefd5(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).getUniformBlockIndex(getObject(arg1), getStringFromWasm0(arg2, arg3));
    return ret;
};

export function __wbg_getUniformLocation_21ac12bfc569cbbf(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).getUniformLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_getUniformLocation_2a4ddf8dd8285373(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).getUniformLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_get_6b7bd52aca3f9671(arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};

export function __wbg_get_c53d381635aa3929(arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_gpu_4b2187814fd587ca(arg0) {
    const ret = getObject(arg0).gpu;
    return addHeapObject(ret);
};

export function __wbg_height_5d22b94a936fae9f(arg0) {
    const ret = getObject(arg0).height;
    return ret;
};

export function __wbg_includes_cd7103de1f6ce823(arg0, arg1, arg2) {
    const ret = getObject(arg0).includes(getObject(arg1), arg2);
    return ret;
};

export function __wbg_info_ce6bcc489c22f6f0(arg0) {
    console.info(getObject(arg0));
};

export function __wbg_inlineSize_65c8cd0ecc54c605(arg0) {
    const ret = getObject(arg0).inlineSize;
    return ret;
};

export function __wbg_instanceof_GpuAdapter_5e451ad6596e2784(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof GPUAdapter;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_GpuCanvasContext_f70ee27f49f4f884(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof GPUCanvasContext;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_HtmlCanvasElement_c4251b1b6a15edcc(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof HTMLCanvasElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_WebGl2RenderingContext_121e4c8c95b128ef(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof WebGL2RenderingContext;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Window_b5cf7783caa68180(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_invalidateFramebuffer_e2d4d1747d73b885() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).invalidateFramebuffer(arg1 >>> 0, getObject(arg2));
}, arguments) };

export function __wbg_isIntersecting_2d00a342ea420fb9(arg0) {
    const ret = getObject(arg0).isIntersecting;
    return ret;
};

export function __wbg_is_928aa29d71e75457(arg0, arg1) {
    const ret = Object.is(getObject(arg0), getObject(arg1));
    return ret;
};

export function __wbg_key_505d33c50799526a(arg0, arg1) {
    const ret = getObject(arg1).key;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_label_8296b38115112ca4(arg0, arg1) {
    const ret = getObject(arg1).label;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_length_d45040a40c570362(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

export function __wbg_linkProgram_2f770464e69099dc(arg0, arg1) {
    getObject(arg0).linkProgram(getObject(arg1));
};

export function __wbg_linkProgram_93f76a2f5030041e(arg0, arg1) {
    getObject(arg0).linkProgram(getObject(arg1));
};

export function __wbg_location_0ef648bbeb3e599c(arg0) {
    const ret = getObject(arg0).location;
    return ret;
};

export function __wbg_log_1d990106d99dacb7(arg0) {
    console.log(getObject(arg0));
};

export function __wbg_mapAsync_2dba5c7b48d2e598(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).mapAsync(arg1 >>> 0, arg2, arg3);
    return addHeapObject(ret);
};

export function __wbg_matchMedia_29904c79dbaba90b() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).matchMedia(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_matches_9cef9b7c722bd7c8(arg0) {
    const ret = getObject(arg0).matches;
    return ret;
};

export function __wbg_media_077ecdcd98f5aa28(arg0, arg1) {
    const ret = getObject(arg1).media;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_metaKey_0572b1cbcb5b272b(arg0) {
    const ret = getObject(arg0).metaKey;
    return ret;
};

export function __wbg_metaKey_448c751accad2eba(arg0) {
    const ret = getObject(arg0).metaKey;
    return ret;
};

export function __wbg_movementX_00c85de14e45c5f4(arg0) {
    const ret = getObject(arg0).movementX;
    return ret;
};

export function __wbg_movementY_9f8470917a12f3f5(arg0) {
    const ret = getObject(arg0).movementY;
    return ret;
};

export function __wbg_navigator_11b7299bb7886507(arg0) {
    const ret = getObject(arg0).navigator;
    return addHeapObject(ret);
};

export function __wbg_navigator_b49edef831236138(arg0) {
    const ret = getObject(arg0).navigator;
    return addHeapObject(ret);
};

export function __wbg_new_137453588c393c59() { return handleError(function () {
    const ret = new MessageChannel();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_1ba21ce319a06297() {
    const ret = new Object();
    return addHeapObject(ret);
};

export function __wbg_new_25f239778d6112b9() {
    const ret = new Array();
    return addHeapObject(ret);
};

export function __wbg_new_53cb1e86c1ef5d2a() { return handleError(function (arg0, arg1) {
    const ret = new Worker(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_881a222c65f168fc() { return handleError(function () {
    const ret = new AbortController();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return addHeapObject(ret);
};

export function __wbg_new_a25bd305a87faf63() { return handleError(function (arg0) {
    const ret = new ResizeObserver(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_bba60878a7b7f42c() { return handleError(function (arg0) {
    const ret = new IntersectionObserver(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_no_args_cb138f77cf6151ee(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_new_with_str_sequence_and_options_fe06fc75a8482fd3() { return handleError(function (arg0, arg1) {
    const ret = new Blob(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_now_2c95c9de01293173(arg0) {
    const ret = getObject(arg0).now();
    return ret;
};

export function __wbg_observe_5186b67ce86740f9(arg0, arg1) {
    getObject(arg0).observe(getObject(arg1));
};

export function __wbg_observe_ce343c3f1701b1f1(arg0, arg1, arg2) {
    getObject(arg0).observe(getObject(arg1), getObject(arg2));
};

export function __wbg_observe_eefa2465578e5d51(arg0, arg1) {
    getObject(arg0).observe(getObject(arg1));
};

export function __wbg_of_6505a0eb509da02e(arg0) {
    const ret = Array.of(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_of_b8cd42ebb79fb759(arg0, arg1) {
    const ret = Array.of(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_offsetX_cb6a38e6f23cb4a6(arg0) {
    const ret = getObject(arg0).offsetX;
    return ret;
};

export function __wbg_offsetY_43e21941c5c1f8bf(arg0) {
    const ret = getObject(arg0).offsetY;
    return ret;
};

export function __wbg_onSubmittedWorkDone_22f709e16b81d1c2(arg0) {
    const ret = getObject(arg0).onSubmittedWorkDone();
    return addHeapObject(ret);
};

export function __wbg_performance_7a3ffd0b17f663ad(arg0) {
    const ret = getObject(arg0).performance;
    return addHeapObject(ret);
};

export function __wbg_persisted_90586ee41f1f0188(arg0) {
    const ret = getObject(arg0).persisted;
    return ret;
};

export function __wbg_pixelStorei_1956db9ae4b22c29(arg0, arg1, arg2) {
    getObject(arg0).pixelStorei(arg1 >>> 0, arg2);
};

export function __wbg_pixelStorei_5449c87f83f25694(arg0, arg1, arg2) {
    getObject(arg0).pixelStorei(arg1 >>> 0, arg2);
};

export function __wbg_play_63bc12f42e16af91(arg0) {
    getObject(arg0).play();
};

export function __wbg_pointerId_bf4326e151df1474(arg0) {
    const ret = getObject(arg0).pointerId;
    return ret;
};

export function __wbg_pointerType_f1939c6407f96be9(arg0, arg1) {
    const ret = getObject(arg1).pointerType;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_polygonOffset_7308f17e4b9c9e6f(arg0, arg1, arg2) {
    getObject(arg0).polygonOffset(arg1, arg2);
};

export function __wbg_polygonOffset_d405a847eb9279a1(arg0, arg1, arg2) {
    getObject(arg0).polygonOffset(arg1, arg2);
};

export function __wbg_port1_75dce9d0d8087125(arg0) {
    const ret = getObject(arg0).port1;
    return addHeapObject(ret);
};

export function __wbg_port2_3cffa4119380f41d(arg0) {
    const ret = getObject(arg0).port2;
    return addHeapObject(ret);
};

export function __wbg_postMessage_79f844174f56304f() { return handleError(function (arg0, arg1) {
    getObject(arg0).postMessage(getObject(arg1));
}, arguments) };

export function __wbg_postMessage_e0309b53c7ad30e6() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).postMessage(getObject(arg1), getObject(arg2));
}, arguments) };

export function __wbg_postTask_41d93e93941e4a3d(arg0, arg1, arg2) {
    const ret = getObject(arg0).postTask(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export function __wbg_pressure_35422752c1a40439(arg0) {
    const ret = getObject(arg0).pressure;
    return ret;
};

export function __wbg_preventDefault_e97663aeeb9709d3(arg0) {
    getObject(arg0).preventDefault();
};

export function __wbg_prototype_c28bca39c45aba9b() {
    const ret = ResizeObserverEntry.prototype;
    return addHeapObject(ret);
};

export function __wbg_push_7d9be8f38fc13975(arg0, arg1) {
    const ret = getObject(arg0).push(getObject(arg1));
    return ret;
};

export function __wbg_queryCounterEXT_ecccc67a3c00d9b2(arg0, arg1, arg2) {
    getObject(arg0).queryCounterEXT(getObject(arg1), arg2 >>> 0);
};

export function __wbg_querySelectorAll_aa1048eae18f6f1a() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).querySelectorAll(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_querySelector_15a92ce6bed6157d() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).querySelector(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_queueMicrotask_892c6bd5d40fe78e(arg0, arg1) {
    getObject(arg0).queueMicrotask(getObject(arg1));
};

export function __wbg_queueMicrotask_9b549dfce8865860(arg0) {
    const ret = getObject(arg0).queueMicrotask;
    return addHeapObject(ret);
};

export function __wbg_queueMicrotask_fca69f5bfad613a5(arg0) {
    queueMicrotask(getObject(arg0));
};

export function __wbg_queue_e7ab52ab0880dce9(arg0) {
    const ret = getObject(arg0).queue;
    return addHeapObject(ret);
};

export function __wbg_readBuffer_bbd823c99c8cb8c2(arg0, arg1) {
    getObject(arg0).readBuffer(arg1 >>> 0);
};

export function __wbg_readPixels_031b1d4c916fc4f9() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    getObject(arg0).readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, getObject(arg7));
}, arguments) };

export function __wbg_readPixels_3288aabda6ab89ff() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    getObject(arg0).readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, getObject(arg7));
}, arguments) };

export function __wbg_readPixels_bc06772e95599959() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    getObject(arg0).readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
}, arguments) };

export function __wbg_removeEventListener_565e273024b68b75() { return handleError(function (arg0, arg1, arg2, arg3) {
    getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
}, arguments) };

export function __wbg_removeListener_204002d1eb3f20f6() { return handleError(function (arg0, arg1) {
    getObject(arg0).removeListener(getObject(arg1));
}, arguments) };

export function __wbg_removeProperty_c2e16faee2834bef() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = getObject(arg1).removeProperty(getStringFromWasm0(arg2, arg3));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_renderbufferStorageMultisample_c944aa96428a6ff6(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).renderbufferStorageMultisample(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};

export function __wbg_renderbufferStorage_4ea9706d7f996e6d(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
};

export function __wbg_renderbufferStorage_95fae6488cee51e3(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
};

export function __wbg_repeat_3733d1d584bf0e38(arg0) {
    const ret = getObject(arg0).repeat;
    return ret;
};

export function __wbg_requestAdapter_eb00393b717ebb9c(arg0, arg1) {
    const ret = getObject(arg0).requestAdapter(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_requestAnimationFrame_994dc4ebde22b8d9() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
    return ret;
}, arguments) };

export function __wbg_requestDevice_1be6e30ff9d67933(arg0, arg1) {
    const ret = getObject(arg0).requestDevice(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_requestFullscreen_86fc6cdb76000482(arg0) {
    const ret = getObject(arg0).requestFullscreen;
    return addHeapObject(ret);
};

export function __wbg_requestFullscreen_9f0611438eb929cf(arg0) {
    const ret = getObject(arg0).requestFullscreen();
    return addHeapObject(ret);
};

export function __wbg_requestIdleCallback_1b8d644ff564208f(arg0) {
    const ret = getObject(arg0).requestIdleCallback;
    return addHeapObject(ret);
};

export function __wbg_requestIdleCallback_dedd367f2e61f932() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).requestIdleCallback(getObject(arg1));
    return ret;
}, arguments) };

export function __wbg_resolve_fd5bfbaa4ce36e1e(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_revokeObjectURL_88db3468842ff09e() { return handleError(function (arg0, arg1) {
    URL.revokeObjectURL(getStringFromWasm0(arg0, arg1));
}, arguments) };

export function __wbg_samplerParameterf_dc4f26238b36d07a(arg0, arg1, arg2, arg3) {
    getObject(arg0).samplerParameterf(getObject(arg1), arg2 >>> 0, arg3);
};

export function __wbg_samplerParameteri_66d42118f12ed70c(arg0, arg1, arg2, arg3) {
    getObject(arg0).samplerParameteri(getObject(arg1), arg2 >>> 0, arg3);
};

export function __wbg_scheduler_48482a9974eeacbd(arg0) {
    const ret = getObject(arg0).scheduler;
    return addHeapObject(ret);
};

export function __wbg_scheduler_5156bb61cc1cf589(arg0) {
    const ret = getObject(arg0).scheduler;
    return addHeapObject(ret);
};

export function __wbg_scissor_04e903bd18e45083(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).scissor(arg1, arg2, arg3, arg4);
};

export function __wbg_scissor_988df87f9cf85e7e(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).scissor(arg1, arg2, arg3, arg4);
};

export function __wbg_setAttribute_34747dd193f45828() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_setPipeline_b010841b1ab020c5(arg0, arg1) {
    getObject(arg0).setPipeline(getObject(arg1));
};

export function __wbg_setPointerCapture_c611f4bcb7e9081e() { return handleError(function (arg0, arg1) {
    getObject(arg0).setPointerCapture(arg1);
}, arguments) };

export function __wbg_setProperty_f27b2c05323daf8a() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_setTimeout_06477c23d31efef1() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
    return ret;
}, arguments) };

export function __wbg_setTimeout_780045617e4bd6d6() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).setTimeout(getObject(arg1));
    return ret;
}, arguments) };

export function __wbg_set_781438a03c0c3c81() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };

export function __wbg_set_a_004bf5b9918b7a9d(arg0, arg1) {
    getObject(arg0).a = arg1;
};

export function __wbg_set_alpha_7c9ec1b9552caf33(arg0, arg1) {
    getObject(arg0).alpha = getObject(arg1);
};

export function __wbg_set_alpha_mode_d776091480150822(arg0, arg1) {
    getObject(arg0).alphaMode = __wbindgen_enum_GpuCanvasAlphaMode[arg1];
};

export function __wbg_set_alpha_to_coverage_enabled_97c65e8e0f0f97f0(arg0, arg1) {
    getObject(arg0).alphaToCoverageEnabled = arg1 !== 0;
};

export function __wbg_set_array_layer_count_4b8708bd126ac758(arg0, arg1) {
    getObject(arg0).arrayLayerCount = arg1 >>> 0;
};

export function __wbg_set_array_stride_89addb9ef89545a3(arg0, arg1) {
    getObject(arg0).arrayStride = arg1;
};

export function __wbg_set_aspect_e672528231f771cb(arg0, arg1) {
    getObject(arg0).aspect = __wbindgen_enum_GpuTextureAspect[arg1];
};

export function __wbg_set_attributes_2ab28c57eed0dc3a(arg0, arg1) {
    getObject(arg0).attributes = getObject(arg1);
};

export function __wbg_set_b_b2b86286be8253f1(arg0, arg1) {
    getObject(arg0).b = arg1;
};

export function __wbg_set_base_array_layer_a3268c17b424196f(arg0, arg1) {
    getObject(arg0).baseArrayLayer = arg1 >>> 0;
};

export function __wbg_set_base_mip_level_7ac60a20e24c81b1(arg0, arg1) {
    getObject(arg0).baseMipLevel = arg1 >>> 0;
};

export function __wbg_set_beginning_of_pass_write_index_87e36fb6887d3c1c(arg0, arg1) {
    getObject(arg0).beginningOfPassWriteIndex = arg1 >>> 0;
};

export function __wbg_set_bind_group_layouts_7fedf360e81319eb(arg0, arg1) {
    getObject(arg0).bindGroupLayouts = getObject(arg1);
};

export function __wbg_set_blend_c6896375c7f0119c(arg0, arg1) {
    getObject(arg0).blend = getObject(arg1);
};

export function __wbg_set_box_d724bbbe6354cf86(arg0, arg1) {
    getObject(arg0).box = __wbindgen_enum_ResizeObserverBoxOptions[arg1];
};

export function __wbg_set_buffers_14ec06929ea541ec(arg0, arg1) {
    getObject(arg0).buffers = getObject(arg1);
};

export function __wbg_set_clear_value_829dfd0db30aaeac(arg0, arg1) {
    getObject(arg0).clearValue = getObject(arg1);
};

export function __wbg_set_code_09748e5373b711b2(arg0, arg1, arg2) {
    getObject(arg0).code = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_color_96b2f28b4f51fceb(arg0, arg1) {
    getObject(arg0).color = getObject(arg1);
};

export function __wbg_set_color_attachments_ee51f860224ee6dd(arg0, arg1) {
    getObject(arg0).colorAttachments = getObject(arg1);
};

export function __wbg_set_compare_eb86f2890782b20b(arg0, arg1) {
    getObject(arg0).compare = __wbindgen_enum_GpuCompareFunction[arg1];
};

export function __wbg_set_count_4d43f3f3ab7f952d(arg0, arg1) {
    getObject(arg0).count = arg1 >>> 0;
};

export function __wbg_set_cull_mode_4e0bb3799474c091(arg0, arg1) {
    getObject(arg0).cullMode = __wbindgen_enum_GpuCullMode[arg1];
};

export function __wbg_set_depth_bias_clamp_5375d337b8b35cd8(arg0, arg1) {
    getObject(arg0).depthBiasClamp = arg1;
};

export function __wbg_set_depth_bias_ea8b79f02442c9c7(arg0, arg1) {
    getObject(arg0).depthBias = arg1;
};

export function __wbg_set_depth_bias_slope_scale_0493feedbe6ad438(arg0, arg1) {
    getObject(arg0).depthBiasSlopeScale = arg1;
};

export function __wbg_set_depth_clear_value_20534499c6507e19(arg0, arg1) {
    getObject(arg0).depthClearValue = arg1;
};

export function __wbg_set_depth_compare_00e8b65c01d4bf03(arg0, arg1) {
    getObject(arg0).depthCompare = __wbindgen_enum_GpuCompareFunction[arg1];
};

export function __wbg_set_depth_fail_op_765de27464903fd0(arg0, arg1) {
    getObject(arg0).depthFailOp = __wbindgen_enum_GpuStencilOperation[arg1];
};

export function __wbg_set_depth_load_op_33c128108a7dc8f1(arg0, arg1) {
    getObject(arg0).depthLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
};

export function __wbg_set_depth_read_only_60990818c939df42(arg0, arg1) {
    getObject(arg0).depthReadOnly = arg1 !== 0;
};

export function __wbg_set_depth_stencil_2e141a5dfe91878d(arg0, arg1) {
    getObject(arg0).depthStencil = getObject(arg1);
};

export function __wbg_set_depth_stencil_attachment_47273ec480dd9bb3(arg0, arg1) {
    getObject(arg0).depthStencilAttachment = getObject(arg1);
};

export function __wbg_set_depth_store_op_9cf32660e51edb87(arg0, arg1) {
    getObject(arg0).depthStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
};

export function __wbg_set_depth_write_enabled_2757b4106a089684(arg0, arg1) {
    getObject(arg0).depthWriteEnabled = arg1 !== 0;
};

export function __wbg_set_device_c2cb3231e445ef7c(arg0, arg1) {
    getObject(arg0).device = getObject(arg1);
};

export function __wbg_set_dimension_c7429fee9721a104(arg0, arg1) {
    getObject(arg0).dimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
};

export function __wbg_set_dst_factor_976f0a83fd6ab733(arg0, arg1) {
    getObject(arg0).dstFactor = __wbindgen_enum_GpuBlendFactor[arg1];
};

export function __wbg_set_end_of_pass_write_index_3cc5a7a3f6819a03(arg0, arg1) {
    getObject(arg0).endOfPassWriteIndex = arg1 >>> 0;
};

export function __wbg_set_entry_point_1da27599bf796782(arg0, arg1, arg2) {
    getObject(arg0).entryPoint = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_entry_point_670e208336b80723(arg0, arg1, arg2) {
    getObject(arg0).entryPoint = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_fail_op_9de9bf69ac6682e3(arg0, arg1) {
    getObject(arg0).failOp = __wbindgen_enum_GpuStencilOperation[arg1];
};

export function __wbg_set_format_10a5222e02236027(arg0, arg1) {
    getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1];
};

export function __wbg_set_format_37627c6070d0ecfc(arg0, arg1) {
    getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1];
};

export function __wbg_set_format_3c7d4bce3fb94de5(arg0, arg1) {
    getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1];
};

export function __wbg_set_format_877a89e3431cb656(arg0, arg1) {
    getObject(arg0).format = __wbindgen_enum_GpuVertexFormat[arg1];
};

export function __wbg_set_format_ee418ce830040f4d(arg0, arg1) {
    getObject(arg0).format = __wbindgen_enum_GpuTextureFormat[arg1];
};

export function __wbg_set_fragment_616c1d1c0db9abd4(arg0, arg1) {
    getObject(arg0).fragment = getObject(arg1);
};

export function __wbg_set_front_face_a1a0e940bd9fa3d0(arg0, arg1) {
    getObject(arg0).frontFace = __wbindgen_enum_GpuFrontFace[arg1];
};

export function __wbg_set_g_9ab482dfe9422850(arg0, arg1) {
    getObject(arg0).g = arg1;
};

export function __wbg_set_height_6f8f8ef4cb40e496(arg0, arg1) {
    getObject(arg0).height = arg1 >>> 0;
};

export function __wbg_set_height_afe09c24165867f7(arg0, arg1) {
    getObject(arg0).height = arg1 >>> 0;
};

export function __wbg_set_label_0b21604c6a585153(arg0, arg1, arg2) {
    getObject(arg0).label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_label_1b7e4bc9d67c38b4(arg0, arg1, arg2) {
    getObject(arg0).label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_label_407c8b09134f4f1d(arg0, arg1, arg2) {
    getObject(arg0).label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_label_5dc53fac7117f697(arg0, arg1, arg2) {
    getObject(arg0).label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_label_ae972d3c351c79ec(arg0, arg1, arg2) {
    getObject(arg0).label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_label_b1b0d28716686810(arg0, arg1, arg2) {
    getObject(arg0).label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_label_d90e07589bdb8f1a(arg0, arg1, arg2) {
    getObject(arg0).label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_label_e69d774bf38947d2(arg0, arg1, arg2) {
    getObject(arg0).label = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_layout_ac044d38ca30f520(arg0, arg1) {
    getObject(arg0).layout = getObject(arg1);
};

export function __wbg_set_load_op_d48e31970a7bdf9b(arg0, arg1) {
    getObject(arg0).loadOp = __wbindgen_enum_GpuLoadOp[arg1];
};

export function __wbg_set_mask_a51cdf9e56393e94(arg0, arg1) {
    getObject(arg0).mask = arg1 >>> 0;
};

export function __wbg_set_mip_level_count_79f47bf6140098e5(arg0, arg1) {
    getObject(arg0).mipLevelCount = arg1 >>> 0;
};

export function __wbg_set_module_8ff6ea5431317fde(arg0, arg1) {
    getObject(arg0).module = getObject(arg1);
};

export function __wbg_set_module_dae95bb56c7d6ee9(arg0, arg1) {
    getObject(arg0).module = getObject(arg1);
};

export function __wbg_set_multisample_156e854358e208ff(arg0, arg1) {
    getObject(arg0).multisample = getObject(arg1);
};

export function __wbg_set_offset_9ed8011d53037f93(arg0, arg1) {
    getObject(arg0).offset = arg1;
};

export function __wbg_set_onmessage_f0d5bf805190d1d8(arg0, arg1) {
    getObject(arg0).onmessage = getObject(arg1);
};

export function __wbg_set_operation_2ad26b5d94a70e63(arg0, arg1) {
    getObject(arg0).operation = __wbindgen_enum_GpuBlendOperation[arg1];
};

export function __wbg_set_pass_op_25209e5db7ec5d4b(arg0, arg1) {
    getObject(arg0).passOp = __wbindgen_enum_GpuStencilOperation[arg1];
};

export function __wbg_set_power_preference_2f983dce6d983584(arg0, arg1) {
    getObject(arg0).powerPreference = __wbindgen_enum_GpuPowerPreference[arg1];
};

export function __wbg_set_primitive_cc91060b2752c577(arg0, arg1) {
    getObject(arg0).primitive = getObject(arg1);
};

export function __wbg_set_query_set_e258abc9e7072a65(arg0, arg1) {
    getObject(arg0).querySet = getObject(arg1);
};

export function __wbg_set_r_4943e4c720ff77ca(arg0, arg1) {
    getObject(arg0).r = arg1;
};

export function __wbg_set_required_features_52447a9e50ed9b36(arg0, arg1) {
    getObject(arg0).requiredFeatures = getObject(arg1);
};

export function __wbg_set_resolve_target_28603a69bca08e48(arg0, arg1) {
    getObject(arg0).resolveTarget = getObject(arg1);
};

export function __wbg_set_shader_location_2ee098966925fd00(arg0, arg1) {
    getObject(arg0).shaderLocation = arg1 >>> 0;
};

export function __wbg_set_src_factor_ebc4adbcb746fedc(arg0, arg1) {
    getObject(arg0).srcFactor = __wbindgen_enum_GpuBlendFactor[arg1];
};

export function __wbg_set_stencil_back_51d5377faff8840b(arg0, arg1) {
    getObject(arg0).stencilBack = getObject(arg1);
};

export function __wbg_set_stencil_clear_value_21847cbc9881e39b(arg0, arg1) {
    getObject(arg0).stencilClearValue = arg1 >>> 0;
};

export function __wbg_set_stencil_front_115e8b375153cc55(arg0, arg1) {
    getObject(arg0).stencilFront = getObject(arg1);
};

export function __wbg_set_stencil_load_op_3531e7e23b9c735e(arg0, arg1) {
    getObject(arg0).stencilLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
};

export function __wbg_set_stencil_read_mask_6022bedf9e54ec0d(arg0, arg1) {
    getObject(arg0).stencilReadMask = arg1 >>> 0;
};

export function __wbg_set_stencil_read_only_beb27fbf4ca9b6e4(arg0, arg1) {
    getObject(arg0).stencilReadOnly = arg1 !== 0;
};

export function __wbg_set_stencil_store_op_7b3259ed6b9d76ca(arg0, arg1) {
    getObject(arg0).stencilStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
};

export function __wbg_set_stencil_write_mask_294d575eb0e2fd6f(arg0, arg1) {
    getObject(arg0).stencilWriteMask = arg1 >>> 0;
};

export function __wbg_set_step_mode_5b6d687e55df5dd0(arg0, arg1) {
    getObject(arg0).stepMode = __wbindgen_enum_GpuVertexStepMode[arg1];
};

export function __wbg_set_store_op_e1b7633c5612534a(arg0, arg1) {
    getObject(arg0).storeOp = __wbindgen_enum_GpuStoreOp[arg1];
};

export function __wbg_set_strip_index_format_6d0c95e2646c52d1(arg0, arg1) {
    getObject(arg0).stripIndexFormat = __wbindgen_enum_GpuIndexFormat[arg1];
};

export function __wbg_set_targets_9f867a93d09515a9(arg0, arg1) {
    getObject(arg0).targets = getObject(arg1);
};

export function __wbg_set_timestamp_writes_94da76b5f3fee792(arg0, arg1) {
    getObject(arg0).timestampWrites = getObject(arg1);
};

export function __wbg_set_topology_0ef9190b0c51fc78(arg0, arg1) {
    getObject(arg0).topology = __wbindgen_enum_GpuPrimitiveTopology[arg1];
};

export function __wbg_set_type_7ce650670a34c68f(arg0, arg1, arg2) {
    getObject(arg0).type = getStringFromWasm0(arg1, arg2);
};

export function __wbg_set_unclipped_depth_936bc9a32a318b94(arg0, arg1) {
    getObject(arg0).unclippedDepth = arg1 !== 0;
};

export function __wbg_set_usage_9c6ccd6bcc15f735(arg0, arg1) {
    getObject(arg0).usage = arg1 >>> 0;
};

export function __wbg_set_usage_b84e5d16af27594a(arg0, arg1) {
    getObject(arg0).usage = arg1 >>> 0;
};

export function __wbg_set_vertex_9c9752039687305f(arg0, arg1) {
    getObject(arg0).vertex = getObject(arg1);
};

export function __wbg_set_view_5aa6ed9f881b63f2(arg0, arg1) {
    getObject(arg0).view = getObject(arg1);
};

export function __wbg_set_view_820375e4a740874f(arg0, arg1) {
    getObject(arg0).view = getObject(arg1);
};

export function __wbg_set_view_formats_6533614c7017475e(arg0, arg1) {
    getObject(arg0).viewFormats = getObject(arg1);
};

export function __wbg_set_width_0a22c810f06a5152(arg0, arg1) {
    getObject(arg0).width = arg1 >>> 0;
};

export function __wbg_set_width_7ff7a22c6e9f423e(arg0, arg1) {
    getObject(arg0).width = arg1 >>> 0;
};

export function __wbg_set_write_mask_122c167c45bb2d8e(arg0, arg1) {
    getObject(arg0).writeMask = arg1 >>> 0;
};

export function __wbg_shaderSource_8a7a30baeaf655d5(arg0, arg1, arg2, arg3) {
    getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm0(arg2, arg3));
};

export function __wbg_shaderSource_aea71cfa376fc985(arg0, arg1, arg2, arg3) {
    getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm0(arg2, arg3));
};

export function __wbg_shiftKey_a6df227a917d203b(arg0) {
    const ret = getObject(arg0).shiftKey;
    return ret;
};

export function __wbg_shiftKey_d2640abcfa98acec(arg0) {
    const ret = getObject(arg0).shiftKey;
    return ret;
};

export function __wbg_signal_3c14fbdc89694b39(arg0) {
    const ret = getObject(arg0).signal;
    return addHeapObject(ret);
};

export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_start_dd05b3be5674e9f3(arg0) {
    getObject(arg0).start();
};

export function __wbg_static_accessor_GLOBAL_769e6b65d6557335() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_static_accessor_GLOBAL_THIS_60cf02db4de8e1c1() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_static_accessor_SELF_08f5a74c69739274() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_static_accessor_WINDOW_a8924b26aa92d024() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_stencilFuncSeparate_8837ff1279f2bcd8(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
};

export function __wbg_stencilFuncSeparate_b6b919cb79b36c7f(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
};

export function __wbg_stencilMaskSeparate_8780b512ad994312(arg0, arg1, arg2) {
    getObject(arg0).stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_stencilMaskSeparate_fdaf7687ee443945(arg0, arg1, arg2) {
    getObject(arg0).stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_stencilMask_729d1b04c4560c92(arg0, arg1) {
    getObject(arg0).stencilMask(arg1 >>> 0);
};

export function __wbg_stencilMask_8763a80561b98dde(arg0, arg1) {
    getObject(arg0).stencilMask(arg1 >>> 0);
};

export function __wbg_stencilOpSeparate_126147c7d73a0e8e(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};

export function __wbg_stencilOpSeparate_d1770154b137259f(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
};

export function __wbg_style_521a717da50e53c6(arg0) {
    const ret = getObject(arg0).style;
    return addHeapObject(ret);
};

export function __wbg_submit_3ecd36be9abeba75(arg0, arg1) {
    getObject(arg0).submit(getObject(arg1));
};

export function __wbg_texImage2D_9626e500f8562784() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, getObject(arg9));
}, arguments) };

export function __wbg_texImage2D_d2480404caf2a35b() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, getObject(arg9));
}, arguments) };

export function __wbg_texImage2D_d37b35cd7e971b0d() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texImage3D_0c45150b4a96b45e() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    getObject(arg0).texImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8 >>> 0, arg9 >>> 0, getObject(arg10));
}, arguments) };

export function __wbg_texImage3D_0c9cf74f3c3c59fe() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    getObject(arg0).texImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8 >>> 0, arg9 >>> 0, arg10);
}, arguments) };

export function __wbg_texParameteri_035e104616b395e0(arg0, arg1, arg2, arg3) {
    getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
};

export function __wbg_texParameteri_3a52bfd2ef280632(arg0, arg1, arg2, arg3) {
    getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
};

export function __wbg_texStorage2D_21e779f76539549d(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).texStorage2D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};

export function __wbg_texStorage3D_0b08c3a68b3d128e(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).texStorage3D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5, arg6);
};

export function __wbg_texSubImage2D_1f2ed8e2272ea41a() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, getObject(arg9));
}, arguments) };

export function __wbg_texSubImage2D_38b182399f10128e() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, getObject(arg9));
}, arguments) };

export function __wbg_texSubImage2D_65b65c3b76d83400() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, getObject(arg9));
}, arguments) };

export function __wbg_texSubImage2D_6b92ceb1553771fc() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, getObject(arg9));
}, arguments) };

export function __wbg_texSubImage2D_7b89a7441b2a9257() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, getObject(arg9));
}, arguments) };

export function __wbg_texSubImage2D_b3a850c16797a6b2() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, getObject(arg9));
}, arguments) };

export function __wbg_texSubImage2D_dc6a2bd41673ac84() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_dc95b375d770251c() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, getObject(arg9));
}, arguments) };

export function __wbg_texSubImage3D_60e409379482084f() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    getObject(arg0).texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_texSubImage3D_78f029ad7e55ca39() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    getObject(arg0).texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, getObject(arg11));
}, arguments) };

export function __wbg_texSubImage3D_9f46bb4a0a79d9e3() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    getObject(arg0).texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, getObject(arg11));
}, arguments) };

export function __wbg_texSubImage3D_a86271ca5befc16d() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    getObject(arg0).texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, getObject(arg11));
}, arguments) };

export function __wbg_texSubImage3D_af2ddc81a17c35ce() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    getObject(arg0).texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, getObject(arg11));
}, arguments) };

export function __wbg_texSubImage3D_da65e56061783a1b() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    getObject(arg0).texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, getObject(arg11));
}, arguments) };

export function __wbg_texSubImage3D_e878e89d319561b4() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    getObject(arg0).texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, getObject(arg11));
}, arguments) };

export function __wbg_then_429f7caf1026411d(arg0, arg1, arg2) {
    const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export function __wbg_then_4f95312d68691235(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_uniform1f_058417475b9966c8(arg0, arg1, arg2) {
    getObject(arg0).uniform1f(getObject(arg1), arg2);
};

export function __wbg_uniform1f_b47da9590d2c2cf1(arg0, arg1, arg2) {
    getObject(arg0).uniform1f(getObject(arg1), arg2);
};

export function __wbg_uniform1i_85131b7388bc8e3f(arg0, arg1, arg2) {
    getObject(arg0).uniform1i(getObject(arg1), arg2);
};

export function __wbg_uniform1i_e48736e68cd30ed1(arg0, arg1, arg2) {
    getObject(arg0).uniform1i(getObject(arg1), arg2);
};

export function __wbg_uniform1ui_03b9da58a76f91cf(arg0, arg1, arg2) {
    getObject(arg0).uniform1ui(getObject(arg1), arg2 >>> 0);
};

export function __wbg_uniform2fv_708680e0e9752754(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform2fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
};

export function __wbg_uniform2fv_908e28848891e2bf(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform2fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
};

export function __wbg_uniform2iv_3f71696540a8b2ea(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform2iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3));
};

export function __wbg_uniform2iv_a0cc429953135311(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform2iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3));
};

export function __wbg_uniform2uiv_8b142338906d7ff5(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform2uiv(getObject(arg1), getArrayU32FromWasm0(arg2, arg3));
};

export function __wbg_uniform3fv_aa655890f3512e6b(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform3fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
};

export function __wbg_uniform3fv_e58ff84eca16cad5(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform3fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
};

export function __wbg_uniform3iv_624ea88531cdde63(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform3iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3));
};

export function __wbg_uniform3iv_afc54662b2809357(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform3iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3));
};

export function __wbg_uniform3uiv_ff68240586289823(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform3uiv(getObject(arg1), getArrayU32FromWasm0(arg2, arg3));
};

export function __wbg_uniform4f_1e4aad4d202f9f6c(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).uniform4f(getObject(arg1), arg2, arg3, arg4, arg5);
};

export function __wbg_uniform4f_f0ae29c4c1eb79e0(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).uniform4f(getObject(arg1), arg2, arg3, arg4, arg5);
};

export function __wbg_uniform4fv_2521ae2ffe6e215c(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform4fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
};

export function __wbg_uniform4fv_9913dec8e48633d9(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform4fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
};

export function __wbg_uniform4iv_6d0331d24af48aea(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform4iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3));
};

export function __wbg_uniform4iv_9e38dad2e14636c0(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform4iv(getObject(arg1), getArrayI32FromWasm0(arg2, arg3));
};

export function __wbg_uniform4uiv_766efbfa63685f92(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniform4uiv(getObject(arg1), getArrayU32FromWasm0(arg2, arg3));
};

export function __wbg_uniformBlockBinding_83eb9ed3f1189da9(arg0, arg1, arg2, arg3) {
    getObject(arg0).uniformBlockBinding(getObject(arg1), arg2 >>> 0, arg3 >>> 0);
};

export function __wbg_uniformMatrix2fv_13787967d812a489(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix2fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix2fv_90702a9a8694e69b(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix2fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix2x3fv_f0dad33c79231b14(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix2x3fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix2x4fv_c11cac98bdf0e214(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix2x4fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix3fv_3b2ed3a816d45543(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix3fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix3fv_eb9d7317ce9cb6b5(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix3fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix3x2fv_11d50f0b78d73578(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix3x2fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix3x4fv_a78caffb62d235c9(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix3x4fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix4fv_54fea58f845bbc0e(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix4fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix4fv_62e9aaf2b4268690(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix4fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix4x2fv_692f10b2150c1ef9(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix4x2fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_uniformMatrix4x3fv_45f7b122755e52e6(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).uniformMatrix4x3fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
};

export function __wbg_unobserve_0d3c5074b9205239(arg0, arg1) {
    getObject(arg0).unobserve(getObject(arg1));
};

export function __wbg_useProgram_142dd02d095f80f1(arg0, arg1) {
    getObject(arg0).useProgram(getObject(arg1));
};

export function __wbg_useProgram_4632a62f19deea67(arg0, arg1) {
    getObject(arg0).useProgram(getObject(arg1));
};

export function __wbg_userAgentData_f7b0e61c05c54315(arg0) {
    const ret = getObject(arg0).userAgentData;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_userAgent_e18bc0cc9ad38ec1() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg1).userAgent;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_vertexAttribDivisorANGLE_0797a329758e2a28(arg0, arg1, arg2) {
    getObject(arg0).vertexAttribDivisorANGLE(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_vertexAttribDivisor_4f37e0f7c1197d16(arg0, arg1, arg2) {
    getObject(arg0).vertexAttribDivisor(arg1 >>> 0, arg2 >>> 0);
};

export function __wbg_vertexAttribIPointer_87d7fcce484093c9(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).vertexAttribIPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
};

export function __wbg_vertexAttribPointer_5c516f4c675103bf(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
};

export function __wbg_vertexAttribPointer_880223685613a791(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
};

export function __wbg_viewport_1b0f7b63c424b52f(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).viewport(arg1, arg2, arg3, arg4);
};

export function __wbg_viewport_ceaa5c1a061b76df(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).viewport(arg1, arg2, arg3, arg4);
};

export function __wbg_visibilityState_2f27cbaac764b521(arg0) {
    const ret = getObject(arg0).visibilityState;
    return (__wbindgen_enum_VisibilityState.indexOf(ret) + 1 || 3) - 1;
};

export function __wbg_warn_6e567d0d926ff881(arg0) {
    console.warn(getObject(arg0));
};

export function __wbg_webkitFullscreenElement_a9ca38b7214d1567(arg0) {
    const ret = getObject(arg0).webkitFullscreenElement;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_webkitRequestFullscreen_23664c63833ff0e5(arg0) {
    getObject(arg0).webkitRequestFullscreen();
};

export function __wbg_width_30d712cfe70e4fae(arg0) {
    const ret = getObject(arg0).width;
    return ret;
};

export function __wbindgen_cast_2241b6af4c4b2941(arg0, arg1) {
    // Cast intrinsic for `Ref(String) -> Externref`.
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_cast_4e3b14ce547675e8(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 3042, function: Function { arguments: [NamedExternref("PointerEvent")], shim_idx: 3043, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_6732, __wasm_bindgen_func_elem_7043);
    return addHeapObject(ret);
};

export function __wbindgen_cast_75ca202fc509ccd3(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 3042, function: Function { arguments: [NamedExternref("WheelEvent")], shim_idx: 3043, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_6732, __wasm_bindgen_func_elem_7043);
    return addHeapObject(ret);
};

export function __wbindgen_cast_76e5cfa2f0750fc7(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 3042, function: Function { arguments: [NamedExternref("PageTransitionEvent")], shim_idx: 3043, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_6732, __wasm_bindgen_func_elem_7043);
    return addHeapObject(ret);
};

export function __wbindgen_cast_7c316abdc43840a3(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(U32)) -> NamedExternref("Uint32Array")`.
    const ret = getArrayU32FromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_cast_923da89d565b06e0(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 3042, function: Function { arguments: [], shim_idx: 3051, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_6732, __wasm_bindgen_func_elem_7051);
    return addHeapObject(ret);
};

export function __wbindgen_cast_9575fb55a66c262b(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(I32)) -> NamedExternref("Int32Array")`.
    const ret = getArrayI32FromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_cast_9b60277cfb53acfb(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 3042, function: Function { arguments: [NamedExternref("KeyboardEvent")], shim_idx: 3043, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_6732, __wasm_bindgen_func_elem_7043);
    return addHeapObject(ret);
};

export function __wbindgen_cast_a95614b2b549e3ec(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 3042, function: Function { arguments: [NamedExternref("Event")], shim_idx: 3043, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_6732, __wasm_bindgen_func_elem_7043);
    return addHeapObject(ret);
};

export function __wbindgen_cast_b055a16e24ea80e6(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 3042, function: Function { arguments: [NamedExternref("Array<any>")], shim_idx: 3043, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_6732, __wasm_bindgen_func_elem_7043);
    return addHeapObject(ret);
};

export function __wbindgen_cast_b25cf10750b5b865(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 3042, function: Function { arguments: [NamedExternref("FocusEvent")], shim_idx: 3043, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_6732, __wasm_bindgen_func_elem_7043);
    return addHeapObject(ret);
};

export function __wbindgen_cast_bbb4883c6389f1de(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(U16)) -> NamedExternref("Uint16Array")`.
    const ret = getArrayU16FromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_cast_cb9088102bce6b30(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
    const ret = getArrayU8FromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_cast_cd07b1914aa3d62c(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(F32)) -> NamedExternref("Float32Array")`.
    const ret = getArrayF32FromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_cast_d6cd19b81560fd6e(arg0) {
    // Cast intrinsic for `F64 -> Externref`.
    const ret = arg0;
    return addHeapObject(ret);
};

export function __wbindgen_cast_e47ceb6027f5c92c(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(I16)) -> NamedExternref("Int16Array")`.
    const ret = getArrayI16FromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_cast_f1c1afee263832b5(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 3042, function: Function { arguments: [NamedExternref("Array<any>"), NamedExternref("ResizeObserver")], shim_idx: 3046, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_6732, __wasm_bindgen_func_elem_7046);
    return addHeapObject(ret);
};

export function __wbindgen_cast_f20a41ce5cb757e1(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 3091, function: Function { arguments: [Externref], shim_idx: 3092, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_8675, __wasm_bindgen_func_elem_8676);
    return addHeapObject(ret);
};

export function __wbindgen_cast_feefb5fadd6457fd(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(I8)) -> NamedExternref("Int8Array")`.
    const ret = getArrayI8FromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};
