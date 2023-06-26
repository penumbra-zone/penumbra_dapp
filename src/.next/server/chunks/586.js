"use strict";
exports.id = 586;
exports.ids = [586];
exports.modules = {

/***/ 512:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
exports.iE = __webpack_unused_export__ = void 0;
const ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const ALPHABET_MAP = {};
for (let z = 0; z < ALPHABET.length; z++) {
    const x = ALPHABET.charAt(z);
    ALPHABET_MAP[x] = z;
}
function polymodStep(pre) {
    const b = pre >> 25;
    return (((pre & 0x1ffffff) << 5) ^
        (-((b >> 0) & 1) & 0x3b6a57b2) ^
        (-((b >> 1) & 1) & 0x26508e6d) ^
        (-((b >> 2) & 1) & 0x1ea119fa) ^
        (-((b >> 3) & 1) & 0x3d4233dd) ^
        (-((b >> 4) & 1) & 0x2a1462b3));
}
function prefixChk(prefix) {
    let chk = 1;
    for (let i = 0; i < prefix.length; ++i) {
        const c = prefix.charCodeAt(i);
        if (c < 33 || c > 126)
            return 'Invalid prefix (' + prefix + ')';
        chk = polymodStep(chk) ^ (c >> 5);
    }
    chk = polymodStep(chk);
    for (let i = 0; i < prefix.length; ++i) {
        const v = prefix.charCodeAt(i);
        chk = polymodStep(chk) ^ (v & 0x1f);
    }
    return chk;
}
function convert(data, inBits, outBits, pad) {
    let value = 0;
    let bits = 0;
    const maxV = (1 << outBits) - 1;
    const result = [];
    for (let i = 0; i < data.length; ++i) {
        value = (value << inBits) | data[i];
        bits += inBits;
        while (bits >= outBits) {
            bits -= outBits;
            result.push((value >> bits) & maxV);
        }
    }
    if (pad) {
        if (bits > 0) {
            result.push((value << (outBits - bits)) & maxV);
        }
    }
    else {
        if (bits >= inBits)
            return 'Excess padding';
        if ((value << (outBits - bits)) & maxV)
            return 'Non-zero padding';
    }
    return result;
}
function toWords(bytes) {
    return convert(bytes, 8, 5, true);
}
function fromWordsUnsafe(words) {
    const res = convert(words, 5, 8, false);
    if (Array.isArray(res))
        return res;
}
function fromWords(words) {
    const res = convert(words, 5, 8, false);
    if (Array.isArray(res))
        return res;
    throw new Error(res);
}
function getLibraryFromEncoding(encoding) {
    let ENCODING_CONST;
    if (encoding === 'bech32') {
        ENCODING_CONST = 1;
    }
    else {
        ENCODING_CONST = 0x2bc830a3;
    }
    function encode(prefix, words, LIMIT) {
        LIMIT = LIMIT || 90;
        if (prefix.length + 7 + words.length > LIMIT)
            throw new TypeError('Exceeds length limit');
        prefix = prefix.toLowerCase();
        // determine chk mod
        let chk = prefixChk(prefix);
        if (typeof chk === 'string')
            throw new Error(chk);
        let result = prefix + '1';
        for (let i = 0; i < words.length; ++i) {
            const x = words[i];
            if (x >> 5 !== 0)
                throw new Error('Non 5-bit word');
            chk = polymodStep(chk) ^ x;
            result += ALPHABET.charAt(x);
        }
        for (let i = 0; i < 6; ++i) {
            chk = polymodStep(chk);
        }
        chk ^= ENCODING_CONST;
        for (let i = 0; i < 6; ++i) {
            const v = (chk >> ((5 - i) * 5)) & 0x1f;
            result += ALPHABET.charAt(v);
        }
        return result;
    }
    function __decode(str, LIMIT) {
        LIMIT = LIMIT || 90;
        if (str.length < 8)
            return str + ' too short';
        if (str.length > LIMIT)
            return 'Exceeds length limit';
        // don't allow mixed case
        const lowered = str.toLowerCase();
        const uppered = str.toUpperCase();
        if (str !== lowered && str !== uppered)
            return 'Mixed-case string ' + str;
        str = lowered;
        const split = str.lastIndexOf('1');
        if (split === -1)
            return 'No separator character for ' + str;
        if (split === 0)
            return 'Missing prefix for ' + str;
        const prefix = str.slice(0, split);
        const wordChars = str.slice(split + 1);
        if (wordChars.length < 6)
            return 'Data too short';
        let chk = prefixChk(prefix);
        if (typeof chk === 'string')
            return chk;
        const words = [];
        for (let i = 0; i < wordChars.length; ++i) {
            const c = wordChars.charAt(i);
            const v = ALPHABET_MAP[c];
            if (v === undefined)
                return 'Unknown character ' + c;
            chk = polymodStep(chk) ^ v;
            // not in the checksum?
            if (i + 6 >= wordChars.length)
                continue;
            words.push(v);
        }
        if (chk !== ENCODING_CONST)
            return 'Invalid checksum for ' + str;
        return { prefix, words };
    }
    function decodeUnsafe(str, LIMIT) {
        const res = __decode(str, LIMIT);
        if (typeof res === 'object')
            return res;
    }
    function decode(str, LIMIT) {
        const res = __decode(str, LIMIT);
        if (typeof res === 'object')
            return res;
        throw new Error(res);
    }
    return {
        decodeUnsafe,
        decode,
        encode,
        toWords,
        fromWordsUnsafe,
        fromWords,
    };
}
__webpack_unused_export__ = getLibraryFromEncoding('bech32');
exports.iE = getLibraryFromEncoding('bech32m');


/***/ }),

/***/ 5861:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   U: () => (/* binding */ ViewProtocolService)
/* harmony export */ });
/* unused harmony export ViewAuthService */
/* harmony import */ var _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7536);
/* harmony import */ var _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3421);
// @generated by protoc-gen-connect-es v0.10.1
// @generated from file penumbra/view/v1alpha1/view.proto (package penumbra.view.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck




/**
 * The view protocol is used by a view client, who wants to do some
 * transaction-related actions, to request data from a view service, which is
 * responsible for synchronizing and scanning the public chain state with one or
 * more full viewing keys.
 *
 * View protocol requests optionally include the account group ID, used to
 * identify which set of data to query.
 *
 * @generated from service penumbra.view.v1alpha1.ViewProtocolService
 */
const ViewProtocolService = {
  typeName: "penumbra.view.v1alpha1.ViewProtocolService",
  methods: {
    /**
     * Get current status of chain sync
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.Status
     */
    status: {
      name: "Status",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .StatusRequest */ .pC,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .StatusResponse */ .UX,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Stream sync status updates until the view service has caught up with the core.chain.v1alpha1.
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.StatusStream
     */
    statusStream: {
      name: "StatusStream",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .StatusStreamRequest */ .t_,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .StatusStreamResponse */ .D$,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.ServerStreaming,
    },
    /**
     * Queries for notes that have been accepted by the core.chain.v1alpha1.
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.Notes
     */
    notes: {
      name: "Notes",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .NotesRequest */ .L0,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .NotesResponse */ .$L,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.ServerStreaming,
    },
    /**
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.NotesForVoting
     */
    notesForVoting: {
      name: "NotesForVoting",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .NotesForVotingRequest */ .fV,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .NotesForVotingResponse */ .im,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.ServerStreaming,
    },
    /**
     * Returns authentication paths for the given note commitments.
     *
     * This method takes a batch of input commitments, rather than just one, so
     * that the client can get a consistent set of authentication paths to a
     * common root.  (Otherwise, if a client made multiple requests, the wallet
     * service could have advanced the state commitment tree state between queries).
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.Witness
     */
    witness: {
      name: "Witness",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .WitnessRequest */ .i9,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .WitnessResponse */ .T8,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.WitnessAndBuild
     */
    witnessAndBuild: {
      name: "WitnessAndBuild",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .WitnessAndBuildRequest */ .sT,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .WitnessAndBuildResponse */ .xl,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Queries for assets.
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.Assets
     */
    assets: {
      name: "Assets",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .AssetsRequest */ .MA,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .AssetsResponse */ .fU,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.ServerStreaming,
    },
    /**
     * Query for the current chain parameters.
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.ChainParameters
     */
    chainParameters: {
      name: "ChainParameters",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .ChainParametersRequest */ .Wr,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .ChainParametersResponse */ .g8,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Query for the current FMD parameters.
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.FMDParameters
     */
    fMDParameters: {
      name: "FMDParameters",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .FMDParametersRequest */ .g2,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .FMDParametersResponse */ .tN,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Query for an address given an address index
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.AddressByIndex
     */
    addressByIndex: {
      name: "AddressByIndex",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .AddressByIndexRequest */ .Vh,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .AddressByIndexResponse */ .jF,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Query for an address given an address index
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.IndexByAddress
     */
    indexByAddress: {
      name: "IndexByAddress",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .IndexByAddressRequest */ .oA,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .IndexByAddressResponse */ .L7,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Query for an ephemeral address
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.EphemeralAddress
     */
    ephemeralAddress: {
      name: "EphemeralAddress",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .EphemeralAddressRequest */ .D8,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .EphemeralAddressResponse */ .zb,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Query for balance of a given address
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.BalanceByAddress
     */
    balanceByAddress: {
      name: "BalanceByAddress",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .BalanceByAddressRequest */ .GP,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .BalanceByAddressResponse */ .PC,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.ServerStreaming,
    },
    /**
     * Query for a note by its note commitment, optionally waiting until the note is detected.
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.NoteByCommitment
     */
    noteByCommitment: {
      name: "NoteByCommitment",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .NoteByCommitmentRequest */ .JX,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .NoteByCommitmentResponse */ .K_,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Query for a swap by its swap commitment, optionally waiting until the swap is detected.
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.SwapByCommitment
     */
    swapByCommitment: {
      name: "SwapByCommitment",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .SwapByCommitmentRequest */ .UM,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .SwapByCommitmentResponse */ .u0,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Query for whether a nullifier has been spent, optionally waiting until it is spent.
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.NullifierStatus
     */
    nullifierStatus: {
      name: "NullifierStatus",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .NullifierStatusRequest */ .I,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .NullifierStatusResponse */ .KC,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Query for a given transaction by its hash.
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.TransactionInfoByHash
     */
    transactionInfoByHash: {
      name: "TransactionInfoByHash",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .TransactionInfoByHashRequest */ .sr,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .TransactionInfoByHashResponse */ .gW,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Query for the full transactions in the given range of blocks.
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.TransactionInfo
     */
    transactionInfo: {
      name: "TransactionInfo",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .TransactionInfoRequest */ .r,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .TransactionInfoResponse */ .II,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.ServerStreaming,
    },
    /**
     * Query for a transaction plan
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.TransactionPlanner
     */
    transactionPlanner: {
      name: "TransactionPlanner",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .TransactionPlannerRequest */ .vX,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .TransactionPlannerResponse */ .lu,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Broadcast a transaction to the network, optionally waiting for full confirmation.
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.BroadcastTransaction
     */
    broadcastTransaction: {
      name: "BroadcastTransaction",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .BroadcastTransactionRequest */ .gI,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .BroadcastTransactionResponse */ .AC,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
    /**
     * Query for owned position IDs for the given trading pair and in the given position state.
     *
     * @generated from rpc penumbra.view.v1alpha1.ViewProtocolService.OwnedPositionIds
     */
    ownedPositionIds: {
      name: "OwnedPositionIds",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .OwnedPositionIdsRequest */ .po,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .OwnedPositionIdsResponse */ .AH,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
  }
};

/**
 * @generated from service penumbra.view.v1alpha1.ViewAuthService
 */
const ViewAuthService = {
  typeName: "penumbra.view.v1alpha1.ViewAuthService",
  methods: {
    /**
     * @generated from rpc penumbra.view.v1alpha1.ViewAuthService.ViewAuth
     */
    viewAuth: {
      name: "ViewAuth",
      I: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .ViewAuthRequest */ .y2,
      O: _buf_penumbra_zone_penumbra_bufbuild_es_penumbra_view_v1alpha1_view_pb_js__WEBPACK_IMPORTED_MODULE_0__/* .ViewAuthResponse */ .zR,
      kind: _bufbuild_protobuf__WEBPACK_IMPORTED_MODULE_1__/* .MethodKind */ .t.Unary,
    },
  }
};



/***/ }),

/***/ 7536:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Vh: () => (/* binding */ AddressByIndexRequest),
  jF: () => (/* binding */ AddressByIndexResponse),
  MA: () => (/* binding */ AssetsRequest),
  fU: () => (/* binding */ AssetsResponse),
  GP: () => (/* binding */ BalanceByAddressRequest),
  PC: () => (/* binding */ BalanceByAddressResponse),
  gI: () => (/* binding */ BroadcastTransactionRequest),
  AC: () => (/* binding */ BroadcastTransactionResponse),
  Wr: () => (/* binding */ ChainParametersRequest),
  g8: () => (/* binding */ ChainParametersResponse),
  D8: () => (/* binding */ EphemeralAddressRequest),
  zb: () => (/* binding */ EphemeralAddressResponse),
  g2: () => (/* binding */ FMDParametersRequest),
  tN: () => (/* binding */ FMDParametersResponse),
  oA: () => (/* binding */ IndexByAddressRequest),
  L7: () => (/* binding */ IndexByAddressResponse),
  JX: () => (/* binding */ NoteByCommitmentRequest),
  K_: () => (/* binding */ NoteByCommitmentResponse),
  fV: () => (/* binding */ NotesForVotingRequest),
  im: () => (/* binding */ NotesForVotingResponse),
  L0: () => (/* binding */ NotesRequest),
  $L: () => (/* binding */ NotesResponse),
  I: () => (/* binding */ NullifierStatusRequest),
  KC: () => (/* binding */ NullifierStatusResponse),
  po: () => (/* binding */ OwnedPositionIdsRequest),
  AH: () => (/* binding */ OwnedPositionIdsResponse),
  pC: () => (/* binding */ StatusRequest),
  UX: () => (/* binding */ StatusResponse),
  t_: () => (/* binding */ StatusStreamRequest),
  D$: () => (/* binding */ StatusStreamResponse),
  UM: () => (/* binding */ SwapByCommitmentRequest),
  u0: () => (/* binding */ SwapByCommitmentResponse),
  sr: () => (/* binding */ TransactionInfoByHashRequest),
  gW: () => (/* binding */ TransactionInfoByHashResponse),
  r: () => (/* binding */ TransactionInfoRequest),
  II: () => (/* binding */ TransactionInfoResponse),
  vX: () => (/* binding */ TransactionPlannerRequest),
  lu: () => (/* binding */ TransactionPlannerResponse),
  y2: () => (/* binding */ ViewAuthRequest),
  zR: () => (/* binding */ ViewAuthResponse),
  sT: () => (/* binding */ WitnessAndBuildRequest),
  xl: () => (/* binding */ WitnessAndBuildResponse),
  i9: () => (/* binding */ WitnessRequest),
  T8: () => (/* binding */ WitnessResponse)
});

// UNUSED EXPORTS: SpendableNoteRecord, SwapRecord, TransactionInfo, TransactionPlannerRequest_Delegate, TransactionPlannerRequest_Output, TransactionPlannerRequest_Swap, TransactionPlannerRequest_Undelegate, ViewAuthToken

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/assert.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * Assert that condition is truthy or throw error (with message)
 */
function assert(condition, msg) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- we want the implicit conversion to boolean
    if (!condition) {
        throw new Error(msg);
    }
}
const FLOAT32_MAX = 3.4028234663852886e38, FLOAT32_MIN = -3.4028234663852886e38, UINT32_MAX = 0xffffffff, INT32_MAX = 0x7fffffff, INT32_MIN = -0x80000000;
/**
 * Assert a valid signed protobuf 32-bit integer.
 */
function assertInt32(arg) {
    if (typeof arg !== "number")
        throw new Error("invalid int 32: " + typeof arg);
    if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN)
        throw new Error("invalid int 32: " + arg); // eslint-disable-line @typescript-eslint/restrict-plus-operands -- we want the implicit conversion to string
}
/**
 * Assert a valid unsigned protobuf 32-bit integer.
 */
function assertUInt32(arg) {
    if (typeof arg !== "number")
        throw new Error("invalid uint 32: " + typeof arg);
    if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0)
        throw new Error("invalid uint 32: " + arg); // eslint-disable-line @typescript-eslint/restrict-plus-operands -- we want the implicit conversion to string
}
/**
 * Assert a valid protobuf float value.
 */
function assertFloat32(arg) {
    if (typeof arg !== "number")
        throw new Error("invalid float 32: " + typeof arg);
    if (!Number.isFinite(arg))
        return;
    if (arg > FLOAT32_MAX || arg < FLOAT32_MIN)
        throw new Error("invalid float 32: " + arg); // eslint-disable-line @typescript-eslint/restrict-plus-operands -- we want the implicit conversion to string
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/enum.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const enumTypeSymbol = Symbol("@bufbuild/protobuf/enum-type");
/**
 * Get reflection information from a generated enum.
 * If this function is called on something other than a generated
 * enum, it raises an error.
 */
function getEnumType(enumObject) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any
    const t = enumObject[enumTypeSymbol];
    assert(t, "missing enum type on enum object");
    return t; // eslint-disable-line @typescript-eslint/no-unsafe-return
}
/**
 * Sets reflection information on a generated enum.
 */
function setEnumType(enumObject, typeName, values, opt) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    enumObject[enumTypeSymbol] = makeEnumType(typeName, values.map((v) => ({
        no: v.no,
        name: v.name,
        localName: enumObject[v.no],
    })), opt);
}
/**
 * Create a new EnumType with the given values.
 */
function makeEnumType(typeName, values, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_opt) {
    const names = Object.create(null);
    const numbers = Object.create(null);
    const normalValues = [];
    for (const value of values) {
        // We do not surface options at this time
        // const value: EnumValueInfo = {...v, options: v.options ?? emptyReadonlyObject};
        const n = normalizeEnumValue(value);
        normalValues.push(n);
        names[value.name] = n;
        numbers[value.no] = n;
    }
    return {
        typeName,
        values: normalValues,
        // We do not surface options at this time
        // options: opt?.options ?? Object.create(null),
        findName(name) {
            return names[name];
        },
        findNumber(no) {
            return numbers[no];
        },
    };
}
/**
 * Create a new enum object with the given values.
 * Sets reflection information.
 */
function makeEnum(typeName, values, opt) {
    const enumObject = {};
    for (const value of values) {
        const n = normalizeEnumValue(value);
        enumObject[n.localName] = n.no;
        enumObject[n.no] = n.localName;
    }
    setEnumType(enumObject, typeName, values, opt);
    return enumObject;
}
function normalizeEnumValue(value) {
    if ("localName" in value) {
        return value;
    }
    return Object.assign(Object.assign({}, value), { localName: value.name });
}

// EXTERNAL MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/message.js
var esm_message = __webpack_require__(7451);
;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/message-type.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Create a new message type using the given runtime.
 */
function makeMessageType(runtime, typeName, fields, opt) {
    var _a;
    const localName = (_a = opt === null || opt === void 0 ? void 0 : opt.localName) !== null && _a !== void 0 ? _a : typeName.substring(typeName.lastIndexOf(".") + 1);
    const type = {
        [localName]: function (data) {
            runtime.util.initFields(this);
            runtime.util.initPartial(data, this);
        },
    }[localName];
    Object.setPrototypeOf(type.prototype, new esm_message/* Message */.v());
    Object.assign(type, {
        runtime,
        typeName,
        fields: runtime.util.newFieldList(fields),
        fromBinary(bytes, options) {
            return new type().fromBinary(bytes, options);
        },
        fromJson(jsonValue, options) {
            return new type().fromJson(jsonValue, options);
        },
        fromJsonString(jsonString, options) {
            return new type().fromJsonString(jsonString, options);
        },
        equals(a, b) {
            return runtime.util.equals(type, a, b);
        },
    });
    return type;
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/proto-runtime.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


function makeProtoRuntime(syntax, json, bin, util) {
    return {
        syntax,
        json,
        bin,
        util,
        makeMessageType(typeName, fields, opt) {
            return makeMessageType(this, typeName, fields, opt);
        },
        makeEnum: makeEnum,
        makeEnumType: makeEnumType,
        getEnumType: getEnumType,
    };
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/field.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * Scalar value types. This is a subset of field types declared by protobuf
 * enum google.protobuf.FieldDescriptorProto.Type The types GROUP and MESSAGE
 * are omitted, but the numerical values are identical.
 */
var ScalarType;
(function (ScalarType) {
    // 0 is reserved for errors.
    // Order is weird for historical reasons.
    ScalarType[ScalarType["DOUBLE"] = 1] = "DOUBLE";
    ScalarType[ScalarType["FLOAT"] = 2] = "FLOAT";
    // Not ZigZag encoded.  Negative numbers take 10 bytes.  Use TYPE_SINT64 if
    // negative values are likely.
    ScalarType[ScalarType["INT64"] = 3] = "INT64";
    ScalarType[ScalarType["UINT64"] = 4] = "UINT64";
    // Not ZigZag encoded.  Negative numbers take 10 bytes.  Use TYPE_SINT32 if
    // negative values are likely.
    ScalarType[ScalarType["INT32"] = 5] = "INT32";
    ScalarType[ScalarType["FIXED64"] = 6] = "FIXED64";
    ScalarType[ScalarType["FIXED32"] = 7] = "FIXED32";
    ScalarType[ScalarType["BOOL"] = 8] = "BOOL";
    ScalarType[ScalarType["STRING"] = 9] = "STRING";
    // Tag-delimited aggregate.
    // Group type is deprecated and not supported in proto3. However, Proto3
    // implementations should still be able to parse the group wire format and
    // treat group fields as unknown fields.
    // TYPE_GROUP = 10,
    // TYPE_MESSAGE = 11,  // Length-delimited aggregate.
    // New in version 2.
    ScalarType[ScalarType["BYTES"] = 12] = "BYTES";
    ScalarType[ScalarType["UINT32"] = 13] = "UINT32";
    // TYPE_ENUM = 14,
    ScalarType[ScalarType["SFIXED32"] = 15] = "SFIXED32";
    ScalarType[ScalarType["SFIXED64"] = 16] = "SFIXED64";
    ScalarType[ScalarType["SINT32"] = 17] = "SINT32";
    ScalarType[ScalarType["SINT64"] = 18] = "SINT64";
})(ScalarType || (ScalarType = {}));

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/google/varint.js
// Copyright 2008 Google Inc.  All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
// * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// Code generated by the Protocol Buffer compiler is owned by the owner
// of the input file used when generating it.  This code is not
// standalone and requires a support library to be linked with it.  This
// support library is itself covered by the above license.
/* eslint-disable prefer-const,@typescript-eslint/restrict-plus-operands */
/**
 * Read a 64 bit varint as two JS numbers.
 *
 * Returns tuple:
 * [0]: low bits
 * [1]: high bits
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L175
 */
function varint64read() {
    let lowBits = 0;
    let highBits = 0;
    for (let shift = 0; shift < 28; shift += 7) {
        let b = this.buf[this.pos++];
        lowBits |= (b & 0x7f) << shift;
        if ((b & 0x80) == 0) {
            this.assertBounds();
            return [lowBits, highBits];
        }
    }
    let middleByte = this.buf[this.pos++];
    // last four bits of the first 32 bit number
    lowBits |= (middleByte & 0x0f) << 28;
    // 3 upper bits are part of the next 32 bit number
    highBits = (middleByte & 0x70) >> 4;
    if ((middleByte & 0x80) == 0) {
        this.assertBounds();
        return [lowBits, highBits];
    }
    for (let shift = 3; shift <= 31; shift += 7) {
        let b = this.buf[this.pos++];
        highBits |= (b & 0x7f) << shift;
        if ((b & 0x80) == 0) {
            this.assertBounds();
            return [lowBits, highBits];
        }
    }
    throw new Error("invalid varint");
}
/**
 * Write a 64 bit varint, given as two JS numbers, to the given bytes array.
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/writer.js#L344
 */
function varint64write(lo, hi, bytes) {
    for (let i = 0; i < 28; i = i + 7) {
        const shift = lo >>> i;
        const hasNext = !(shift >>> 7 == 0 && hi == 0);
        const byte = (hasNext ? shift | 0x80 : shift) & 0xff;
        bytes.push(byte);
        if (!hasNext) {
            return;
        }
    }
    const splitBits = ((lo >>> 28) & 0x0f) | ((hi & 0x07) << 4);
    const hasMoreBits = !(hi >> 3 == 0);
    bytes.push((hasMoreBits ? splitBits | 0x80 : splitBits) & 0xff);
    if (!hasMoreBits) {
        return;
    }
    for (let i = 3; i < 31; i = i + 7) {
        const shift = hi >>> i;
        const hasNext = !(shift >>> 7 == 0);
        const byte = (hasNext ? shift | 0x80 : shift) & 0xff;
        bytes.push(byte);
        if (!hasNext) {
            return;
        }
    }
    bytes.push((hi >>> 31) & 0x01);
}
// constants for binary math
const TWO_PWR_32_DBL = 0x100000000;
/**
 * Parse decimal string of 64 bit integer value as two JS numbers.
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf-javascript/blob/a428c58273abad07c66071d9753bc4d1289de426/experimental/runtime/int64.js#L10
 */
function int64FromString(dec) {
    // Check for minus sign.
    const minus = dec[0] === "-";
    if (minus) {
        dec = dec.slice(1);
    }
    // Work 6 decimal digits at a time, acting like we're converting base 1e6
    // digits to binary. This is safe to do with floating point math because
    // Number.isSafeInteger(ALL_32_BITS * 1e6) == true.
    const base = 1e6;
    let lowBits = 0;
    let highBits = 0;
    function add1e6digit(begin, end) {
        // Note: Number('') is 0.
        const digit1e6 = Number(dec.slice(begin, end));
        highBits *= base;
        lowBits = lowBits * base + digit1e6;
        // Carry bits from lowBits to
        if (lowBits >= TWO_PWR_32_DBL) {
            highBits = highBits + ((lowBits / TWO_PWR_32_DBL) | 0);
            lowBits = lowBits % TWO_PWR_32_DBL;
        }
    }
    add1e6digit(-24, -18);
    add1e6digit(-18, -12);
    add1e6digit(-12, -6);
    add1e6digit(-6);
    return minus ? negate(lowBits, highBits) : newBits(lowBits, highBits);
}
/**
 * Losslessly converts a 64-bit signed integer in 32:32 split representation
 * into a decimal string.
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf-javascript/blob/a428c58273abad07c66071d9753bc4d1289de426/experimental/runtime/int64.js#L10
 */
function int64ToString(lo, hi) {
    let bits = newBits(lo, hi);
    // If we're treating the input as a signed value and the high bit is set, do
    // a manual two's complement conversion before the decimal conversion.
    const negative = (bits.hi & 0x80000000);
    if (negative) {
        bits = negate(bits.lo, bits.hi);
    }
    const result = uInt64ToString(bits.lo, bits.hi);
    return negative ? "-" + result : result;
}
/**
 * Losslessly converts a 64-bit unsigned integer in 32:32 split representation
 * into a decimal string.
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf-javascript/blob/a428c58273abad07c66071d9753bc4d1289de426/experimental/runtime/int64.js#L10
 */
function uInt64ToString(lo, hi) {
    ({ lo, hi } = toUnsigned(lo, hi));
    // Skip the expensive conversion if the number is small enough to use the
    // built-in conversions.
    // Number.MAX_SAFE_INTEGER = 0x001FFFFF FFFFFFFF, thus any number with
    // highBits <= 0x1FFFFF can be safely expressed with a double and retain
    // integer precision.
    // Proven by: Number.isSafeInteger(0x1FFFFF * 2**32 + 0xFFFFFFFF) == true.
    if (hi <= 0x1FFFFF) {
        return String(TWO_PWR_32_DBL * hi + lo);
    }
    // What this code is doing is essentially converting the input number from
    // base-2 to base-1e7, which allows us to represent the 64-bit range with
    // only 3 (very large) digits. Those digits are then trivial to convert to
    // a base-10 string.
    // The magic numbers used here are -
    // 2^24 = 16777216 = (1,6777216) in base-1e7.
    // 2^48 = 281474976710656 = (2,8147497,6710656) in base-1e7.
    // Split 32:32 representation into 16:24:24 representation so our
    // intermediate digits don't overflow.
    const low = lo & 0xFFFFFF;
    const mid = ((lo >>> 24) | (hi << 8)) & 0xFFFFFF;
    const high = (hi >> 16) & 0xFFFF;
    // Assemble our three base-1e7 digits, ignoring carries. The maximum
    // value in a digit at this step is representable as a 48-bit integer, which
    // can be stored in a 64-bit floating point number.
    let digitA = low + (mid * 6777216) + (high * 6710656);
    let digitB = mid + (high * 8147497);
    let digitC = (high * 2);
    // Apply carries from A to B and from B to C.
    const base = 10000000;
    if (digitA >= base) {
        digitB += Math.floor(digitA / base);
        digitA %= base;
    }
    if (digitB >= base) {
        digitC += Math.floor(digitB / base);
        digitB %= base;
    }
    // If digitC is 0, then we should have returned in the trivial code path
    // at the top for non-safe integers. Given this, we can assume both digitB
    // and digitA need leading zeros.
    return digitC.toString() + decimalFrom1e7WithLeadingZeros(digitB) +
        decimalFrom1e7WithLeadingZeros(digitA);
}
function toUnsigned(lo, hi) {
    return { lo: lo >>> 0, hi: hi >>> 0 };
}
function newBits(lo, hi) {
    return { lo: lo | 0, hi: hi | 0 };
}
/**
 * Returns two's compliment negation of input.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Signed_32-bit_integers
 */
function negate(lowBits, highBits) {
    highBits = ~highBits;
    if (lowBits) {
        lowBits = ~lowBits + 1;
    }
    else {
        // If lowBits is 0, then bitwise-not is 0xFFFFFFFF,
        // adding 1 to that, results in 0x100000000, which leaves
        // the low bits 0x0 and simply adds one to the high bits.
        highBits += 1;
    }
    return newBits(lowBits, highBits);
}
/**
 * Returns decimal representation of digit1e7 with leading zeros.
 */
const decimalFrom1e7WithLeadingZeros = (digit1e7) => {
    const partial = String(digit1e7);
    return "0000000".slice(partial.length) + partial;
};
/**
 * Write a 32 bit varint, signed or unsigned. Same as `varint64write(0, value, bytes)`
 *
 * Copyright 2008 Google Inc.  All rights reserved.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/1b18833f4f2a2f681f4e4a25cdf3b0a43115ec26/js/binary/encoder.js#L144
 */
function varint32write(value, bytes) {
    if (value >= 0) {
        // write value as varint 32
        while (value > 0x7f) {
            bytes.push((value & 0x7f) | 0x80);
            value = value >>> 7;
        }
        bytes.push(value);
    }
    else {
        for (let i = 0; i < 9; i++) {
            bytes.push((value & 127) | 128);
            value = value >> 7;
        }
        bytes.push(1);
    }
}
/**
 * Read an unsigned 32 bit varint.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L220
 */
function varint32read() {
    let b = this.buf[this.pos++];
    let result = b & 0x7f;
    if ((b & 0x80) == 0) {
        this.assertBounds();
        return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 0x7f) << 7;
    if ((b & 0x80) == 0) {
        this.assertBounds();
        return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 0x7f) << 14;
    if ((b & 0x80) == 0) {
        this.assertBounds();
        return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 0x7f) << 21;
    if ((b & 0x80) == 0) {
        this.assertBounds();
        return result;
    }
    // Extract only last 4 bits
    b = this.buf[this.pos++];
    result |= (b & 0x0f) << 28;
    for (let readBytes = 5; (b & 0x80) !== 0 && readBytes < 10; readBytes++)
        b = this.buf[this.pos++];
    if ((b & 0x80) != 0)
        throw new Error("invalid varint");
    this.assertBounds();
    // Result can have 32 bits, convert it to unsigned
    return result >>> 0;
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


function makeInt64Support() {
    const dv = new DataView(new ArrayBuffer(8));
    // note that Safari 14 implements BigInt, but not the DataView methods
    const ok = globalThis.BigInt !== undefined &&
        typeof dv.getBigInt64 === "function" &&
        typeof dv.getBigUint64 === "function" &&
        typeof dv.setBigInt64 === "function" &&
        typeof dv.setBigUint64 === "function" &&
        (typeof process != "object" ||
            typeof process.env != "object" ||
            process.env.BUF_BIGINT_DISABLE !== "1");
    if (ok) {
        const MIN = BigInt("-9223372036854775808"), MAX = BigInt("9223372036854775807"), UMIN = BigInt("0"), UMAX = BigInt("18446744073709551615");
        return {
            zero: BigInt(0),
            supported: true,
            parse(value) {
                const bi = typeof value == "bigint" ? value : BigInt(value);
                if (bi > MAX || bi < MIN) {
                    throw new Error(`int64 invalid: ${value}`);
                }
                return bi;
            },
            uParse(value) {
                const bi = typeof value == "bigint" ? value : BigInt(value);
                if (bi > UMAX || bi < UMIN) {
                    throw new Error(`uint64 invalid: ${value}`);
                }
                return bi;
            },
            enc(value) {
                dv.setBigInt64(0, this.parse(value), true);
                return {
                    lo: dv.getInt32(0, true),
                    hi: dv.getInt32(4, true),
                };
            },
            uEnc(value) {
                dv.setBigInt64(0, this.uParse(value), true);
                return {
                    lo: dv.getInt32(0, true),
                    hi: dv.getInt32(4, true),
                };
            },
            dec(lo, hi) {
                dv.setInt32(0, lo, true);
                dv.setInt32(4, hi, true);
                return dv.getBigInt64(0, true);
            },
            uDec(lo, hi) {
                dv.setInt32(0, lo, true);
                dv.setInt32(4, hi, true);
                return dv.getBigUint64(0, true);
            },
        };
    }
    const assertInt64String = (value) => assert(/^-?[0-9]+$/.test(value), `int64 invalid: ${value}`);
    const assertUInt64String = (value) => assert(/^[0-9]+$/.test(value), `uint64 invalid: ${value}`);
    return {
        zero: "0",
        supported: false,
        parse(value) {
            if (typeof value != "string") {
                value = value.toString();
            }
            assertInt64String(value);
            return value;
        },
        uParse(value) {
            if (typeof value != "string") {
                value = value.toString();
            }
            assertUInt64String(value);
            return value;
        },
        enc(value) {
            if (typeof value != "string") {
                value = value.toString();
            }
            assertInt64String(value);
            return int64FromString(value);
        },
        uEnc(value) {
            if (typeof value != "string") {
                value = value.toString();
            }
            assertUInt64String(value);
            return int64FromString(value);
        },
        dec(lo, hi) {
            return int64ToString(lo, hi);
        },
        uDec(lo, hi) {
            return uInt64ToString(lo, hi);
        },
    };
}
const protoInt64 = makeInt64Support();

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/binary-encoding.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/* eslint-disable prefer-const,no-case-declarations,@typescript-eslint/restrict-plus-operands */
/**
 * Protobuf binary format wire types.
 *
 * A wire type provides just enough information to find the length of the
 * following value.
 *
 * See https://developers.google.com/protocol-buffers/docs/encoding#structure
 */
var WireType;
(function (WireType) {
    /**
     * Used for int32, int64, uint32, uint64, sint32, sint64, bool, enum
     */
    WireType[WireType["Varint"] = 0] = "Varint";
    /**
     * Used for fixed64, sfixed64, double.
     * Always 8 bytes with little-endian byte order.
     */
    WireType[WireType["Bit64"] = 1] = "Bit64";
    /**
     * Used for string, bytes, embedded messages, packed repeated fields
     *
     * Only repeated numeric types (types which use the varint, 32-bit,
     * or 64-bit wire types) can be packed. In proto3, such fields are
     * packed by default.
     */
    WireType[WireType["LengthDelimited"] = 2] = "LengthDelimited";
    /**
     * Used for groups
     * @deprecated
     */
    WireType[WireType["StartGroup"] = 3] = "StartGroup";
    /**
     * Used for groups
     * @deprecated
     */
    WireType[WireType["EndGroup"] = 4] = "EndGroup";
    /**
     * Used for fixed32, sfixed32, float.
     * Always 4 bytes with little-endian byte order.
     */
    WireType[WireType["Bit32"] = 5] = "Bit32";
})(WireType || (WireType = {}));
class BinaryWriter {
    constructor(textEncoder) {
        /**
         * Previous fork states.
         */
        this.stack = [];
        this.textEncoder = textEncoder !== null && textEncoder !== void 0 ? textEncoder : new TextEncoder();
        this.chunks = [];
        this.buf = [];
    }
    /**
     * Return all bytes written and reset this writer.
     */
    finish() {
        this.chunks.push(new Uint8Array(this.buf)); // flush the buffer
        let len = 0;
        for (let i = 0; i < this.chunks.length; i++)
            len += this.chunks[i].length;
        let bytes = new Uint8Array(len);
        let offset = 0;
        for (let i = 0; i < this.chunks.length; i++) {
            bytes.set(this.chunks[i], offset);
            offset += this.chunks[i].length;
        }
        this.chunks = [];
        return bytes;
    }
    /**
     * Start a new fork for length-delimited data like a message
     * or a packed repeated field.
     *
     * Must be joined later with `join()`.
     */
    fork() {
        this.stack.push({ chunks: this.chunks, buf: this.buf });
        this.chunks = [];
        this.buf = [];
        return this;
    }
    /**
     * Join the last fork. Write its length and bytes, then
     * return to the previous state.
     */
    join() {
        // get chunk of fork
        let chunk = this.finish();
        // restore previous state
        let prev = this.stack.pop();
        if (!prev)
            throw new Error("invalid state, fork stack empty");
        this.chunks = prev.chunks;
        this.buf = prev.buf;
        // write length of chunk as varint
        this.uint32(chunk.byteLength);
        return this.raw(chunk);
    }
    /**
     * Writes a tag (field number and wire type).
     *
     * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
     *
     * Generated code should compute the tag ahead of time and call `uint32()`.
     */
    tag(fieldNo, type) {
        return this.uint32(((fieldNo << 3) | type) >>> 0);
    }
    /**
     * Write a chunk of raw bytes.
     */
    raw(chunk) {
        if (this.buf.length) {
            this.chunks.push(new Uint8Array(this.buf));
            this.buf = [];
        }
        this.chunks.push(chunk);
        return this;
    }
    /**
     * Write a `uint32` value, an unsigned 32 bit varint.
     */
    uint32(value) {
        assertUInt32(value);
        // write value as varint 32, inlined for speed
        while (value > 0x7f) {
            this.buf.push((value & 0x7f) | 0x80);
            value = value >>> 7;
        }
        this.buf.push(value);
        return this;
    }
    /**
     * Write a `int32` value, a signed 32 bit varint.
     */
    int32(value) {
        assertInt32(value);
        varint32write(value, this.buf);
        return this;
    }
    /**
     * Write a `bool` value, a variant.
     */
    bool(value) {
        this.buf.push(value ? 1 : 0);
        return this;
    }
    /**
     * Write a `bytes` value, length-delimited arbitrary data.
     */
    bytes(value) {
        this.uint32(value.byteLength); // write length of chunk as varint
        return this.raw(value);
    }
    /**
     * Write a `string` value, length-delimited data converted to UTF-8 text.
     */
    string(value) {
        let chunk = this.textEncoder.encode(value);
        this.uint32(chunk.byteLength); // write length of chunk as varint
        return this.raw(chunk);
    }
    /**
     * Write a `float` value, 32-bit floating point number.
     */
    float(value) {
        assertFloat32(value);
        let chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setFloat32(0, value, true);
        return this.raw(chunk);
    }
    /**
     * Write a `double` value, a 64-bit floating point number.
     */
    double(value) {
        let chunk = new Uint8Array(8);
        new DataView(chunk.buffer).setFloat64(0, value, true);
        return this.raw(chunk);
    }
    /**
     * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
     */
    fixed32(value) {
        assertUInt32(value);
        let chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setUint32(0, value, true);
        return this.raw(chunk);
    }
    /**
     * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
     */
    sfixed32(value) {
        assertInt32(value);
        let chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setInt32(0, value, true);
        return this.raw(chunk);
    }
    /**
     * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
     */
    sint32(value) {
        assertInt32(value);
        // zigzag encode
        value = ((value << 1) ^ (value >> 31)) >>> 0;
        varint32write(value, this.buf);
        return this;
    }
    /**
     * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
     */
    sfixed64(value) {
        let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.enc(value);
        view.setInt32(0, tc.lo, true);
        view.setInt32(4, tc.hi, true);
        return this.raw(chunk);
    }
    /**
     * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
     */
    fixed64(value) {
        let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.uEnc(value);
        view.setInt32(0, tc.lo, true);
        view.setInt32(4, tc.hi, true);
        return this.raw(chunk);
    }
    /**
     * Write a `int64` value, a signed 64-bit varint.
     */
    int64(value) {
        let tc = protoInt64.enc(value);
        varint64write(tc.lo, tc.hi, this.buf);
        return this;
    }
    /**
     * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64(value) {
        let tc = protoInt64.enc(value), 
        // zigzag encode
        sign = tc.hi >> 31, lo = (tc.lo << 1) ^ sign, hi = ((tc.hi << 1) | (tc.lo >>> 31)) ^ sign;
        varint64write(lo, hi, this.buf);
        return this;
    }
    /**
     * Write a `uint64` value, an unsigned 64-bit varint.
     */
    uint64(value) {
        let tc = protoInt64.uEnc(value);
        varint64write(tc.lo, tc.hi, this.buf);
        return this;
    }
}
class BinaryReader {
    constructor(buf, textDecoder) {
        this.varint64 = varint64read; // dirty cast for `this`
        /**
         * Read a `uint32` field, an unsigned 32 bit varint.
         */
        this.uint32 = varint32read; // dirty cast for `this` and access to protected `buf`
        this.buf = buf;
        this.len = buf.length;
        this.pos = 0;
        this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        this.textDecoder = textDecoder !== null && textDecoder !== void 0 ? textDecoder : new TextDecoder();
    }
    /**
     * Reads a tag - field number and wire type.
     */
    tag() {
        let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
        if (fieldNo <= 0 || wireType < 0 || wireType > 5)
            throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
        return [fieldNo, wireType];
    }
    /**
     * Skip one element on the wire and return the skipped data.
     * Supports WireType.StartGroup since v2.0.0-alpha.23.
     */
    skip(wireType) {
        let start = this.pos;
        switch (wireType) {
            case WireType.Varint:
                while (this.buf[this.pos++] & 0x80) {
                    // ignore
                }
                break;
            // eslint-disable-next-line
            // @ts-ignore TS7029: Fallthrough case in switch
            case WireType.Bit64:
                this.pos += 4;
            // eslint-disable-next-line
            // @ts-ignore TS7029: Fallthrough case in switch
            case WireType.Bit32:
                this.pos += 4;
                break;
            case WireType.LengthDelimited:
                let len = this.uint32();
                this.pos += len;
                break;
            case WireType.StartGroup:
                // From descriptor.proto: Group type is deprecated, not supported in proto3.
                // But we must still be able to parse and treat as unknown.
                let t;
                while ((t = this.tag()[1]) !== WireType.EndGroup) {
                    this.skip(t);
                }
                break;
            default:
                throw new Error("cant skip wire type " + wireType);
        }
        this.assertBounds();
        return this.buf.subarray(start, this.pos);
    }
    /**
     * Throws error if position in byte array is out of range.
     */
    assertBounds() {
        if (this.pos > this.len)
            throw new RangeError("premature EOF");
    }
    /**
     * Read a `int32` field, a signed 32 bit varint.
     */
    int32() {
        return this.uint32() | 0;
    }
    /**
     * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
     */
    sint32() {
        let zze = this.uint32();
        // decode zigzag
        return (zze >>> 1) ^ -(zze & 1);
    }
    /**
     * Read a `int64` field, a signed 64-bit varint.
     */
    int64() {
        return protoInt64.dec(...this.varint64());
    }
    /**
     * Read a `uint64` field, an unsigned 64-bit varint.
     */
    uint64() {
        return protoInt64.uDec(...this.varint64());
    }
    /**
     * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64() {
        let [lo, hi] = this.varint64();
        // decode zig zag
        let s = -(lo & 1);
        lo = ((lo >>> 1) | ((hi & 1) << 31)) ^ s;
        hi = (hi >>> 1) ^ s;
        return protoInt64.dec(lo, hi);
    }
    /**
     * Read a `bool` field, a variant.
     */
    bool() {
        let [lo, hi] = this.varint64();
        return lo !== 0 || hi !== 0;
    }
    /**
     * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
     */
    fixed32() {
        return this.view.getUint32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
     */
    sfixed32() {
        return this.view.getInt32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
     */
    fixed64() {
        return protoInt64.uDec(this.sfixed32(), this.sfixed32());
    }
    /**
     * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
     */
    sfixed64() {
        return protoInt64.dec(this.sfixed32(), this.sfixed32());
    }
    /**
     * Read a `float` field, 32-bit floating point number.
     */
    float() {
        return this.view.getFloat32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `double` field, a 64-bit floating point number.
     */
    double() {
        return this.view.getFloat64((this.pos += 8) - 8, true);
    }
    /**
     * Read a `bytes` field, length-delimited arbitrary data.
     */
    bytes() {
        let len = this.uint32(), start = this.pos;
        this.pos += len;
        this.assertBounds();
        return this.buf.subarray(start, start + len);
    }
    /**
     * Read a `string` field, length-delimited data converted to UTF-8 text.
     */
    string() {
        return this.textDecoder.decode(this.bytes());
    }
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/field-wrapper.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * Wrap a primitive message field value in its corresponding wrapper
 * message. This function is idempotent.
 */
function wrapField(type, value) {
    if (value instanceof esm_message/* Message */.v || !type.fieldWrapper) {
        return value;
    }
    return type.fieldWrapper.wrapField(value);
}
/**
 * If the given field uses one of the well-known wrapper types, return
 * the primitive type it wraps.
 */
function getUnwrappedFieldType(field) {
    if (field.fieldKind !== "message") {
        return undefined;
    }
    if (field.repeated) {
        return undefined;
    }
    if (field.oneof != undefined) {
        return undefined;
    }
    return wktWrapperToScalarType[field.message.typeName];
}
const wktWrapperToScalarType = {
    "google.protobuf.DoubleValue": ScalarType.DOUBLE,
    "google.protobuf.FloatValue": ScalarType.FLOAT,
    "google.protobuf.Int64Value": ScalarType.INT64,
    "google.protobuf.UInt64Value": ScalarType.UINT64,
    "google.protobuf.Int32Value": ScalarType.INT32,
    "google.protobuf.UInt32Value": ScalarType.UINT32,
    "google.protobuf.BoolValue": ScalarType.BOOL,
    "google.protobuf.StringValue": ScalarType.STRING,
    "google.protobuf.BytesValue": ScalarType.BYTES,
};

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/scalars.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Returns true if both scalar values are equal.
 */
function scalarEquals(type, a, b) {
    if (a === b) {
        // This correctly matches equal values except BYTES and (possibly) 64-bit integers.
        return true;
    }
    // Special case BYTES - we need to compare each byte individually
    if (type == ScalarType.BYTES) {
        if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) {
            return false;
        }
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
    // Special case 64-bit integers - we support number, string and bigint representation.
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (type) {
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
            // Loose comparison will match between 0n, 0 and "0".
            return a == b;
    }
    // Anything that hasn't been caught by strict comparison or special cased
    // BYTES and 64-bit integers is not equal.
    return false;
}
/**
 * Returns the default value for the given scalar type, following
 * proto3 semantics.
 */
function scalarDefaultValue(type) {
    switch (type) {
        case ScalarType.BOOL:
            return false;
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
            return protoInt64.zero;
        case ScalarType.DOUBLE:
        case ScalarType.FLOAT:
            return 0.0;
        case ScalarType.BYTES:
            return new Uint8Array(0);
        case ScalarType.STRING:
            return "";
        default:
            // Handles INT32, UINT32, SINT32, FIXED32, SFIXED32.
            // We do not use individual cases to save a few bytes code size.
            return 0;
    }
}
/**
 * Get information for writing a scalar value.
 *
 * Returns tuple:
 * [0]: appropriate WireType
 * [1]: name of the appropriate method of IBinaryWriter
 * [2]: whether the given value is a default value for proto3 semantics
 *
 * If argument `value` is omitted, [2] is always false.
 */
function scalarTypeInfo(type, value) {
    const isUndefined = value === undefined;
    let wireType = WireType.Varint;
    let isIntrinsicDefault = value === 0;
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- INT32, UINT32, SINT32 are covered by the defaults
    switch (type) {
        case ScalarType.STRING:
            isIntrinsicDefault = isUndefined || !value.length;
            wireType = WireType.LengthDelimited;
            break;
        case ScalarType.BOOL:
            isIntrinsicDefault = value === false;
            break;
        case ScalarType.DOUBLE:
            wireType = WireType.Bit64;
            break;
        case ScalarType.FLOAT:
            wireType = WireType.Bit32;
            break;
        case ScalarType.INT64:
            isIntrinsicDefault = isUndefined || value == 0;
            break;
        case ScalarType.UINT64:
            isIntrinsicDefault = isUndefined || value == 0;
            break;
        case ScalarType.FIXED64:
            isIntrinsicDefault = isUndefined || value == 0;
            wireType = WireType.Bit64;
            break;
        case ScalarType.BYTES:
            isIntrinsicDefault = isUndefined || !value.byteLength;
            wireType = WireType.LengthDelimited;
            break;
        case ScalarType.FIXED32:
            wireType = WireType.Bit32;
            break;
        case ScalarType.SFIXED32:
            wireType = WireType.Bit32;
            break;
        case ScalarType.SFIXED64:
            isIntrinsicDefault = isUndefined || value == 0;
            wireType = WireType.Bit64;
            break;
        case ScalarType.SINT64:
            isIntrinsicDefault = isUndefined || value == 0;
            break;
    }
    const method = ScalarType[type].toLowerCase();
    return [wireType, method, isUndefined || isIntrinsicDefault];
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/binary-format-common.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.






/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, no-case-declarations, prefer-const */
const unknownFieldsSymbol = Symbol("@bufbuild/protobuf/unknown-fields");
// Default options for parsing binary data.
const readDefaults = {
    readUnknownFields: true,
    readerFactory: (bytes) => new BinaryReader(bytes),
};
// Default options for serializing binary data.
const writeDefaults = {
    writeUnknownFields: true,
    writerFactory: () => new BinaryWriter(),
};
function makeReadOptions(options) {
    return options ? Object.assign(Object.assign({}, readDefaults), options) : readDefaults;
}
function makeWriteOptions(options) {
    return options ? Object.assign(Object.assign({}, writeDefaults), options) : writeDefaults;
}
function makeBinaryFormatCommon() {
    return {
        makeReadOptions,
        makeWriteOptions,
        listUnknownFields(message) {
            var _a;
            return (_a = message[unknownFieldsSymbol]) !== null && _a !== void 0 ? _a : [];
        },
        discardUnknownFields(message) {
            delete message[unknownFieldsSymbol];
        },
        writeUnknownFields(message, writer) {
            const m = message;
            const c = m[unknownFieldsSymbol];
            if (c) {
                for (const f of c) {
                    writer.tag(f.no, f.wireType).raw(f.data);
                }
            }
        },
        onUnknownField(message, no, wireType, data) {
            const m = message;
            if (!Array.isArray(m[unknownFieldsSymbol])) {
                m[unknownFieldsSymbol] = [];
            }
            m[unknownFieldsSymbol].push({ no, wireType, data });
        },
        readMessage(message, reader, length, options) {
            const type = message.getType();
            const end = length === undefined ? reader.len : reader.pos + length;
            while (reader.pos < end) {
                const [fieldNo, wireType] = reader.tag(), field = type.fields.find(fieldNo);
                if (!field) {
                    const data = reader.skip(wireType);
                    if (options.readUnknownFields) {
                        this.onUnknownField(message, fieldNo, wireType, data);
                    }
                    continue;
                }
                let target = message, repeated = field.repeated, localName = field.localName;
                if (field.oneof) {
                    target = target[field.oneof.localName];
                    if (target.case != localName) {
                        delete target.value;
                    }
                    target.case = localName;
                    localName = "value";
                }
                switch (field.kind) {
                    case "scalar":
                    case "enum":
                        const scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
                        if (repeated) {
                            let arr = target[localName]; // safe to assume presence of array, oneof cannot contain repeated values
                            if (wireType == WireType.LengthDelimited &&
                                scalarType != ScalarType.STRING &&
                                scalarType != ScalarType.BYTES) {
                                let e = reader.uint32() + reader.pos;
                                while (reader.pos < e) {
                                    arr.push(readScalar(reader, scalarType));
                                }
                            }
                            else {
                                arr.push(readScalar(reader, scalarType));
                            }
                        }
                        else {
                            target[localName] = readScalar(reader, scalarType);
                        }
                        break;
                    case "message":
                        const messageType = field.T;
                        if (repeated) {
                            // safe to assume presence of array, oneof cannot contain repeated values
                            target[localName].push(readMessageField(reader, new messageType(), options));
                        }
                        else {
                            if (target[localName] instanceof esm_message/* Message */.v) {
                                readMessageField(reader, target[localName], options);
                            }
                            else {
                                target[localName] = readMessageField(reader, new messageType(), options);
                                if (messageType.fieldWrapper &&
                                    !field.oneof &&
                                    !field.repeated) {
                                    target[localName] = messageType.fieldWrapper.unwrapField(target[localName]);
                                }
                            }
                        }
                        break;
                    case "map":
                        let [mapKey, mapVal] = readMapEntry(field, reader, options);
                        // safe to assume presence of map object, oneof cannot contain repeated values
                        target[localName][mapKey] = mapVal;
                        break;
                }
            }
        },
    };
}
// Read a message, avoiding MessageType.fromBinary() to re-use the
// BinaryReadOptions and the IBinaryReader.
function readMessageField(reader, message, options) {
    const format = message.getType().runtime.bin;
    format.readMessage(message, reader, reader.uint32(), options);
    return message;
}
// Read a map field, expecting key field = 1, value field = 2
function readMapEntry(field, reader, options) {
    const length = reader.uint32(), end = reader.pos + length;
    let key, val;
    while (reader.pos < end) {
        let [fieldNo] = reader.tag();
        switch (fieldNo) {
            case 1:
                key = readScalar(reader, field.K);
                break;
            case 2:
                switch (field.V.kind) {
                    case "scalar":
                        val = readScalar(reader, field.V.T);
                        break;
                    case "enum":
                        val = reader.int32();
                        break;
                    case "message":
                        val = readMessageField(reader, new field.V.T(), options);
                        break;
                }
                break;
        }
    }
    if (key === undefined) {
        let keyRaw = scalarDefaultValue(field.K);
        key =
            field.K == ScalarType.BOOL
                ? keyRaw.toString()
                : keyRaw;
    }
    if (typeof key != "string" && typeof key != "number") {
        key = key.toString();
    }
    if (val === undefined) {
        switch (field.V.kind) {
            case "scalar":
                val = scalarDefaultValue(field.V.T);
                break;
            case "enum":
                val = 0;
                break;
            case "message":
                val = new field.V.T();
                break;
        }
    }
    return [key, val];
}
// Does not use scalarTypeInfo() for better performance.
function readScalar(reader, type) {
    switch (type) {
        case ScalarType.STRING:
            return reader.string();
        case ScalarType.BOOL:
            return reader.bool();
        case ScalarType.DOUBLE:
            return reader.double();
        case ScalarType.FLOAT:
            return reader.float();
        case ScalarType.INT32:
            return reader.int32();
        case ScalarType.INT64:
            return reader.int64();
        case ScalarType.UINT64:
            return reader.uint64();
        case ScalarType.FIXED64:
            return reader.fixed64();
        case ScalarType.BYTES:
            return reader.bytes();
        case ScalarType.FIXED32:
            return reader.fixed32();
        case ScalarType.SFIXED32:
            return reader.sfixed32();
        case ScalarType.SFIXED64:
            return reader.sfixed64();
        case ScalarType.SINT64:
            return reader.sint64();
        case ScalarType.UINT32:
            return reader.uint32();
        case ScalarType.SINT32:
            return reader.sint32();
    }
}
function writeMapEntry(writer, options, field, key, value) {
    writer.tag(field.no, WireType.LengthDelimited);
    writer.fork();
    // javascript only allows number or string for object properties
    // we convert from our representation to the protobuf type
    let keyValue = key;
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- we deliberately handle just the special cases for map keys
    switch (field.K) {
        case ScalarType.INT32:
        case ScalarType.FIXED32:
        case ScalarType.UINT32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
            keyValue = Number.parseInt(key);
            break;
        case ScalarType.BOOL:
            assert(key == "true" || key == "false");
            keyValue = key == "true";
            break;
    }
    // write key, expecting key field number = 1
    writeScalar(writer, field.K, 1, keyValue, true);
    // write value, expecting value field number = 2
    switch (field.V.kind) {
        case "scalar":
            writeScalar(writer, field.V.T, 2, value, true);
            break;
        case "enum":
            writeScalar(writer, ScalarType.INT32, 2, value, true);
            break;
        case "message":
            writeMessageField(writer, options, field.V.T, 2, value);
            break;
    }
    writer.join();
}
function writeMessageField(writer, options, type, fieldNo, value) {
    if (value !== undefined) {
        const message = wrapField(type, value);
        writer
            .tag(fieldNo, WireType.LengthDelimited)
            .bytes(message.toBinary(options));
    }
}
function writeScalar(writer, type, fieldNo, value, emitIntrinsicDefault) {
    let [wireType, method, isIntrinsicDefault] = scalarTypeInfo(type, value);
    if (!isIntrinsicDefault || emitIntrinsicDefault) {
        writer.tag(fieldNo, wireType)[method](value);
    }
}
function writePacked(writer, type, fieldNo, value) {
    if (!value.length) {
        return;
    }
    writer.tag(fieldNo, WireType.LengthDelimited).fork();
    let [, method] = scalarTypeInfo(type);
    for (let i = 0; i < value.length; i++) {
        writer[method](value[i]);
    }
    writer.join();
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/binary-format-proto3.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions, prefer-const, no-case-declarations */
function makeBinaryFormatProto3() {
    return Object.assign(Object.assign({}, makeBinaryFormatCommon()), { writeMessage(message, writer, options) {
            const type = message.getType();
            for (const field of type.fields.byNumber()) {
                let value, // this will be our field value, whether it is member of a oneof or regular field
                repeated = field.repeated, localName = field.localName;
                if (field.oneof) {
                    const oneof = message[field.oneof.localName];
                    if (oneof.case !== localName) {
                        continue; // field is not selected, skip
                    }
                    value = oneof.value;
                }
                else {
                    value = message[localName];
                }
                switch (field.kind) {
                    case "scalar":
                    case "enum":
                        let scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
                        if (repeated) {
                            if (field.packed) {
                                writePacked(writer, scalarType, field.no, value);
                            }
                            else {
                                for (const item of value) {
                                    writeScalar(writer, scalarType, field.no, item, true);
                                }
                            }
                        }
                        else {
                            if (value !== undefined) {
                                writeScalar(writer, scalarType, field.no, value, !!field.oneof || field.opt);
                            }
                        }
                        break;
                    case "message":
                        if (repeated) {
                            for (const item of value) {
                                writeMessageField(writer, options, field.T, field.no, item);
                            }
                        }
                        else {
                            writeMessageField(writer, options, field.T, field.no, value);
                        }
                        break;
                    case "map":
                        for (const [key, val] of Object.entries(value)) {
                            writeMapEntry(writer, options, field, key, val);
                        }
                        break;
                }
            }
            if (options.writeUnknownFields) {
                this.writeUnknownFields(message, writer);
            }
            return writer;
        } });
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/proto-base64.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unnecessary-condition, prefer-const */
// lookup table from base64 character to byte
let encTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
// lookup table from base64 character *code* to byte because lookup by number is fast
let decTable = [];
for (let i = 0; i < encTable.length; i++)
    decTable[encTable[i].charCodeAt(0)] = i;
// support base64url variants
decTable["-".charCodeAt(0)] = encTable.indexOf("+");
decTable["_".charCodeAt(0)] = encTable.indexOf("/");
const protoBase64 = {
    /**
     * Decodes a base64 string to a byte array.
     *
     * - ignores white-space, including line breaks and tabs
     * - allows inner padding (can decode concatenated base64 strings)
     * - does not require padding
     * - understands base64url encoding:
     *   "-" instead of "+",
     *   "_" instead of "/",
     *   no padding
     */
    dec(base64Str) {
        // estimate byte size, not accounting for inner padding and whitespace
        let es = (base64Str.length * 3) / 4;
        if (base64Str[base64Str.length - 2] == "=")
            es -= 2;
        else if (base64Str[base64Str.length - 1] == "=")
            es -= 1;
        let bytes = new Uint8Array(es), bytePos = 0, // position in byte array
        groupPos = 0, // position in base64 group
        b, // current byte
        p = 0; // previous byte
        for (let i = 0; i < base64Str.length; i++) {
            b = decTable[base64Str.charCodeAt(i)];
            if (b === undefined) {
                switch (base64Str[i]) {
                    // @ts-ignore TS7029: Fallthrough case in switch
                    case "=":
                        groupPos = 0; // reset state when padding found
                    // @ts-ignore TS7029: Fallthrough case in switch
                    case "\n":
                    case "\r":
                    case "\t":
                    case " ":
                        continue; // skip white-space, and padding
                    default:
                        throw Error("invalid base64 string.");
                }
            }
            switch (groupPos) {
                case 0:
                    p = b;
                    groupPos = 1;
                    break;
                case 1:
                    bytes[bytePos++] = (p << 2) | ((b & 48) >> 4);
                    p = b;
                    groupPos = 2;
                    break;
                case 2:
                    bytes[bytePos++] = ((p & 15) << 4) | ((b & 60) >> 2);
                    p = b;
                    groupPos = 3;
                    break;
                case 3:
                    bytes[bytePos++] = ((p & 3) << 6) | b;
                    groupPos = 0;
                    break;
            }
        }
        if (groupPos == 1)
            throw Error("invalid base64 string.");
        return bytes.subarray(0, bytePos);
    },
    /**
     * Encode a byte array to a base64 string.
     */
    enc(bytes) {
        let base64 = "", groupPos = 0, // position in base64 group
        b, // current byte
        p = 0; // carry over from previous byte
        for (let i = 0; i < bytes.length; i++) {
            b = bytes[i];
            switch (groupPos) {
                case 0:
                    base64 += encTable[b >> 2];
                    p = (b & 3) << 4;
                    groupPos = 1;
                    break;
                case 1:
                    base64 += encTable[p | (b >> 4)];
                    p = (b & 15) << 2;
                    groupPos = 2;
                    break;
                case 2:
                    base64 += encTable[p | (b >> 6)];
                    base64 += encTable[b & 63];
                    groupPos = 0;
                    break;
            }
        }
        // add output padding
        if (groupPos) {
            base64 += encTable[p];
            base64 += "=";
            if (groupPos == 1)
                base64 += "=";
        }
        return base64;
    },
};

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/json-format-common.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.





/* eslint-disable no-case-declarations, @typescript-eslint/restrict-plus-operands,@typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument */
// Default options for parsing JSON.
const jsonReadDefaults = {
    ignoreUnknownFields: false,
};
// Default options for serializing to JSON.
const jsonWriteDefaults = {
    emitDefaultValues: false,
    enumAsInteger: false,
    useProtoFieldName: false,
    prettySpaces: 0,
};
function json_format_common_makeReadOptions(options) {
    return options ? Object.assign(Object.assign({}, jsonReadDefaults), options) : jsonReadDefaults;
}
function json_format_common_makeWriteOptions(options) {
    return options ? Object.assign(Object.assign({}, jsonWriteDefaults), options) : jsonWriteDefaults;
}
function makeJsonFormatCommon(makeWriteField) {
    const writeField = makeWriteField(writeEnum, json_format_common_writeScalar);
    return {
        makeReadOptions: json_format_common_makeReadOptions,
        makeWriteOptions: json_format_common_makeWriteOptions,
        readMessage(type, json, options, message) {
            if (json == null || Array.isArray(json) || typeof json != "object") {
                throw new Error(`cannot decode message ${type.typeName} from JSON: ${this.debug(json)}`);
            }
            message = message !== null && message !== void 0 ? message : new type();
            const oneofSeen = {};
            for (const [jsonKey, jsonValue] of Object.entries(json)) {
                const field = type.fields.findJsonName(jsonKey);
                if (!field) {
                    if (!options.ignoreUnknownFields) {
                        throw new Error(`cannot decode message ${type.typeName} from JSON: key "${jsonKey}" is unknown`);
                    }
                    continue;
                }
                let localName = field.localName;
                let target = message;
                if (field.oneof) {
                    if (jsonValue === null && field.kind == "scalar") {
                        // see conformance test Required.Proto3.JsonInput.OneofFieldNull{First,Second}
                        continue;
                    }
                    const seen = oneofSeen[field.oneof.localName];
                    if (seen) {
                        throw new Error(`cannot decode message ${type.typeName} from JSON: multiple keys for oneof "${field.oneof.name}" present: "${seen}", "${jsonKey}"`);
                    }
                    oneofSeen[field.oneof.localName] = jsonKey;
                    target = target[field.oneof.localName] = { case: localName };
                    localName = "value";
                }
                if (field.repeated) {
                    if (jsonValue === null) {
                        continue;
                    }
                    if (!Array.isArray(jsonValue)) {
                        throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonValue)}`);
                    }
                    const targetArray = target[localName];
                    for (const jsonItem of jsonValue) {
                        if (jsonItem === null) {
                            throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonItem)}`);
                        }
                        let val;
                        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- "map" is invalid for repeated fields
                        switch (field.kind) {
                            case "message":
                                val = field.T.fromJson(jsonItem, options);
                                break;
                            case "enum":
                                val = readEnum(field.T, jsonItem, options.ignoreUnknownFields);
                                if (val === undefined)
                                    continue;
                                break;
                            case "scalar":
                                try {
                                    val = json_format_common_readScalar(field.T, jsonItem);
                                }
                                catch (e) {
                                    let m = `cannot decode field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonItem)}`;
                                    if (e instanceof Error && e.message.length > 0) {
                                        m += `: ${e.message}`;
                                    }
                                    throw new Error(m);
                                }
                                break;
                        }
                        targetArray.push(val);
                    }
                }
                else if (field.kind == "map") {
                    if (jsonValue === null) {
                        continue;
                    }
                    if (Array.isArray(jsonValue) || typeof jsonValue != "object") {
                        throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonValue)}`);
                    }
                    const targetMap = target[localName];
                    for (const [jsonMapKey, jsonMapValue] of Object.entries(jsonValue)) {
                        if (jsonMapValue === null) {
                            throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: map value null`);
                        }
                        let val;
                        switch (field.V.kind) {
                            case "message":
                                val = field.V.T.fromJson(jsonMapValue, options);
                                break;
                            case "enum":
                                val = readEnum(field.V.T, jsonMapValue, options.ignoreUnknownFields);
                                if (val === undefined)
                                    continue;
                                break;
                            case "scalar":
                                try {
                                    val = json_format_common_readScalar(field.V.T, jsonMapValue);
                                }
                                catch (e) {
                                    let m = `cannot decode map value for field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonValue)}`;
                                    if (e instanceof Error && e.message.length > 0) {
                                        m += `: ${e.message}`;
                                    }
                                    throw new Error(m);
                                }
                                break;
                        }
                        try {
                            targetMap[json_format_common_readScalar(field.K, field.K == ScalarType.BOOL
                                ? jsonMapKey == "true"
                                    ? true
                                    : jsonMapKey == "false"
                                        ? false
                                        : jsonMapKey
                                : jsonMapKey).toString()] = val;
                        }
                        catch (e) {
                            let m = `cannot decode map key for field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonValue)}`;
                            if (e instanceof Error && e.message.length > 0) {
                                m += `: ${e.message}`;
                            }
                            throw new Error(m);
                        }
                    }
                }
                else {
                    switch (field.kind) {
                        case "message":
                            const messageType = field.T;
                            if (jsonValue === null &&
                                messageType.typeName != "google.protobuf.Value") {
                                if (field.oneof) {
                                    throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: null is invalid for oneof field "${jsonKey}"`);
                                }
                                continue;
                            }
                            if (target[localName] instanceof esm_message/* Message */.v) {
                                target[localName].fromJson(jsonValue, options);
                            }
                            else {
                                target[localName] = messageType.fromJson(jsonValue, options);
                                if (messageType.fieldWrapper && !field.oneof) {
                                    target[localName] = messageType.fieldWrapper.unwrapField(target[localName]);
                                }
                            }
                            break;
                        case "enum":
                            const enumValue = readEnum(field.T, jsonValue, options.ignoreUnknownFields);
                            if (enumValue !== undefined) {
                                target[localName] = enumValue;
                            }
                            break;
                        case "scalar":
                            try {
                                target[localName] = json_format_common_readScalar(field.T, jsonValue);
                            }
                            catch (e) {
                                let m = `cannot decode field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonValue)}`;
                                if (e instanceof Error && e.message.length > 0) {
                                    m += `: ${e.message}`;
                                }
                                throw new Error(m);
                            }
                            break;
                    }
                }
            }
            return message;
        },
        writeMessage(message, options) {
            const type = message.getType();
            const json = {};
            let field;
            try {
                for (const member of type.fields.byMember()) {
                    let jsonValue;
                    if (member.kind == "oneof") {
                        const oneof = message[member.localName];
                        if (oneof.value === undefined) {
                            continue;
                        }
                        field = member.findField(oneof.case);
                        if (!field) {
                            throw "oneof case not found: " + oneof.case;
                        }
                        jsonValue = writeField(field, oneof.value, options);
                    }
                    else {
                        field = member;
                        jsonValue = writeField(field, message[field.localName], options);
                    }
                    if (jsonValue !== undefined) {
                        json[options.useProtoFieldName ? field.name : field.jsonName] =
                            jsonValue;
                    }
                }
            }
            catch (e) {
                const m = field
                    ? `cannot encode field ${type.typeName}.${field.name} to JSON`
                    : `cannot encode message ${type.typeName} to JSON`;
                const r = e instanceof Error ? e.message : String(e);
                throw new Error(m + (r.length > 0 ? `: ${r}` : ""));
            }
            return json;
        },
        readScalar: json_format_common_readScalar,
        writeScalar: json_format_common_writeScalar,
        debug: debugJsonValue,
    };
}
function debugJsonValue(json) {
    if (json === null) {
        return "null";
    }
    switch (typeof json) {
        case "object":
            return Array.isArray(json) ? "array" : "object";
        case "string":
            return json.length > 100 ? "string" : `"${json.split('"').join('\\"')}"`;
        default:
            return json.toString();
    }
}
// May throw an error. If the error message is non-blank, it should be shown.
// It is up to the caller to provide context.
function json_format_common_readScalar(type, json) {
    // every valid case in the switch below returns, and every fall
    // through is regarded as a failure.
    switch (type) {
        // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
        // Either numbers or strings are accepted. Exponent notation is also accepted.
        case ScalarType.DOUBLE:
        case ScalarType.FLOAT:
            if (json === null)
                return 0.0;
            if (json === "NaN")
                return Number.NaN;
            if (json === "Infinity")
                return Number.POSITIVE_INFINITY;
            if (json === "-Infinity")
                return Number.NEGATIVE_INFINITY;
            if (json === "") {
                // empty string is not a number
                break;
            }
            if (typeof json == "string" && json.trim().length !== json.length) {
                // extra whitespace
                break;
            }
            if (typeof json != "string" && typeof json != "number") {
                break;
            }
            const float = Number(json);
            if (Number.isNaN(float)) {
                // not a number
                break;
            }
            if (!Number.isFinite(float)) {
                // infinity and -infinity are handled by string representation above, so this is an error
                break;
            }
            if (type == ScalarType.FLOAT)
                assertFloat32(float);
            return float;
        // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
        case ScalarType.INT32:
        case ScalarType.FIXED32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
        case ScalarType.UINT32:
            if (json === null)
                return 0;
            let int32;
            if (typeof json == "number")
                int32 = json;
            else if (typeof json == "string" && json.length > 0) {
                if (json.trim().length === json.length)
                    int32 = Number(json);
            }
            if (int32 === undefined)
                break;
            if (type == ScalarType.UINT32)
                assertUInt32(int32);
            else
                assertInt32(int32);
            return int32;
        // int64, fixed64, uint64: JSON value will be a decimal string. Either numbers or strings are accepted.
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
            if (json === null)
                return protoInt64.zero;
            if (typeof json != "number" && typeof json != "string")
                break;
            return protoInt64.parse(json);
        case ScalarType.FIXED64:
        case ScalarType.UINT64:
            if (json === null)
                return protoInt64.zero;
            if (typeof json != "number" && typeof json != "string")
                break;
            return protoInt64.uParse(json);
        // bool:
        case ScalarType.BOOL:
            if (json === null)
                return false;
            if (typeof json !== "boolean")
                break;
            return json;
        // string:
        case ScalarType.STRING:
            if (json === null)
                return "";
            if (typeof json !== "string") {
                break;
            }
            // A string must always contain UTF-8 encoded or 7-bit ASCII.
            // We validate with encodeURIComponent, which appears to be the fastest widely available option.
            try {
                encodeURIComponent(json);
            }
            catch (e) {
                throw new Error("invalid UTF8");
            }
            return json;
        // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
        // Either standard or URL-safe base64 encoding with/without paddings are accepted.
        case ScalarType.BYTES:
            if (json === null || json === "")
                return new Uint8Array(0);
            if (typeof json !== "string")
                break;
            return protoBase64.dec(json);
    }
    throw new Error();
}
function readEnum(type, json, ignoreUnknownFields) {
    if (json === null) {
        // proto3 requires 0 to be default value for all enums
        return 0;
    }
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (typeof json) {
        case "number":
            if (Number.isInteger(json)) {
                return json;
            }
            break;
        case "string":
            const value = type.findName(json);
            if (value || ignoreUnknownFields) {
                return value === null || value === void 0 ? void 0 : value.no;
            }
            break;
    }
    throw new Error(`cannot decode enum ${type.typeName} from JSON: ${debugJsonValue(json)}`);
}
function writeEnum(type, value, emitIntrinsicDefault, enumAsInteger) {
    var _a;
    if (value === undefined) {
        return value;
    }
    if (value === 0 && !emitIntrinsicDefault) {
        // proto3 requires 0 to be default value for all enums
        return undefined;
    }
    if (enumAsInteger) {
        return value;
    }
    if (type.typeName == "google.protobuf.NullValue") {
        return null;
    }
    const val = type.findNumber(value);
    return (_a = val === null || val === void 0 ? void 0 : val.name) !== null && _a !== void 0 ? _a : value; // if we don't know the enum value, just return the number
}
function json_format_common_writeScalar(type, value, emitIntrinsicDefault) {
    if (value === undefined) {
        return undefined;
    }
    switch (type) {
        // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
        case ScalarType.INT32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
        case ScalarType.FIXED32:
        case ScalarType.UINT32:
            assert(typeof value == "number");
            return value != 0 || emitIntrinsicDefault ? value : undefined;
        // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
        // Either numbers or strings are accepted. Exponent notation is also accepted.
        case ScalarType.FLOAT:
        // assertFloat32(value);
        case ScalarType.DOUBLE: // eslint-disable-line no-fallthrough
            assert(typeof value == "number");
            if (Number.isNaN(value))
                return "NaN";
            if (value === Number.POSITIVE_INFINITY)
                return "Infinity";
            if (value === Number.NEGATIVE_INFINITY)
                return "-Infinity";
            return value !== 0 || emitIntrinsicDefault ? value : undefined;
        // string:
        case ScalarType.STRING:
            assert(typeof value == "string");
            return value.length > 0 || emitIntrinsicDefault ? value : undefined;
        // bool:
        case ScalarType.BOOL:
            assert(typeof value == "boolean");
            return value || emitIntrinsicDefault ? value : undefined;
        // JSON value will be a decimal string. Either numbers or strings are accepted.
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
            assert(typeof value == "bigint" ||
                typeof value == "string" ||
                typeof value == "number");
            // We use implicit conversion with `value != 0` to catch both 0n and "0"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return emitIntrinsicDefault || value != 0
                ? value.toString(10)
                : undefined;
        // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
        // Either standard or URL-safe base64 encoding with/without paddings are accepted.
        case ScalarType.BYTES:
            assert(value instanceof Uint8Array);
            return emitIntrinsicDefault || value.byteLength > 0
                ? protoBase64.enc(value)
                : undefined;
    }
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/json-format-proto3.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/* eslint-disable no-case-declarations, @typescript-eslint/restrict-plus-operands,@typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument */
function makeJsonFormatProto3() {
    return makeJsonFormatCommon((writeEnum, writeScalar) => {
        return function writeField(field, value, options) {
            if (field.kind == "map") {
                const jsonObj = {};
                switch (field.V.kind) {
                    case "scalar":
                        for (const [entryKey, entryValue] of Object.entries(value)) {
                            const val = writeScalar(field.V.T, entryValue, true);
                            assert(val !== undefined);
                            jsonObj[entryKey.toString()] = val; // JSON standard allows only (double quoted) string as property key
                        }
                        break;
                    case "message":
                        for (const [entryKey, entryValue] of Object.entries(value)) {
                            // JSON standard allows only (double quoted) string as property key
                            jsonObj[entryKey.toString()] = entryValue.toJson(options);
                        }
                        break;
                    case "enum":
                        const enumType = field.V.T;
                        for (const [entryKey, entryValue] of Object.entries(value)) {
                            assert(entryValue === undefined || typeof entryValue == "number");
                            const val = writeEnum(enumType, entryValue, true, options.enumAsInteger);
                            assert(val !== undefined);
                            jsonObj[entryKey.toString()] = val; // JSON standard allows only (double quoted) string as property key
                        }
                        break;
                }
                return options.emitDefaultValues || Object.keys(jsonObj).length > 0
                    ? jsonObj
                    : undefined;
            }
            else if (field.repeated) {
                const jsonArr = [];
                switch (field.kind) {
                    case "scalar":
                        for (let i = 0; i < value.length; i++) {
                            jsonArr.push(writeScalar(field.T, value[i], true));
                        }
                        break;
                    case "enum":
                        for (let i = 0; i < value.length; i++) {
                            jsonArr.push(writeEnum(field.T, value[i], true, options.enumAsInteger));
                        }
                        break;
                    case "message":
                        for (let i = 0; i < value.length; i++) {
                            jsonArr.push(wrapField(field.T, value[i]).toJson(options));
                        }
                        break;
                }
                return options.emitDefaultValues || jsonArr.length > 0
                    ? jsonArr
                    : undefined;
            }
            else {
                switch (field.kind) {
                    case "scalar":
                        return writeScalar(field.T, value, !!field.oneof || field.opt || options.emitDefaultValues);
                    case "enum":
                        return writeEnum(field.T, value, !!field.oneof || field.opt || options.emitDefaultValues, options.enumAsInteger);
                    case "message":
                        return value !== undefined
                            ? wrapField(field.T, value).toJson(options)
                            : undefined;
                }
            }
        };
    });
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/util-common.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.




/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-argument,no-case-declarations */
function makeUtilCommon() {
    return {
        setEnumType: setEnumType,
        initPartial(source, target) {
            if (source === undefined) {
                return;
            }
            const type = target.getType();
            for (const member of type.fields.byMember()) {
                const localName = member.localName, t = target, s = source;
                if (s[localName] === undefined) {
                    continue;
                }
                switch (member.kind) {
                    case "oneof":
                        const sk = s[localName].case;
                        if (sk === undefined) {
                            continue;
                        }
                        const sourceField = member.findField(sk);
                        let val = s[localName].value;
                        if (sourceField &&
                            sourceField.kind == "message" &&
                            !(val instanceof sourceField.T)) {
                            val = new sourceField.T(val);
                        }
                        t[localName] = { case: sk, value: val };
                        break;
                    case "scalar":
                    case "enum":
                        t[localName] = s[localName];
                        break;
                    case "map":
                        switch (member.V.kind) {
                            case "scalar":
                            case "enum":
                                Object.assign(t[localName], s[localName]);
                                break;
                            case "message":
                                const messageType = member.V.T;
                                for (const k of Object.keys(s[localName])) {
                                    let val = s[localName][k];
                                    if (!messageType.fieldWrapper) {
                                        // We only take partial input for messages that are not a wrapper type.
                                        // For those messages, we recursively normalize the partial input.
                                        val = new messageType(val);
                                    }
                                    t[localName][k] = val;
                                }
                                break;
                        }
                        break;
                    case "message":
                        const mt = member.T;
                        if (member.repeated) {
                            t[localName] = s[localName].map((val) => val instanceof mt ? val : new mt(val));
                        }
                        else if (s[localName] !== undefined) {
                            const val = s[localName];
                            if (mt.fieldWrapper) {
                                t[localName] = val;
                            }
                            else {
                                t[localName] = val instanceof mt ? val : new mt(val);
                            }
                        }
                        break;
                }
            }
        },
        equals(type, a, b) {
            if (a === b) {
                return true;
            }
            if (!a || !b) {
                return false;
            }
            return type.fields.byMember().every((m) => {
                const va = a[m.localName];
                const vb = b[m.localName];
                if (m.repeated) {
                    if (va.length !== vb.length) {
                        return false;
                    }
                    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- repeated fields are never "map"
                    switch (m.kind) {
                        case "message":
                            return va.every((a, i) => m.T.equals(a, vb[i]));
                        case "scalar":
                            return va.every((a, i) => scalarEquals(m.T, a, vb[i]));
                        case "enum":
                            return va.every((a, i) => scalarEquals(ScalarType.INT32, a, vb[i]));
                    }
                    throw new Error(`repeated cannot contain ${m.kind}`);
                }
                switch (m.kind) {
                    case "message":
                        return m.T.equals(va, vb);
                    case "enum":
                        return scalarEquals(ScalarType.INT32, va, vb);
                    case "scalar":
                        return scalarEquals(m.T, va, vb);
                    case "oneof":
                        if (va.case !== vb.case) {
                            return false;
                        }
                        const s = m.findField(va.case);
                        if (s === undefined) {
                            return true;
                        }
                        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- oneof fields are never "map"
                        switch (s.kind) {
                            case "message":
                                return s.T.equals(va.value, vb.value);
                            case "enum":
                                return scalarEquals(ScalarType.INT32, va.value, vb.value);
                            case "scalar":
                                return scalarEquals(s.T, va.value, vb.value);
                        }
                        throw new Error(`oneof cannot contain ${s.kind}`);
                    case "map":
                        const keys = Object.keys(va).concat(Object.keys(vb));
                        switch (m.V.kind) {
                            case "message":
                                const messageType = m.V.T;
                                return keys.every((k) => messageType.equals(va[k], vb[k]));
                            case "enum":
                                return keys.every((k) => scalarEquals(ScalarType.INT32, va[k], vb[k]));
                            case "scalar":
                                const scalarType = m.V.T;
                                return keys.every((k) => scalarEquals(scalarType, va[k], vb[k]));
                        }
                        break;
                }
            });
        },
        clone(message) {
            const type = message.getType(), target = new type(), any = target;
            for (const member of type.fields.byMember()) {
                const source = message[member.localName];
                let copy;
                if (member.repeated) {
                    copy = source.map((e) => cloneSingularField(member, e));
                }
                else if (member.kind == "map") {
                    copy = any[member.localName];
                    for (const [key, v] of Object.entries(source)) {
                        copy[key] = cloneSingularField(member.V, v);
                    }
                }
                else if (member.kind == "oneof") {
                    const f = member.findField(source.case);
                    copy = f
                        ? { case: source.case, value: cloneSingularField(f, source.value) }
                        : { case: undefined };
                }
                else {
                    copy = cloneSingularField(member, source);
                }
                any[member.localName] = copy;
            }
            return target;
        },
    };
}
// clone a single field value - i.e. the element type of repeated fields, the value type of maps
function cloneSingularField(field, value) {
    if (value === undefined) {
        return value;
    }
    if (value instanceof esm_message/* Message */.v) {
        return value.clone();
    }
    if (value instanceof Uint8Array) {
        const c = new Uint8Array(value.byteLength);
        c.set(value);
        return c;
    }
    return value;
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/field-list.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
class InternalFieldList {
    constructor(fields, normalizer) {
        this._fields = fields;
        this._normalizer = normalizer;
    }
    findJsonName(jsonName) {
        if (!this.jsonNames) {
            const t = {};
            for (const f of this.list()) {
                t[f.jsonName] = t[f.name] = f;
            }
            this.jsonNames = t;
        }
        return this.jsonNames[jsonName];
    }
    find(fieldNo) {
        if (!this.numbers) {
            const t = {};
            for (const f of this.list()) {
                t[f.no] = f;
            }
            this.numbers = t;
        }
        return this.numbers[fieldNo];
    }
    list() {
        if (!this.all) {
            this.all = this._normalizer(this._fields);
        }
        return this.all;
    }
    byNumber() {
        if (!this.numbersAsc) {
            this.numbersAsc = this.list()
                .concat()
                .sort((a, b) => a.no - b.no);
        }
        return this.numbersAsc;
    }
    byMember() {
        if (!this.members) {
            this.members = [];
            const a = this.members;
            let o;
            for (const f of this.list()) {
                if (f.oneof) {
                    if (f.oneof !== o) {
                        o = f.oneof;
                        a.push(o);
                    }
                }
                else {
                    a.push(f);
                }
            }
        }
        return this.members;
    }
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/names.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * Returns the name of a protobuf element in generated code.
 *
 * Field names - including oneofs - are converted to lowerCamelCase. For
 * messages, enumerations and services, the package name is stripped from
 * the type name. For nested messages and enumerations, the names are joined
 * with an underscore. For methods, the first character is made lowercase.
 */
function localName(desc) {
    switch (desc.kind) {
        case "field":
            return localFieldName(desc.name, desc.oneof !== undefined);
        case "oneof":
            return localOneofName(desc.name);
        case "enum":
        case "message":
        case "service": {
            const pkg = desc.file.proto.package;
            const offset = pkg === undefined ? 0 : pkg.length + 1;
            const name = desc.typeName.substring(offset).replace(/\./g, "_");
            // For services, we only care about safe identifiers, not safe object properties,
            // but we have shipped v1 with a bug that respected object properties, and we
            // do not want to introduce a breaking change, so we continue to escape for
            // safe object properties.
            // See https://github.com/bufbuild/protobuf-es/pull/391
            return safeObjectProperty(safeIdentifier(name));
        }
        case "enum_value": {
            const sharedPrefix = desc.parent.sharedPrefix;
            if (sharedPrefix === undefined) {
                return desc.name;
            }
            const name = desc.name.substring(sharedPrefix.length);
            return safeObjectProperty(name);
        }
        case "rpc": {
            let name = desc.name;
            if (name.length == 0) {
                return name;
            }
            name = name[0].toLowerCase() + name.substring(1);
            return safeObjectProperty(name);
        }
    }
}
/**
 * Returns the name of a field in generated code.
 */
function localFieldName(protoName, inOneof) {
    const name = protoCamelCase(protoName);
    if (inOneof) {
        // oneof member names are not properties, but values of the `case` property.
        return name;
    }
    return safeObjectProperty(safeMessageProperty(name));
}
/**
 * Returns the name of a oneof group in generated code.
 */
function localOneofName(protoName) {
    return localFieldName(protoName, false);
}
/**
 * Returns the JSON name for a protobuf field, exactly like protoc does.
 */
const fieldJsonName = protoCamelCase;
/**
 * Finds a prefix shared by enum values, for example `MY_ENUM_` for
 * `enum MyEnum {MY_ENUM_A=0; MY_ENUM_B=1;}`.
 */
function findEnumSharedPrefix(enumName, valueNames) {
    const prefix = camelToSnakeCase(enumName) + "_";
    for (const name of valueNames) {
        if (!name.toLowerCase().startsWith(prefix)) {
            return undefined;
        }
        const shortName = name.substring(prefix.length);
        if (shortName.length == 0) {
            return undefined;
        }
        if (/^\d/.test(shortName)) {
            // identifiers must not start with numbers
            return undefined;
        }
    }
    return prefix;
}
/**
 * Converts lowerCamelCase or UpperCamelCase into lower_snake_case.
 * This is used to find shared prefixes in an enum.
 */
function camelToSnakeCase(camel) {
    return (camel.substring(0, 1) + camel.substring(1).replace(/[A-Z]/g, (c) => "_" + c)).toLowerCase();
}
/**
 * Converts snake_case to protoCamelCase according to the convention
 * used by protoc to convert a field name to a JSON name.
 */
function protoCamelCase(snakeCase) {
    let capNext = false;
    const b = [];
    for (let i = 0; i < snakeCase.length; i++) {
        let c = snakeCase.charAt(i);
        switch (c) {
            case "_":
                capNext = true;
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                b.push(c);
                capNext = false;
                break;
            default:
                if (capNext) {
                    capNext = false;
                    c = c.toUpperCase();
                }
                b.push(c);
                break;
        }
    }
    return b.join("");
}
/**
 * Names that cannot be used for identifiers, such as class names,
 * but _can_ be used for object properties.
 */
const reservedIdentifiers = new Set([
    // ECMAScript 2015 keywords
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
    // ECMAScript 2015 future reserved keywords
    "enum",
    "implements",
    "interface",
    "let",
    "package",
    "private",
    "protected",
    "public",
    "static",
    // Class name cannot be 'Object' when targeting ES5 with module CommonJS
    "Object",
    // TypeScript keywords that cannot be used for types (as opposed to variables)
    "bigint",
    "number",
    "boolean",
    "string",
    "object",
    // Identifiers reserved for the runtime, so we can generate legible code
    "globalThis",
    "Uint8Array",
    "Partial",
]);
/**
 * Names that cannot be used for object properties because they are reserved
 * by built-in JavaScript properties.
 */
const reservedObjectProperties = new Set([
    // names reserved by JavaScript
    "constructor",
    "toString",
    "toJSON",
    "valueOf",
]);
/**
 * Names that cannot be used for object properties because they are reserved
 * by the runtime.
 */
const reservedMessageProperties = new Set([
    // names reserved by the runtime
    "getType",
    "clone",
    "equals",
    "fromBinary",
    "fromJson",
    "fromJsonString",
    "toBinary",
    "toJson",
    "toJsonString",
    // names reserved by the runtime for the future
    "toObject",
]);
const fallback = (name) => `${name}$`;
/**
 * Will wrap names that are Object prototype properties or names reserved
 * for `Message`s.
 */
const safeMessageProperty = (name) => {
    if (reservedMessageProperties.has(name)) {
        return fallback(name);
    }
    return name;
};
/**
 * Names that cannot be used for object properties because they are reserved
 * by built-in JavaScript properties.
 */
const safeObjectProperty = (name) => {
    if (reservedObjectProperties.has(name)) {
        return fallback(name);
    }
    return name;
};
/**
 * Names that can be used for identifiers or class properties
 */
const safeIdentifier = (name) => {
    if (reservedIdentifiers.has(name)) {
        return fallback(name);
    }
    return name;
};

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/private/field.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


class InternalOneofInfo {
    constructor(name) {
        this.kind = "oneof";
        this.repeated = false;
        this.packed = false;
        this.opt = false;
        this.default = undefined;
        this.fields = [];
        this.name = name;
        this.localName = localOneofName(name);
    }
    addField(field) {
        assert(field.oneof === this, `field ${field.name} not one of ${this.name}`);
        this.fields.push(field);
    }
    findField(localName) {
        if (!this._lookup) {
            this._lookup = Object.create(null);
            for (let i = 0; i < this.fields.length; i++) {
                this._lookup[this.fields[i].localName] = this.fields[i];
            }
        }
        return this._lookup[localName];
    }
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/proto3.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.









/**
 * Provides functionality for messages defined with the proto3 syntax.
 */
const proto3 = makeProtoRuntime("proto3", makeJsonFormatProto3(), makeBinaryFormatProto3(), Object.assign(Object.assign({}, makeUtilCommon()), { newFieldList(fields) {
        return new InternalFieldList(fields, normalizeFieldInfosProto3);
    },
    initFields(target) {
        for (const member of target.getType().fields.byMember()) {
            if (member.opt) {
                continue;
            }
            const name = member.localName, t = target;
            if (member.repeated) {
                t[name] = [];
                continue;
            }
            switch (member.kind) {
                case "oneof":
                    t[name] = { case: undefined };
                    break;
                case "enum":
                    t[name] = 0;
                    break;
                case "map":
                    t[name] = {};
                    break;
                case "scalar":
                    t[name] = scalarDefaultValue(member.T); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
                    break;
                case "message":
                    // message fields are always optional in proto3
                    break;
            }
        }
    } }));
/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument */
function normalizeFieldInfosProto3(fieldInfos) {
    var _a, _b, _c;
    const r = [];
    let o;
    for (const field of typeof fieldInfos == "function"
        ? fieldInfos()
        : fieldInfos) {
        const f = field;
        f.localName = localFieldName(field.name, field.oneof !== undefined);
        f.jsonName = (_a = field.jsonName) !== null && _a !== void 0 ? _a : fieldJsonName(field.name);
        f.repeated = (_b = field.repeated) !== null && _b !== void 0 ? _b : false;
        // From the proto3 language guide:
        // > In proto3, repeated fields of scalar numeric types are packed by default.
        // This information is incomplete - according to the conformance tests, BOOL
        // and ENUM are packed by default as well. This means only STRING and BYTES
        // are not packed by default, which makes sense because they are length-delimited.
        f.packed =
            (_c = field.packed) !== null && _c !== void 0 ? _c : (field.kind == "enum" ||
                (field.kind == "scalar" &&
                    field.T != ScalarType.BYTES &&
                    field.T != ScalarType.STRING));
        // We do not surface options at this time
        // f.options = field.options ?? emptyReadonlyObject;
        if (field.oneof !== undefined) {
            const ooname = typeof field.oneof == "string" ? field.oneof : field.oneof.name;
            if (!o || o.name != ooname) {
                o = new InternalOneofInfo(ooname);
            }
            f.oneof = o;
            o.addField(f);
        }
        r.push(f);
    }
    return r;
}

;// CONCATENATED MODULE: ../node_modules/@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb.js
// @generated by protoc-gen-es v1.2.1
// @generated from file penumbra/core/crypto/v1alpha1/crypto.proto (package penumbra.core.crypto.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck



/**
 * Specifies fees paid by a transaction.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.Fee
 */
const Fee = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.Fee",
  () => [
    { no: 1, name: "amount", kind: "message", T: Amount },
    { no: 2, name: "asset_id", kind: "message", T: AssetId },
  ],
);

/**
 * A Penumbra address.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.Address
 */
const Address = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.Address",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "alt_bech32m", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.AddressView
 */
const AddressView = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.AddressView",
  () => [
    { no: 1, name: "visible", kind: "message", T: AddressView_Visible, oneof: "address_view" },
    { no: 2, name: "opaque", kind: "message", T: AddressView_Opaque, oneof: "address_view" },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.AddressView.Visible
 */
const AddressView_Visible = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.AddressView.Visible",
  () => [
    { no: 1, name: "address", kind: "message", T: Address },
    { no: 2, name: "index", kind: "message", T: AddressIndex },
    { no: 3, name: "account_group_id", kind: "message", T: AccountGroupId },
  ],
  {localName: "AddressView_Visible"},
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.AddressView.Opaque
 */
const AddressView_Opaque = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.AddressView.Opaque",
  () => [
    { no: 1, name: "address", kind: "message", T: Address },
  ],
  {localName: "AddressView_Opaque"},
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.SpendKey
 */
const SpendKey = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.SpendKey",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.SpendVerificationKey
 */
const SpendVerificationKey = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.SpendVerificationKey",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.FullViewingKey
 */
const FullViewingKey = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.FullViewingKey",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.AccountGroupId
 */
const AccountGroupId = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.AccountGroupId",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.Diversifier
 */
const Diversifier = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.Diversifier",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.AddressIndex
 */
const AddressIndex = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.AddressIndex",
  () => [
    { no: 2, name: "account", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 3, name: "randomizer", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.StateCommitment
 */
const StateCommitment = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.StateCommitment",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.BalanceCommitment
 */
const BalanceCommitment = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.BalanceCommitment",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A Penumbra asset ID.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.AssetId
 */
const AssetId = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.AssetId",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "alt_bech32m", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "alt_base_denom", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.Amount
 */
const Amount = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.Amount",
  () => [
    { no: 1, name: "lo", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "hi", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.Denom
 */
const Denom = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.Denom",
  () => [
    { no: 1, name: "denom", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * DenomMetadata represents a struct that describes a basic token.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.DenomMetadata
 */
const DenomMetadata = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.DenomMetadata",
  () => [
    { no: 1, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "denom_units", kind: "message", T: DenomUnit, repeated: true },
    { no: 3, name: "base", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "display", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "symbol", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "uri", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 8, name: "uri_hash", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 1984, name: "penumbra_asset_id", kind: "message", T: AssetId },
  ],
);

/**
 * DenomUnit represents a struct that describes a given denomination unit of the basic token.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.DenomUnit
 */
const DenomUnit = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.DenomUnit",
  () => [
    { no: 1, name: "denom", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "exponent", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 3, name: "aliases", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.Value
 */
const Value = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.Value",
  () => [
    { no: 1, name: "amount", kind: "message", T: Amount },
    { no: 2, name: "asset_id", kind: "message", T: AssetId },
  ],
);

/**
 * Represents a value of a known or unknown denomination.
 *
 * Note: unlike some other View types, we don't just store the underlying
 * `Value` message together with an additional `Denom`.  Instead, we record
 * either an `Amount` and `Denom` (only) or an `Amount` and `AssetId`.  This is
 * because we don't want to allow a situation where the supplied `Denom` doesn't
 * match the `AssetId`, and a consumer of the API that doesn't check is tricked.
 * This way, the `Denom` will always match, because the consumer is forced to
 * recompute it themselves if they want it.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.ValueView
 */
const ValueView = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.ValueView",
  () => [
    { no: 1, name: "known_denom", kind: "message", T: ValueView_KnownDenom, oneof: "value_view" },
    { no: 2, name: "unknown_denom", kind: "message", T: ValueView_UnknownDenom, oneof: "value_view" },
  ],
);

/**
 * A value whose asset ID has a known denomination.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.ValueView.KnownDenom
 */
const ValueView_KnownDenom = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.ValueView.KnownDenom",
  () => [
    { no: 1, name: "amount", kind: "message", T: Amount },
    { no: 2, name: "denom", kind: "message", T: DenomMetadata },
  ],
  {localName: "ValueView_KnownDenom"},
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.ValueView.UnknownDenom
 */
const ValueView_UnknownDenom = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.ValueView.UnknownDenom",
  () => [
    { no: 1, name: "amount", kind: "message", T: Amount },
    { no: 2, name: "asset_id", kind: "message", T: AssetId },
  ],
  {localName: "ValueView_UnknownDenom"},
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.MerkleRoot
 */
const MerkleRoot = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.MerkleRoot",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A validator's identity key (decaf377-rdsa spendauth verification key).
 *
 * @generated from message penumbra.core.crypto.v1alpha1.IdentityKey
 */
const IdentityKey = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.IdentityKey",
  () => [
    { no: 1, name: "ik", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A validator's governance key (decaf377-rdsa spendauth verification key).
 *
 * @generated from message penumbra.core.crypto.v1alpha1.GovernanceKey
 */
const GovernanceKey = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.GovernanceKey",
  () => [
    { no: 1, name: "gk", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.ConsensusKey
 */
const ConsensusKey = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.ConsensusKey",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.Note
 */
const Note = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.Note",
  () => [
    { no: 1, name: "value", kind: "message", T: Value },
    { no: 2, name: "rseed", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "address", kind: "message", T: Address },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.NoteView
 */
const NoteView = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.NoteView",
  () => [
    { no: 1, name: "value", kind: "message", T: ValueView },
    { no: 2, name: "rseed", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "address", kind: "message", T: AddressView },
  ],
);

/**
 * An encrypted note.
 * 132 = 1(type) + 11(d) + 8(amount) + 32(asset_id) + 32(rcm) + 32(pk_d) + 16(MAC) bytes.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.NoteCiphertext
 */
const NoteCiphertext = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.NoteCiphertext",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.Nullifier
 */
const Nullifier = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.Nullifier",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.SpendAuthSignature
 */
const SpendAuthSignature = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.SpendAuthSignature",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.crypto.v1alpha1.BindingSignature
 */
const BindingSignature = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.BindingSignature",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * The body of an output description, including only the minimal
 * data required to scan and process the output.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.NotePayload
 */
const NotePayload = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.NotePayload",
  () => [
    { no: 1, name: "note_commitment", kind: "message", T: StateCommitment },
    { no: 2, name: "ephemeral_key", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "encrypted_note", kind: "message", T: NoteCiphertext },
  ],
);

/**
 * An authentication path from a state commitment to the root of the state commitment tree.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.StateCommitmentProof
 */
const StateCommitmentProof = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.StateCommitmentProof",
  () => [
    { no: 1, name: "note_commitment", kind: "message", T: StateCommitment },
    { no: 2, name: "position", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "auth_path", kind: "message", T: MerklePathChunk, repeated: true },
  ],
);

/**
 * A set of 3 sibling hashes in the auth path for some note commitment.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.MerklePathChunk
 */
const MerklePathChunk = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.MerklePathChunk",
  () => [
    { no: 1, name: "sibling_1", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "sibling_2", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "sibling_3", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A clue for use with Fuzzy Message Detection.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.Clue
 */
const Clue = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.Clue",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * An authorization hash for a Penumbra transaction.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.EffectHash
 */
const EffectHash = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.EffectHash",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A Penumbra ZK output proof.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.ZKOutputProof
 */
const ZKOutputProof = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.ZKOutputProof",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A Penumbra ZK spend proof.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.ZKSpendProof
 */
const ZKSpendProof = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.ZKSpendProof",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A Penumbra ZK swap proof.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.ZKSwapProof
 */
const ZKSwapProof = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.ZKSwapProof",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A Penumbra ZK swap claim proof.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.ZKSwapClaimProof
 */
const ZKSwapClaimProof = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.ZKSwapClaimProof",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A Penumbra ZK undelegate claim proof.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.ZKUndelegateClaimProof
 */
const ZKUndelegateClaimProof = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.ZKUndelegateClaimProof",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A Penumbra ZK delegator vote proof.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.ZKDelegatorVoteProof
 */
const ZKDelegatorVoteProof = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.ZKDelegatorVoteProof",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A Penumbra ZK nullifier derivation proof.
 *
 * @generated from message penumbra.core.crypto.v1alpha1.ZKNullifierDerivationProof
 */
const ZKNullifierDerivationProof = proto3.makeMessageType(
  "penumbra.core.crypto.v1alpha1.ZKNullifierDerivationProof",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);


;// CONCATENATED MODULE: ../node_modules/@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/dex/v1alpha1/dex_pb.js
// @generated by protoc-gen-es v1.2.1
// @generated from file penumbra/core/dex/v1alpha1/dex.proto (package penumbra.core.dex.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck




/**
 * A transaction action that submits a swap to the dex.
 *
 * @generated from message penumbra.core.dex.v1alpha1.Swap
 */
const Swap = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.Swap",
  () => [
    { no: 1, name: "proof", kind: "message", T: ZKSwapProof },
    { no: 4, name: "body", kind: "message", T: SwapBody },
  ],
);

/**
 * A transaction action that obtains assets previously confirmed
 * via a Swap transaction. Does not include a spend authorization
 * signature, as it is only capable of consuming the NFT from a
 * Swap transaction.
 *
 * @generated from message penumbra.core.dex.v1alpha1.SwapClaim
 */
const SwapClaim = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapClaim",
  () => [
    { no: 1, name: "proof", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "body", kind: "message", T: SwapClaimBody },
    { no: 7, name: "epoch_duration", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * Encapsulates the authorized fields of the SwapClaim action, used in signing.
 *
 * @generated from message penumbra.core.dex.v1alpha1.SwapClaimBody
 */
const SwapClaimBody = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapClaimBody",
  () => [
    { no: 1, name: "nullifier", kind: "message", T: Nullifier },
    { no: 2, name: "fee", kind: "message", T: Fee },
    { no: 3, name: "output_1_commitment", kind: "message", T: StateCommitment },
    { no: 4, name: "output_2_commitment", kind: "message", T: StateCommitment },
    { no: 6, name: "output_data", kind: "message", T: BatchSwapOutputData },
  ],
);

/**
 * The authorized data of a Swap transaction.
 *
 * @generated from message penumbra.core.dex.v1alpha1.SwapBody
 */
const SwapBody = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapBody",
  () => [
    { no: 1, name: "trading_pair", kind: "message", T: TradingPair },
    { no: 2, name: "delta_1_i", kind: "message", T: Amount },
    { no: 3, name: "delta_2_i", kind: "message", T: Amount },
    { no: 4, name: "fee_commitment", kind: "message", T: BalanceCommitment },
    { no: 5, name: "payload", kind: "message", T: SwapPayload },
  ],
);

/**
 * @generated from message penumbra.core.dex.v1alpha1.SwapPayload
 */
const SwapPayload = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapPayload",
  () => [
    { no: 1, name: "commitment", kind: "message", T: StateCommitment },
    { no: 2, name: "encrypted_swap", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.dex.v1alpha1.SwapPlaintext
 */
const SwapPlaintext = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapPlaintext",
  () => [
    { no: 1, name: "trading_pair", kind: "message", T: TradingPair },
    { no: 2, name: "delta_1_i", kind: "message", T: Amount },
    { no: 3, name: "delta_2_i", kind: "message", T: Amount },
    { no: 4, name: "claim_fee", kind: "message", T: Fee },
    { no: 5, name: "claim_address", kind: "message", T: Address },
    { no: 6, name: "rseed", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.dex.v1alpha1.MockFlowCiphertext
 */
const MockFlowCiphertext = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.MockFlowCiphertext",
  () => [
    { no: 1, name: "value", kind: "message", T: Amount },
  ],
);

/**
 * @generated from message penumbra.core.dex.v1alpha1.SwapPlan
 */
const SwapPlan = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapPlan",
  () => [
    { no: 1, name: "swap_plaintext", kind: "message", T: SwapPlaintext },
    { no: 2, name: "fee_blinding", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.dex.v1alpha1.SwapClaimPlan
 */
const SwapClaimPlan = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapClaimPlan",
  () => [
    { no: 1, name: "swap_plaintext", kind: "message", T: SwapPlaintext },
    { no: 2, name: "position", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "output_data", kind: "message", T: BatchSwapOutputData },
    { no: 4, name: "epoch_duration", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * @generated from message penumbra.core.dex.v1alpha1.SwapView
 */
const SwapView = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapView",
  () => [
    { no: 1, name: "visible", kind: "message", T: SwapView_Visible, oneof: "swap_view" },
    { no: 2, name: "opaque", kind: "message", T: SwapView_Opaque, oneof: "swap_view" },
  ],
);

/**
 * @generated from message penumbra.core.dex.v1alpha1.SwapView.Visible
 */
const SwapView_Visible = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapView.Visible",
  () => [
    { no: 1, name: "swap", kind: "message", T: Swap },
    { no: 3, name: "swap_plaintext", kind: "message", T: SwapPlaintext },
  ],
  {localName: "SwapView_Visible"},
);

/**
 * @generated from message penumbra.core.dex.v1alpha1.SwapView.Opaque
 */
const SwapView_Opaque = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapView.Opaque",
  () => [
    { no: 1, name: "swap", kind: "message", T: Swap },
  ],
  {localName: "SwapView_Opaque"},
);

/**
 * @generated from message penumbra.core.dex.v1alpha1.SwapClaimView
 */
const SwapClaimView = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapClaimView",
  () => [
    { no: 1, name: "visible", kind: "message", T: SwapClaimView_Visible, oneof: "swap_claim_view" },
    { no: 2, name: "opaque", kind: "message", T: SwapClaimView_Opaque, oneof: "swap_claim_view" },
  ],
);

/**
 * @generated from message penumbra.core.dex.v1alpha1.SwapClaimView.Visible
 */
const SwapClaimView_Visible = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapClaimView.Visible",
  () => [
    { no: 1, name: "swap_claim", kind: "message", T: SwapClaim },
    { no: 2, name: "output_1", kind: "message", T: NoteView },
    { no: 3, name: "output_2", kind: "message", T: NoteView },
  ],
  {localName: "SwapClaimView_Visible"},
);

/**
 * @generated from message penumbra.core.dex.v1alpha1.SwapClaimView.Opaque
 */
const SwapClaimView_Opaque = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapClaimView.Opaque",
  () => [
    { no: 1, name: "swap_claim", kind: "message", T: SwapClaim },
  ],
  {localName: "SwapClaimView_Opaque"},
);

/**
 * Holds two asset IDs. Ordering doesn't reflect trading direction. Instead, we
 * require `asset_1 < asset_2` as field elements, to ensure a canonical
 * representation of an unordered pair.
 *
 * @generated from message penumbra.core.dex.v1alpha1.TradingPair
 */
const TradingPair = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.TradingPair",
  () => [
    { no: 1, name: "asset_1", kind: "message", T: AssetId },
    { no: 2, name: "asset_2", kind: "message", T: AssetId },
  ],
);

/**
 * Encodes a trading pair starting from asset `start`
 * and ending on asset `end`.
 *
 * @generated from message penumbra.core.dex.v1alpha1.DirectedTradingPair
 */
const DirectedTradingPair = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.DirectedTradingPair",
  () => [
    { no: 1, name: "start", kind: "message", T: AssetId },
    { no: 2, name: "end", kind: "message", T: AssetId },
  ],
);

/**
 * Records the result of a batch swap on-chain.
 *
 * Used as a public input to a swap claim proof, as it implies the effective
 * clearing price for the batch.
 *
 * @generated from message penumbra.core.dex.v1alpha1.BatchSwapOutputData
 */
const BatchSwapOutputData = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.BatchSwapOutputData",
  () => [
    { no: 1, name: "delta_1", kind: "message", T: Amount },
    { no: 2, name: "delta_2", kind: "message", T: Amount },
    { no: 3, name: "lambda_1", kind: "message", T: Amount },
    { no: 4, name: "lambda_2", kind: "message", T: Amount },
    { no: 5, name: "unfilled_1", kind: "message", T: Amount },
    { no: 6, name: "unfilled_2", kind: "message", T: Amount },
    { no: 7, name: "height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 8, name: "trading_pair", kind: "message", T: TradingPair },
    { no: 9, name: "epoch_starting_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * The trading function for a specific pair.
 * For a pair (asset_1, asset_2), a trading function is defined by:
 * `phi(R) = p*R_1 + q*R_2` and `gamma = 1 - fee`.
 * The trading function is frequently referred to as "phi".
 *
 * @generated from message penumbra.core.dex.v1alpha1.TradingFunction
 */
const TradingFunction = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.TradingFunction",
  () => [
    { no: 1, name: "component", kind: "message", T: BareTradingFunction },
    { no: 2, name: "pair", kind: "message", T: TradingPair },
  ],
);

/**
 * The minimum amount of data describing a trading function.
 *
 * This implicitly treats the trading function as being between assets 1 and 2,
 * without specifying what those assets are, to avoid duplicating data (each
 * asset ID alone is twice the size of the trading function).
 *
 * @generated from message penumbra.core.dex.v1alpha1.BareTradingFunction
 */
const BareTradingFunction = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.BareTradingFunction",
  () => [
    { no: 1, name: "fee", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 2, name: "p", kind: "message", T: Amount },
    { no: 3, name: "q", kind: "message", T: Amount },
  ],
);

/**
 * The reserves of a position.
 *
 * Like a position, this implicitly treats the trading function as being
 * between assets 1 and 2, without specifying what those assets are, to avoid
 * duplicating data (each asset ID alone is four times the size of the
 * reserves).
 *
 * @generated from message penumbra.core.dex.v1alpha1.Reserves
 */
const Reserves = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.Reserves",
  () => [
    { no: 1, name: "r1", kind: "message", T: Amount },
    { no: 2, name: "r2", kind: "message", T: Amount },
  ],
);

/**
 * Data identifying a position.
 *
 * @generated from message penumbra.core.dex.v1alpha1.Position
 */
const Position = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.Position",
  () => [
    { no: 1, name: "phi", kind: "message", T: TradingFunction },
    { no: 2, name: "nonce", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "state", kind: "message", T: PositionState },
    { no: 4, name: "reserves", kind: "message", T: Reserves },
  ],
);

/**
 * A hash of a `Position`.
 *
 * @generated from message penumbra.core.dex.v1alpha1.PositionId
 */
const PositionId = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.PositionId",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "alt_bech32m", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * The state of a position.
 *
 * @generated from message penumbra.core.dex.v1alpha1.PositionState
 */
const PositionState = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.PositionState",
  () => [
    { no: 1, name: "state", kind: "enum", T: proto3.getEnumType(PositionState_PositionStateEnum) },
  ],
);

/**
 * @generated from enum penumbra.core.dex.v1alpha1.PositionState.PositionStateEnum
 */
const PositionState_PositionStateEnum = proto3.makeEnum(
  "penumbra.core.dex.v1alpha1.PositionState.PositionStateEnum",
  [
    {no: 0, name: "POSITION_STATE_ENUM_UNSPECIFIED", localName: "UNSPECIFIED"},
    {no: 1, name: "POSITION_STATE_ENUM_OPENED", localName: "OPENED"},
    {no: 2, name: "POSITION_STATE_ENUM_CLOSED", localName: "CLOSED"},
    {no: 3, name: "POSITION_STATE_ENUM_WITHDRAWN", localName: "WITHDRAWN"},
    {no: 4, name: "POSITION_STATE_ENUM_CLAIMED", localName: "CLAIMED"},
  ],
);

/**
 * An LPNFT tracking both ownership and state of a position.
 *
 * Tracking the state as part of the LPNFT means that all LP-related actions can
 * be authorized by spending funds: a state transition (e.g., closing a
 * position) is modeled as spending an "open position LPNFT" and minting a
 * "closed position LPNFT" for the same (globally unique) position ID.
 *
 * This means that the LP mechanics can be agnostic to the mechanism used to
 * record custody and spend authorization.  For instance, they can be recorded
 * in the shielded pool, where custody is based on off-chain keys, or they could
 * be recorded in a programmatic on-chain account (in the future, e.g., to
 * support interchain accounts).  This also means that LP-related actions don't
 * require any cryptographic implementation (proofs, signatures, etc), other
 * than hooking into the value commitment mechanism used for transaction
 * balances.
 *
 * @generated from message penumbra.core.dex.v1alpha1.LpNft
 */
const LpNft = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.LpNft",
  () => [
    { no: 1, name: "position_id", kind: "message", T: PositionId },
    { no: 2, name: "state", kind: "message", T: PositionState },
  ],
);

/**
 * A transaction action that opens a new position.
 *
 * This action's contribution to the transaction's value balance is to consume
 * the initial reserves and contribute an opened position NFT.
 *
 * @generated from message penumbra.core.dex.v1alpha1.PositionOpen
 */
const PositionOpen = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.PositionOpen",
  () => [
    { no: 1, name: "position", kind: "message", T: Position },
  ],
);

/**
 * A transaction action that closes a position.
 *
 * This action's contribution to the transaction's value balance is to consume
 * an opened position NFT and contribute a closed position NFT.
 *
 * Closing a position does not immediately withdraw funds, because Penumbra
 * transactions (like any ZK transaction model) are early-binding: the prover
 * must know the state transition they prove knowledge of, and they cannot know
 * the final reserves with certainty until after the position has been deactivated.
 *
 * @generated from message penumbra.core.dex.v1alpha1.PositionClose
 */
const PositionClose = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.PositionClose",
  () => [
    { no: 1, name: "position_id", kind: "message", T: PositionId },
  ],
);

/**
 * A transaction action that withdraws funds from a closed position.
 *
 * This action's contribution to the transaction's value balance is to consume a
 * closed position NFT and contribute a withdrawn position NFT, as well as all
 * of the funds that were in the position at the time of closing.
 *
 * @generated from message penumbra.core.dex.v1alpha1.PositionWithdraw
 */
const PositionWithdraw = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.PositionWithdraw",
  () => [
    { no: 1, name: "position_id", kind: "message", T: PositionId },
    { no: 2, name: "reserves_commitment", kind: "message", T: BalanceCommitment },
  ],
);

/**
 * A transaction action that claims retroactive rewards for a historical
 * position.
 *
 * This action's contribution to the transaction's value balance is to consume a
 * withdrawn position NFT and contribute its reward balance.
 *
 * @generated from message penumbra.core.dex.v1alpha1.PositionRewardClaim
 */
const PositionRewardClaim = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.PositionRewardClaim",
  () => [
    { no: 1, name: "position_id", kind: "message", T: PositionId },
    { no: 2, name: "rewards_commitment", kind: "message", T: BalanceCommitment },
  ],
);

/**
 * Contains the entire execution of a particular swap.
 *
 * @generated from message penumbra.core.dex.v1alpha1.SwapExecution
 */
const SwapExecution = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapExecution",
  () => [
    { no: 1, name: "traces", kind: "message", T: SwapExecution_Trace, repeated: true },
    { no: 2, name: "input", kind: "message", T: Value },
    { no: 3, name: "output", kind: "message", T: Value },
  ],
);

/**
 * Contains all individual steps consisting of a trade trace.
 *
 * @generated from message penumbra.core.dex.v1alpha1.SwapExecution.Trace
 */
const SwapExecution_Trace = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.SwapExecution.Trace",
  () => [
    { no: 1, name: "value", kind: "message", T: Value, repeated: true },
  ],
  {localName: "SwapExecution_Trace"},
);

/**
 * Contains private and public data for withdrawing funds from a closed position.
 *
 * @generated from message penumbra.core.dex.v1alpha1.PositionWithdrawPlan
 */
const PositionWithdrawPlan = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.PositionWithdrawPlan",
  () => [
    { no: 1, name: "reserves", kind: "message", T: Reserves },
    { no: 2, name: "position_id", kind: "message", T: PositionId },
    { no: 3, name: "pair", kind: "message", T: TradingPair },
  ],
);

/**
 * Contains private and public data for claiming rewards from a position.
 *
 * @generated from message penumbra.core.dex.v1alpha1.PositionRewardClaimPlan
 */
const PositionRewardClaimPlan = proto3.makeMessageType(
  "penumbra.core.dex.v1alpha1.PositionRewardClaimPlan",
  () => [
    { no: 1, name: "reserves", kind: "message", T: Reserves },
  ],
);


;// CONCATENATED MODULE: ../node_modules/@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/stake/v1alpha1/stake_pb.js
// @generated by protoc-gen-es v1.2.1
// @generated from file penumbra/core/stake/v1alpha1/stake.proto (package penumbra.core.stake.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck




/**
 * Describes a validator's configuration data.
 *
 * @generated from message penumbra.core.stake.v1alpha1.Validator
 */
const Validator = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.Validator",
  () => [
    { no: 1, name: "identity_key", kind: "message", T: IdentityKey },
    { no: 2, name: "consensus_key", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "website", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 8, name: "enabled", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 6, name: "funding_streams", kind: "message", T: FundingStream, repeated: true },
    { no: 7, name: "sequence_number", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 9, name: "governance_key", kind: "message", T: GovernanceKey },
  ],
);

/**
 * For storing the list of keys of known validators.
 *
 * @generated from message penumbra.core.stake.v1alpha1.ValidatorList
 */
const ValidatorList = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.ValidatorList",
  () => [
    { no: 1, name: "validator_keys", kind: "message", T: IdentityKey, repeated: true },
  ],
);

/**
 * A portion of a validator's commission.
 *
 * @generated from message penumbra.core.stake.v1alpha1.FundingStream
 */
const FundingStream = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.FundingStream",
  () => [
    { no: 1, name: "to_address", kind: "message", T: FundingStream_ToAddress, oneof: "recipient" },
    { no: 2, name: "to_dao", kind: "message", T: FundingStream_ToDao, oneof: "recipient" },
  ],
);

/**
 * @generated from message penumbra.core.stake.v1alpha1.FundingStream.ToAddress
 */
const FundingStream_ToAddress = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.FundingStream.ToAddress",
  () => [
    { no: 1, name: "address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "rate_bps", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
  ],
  {localName: "FundingStream_ToAddress"},
);

/**
 * @generated from message penumbra.core.stake.v1alpha1.FundingStream.ToDao
 */
const FundingStream_ToDao = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.FundingStream.ToDao",
  () => [
    { no: 2, name: "rate_bps", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
  ],
  {localName: "FundingStream_ToDao"},
);

/**
 * Describes the reward and exchange rates and voting power for a validator in some epoch.
 *
 * @generated from message penumbra.core.stake.v1alpha1.RateData
 */
const RateData = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.RateData",
  () => [
    { no: 1, name: "identity_key", kind: "message", T: IdentityKey },
    { no: 2, name: "epoch_index", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 4, name: "validator_reward_rate", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 5, name: "validator_exchange_rate", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * Describes the base reward and exchange rates in some epoch.
 *
 * @generated from message penumbra.core.stake.v1alpha1.BaseRateData
 */
const BaseRateData = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.BaseRateData",
  () => [
    { no: 1, name: "epoch_index", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "base_reward_rate", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "base_exchange_rate", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * Describes the current state of a validator on-chain
 *
 * @generated from message penumbra.core.stake.v1alpha1.ValidatorStatus
 */
const ValidatorStatus = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.ValidatorStatus",
  () => [
    { no: 1, name: "identity_key", kind: "message", T: IdentityKey },
    { no: 2, name: "state", kind: "message", T: ValidatorState },
    { no: 3, name: "voting_power", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 4, name: "bonding_state", kind: "message", T: BondingState },
  ],
);

/**
 * Describes the unbonding state of a validator's stake pool.
 *
 * @generated from message penumbra.core.stake.v1alpha1.BondingState
 */
const BondingState = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.BondingState",
  () => [
    { no: 1, name: "state", kind: "enum", T: proto3.getEnumType(BondingState_BondingStateEnum) },
    { no: 2, name: "unbonding_epoch", kind: "scalar", T: 4 /* ScalarType.UINT64 */, opt: true },
  ],
);

/**
 * @generated from enum penumbra.core.stake.v1alpha1.BondingState.BondingStateEnum
 */
const BondingState_BondingStateEnum = proto3.makeEnum(
  "penumbra.core.stake.v1alpha1.BondingState.BondingStateEnum",
  [
    {no: 0, name: "BONDING_STATE_ENUM_UNSPECIFIED", localName: "UNSPECIFIED"},
    {no: 1, name: "BONDING_STATE_ENUM_BONDED", localName: "BONDED"},
    {no: 2, name: "BONDING_STATE_ENUM_UNBONDING", localName: "UNBONDING"},
    {no: 3, name: "BONDING_STATE_ENUM_UNBONDED", localName: "UNBONDED"},
  ],
);

/**
 * Describes the state of a validator
 *
 * @generated from message penumbra.core.stake.v1alpha1.ValidatorState
 */
const ValidatorState = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.ValidatorState",
  () => [
    { no: 1, name: "state", kind: "enum", T: proto3.getEnumType(ValidatorState_ValidatorStateEnum) },
  ],
);

/**
 * @generated from enum penumbra.core.stake.v1alpha1.ValidatorState.ValidatorStateEnum
 */
const ValidatorState_ValidatorStateEnum = proto3.makeEnum(
  "penumbra.core.stake.v1alpha1.ValidatorState.ValidatorStateEnum",
  [
    {no: 0, name: "VALIDATOR_STATE_ENUM_UNSPECIFIED", localName: "UNSPECIFIED"},
    {no: 1, name: "VALIDATOR_STATE_ENUM_INACTIVE", localName: "INACTIVE"},
    {no: 2, name: "VALIDATOR_STATE_ENUM_ACTIVE", localName: "ACTIVE"},
    {no: 3, name: "VALIDATOR_STATE_ENUM_JAILED", localName: "JAILED"},
    {no: 4, name: "VALIDATOR_STATE_ENUM_TOMBSTONED", localName: "TOMBSTONED"},
    {no: 5, name: "VALIDATOR_STATE_ENUM_DISABLED", localName: "DISABLED"},
  ],
);

/**
 * Combines all validator info into a single packet.
 *
 * @generated from message penumbra.core.stake.v1alpha1.ValidatorInfo
 */
const ValidatorInfo = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.ValidatorInfo",
  () => [
    { no: 1, name: "validator", kind: "message", T: Validator },
    { no: 2, name: "status", kind: "message", T: ValidatorStatus },
    { no: 3, name: "rate_data", kind: "message", T: RateData },
  ],
);

/**
 * A transaction action (re)defining a validator.
 *
 * @generated from message penumbra.core.stake.v1alpha1.ValidatorDefinition
 */
const ValidatorDefinition = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.ValidatorDefinition",
  () => [
    { no: 1, name: "validator", kind: "message", T: Validator },
    { no: 2, name: "auth_sig", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A transaction action adding stake to a validator's delegation pool.
 *
 * @generated from message penumbra.core.stake.v1alpha1.Delegate
 */
const Delegate = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.Delegate",
  () => [
    { no: 1, name: "validator_identity", kind: "message", T: IdentityKey },
    { no: 2, name: "epoch_index", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "unbonded_amount", kind: "message", T: Amount },
    { no: 4, name: "delegation_amount", kind: "message", T: Amount },
  ],
);

/**
 * A transaction action withdrawing stake from a validator's delegation pool.
 *
 * @generated from message penumbra.core.stake.v1alpha1.Undelegate
 */
const Undelegate = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.Undelegate",
  () => [
    { no: 1, name: "validator_identity", kind: "message", T: IdentityKey },
    { no: 2, name: "start_epoch_index", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "unbonded_amount", kind: "message", T: Amount },
    { no: 4, name: "delegation_amount", kind: "message", T: Amount },
  ],
);

/**
 * A transaction action finishing an undelegation, converting (slashable)
 * "unbonding tokens" to (unslashable) staking tokens.
 *
 * @generated from message penumbra.core.stake.v1alpha1.UndelegateClaim
 */
const UndelegateClaim = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.UndelegateClaim",
  () => [
    { no: 1, name: "body", kind: "message", T: UndelegateClaimBody },
    { no: 2, name: "proof", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.stake.v1alpha1.UndelegateClaimBody
 */
const UndelegateClaimBody = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.UndelegateClaimBody",
  () => [
    { no: 1, name: "validator_identity", kind: "message", T: IdentityKey },
    { no: 2, name: "start_epoch_index", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "penalty", kind: "message", T: Penalty },
    { no: 4, name: "balance_commitment", kind: "message", T: BalanceCommitment },
  ],
);

/**
 * @generated from message penumbra.core.stake.v1alpha1.UndelegateClaimPlan
 */
const UndelegateClaimPlan = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.UndelegateClaimPlan",
  () => [
    { no: 1, name: "validator_identity", kind: "message", T: IdentityKey },
    { no: 2, name: "start_epoch_index", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 4, name: "penalty", kind: "message", T: Penalty },
    { no: 5, name: "unbonding_amount", kind: "message", T: Amount },
    { no: 6, name: "balance_blinding", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A list of pending delegations and undelegations.
 *
 * @generated from message penumbra.core.stake.v1alpha1.DelegationChanges
 */
const DelegationChanges = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.DelegationChanges",
  () => [
    { no: 1, name: "delegations", kind: "message", T: Delegate, repeated: true },
    { no: 2, name: "undelegations", kind: "message", T: Undelegate, repeated: true },
  ],
);

/**
 * Track's a validator's uptime.
 *
 * @generated from message penumbra.core.stake.v1alpha1.Uptime
 */
const Uptime = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.Uptime",
  () => [
    { no: 1, name: "as_of_block_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "window_len", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 3, name: "bitvec", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * Tracks our view of Tendermint's view of the validator set, so we can keep it
 * from getting confused.
 *
 * @generated from message penumbra.core.stake.v1alpha1.CurrentConsensusKeys
 */
const CurrentConsensusKeys = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.CurrentConsensusKeys",
  () => [
    { no: 1, name: "consensus_keys", kind: "message", T: ConsensusKey, repeated: true },
  ],
);

/**
 * Tracks slashing penalties applied to a validator in some epoch.
 *
 * @generated from message penumbra.core.stake.v1alpha1.Penalty
 */
const Penalty = proto3.makeMessageType(
  "penumbra.core.stake.v1alpha1.Penalty",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);


;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/any_pb.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * `Any` contains an arbitrary serialized protocol buffer message along with a
 * URL that describes the type of the serialized message.
 *
 * Protobuf library provides support to pack/unpack Any values in the form
 * of utility functions or additional generated methods of the Any type.
 *
 * Example 1: Pack and unpack a message in C++.
 *
 *     Foo foo = ...;
 *     Any any;
 *     any.PackFrom(foo);
 *     ...
 *     if (any.UnpackTo(&foo)) {
 *       ...
 *     }
 *
 * Example 2: Pack and unpack a message in Java.
 *
 *     Foo foo = ...;
 *     Any any = Any.pack(foo);
 *     ...
 *     if (any.is(Foo.class)) {
 *       foo = any.unpack(Foo.class);
 *     }
 *     // or ...
 *     if (any.isSameTypeAs(Foo.getDefaultInstance())) {
 *       foo = any.unpack(Foo.getDefaultInstance());
 *     }
 *
 *  Example 3: Pack and unpack a message in Python.
 *
 *     foo = Foo(...)
 *     any = Any()
 *     any.Pack(foo)
 *     ...
 *     if any.Is(Foo.DESCRIPTOR):
 *       any.Unpack(foo)
 *       ...
 *
 *  Example 4: Pack and unpack a message in Go
 *
 *      foo := &pb.Foo{...}
 *      any, err := anypb.New(foo)
 *      if err != nil {
 *        ...
 *      }
 *      ...
 *      foo := &pb.Foo{}
 *      if err := any.UnmarshalTo(foo); err != nil {
 *        ...
 *      }
 *
 * The pack methods provided by protobuf library will by default use
 * 'type.googleapis.com/full.type.name' as the type URL and the unpack
 * methods only use the fully qualified type name after the last '/'
 * in the type URL, for example "foo.bar.com/x/y.z" will yield type
 * name "y.z".
 *
 * JSON
 * ====
 * The JSON representation of an `Any` value uses the regular
 * representation of the deserialized, embedded message, with an
 * additional field `@type` which contains the type URL. Example:
 *
 *     package google.profile;
 *     message Person {
 *       string first_name = 1;
 *       string last_name = 2;
 *     }
 *
 *     {
 *       "@type": "type.googleapis.com/google.profile.Person",
 *       "firstName": <string>,
 *       "lastName": <string>
 *     }
 *
 * If the embedded message type is well-known and has a custom JSON
 * representation, that representation will be embedded adding a field
 * `value` which holds the custom JSON in addition to the `@type`
 * field. Example (for message [google.protobuf.Duration][]):
 *
 *     {
 *       "@type": "type.googleapis.com/google.protobuf.Duration",
 *       "value": "1.212s"
 *     }
 *
 *
 * @generated from message google.protobuf.Any
 */
class Any extends esm_message/* Message */.v {
    constructor(data) {
        super();
        /**
         * A URL/resource name that uniquely identifies the type of the serialized
         * protocol buffer message. This string must contain at least
         * one "/" character. The last segment of the URL's path must represent
         * the fully qualified name of the type (as in
         * `path/google.protobuf.Duration`). The name should be in a canonical form
         * (e.g., leading "." is not accepted).
         *
         * In practice, teams usually precompile into the binary all types that they
         * expect it to use in the context of Any. However, for URLs which use the
         * scheme `http`, `https`, or no scheme, one can optionally set up a type
         * server that maps type URLs to message definitions as follows:
         *
         * * If no scheme is provided, `https` is assumed.
         * * An HTTP GET on the URL must yield a [google.protobuf.Type][]
         *   value in binary format, or produce an error.
         * * Applications are allowed to cache lookup results based on the
         *   URL, or have them precompiled into a binary to avoid any
         *   lookup. Therefore, binary compatibility needs to be preserved
         *   on changes to types. (Use versioned type names to manage
         *   breaking changes.)
         *
         * Note: this functionality is not currently available in the official
         * protobuf release, and it is not used for type URLs beginning with
         * type.googleapis.com.
         *
         * Schemes other than `http`, `https` (or the empty scheme) might be
         * used with implementation specific semantics.
         *
         *
         * @generated from field: string type_url = 1;
         */
        this.typeUrl = "";
        /**
         * Must be a valid serialized protocol buffer of the above specified type.
         *
         * @generated from field: bytes value = 2;
         */
        this.value = new Uint8Array(0);
        proto3.util.initPartial(data, this);
    }
    toJson(options) {
        var _a;
        if (this.typeUrl === "") {
            return {};
        }
        const typeName = this.typeUrlToName(this.typeUrl);
        const messageType = (_a = options === null || options === void 0 ? void 0 : options.typeRegistry) === null || _a === void 0 ? void 0 : _a.findMessage(typeName);
        if (!messageType) {
            throw new Error(`cannot encode message google.protobuf.Any to JSON: "${this.typeUrl}" is not in the type registry`);
        }
        const message = messageType.fromBinary(this.value);
        let json = message.toJson(options);
        if (typeName.startsWith("google.protobuf.") || (json === null || Array.isArray(json) || typeof json !== "object")) {
            json = { value: json };
        }
        json["@type"] = this.typeUrl;
        return json;
    }
    fromJson(json, options) {
        var _a;
        if (json === null || Array.isArray(json) || typeof json != "object") {
            throw new Error(`cannot decode message google.protobuf.Any from JSON: expected object but got ${json === null ? "null" : Array.isArray(json) ? "array" : typeof json}`);
        }
        if (Object.keys(json).length == 0) {
            return this;
        }
        const typeUrl = json["@type"];
        if (typeof typeUrl != "string" || typeUrl == "") {
            throw new Error(`cannot decode message google.protobuf.Any from JSON: "@type" is empty`);
        }
        const typeName = this.typeUrlToName(typeUrl), messageType = (_a = options === null || options === void 0 ? void 0 : options.typeRegistry) === null || _a === void 0 ? void 0 : _a.findMessage(typeName);
        if (!messageType) {
            throw new Error(`cannot decode message google.protobuf.Any from JSON: ${typeUrl} is not in the type registry`);
        }
        let message;
        if (typeName.startsWith("google.protobuf.") && Object.prototype.hasOwnProperty.call(json, "value")) {
            message = messageType.fromJson(json["value"], options);
        }
        else {
            const copy = Object.assign({}, json);
            delete copy["@type"];
            message = messageType.fromJson(copy, options);
        }
        this.packFrom(message);
        return this;
    }
    packFrom(message) {
        this.value = message.toBinary();
        this.typeUrl = this.typeNameToUrl(message.getType().typeName);
    }
    unpackTo(target) {
        if (!this.is(target.getType())) {
            return false;
        }
        target.fromBinary(this.value);
        return true;
    }
    unpack(registry) {
        if (this.typeUrl === "") {
            return undefined;
        }
        const messageType = registry.findMessage(this.typeUrlToName(this.typeUrl));
        if (!messageType) {
            return undefined;
        }
        return messageType.fromBinary(this.value);
    }
    is(type) {
        if (this.typeUrl === '') {
            return false;
        }
        const name = this.typeUrlToName(this.typeUrl);
        let typeName = '';
        if (typeof type === 'string') {
            typeName = type;
        }
        else {
            typeName = type.typeName;
        }
        return name === typeName;
    }
    typeNameToUrl(name) {
        return `type.googleapis.com/${name}`;
    }
    typeUrlToName(url) {
        if (!url.length) {
            throw new Error(`invalid type url: ${url}`);
        }
        const slash = url.lastIndexOf("/");
        const name = slash > 0 ? url.substring(slash + 1) : url;
        if (!name.length) {
            throw new Error(`invalid type url: ${url}`);
        }
        return name;
    }
    static pack(message) {
        const any = new Any();
        any.packFrom(message);
        return any;
    }
    static fromBinary(bytes, options) {
        return new Any().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
        return new Any().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
        return new Any().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
        return proto3.util.equals(Any, a, b);
    }
}
Any.runtime = proto3;
Any.typeName = "google.protobuf.Any";
Any.fields = proto3.util.newFieldList(() => [
    { no: 1, name: "type_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "value", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
]);


;// CONCATENATED MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/timestamp_pb.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/**
 * A Timestamp represents a point in time independent of any time zone or local
 * calendar, encoded as a count of seconds and fractions of seconds at
 * nanosecond resolution. The count is relative to an epoch at UTC midnight on
 * January 1, 1970, in the proleptic Gregorian calendar which extends the
 * Gregorian calendar backwards to year one.
 *
 * All minutes are 60 seconds long. Leap seconds are "smeared" so that no leap
 * second table is needed for interpretation, using a [24-hour linear
 * smear](https://developers.google.com/time/smear).
 *
 * The range is from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59.999999999Z. By
 * restricting to that range, we ensure that we can convert to and from [RFC
 * 3339](https://www.ietf.org/rfc/rfc3339.txt) date strings.
 *
 * # Examples
 *
 * Example 1: Compute Timestamp from POSIX `time()`.
 *
 *     Timestamp timestamp;
 *     timestamp.set_seconds(time(NULL));
 *     timestamp.set_nanos(0);
 *
 * Example 2: Compute Timestamp from POSIX `gettimeofday()`.
 *
 *     struct timeval tv;
 *     gettimeofday(&tv, NULL);
 *
 *     Timestamp timestamp;
 *     timestamp.set_seconds(tv.tv_sec);
 *     timestamp.set_nanos(tv.tv_usec * 1000);
 *
 * Example 3: Compute Timestamp from Win32 `GetSystemTimeAsFileTime()`.
 *
 *     FILETIME ft;
 *     GetSystemTimeAsFileTime(&ft);
 *     UINT64 ticks = (((UINT64)ft.dwHighDateTime) << 32) | ft.dwLowDateTime;
 *
 *     // A Windows tick is 100 nanoseconds. Windows epoch 1601-01-01T00:00:00Z
 *     // is 11644473600 seconds before Unix epoch 1970-01-01T00:00:00Z.
 *     Timestamp timestamp;
 *     timestamp.set_seconds((INT64) ((ticks / 10000000) - 11644473600LL));
 *     timestamp.set_nanos((INT32) ((ticks % 10000000) * 100));
 *
 * Example 4: Compute Timestamp from Java `System.currentTimeMillis()`.
 *
 *     long millis = System.currentTimeMillis();
 *
 *     Timestamp timestamp = Timestamp.newBuilder().setSeconds(millis / 1000)
 *         .setNanos((int) ((millis % 1000) * 1000000)).build();
 *
 * Example 5: Compute Timestamp from Java `Instant.now()`.
 *
 *     Instant now = Instant.now();
 *
 *     Timestamp timestamp =
 *         Timestamp.newBuilder().setSeconds(now.getEpochSecond())
 *             .setNanos(now.getNano()).build();
 *
 * Example 6: Compute Timestamp from current time in Python.
 *
 *     timestamp = Timestamp()
 *     timestamp.GetCurrentTime()
 *
 * # JSON Mapping
 *
 * In JSON format, the Timestamp type is encoded as a string in the
 * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format. That is, the
 * format is "{year}-{month}-{day}T{hour}:{min}:{sec}[.{frac_sec}]Z"
 * where {year} is always expressed using four digits while {month}, {day},
 * {hour}, {min}, and {sec} are zero-padded to two digits each. The fractional
 * seconds, which can go up to 9 digits (i.e. up to 1 nanosecond resolution),
 * are optional. The "Z" suffix indicates the timezone ("UTC"); the timezone
 * is required. A proto3 JSON serializer should always use UTC (as indicated by
 * "Z") when printing the Timestamp type and a proto3 JSON parser should be
 * able to accept both UTC and other timezones (as indicated by an offset).
 *
 * For example, "2017-01-15T01:30:15.01Z" encodes 15.01 seconds past
 * 01:30 UTC on January 15, 2017.
 *
 * In JavaScript, one can convert a Date object to this format using the
 * standard
 * [toISOString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)
 * method. In Python, a standard `datetime.datetime` object can be converted
 * to this format using
 * [`strftime`](https://docs.python.org/2/library/time.html#time.strftime) with
 * the time format spec '%Y-%m-%dT%H:%M:%S.%fZ'. Likewise, in Java, one can use
 * the Joda Time's [`ISODateTimeFormat.dateTime()`](
 * http://joda-time.sourceforge.net/apidocs/org/joda/time/format/ISODateTimeFormat.html#dateTime()
 * ) to obtain a formatter capable of generating timestamps in this format.
 *
 *
 * @generated from message google.protobuf.Timestamp
 */
class Timestamp extends esm_message/* Message */.v {
    constructor(data) {
        super();
        /**
         * Represents seconds of UTC time since Unix epoch
         * 1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
         * 9999-12-31T23:59:59Z inclusive.
         *
         * @generated from field: int64 seconds = 1;
         */
        this.seconds = protoInt64.zero;
        /**
         * Non-negative fractions of a second at nanosecond resolution. Negative
         * second values with fractions must still have non-negative nanos values
         * that count forward in time. Must be from 0 to 999,999,999
         * inclusive.
         *
         * @generated from field: int32 nanos = 2;
         */
        this.nanos = 0;
        proto3.util.initPartial(data, this);
    }
    fromJson(json, options) {
        if (typeof json !== "string") {
            throw new Error(`cannot decode google.protobuf.Timestamp from JSON: ${proto3.json.debug(json)}`);
        }
        const matches = json.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/);
        if (!matches) {
            throw new Error(`cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string`);
        }
        const ms = Date.parse(matches[1] + "-" + matches[2] + "-" + matches[3] + "T" + matches[4] + ":" + matches[5] + ":" + matches[6] + (matches[8] ? matches[8] : "Z"));
        if (Number.isNaN(ms)) {
            throw new Error(`cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string`);
        }
        if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z")) {
            throw new Error(`cannot decode message google.protobuf.Timestamp from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive`);
        }
        this.seconds = protoInt64.parse(ms / 1000);
        this.nanos = 0;
        if (matches[7]) {
            this.nanos = (parseInt("1" + matches[7] + "0".repeat(9 - matches[7].length)) - 1000000000);
        }
        return this;
    }
    toJson(options) {
        const ms = Number(this.seconds) * 1000;
        if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z")) {
            throw new Error(`cannot encode google.protobuf.Timestamp to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive`);
        }
        if (this.nanos < 0) {
            throw new Error(`cannot encode google.protobuf.Timestamp to JSON: nanos must not be negative`);
        }
        let z = "Z";
        if (this.nanos > 0) {
            const nanosStr = (this.nanos + 1000000000).toString().substring(1);
            if (nanosStr.substring(3) === "000000") {
                z = "." + nanosStr.substring(0, 3) + "Z";
            }
            else if (nanosStr.substring(6) === "000") {
                z = "." + nanosStr.substring(0, 6) + "Z";
            }
            else {
                z = "." + nanosStr + "Z";
            }
        }
        return new Date(ms).toISOString().replace(".000Z", z);
    }
    toDate() {
        return new Date(Number(this.seconds) * 1000 + Math.ceil(this.nanos / 1000000));
    }
    static now() {
        return Timestamp.fromDate(new Date());
    }
    static fromDate(date) {
        const ms = date.getTime();
        return new Timestamp({
            seconds: protoInt64.parse(Math.floor(ms / 1000)),
            nanos: (ms % 1000) * 1000000,
        });
    }
    static fromBinary(bytes, options) {
        return new Timestamp().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
        return new Timestamp().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
        return new Timestamp().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
        return proto3.util.equals(Timestamp, a, b);
    }
}
Timestamp.runtime = proto3;
Timestamp.typeName = "google.protobuf.Timestamp";
Timestamp.fields = proto3.util.newFieldList(() => [
    { no: 1, name: "seconds", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: "nanos", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
]);


;// CONCATENATED MODULE: ../node_modules/@buf/cosmos_ibc.bufbuild_es/node_modules/@buf/cosmos_cosmos-sdk.bufbuild_es/cosmos/upgrade/v1beta1/upgrade_pb.js
// @generated by protoc-gen-es v1.2.1
// @generated from file cosmos/upgrade/v1beta1/upgrade.proto (package cosmos.upgrade.v1beta1, syntax proto3)
/* eslint-disable */
// @ts-nocheck



/**
 * Plan specifies information about a planned upgrade and when it should occur.
 *
 * @generated from message cosmos.upgrade.v1beta1.Plan
 */
const Plan = proto3.makeMessageType(
  "cosmos.upgrade.v1beta1.Plan",
  () => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "time", kind: "message", T: Timestamp },
    { no: 3, name: "height", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 4, name: "info", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "upgraded_client_state", kind: "message", T: Any },
  ],
);

/**
 * SoftwareUpgradeProposal is a gov Content type for initiating a software
 * upgrade.
 * Deprecated: This legacy proposal is deprecated in favor of Msg-based gov
 * proposals, see MsgSoftwareUpgrade.
 *
 * @generated from message cosmos.upgrade.v1beta1.SoftwareUpgradeProposal
 * @deprecated
 */
const SoftwareUpgradeProposal = proto3.makeMessageType(
  "cosmos.upgrade.v1beta1.SoftwareUpgradeProposal",
  () => [
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "plan", kind: "message", T: Plan },
  ],
);

/**
 * CancelSoftwareUpgradeProposal is a gov Content type for cancelling a software
 * upgrade.
 * Deprecated: This legacy proposal is deprecated in favor of Msg-based gov
 * proposals, see MsgCancelUpgrade.
 *
 * @generated from message cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal
 * @deprecated
 */
const CancelSoftwareUpgradeProposal = proto3.makeMessageType(
  "cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal",
  () => [
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * ModuleVersion specifies a module and its consensus version.
 *
 * Since: cosmos-sdk 0.43
 *
 * @generated from message cosmos.upgrade.v1beta1.ModuleVersion
 */
const ModuleVersion = proto3.makeMessageType(
  "cosmos.upgrade.v1beta1.ModuleVersion",
  () => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "version", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);


;// CONCATENATED MODULE: ../node_modules/@buf/cosmos_ibc.bufbuild_es/ibc/core/client/v1/client_pb.js
// @generated by protoc-gen-es v1.2.1
// @generated from file ibc/core/client/v1/client.proto (package ibc.core.client.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck




/**
 * IdentifiedClientState defines a client state with an additional client
 * identifier field.
 *
 * @generated from message ibc.core.client.v1.IdentifiedClientState
 */
const IdentifiedClientState = proto3.makeMessageType(
  "ibc.core.client.v1.IdentifiedClientState",
  () => [
    { no: 1, name: "client_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "client_state", kind: "message", T: Any },
  ],
);

/**
 * ConsensusStateWithHeight defines a consensus state with an additional height
 * field.
 *
 * @generated from message ibc.core.client.v1.ConsensusStateWithHeight
 */
const ConsensusStateWithHeight = proto3.makeMessageType(
  "ibc.core.client.v1.ConsensusStateWithHeight",
  () => [
    { no: 1, name: "height", kind: "message", T: Height },
    { no: 2, name: "consensus_state", kind: "message", T: Any },
  ],
);

/**
 * ClientConsensusStates defines all the stored consensus states for a given
 * client.
 *
 * @generated from message ibc.core.client.v1.ClientConsensusStates
 */
const ClientConsensusStates = proto3.makeMessageType(
  "ibc.core.client.v1.ClientConsensusStates",
  () => [
    { no: 1, name: "client_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "consensus_states", kind: "message", T: ConsensusStateWithHeight, repeated: true },
  ],
);

/**
 * ClientUpdateProposal is a governance proposal. If it passes, the substitute
 * client's latest consensus state is copied over to the subject client. The proposal
 * handler may fail if the subject and the substitute do not match in client and
 * chain parameters (with exception to latest height, frozen height, and chain-id).
 *
 * @generated from message ibc.core.client.v1.ClientUpdateProposal
 */
const ClientUpdateProposal = proto3.makeMessageType(
  "ibc.core.client.v1.ClientUpdateProposal",
  () => [
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "subject_client_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "substitute_client_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * UpgradeProposal is a gov Content type for initiating an IBC breaking
 * upgrade.
 *
 * @generated from message ibc.core.client.v1.UpgradeProposal
 */
const UpgradeProposal = proto3.makeMessageType(
  "ibc.core.client.v1.UpgradeProposal",
  () => [
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "plan", kind: "message", T: Plan },
    { no: 4, name: "upgraded_client_state", kind: "message", T: Any },
  ],
);

/**
 * Height is a monotonically increasing data type
 * that can be compared against another Height for the purposes of updating and
 * freezing clients
 *
 * Normally the RevisionHeight is incremented at each height while keeping
 * RevisionNumber the same. However some consensus algorithms may choose to
 * reset the height in certain conditions e.g. hard forks, state-machine
 * breaking changes In these cases, the RevisionNumber is incremented so that
 * height continues to be monitonically increasing even as the RevisionHeight
 * gets reset
 *
 * @generated from message ibc.core.client.v1.Height
 */
const Height = proto3.makeMessageType(
  "ibc.core.client.v1.Height",
  () => [
    { no: 1, name: "revision_number", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "revision_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * Params defines the set of IBC light client parameters.
 *
 * @generated from message ibc.core.client.v1.Params
 */
const Params = proto3.makeMessageType(
  "ibc.core.client.v1.Params",
  () => [
    { no: 1, name: "allowed_clients", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ],
);


;// CONCATENATED MODULE: ../node_modules/@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/ibc/v1alpha1/ibc_pb.js
// @generated by protoc-gen-es v1.2.1
// @generated from file penumbra/core/ibc/v1alpha1/ibc.proto (package penumbra.core.ibc.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck





/**
 * @generated from message penumbra.core.ibc.v1alpha1.IbcAction
 */
const IbcAction = proto3.makeMessageType(
  "penumbra.core.ibc.v1alpha1.IbcAction",
  () => [
    { no: 1, name: "raw_action", kind: "message", T: Any },
  ],
);

/**
 * FungibleTokenPacketData defines a struct for the packet payload
 * See FungibleTokenPacketData spec:
 * https://github.com/cosmos/ibc/tree/master/spec/app/ics-020-fungible-token-transfer#data-structures
 *
 * @generated from message penumbra.core.ibc.v1alpha1.FungibleTokenPacketData
 */
const FungibleTokenPacketData = proto3.makeMessageType(
  "penumbra.core.ibc.v1alpha1.FungibleTokenPacketData",
  () => [
    { no: 1, name: "denom", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "amount", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "sender", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "receiver", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message penumbra.core.ibc.v1alpha1.Ics20Withdrawal
 */
const Ics20Withdrawal = proto3.makeMessageType(
  "penumbra.core.ibc.v1alpha1.Ics20Withdrawal",
  () => [
    { no: 1, name: "destination_chain_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "amount", kind: "message", T: Amount },
    { no: 3, name: "denom", kind: "message", T: Denom },
    { no: 4, name: "destination_chain_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "return_address", kind: "message", T: Address },
    { no: 6, name: "timeout_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 7, name: "timeout_time", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 8, name: "source_port", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 9, name: "source_channel", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message penumbra.core.ibc.v1alpha1.ClientData
 */
const ClientData = proto3.makeMessageType(
  "penumbra.core.ibc.v1alpha1.ClientData",
  () => [
    { no: 1, name: "client_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "client_state", kind: "message", T: Any },
    { no: 3, name: "processed_time", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "processed_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * @generated from message penumbra.core.ibc.v1alpha1.ClientCounter
 */
const ClientCounter = proto3.makeMessageType(
  "penumbra.core.ibc.v1alpha1.ClientCounter",
  () => [
    { no: 1, name: "counter", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * @generated from message penumbra.core.ibc.v1alpha1.ConsensusState
 */
const ConsensusState = proto3.makeMessageType(
  "penumbra.core.ibc.v1alpha1.ConsensusState",
  () => [
    { no: 1, name: "consensus_state", kind: "message", T: Any },
  ],
);

/**
 * @generated from message penumbra.core.ibc.v1alpha1.VerifiedHeights
 */
const VerifiedHeights = proto3.makeMessageType(
  "penumbra.core.ibc.v1alpha1.VerifiedHeights",
  () => [
    { no: 1, name: "heights", kind: "message", T: Height, repeated: true },
  ],
);

/**
 * @generated from message penumbra.core.ibc.v1alpha1.ConnectionCounter
 */
const ConnectionCounter = proto3.makeMessageType(
  "penumbra.core.ibc.v1alpha1.ConnectionCounter",
  () => [
    { no: 1, name: "counter", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * @generated from message penumbra.core.ibc.v1alpha1.ClientConnections
 */
const ClientConnections = proto3.makeMessageType(
  "penumbra.core.ibc.v1alpha1.ClientConnections",
  () => [
    { no: 1, name: "connections", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ],
);


;// CONCATENATED MODULE: ../node_modules/@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/chain/v1alpha1/chain_pb.js
// @generated by protoc-gen-es v1.2.1
// @generated from file penumbra/core/chain/v1alpha1/chain.proto (package penumbra.core.chain.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck






/**
 * Global chain configuration data, such as chain ID, epoch duration, etc.
 *
 * @generated from message penumbra.core.chain.v1alpha1.ChainParameters
 */
const ChainParameters = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.ChainParameters",
  () => [
    { no: 1, name: "chain_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "epoch_duration", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "unbonding_epochs", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 4, name: "active_validator_limit", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 9, name: "base_reward_rate", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 5, name: "slashing_penalty_misbehavior", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 10, name: "slashing_penalty_downtime", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 11, name: "signed_blocks_window_len", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 12, name: "missed_blocks_maximum", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 6, name: "ibc_enabled", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 7, name: "inbound_ics20_transfers_enabled", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 8, name: "outbound_ics20_transfers_enabled", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 20, name: "proposal_voting_blocks", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 21, name: "proposal_deposit_amount", kind: "message", T: Amount },
    { no: 22, name: "proposal_valid_quorum", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 23, name: "proposal_pass_threshold", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 24, name: "proposal_slash_threshold", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 25, name: "dao_spend_proposals_enabled", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
);

/**
 * The ratio between two numbers, used in governance to describe vote thresholds and quorums.
 *
 * @generated from message penumbra.core.chain.v1alpha1.Ratio
 */
const Ratio = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.Ratio",
  () => [
    { no: 1, name: "numerator", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "denominator", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * Parameters for Fuzzy Message Detection
 *
 * @generated from message penumbra.core.chain.v1alpha1.FmdParameters
 */
const FmdParameters = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.FmdParameters",
  () => [
    { no: 1, name: "precision_bits", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 2, name: "as_of_block_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * Contains the minimum data needed to update client state.
 *
 * @generated from message penumbra.core.chain.v1alpha1.CompactBlock
 */
const CompactBlock = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.CompactBlock",
  () => [
    { no: 1, name: "height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "state_payloads", kind: "message", T: StatePayload, repeated: true },
    { no: 3, name: "nullifiers", kind: "message", T: Nullifier, repeated: true },
    { no: 4, name: "block_root", kind: "message", T: MerkleRoot },
    { no: 17, name: "epoch_root", kind: "message", T: MerkleRoot },
    { no: 20, name: "proposal_started", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 100, name: "fmd_parameters", kind: "message", T: FmdParameters },
    { no: 5, name: "swap_outputs", kind: "message", T: BatchSwapOutputData, repeated: true },
    { no: 6, name: "chain_parameters", kind: "message", T: ChainParameters },
  ],
);

/**
 * @generated from message penumbra.core.chain.v1alpha1.StatePayload
 */
const StatePayload = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.StatePayload",
  () => [
    { no: 1, name: "rolled_up", kind: "message", T: StatePayload_RolledUp, oneof: "state_payload" },
    { no: 2, name: "note", kind: "message", T: StatePayload_Note, oneof: "state_payload" },
    { no: 3, name: "swap", kind: "message", T: StatePayload_Swap, oneof: "state_payload" },
  ],
);

/**
 * @generated from message penumbra.core.chain.v1alpha1.StatePayload.RolledUp
 */
const StatePayload_RolledUp = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.StatePayload.RolledUp",
  () => [
    { no: 1, name: "commitment", kind: "message", T: StateCommitment },
  ],
  {localName: "StatePayload_RolledUp"},
);

/**
 * @generated from message penumbra.core.chain.v1alpha1.StatePayload.Note
 */
const StatePayload_Note = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.StatePayload.Note",
  () => [
    { no: 1, name: "source", kind: "message", T: NoteSource },
    { no: 2, name: "note", kind: "message", T: NotePayload },
  ],
  {localName: "StatePayload_Note"},
);

/**
 * @generated from message penumbra.core.chain.v1alpha1.StatePayload.Swap
 */
const StatePayload_Swap = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.StatePayload.Swap",
  () => [
    { no: 1, name: "source", kind: "message", T: NoteSource },
    { no: 2, name: "swap", kind: "message", T: SwapPayload },
  ],
  {localName: "StatePayload_Swap"},
);

/**
 * @generated from message penumbra.core.chain.v1alpha1.KnownAssets
 */
const KnownAssets = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.KnownAssets",
  () => [
    { no: 1, name: "assets", kind: "message", T: DenomMetadata, repeated: true },
  ],
);

/**
 * A spicy transaction ID
 *
 * @generated from message penumbra.core.chain.v1alpha1.NoteSource
 */
const NoteSource = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.NoteSource",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * A NoteSource paired with the height at which the note was spent
 *
 * @generated from message penumbra.core.chain.v1alpha1.SpendInfo
 */
const SpendInfo = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.SpendInfo",
  () => [
    { no: 1, name: "note_source", kind: "message", T: NoteSource },
    { no: 2, name: "spend_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * @generated from message penumbra.core.chain.v1alpha1.GenesisAppState
 */
const GenesisAppState = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.GenesisAppState",
  () => [
    { no: 1, name: "chain_params", kind: "message", T: ChainParameters },
    { no: 2, name: "validators", kind: "message", T: Validator, repeated: true },
    { no: 3, name: "allocations", kind: "message", T: GenesisAppState_Allocation, repeated: true },
  ],
);

/**
 * @generated from message penumbra.core.chain.v1alpha1.GenesisAppState.Allocation
 */
const GenesisAppState_Allocation = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.GenesisAppState.Allocation",
  () => [
    { no: 1, name: "amount", kind: "message", T: Amount },
    { no: 2, name: "denom", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "address", kind: "message", T: Address },
  ],
  {localName: "GenesisAppState_Allocation"},
);

/**
 * @generated from message penumbra.core.chain.v1alpha1.Epoch
 */
const Epoch = proto3.makeMessageType(
  "penumbra.core.chain.v1alpha1.Epoch",
  () => [
    { no: 1, name: "index", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "start_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);


;// CONCATENATED MODULE: ../node_modules/@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/governance/v1alpha1/governance_pb.js
// @generated by protoc-gen-es v1.2.1
// @generated from file penumbra/core/governance/v1alpha1/governance.proto (package penumbra.core.governance.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck





/**
 * @generated from message penumbra.core.governance.v1alpha1.ProposalSubmit
 */
const ProposalSubmit = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ProposalSubmit",
  () => [
    { no: 1, name: "proposal", kind: "message", T: Proposal },
    { no: 3, name: "deposit_amount", kind: "message", T: Amount },
  ],
);

/**
 * @generated from message penumbra.core.governance.v1alpha1.ProposalWithdraw
 */
const ProposalWithdraw = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ProposalWithdraw",
  () => [
    { no: 1, name: "proposal", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "reason", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message penumbra.core.governance.v1alpha1.ProposalDepositClaim
 */
const ProposalDepositClaim = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ProposalDepositClaim",
  () => [
    { no: 1, name: "proposal", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "deposit_amount", kind: "message", T: Amount },
    { no: 3, name: "outcome", kind: "message", T: ProposalOutcome },
  ],
);

/**
 * @generated from message penumbra.core.governance.v1alpha1.ValidatorVote
 */
const ValidatorVote = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ValidatorVote",
  () => [
    { no: 1, name: "body", kind: "message", T: ValidatorVoteBody },
    { no: 2, name: "auth_sig", kind: "message", T: SpendAuthSignature },
  ],
);

/**
 * @generated from message penumbra.core.governance.v1alpha1.ValidatorVoteBody
 */
const ValidatorVoteBody = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ValidatorVoteBody",
  () => [
    { no: 1, name: "proposal", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "vote", kind: "message", T: Vote },
    { no: 3, name: "identity_key", kind: "message", T: IdentityKey },
    { no: 4, name: "governance_key", kind: "message", T: GovernanceKey },
  ],
);

/**
 * @generated from message penumbra.core.governance.v1alpha1.DelegatorVote
 */
const DelegatorVote = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.DelegatorVote",
  () => [
    { no: 1, name: "body", kind: "message", T: DelegatorVoteBody },
    { no: 2, name: "auth_sig", kind: "message", T: SpendAuthSignature },
    { no: 3, name: "proof", kind: "message", T: ZKDelegatorVoteProof },
  ],
);

/**
 * @generated from message penumbra.core.governance.v1alpha1.DelegatorVoteBody
 */
const DelegatorVoteBody = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.DelegatorVoteBody",
  () => [
    { no: 1, name: "proposal", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "start_position", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "vote", kind: "message", T: Vote },
    { no: 4, name: "value", kind: "message", T: Value },
    { no: 5, name: "unbonded_amount", kind: "message", T: Amount },
    { no: 6, name: "nullifier", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 7, name: "rk", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.governance.v1alpha1.DelegatorVotePlan
 */
const DelegatorVotePlan = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.DelegatorVotePlan",
  () => [
    { no: 1, name: "proposal", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "start_position", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "vote", kind: "message", T: Vote },
    { no: 4, name: "staked_note", kind: "message", T: Note },
    { no: 5, name: "staked_note_position", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 6, name: "unbonded_amount", kind: "message", T: Amount },
    { no: 7, name: "randomizer", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.governance.v1alpha1.DaoDeposit
 */
const DaoDeposit = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.DaoDeposit",
  () => [
    { no: 1, name: "value", kind: "message", T: Value },
  ],
);

/**
 * @generated from message penumbra.core.governance.v1alpha1.DaoSpend
 */
const DaoSpend = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.DaoSpend",
  () => [
    { no: 1, name: "value", kind: "message", T: Value },
  ],
);

/**
 * @generated from message penumbra.core.governance.v1alpha1.DaoOutput
 */
const DaoOutput = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.DaoOutput",
  () => [
    { no: 1, name: "value", kind: "message", T: Value },
    { no: 2, name: "address", kind: "message", T: Address },
  ],
);

/**
 * A vote on a proposal.
 *
 * @generated from message penumbra.core.governance.v1alpha1.Vote
 */
const Vote = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.Vote",
  () => [
    { no: 1, name: "vote", kind: "enum", T: proto3.getEnumType(Vote_Vote) },
  ],
);

/**
 * A vote.
 *
 * @generated from enum penumbra.core.governance.v1alpha1.Vote.Vote
 */
const Vote_Vote = proto3.makeEnum(
  "penumbra.core.governance.v1alpha1.Vote.Vote",
  [
    {no: 0, name: "VOTE_UNSPECIFIED", localName: "UNSPECIFIED"},
    {no: 1, name: "VOTE_ABSTAIN", localName: "ABSTAIN"},
    {no: 2, name: "VOTE_YES", localName: "YES"},
    {no: 3, name: "VOTE_NO", localName: "NO"},
  ],
);

/**
 * The current state of a proposal.
 *
 * @generated from message penumbra.core.governance.v1alpha1.ProposalState
 */
const ProposalState = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ProposalState",
  () => [
    { no: 2, name: "voting", kind: "message", T: ProposalState_Voting, oneof: "state" },
    { no: 3, name: "withdrawn", kind: "message", T: ProposalState_Withdrawn, oneof: "state" },
    { no: 4, name: "finished", kind: "message", T: ProposalState_Finished, oneof: "state" },
    { no: 5, name: "claimed", kind: "message", T: ProposalState_Claimed, oneof: "state" },
  ],
);

/**
 * Voting is in progress and the proposal has not yet concluded voting or been withdrawn.
 *
 * @generated from message penumbra.core.governance.v1alpha1.ProposalState.Voting
 */
const ProposalState_Voting = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ProposalState.Voting",
  [],
  {localName: "ProposalState_Voting"},
);

/**
 * The proposal has been withdrawn but the voting period is not yet concluded.
 *
 * @generated from message penumbra.core.governance.v1alpha1.ProposalState.Withdrawn
 */
const ProposalState_Withdrawn = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ProposalState.Withdrawn",
  () => [
    { no: 1, name: "reason", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
  {localName: "ProposalState_Withdrawn"},
);

/**
 * The voting period has ended, and the proposal has been assigned an outcome.
 *
 * @generated from message penumbra.core.governance.v1alpha1.ProposalState.Finished
 */
const ProposalState_Finished = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ProposalState.Finished",
  () => [
    { no: 1, name: "outcome", kind: "message", T: ProposalOutcome },
  ],
  {localName: "ProposalState_Finished"},
);

/**
 * The voting period has ended, and the original proposer has claimed their deposit.
 *
 * @generated from message penumbra.core.governance.v1alpha1.ProposalState.Claimed
 */
const ProposalState_Claimed = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ProposalState.Claimed",
  () => [
    { no: 1, name: "outcome", kind: "message", T: ProposalOutcome },
  ],
  {localName: "ProposalState_Claimed"},
);

/**
 * The outcome of a concluded proposal.
 *
 * @generated from message penumbra.core.governance.v1alpha1.ProposalOutcome
 */
const ProposalOutcome = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ProposalOutcome",
  () => [
    { no: 1, name: "passed", kind: "message", T: ProposalOutcome_Passed, oneof: "outcome" },
    { no: 2, name: "failed", kind: "message", T: ProposalOutcome_Failed, oneof: "outcome" },
    { no: 3, name: "slashed", kind: "message", T: ProposalOutcome_Slashed, oneof: "outcome" },
  ],
);

/**
 * The proposal was passed.
 *
 * @generated from message penumbra.core.governance.v1alpha1.ProposalOutcome.Passed
 */
const ProposalOutcome_Passed = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ProposalOutcome.Passed",
  [],
  {localName: "ProposalOutcome_Passed"},
);

/**
 * The proposal did not pass.
 *
 * @generated from message penumbra.core.governance.v1alpha1.ProposalOutcome.Failed
 */
const ProposalOutcome_Failed = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ProposalOutcome.Failed",
  () => [
    { no: 1, name: "withdrawn_with_reason", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
  ],
  {localName: "ProposalOutcome_Failed"},
);

/**
 * The proposal did not pass, and was slashed.
 *
 * @generated from message penumbra.core.governance.v1alpha1.ProposalOutcome.Slashed
 */
const ProposalOutcome_Slashed = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.ProposalOutcome.Slashed",
  () => [
    { no: 1, name: "withdrawn_with_reason", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
  ],
  {localName: "ProposalOutcome_Slashed"},
);

/**
 * A tally of votes on a proposal.
 *
 * @generated from message penumbra.core.governance.v1alpha1.Tally
 */
const Tally = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.Tally",
  () => [
    { no: 1, name: "yes", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "no", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "abstain", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * A proposal to be voted upon.
 *
 * @generated from message penumbra.core.governance.v1alpha1.Proposal
 */
const Proposal = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.Proposal",
  () => [
    { no: 4, name: "id", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "signaling", kind: "message", T: Proposal_Signaling },
    { no: 6, name: "emergency", kind: "message", T: Proposal_Emergency },
    { no: 7, name: "parameter_change", kind: "message", T: Proposal_ParameterChange },
    { no: 8, name: "dao_spend", kind: "message", T: Proposal_DaoSpend },
  ],
);

/**
 * A signaling proposal is meant to register a vote on-chain, but does not have an automatic
 * effect when passed.
 *
 * It optionally contains a reference to a commit which contains code to upgrade the chain.
 *
 * @generated from message penumbra.core.governance.v1alpha1.Proposal.Signaling
 */
const Proposal_Signaling = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.Proposal.Signaling",
  () => [
    { no: 1, name: "commit", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
  ],
  {localName: "Proposal_Signaling"},
);

/**
 * An emergency proposal can be passed instantaneously by a 2/3 majority of validators, without
 * waiting for the voting period to expire.
 *
 * If the boolean `halt_chain` is set to `true`, then the chain will halt immediately when the
 * proposal is passed.
 *
 * @generated from message penumbra.core.governance.v1alpha1.Proposal.Emergency
 */
const Proposal_Emergency = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.Proposal.Emergency",
  () => [
    { no: 1, name: "halt_chain", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
  {localName: "Proposal_Emergency"},
);

/**
 * A parameter change proposal describes a replacement of the chain parameters, which should take
 * effect when the proposal is passed.
 *
 * @generated from message penumbra.core.governance.v1alpha1.Proposal.ParameterChange
 */
const Proposal_ParameterChange = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.Proposal.ParameterChange",
  () => [
    { no: 1, name: "old_parameters", kind: "message", T: ChainParameters },
    { no: 2, name: "new_parameters", kind: "message", T: ChainParameters },
  ],
  {localName: "Proposal_ParameterChange"},
);

/**
 * A DAO spend proposal describes zero or more transactions to execute on behalf of the DAO, with
 * access to its funds, and zero or more scheduled transactions from previous passed proposals to
 * cancel.
 *
 * @generated from message penumbra.core.governance.v1alpha1.Proposal.DaoSpend
 */
const Proposal_DaoSpend = proto3.makeMessageType(
  "penumbra.core.governance.v1alpha1.Proposal.DaoSpend",
  () => [
    { no: 2, name: "transaction_plan", kind: "message", T: Any },
  ],
  {localName: "Proposal_DaoSpend"},
);


;// CONCATENATED MODULE: ../node_modules/@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb.js
// @generated by protoc-gen-es v1.2.1
// @generated from file penumbra/core/transaction/v1alpha1/transaction.proto (package penumbra.core.transaction.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck








/**
 * A Penumbra transaction.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.Transaction
 */
const Transaction = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.Transaction",
  () => [
    { no: 1, name: "body", kind: "message", T: TransactionBody },
    { no: 2, name: "binding_sig", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "anchor", kind: "message", T: MerkleRoot },
  ],
);

/**
 * A transaction ID, the Sha256 hash of a transaction.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.Id
 */
const Id = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.Id",
  () => [
    { no: 1, name: "hash", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.EffectHash
 */
const transaction_pb_EffectHash = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.EffectHash",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * The body of a transaction.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.TransactionBody
 */
const TransactionBody = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.TransactionBody",
  () => [
    { no: 1, name: "actions", kind: "message", T: Action, repeated: true },
    { no: 2, name: "expiry_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "chain_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "fee", kind: "message", T: Fee },
    { no: 5, name: "fmd_clues", kind: "message", T: Clue, repeated: true },
    { no: 6, name: "encrypted_memo", kind: "scalar", T: 12 /* ScalarType.BYTES */, opt: true },
  ],
);

/**
 * A state change performed by a transaction.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.Action
 */
const Action = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.Action",
  () => [
    { no: 1, name: "spend", kind: "message", T: Spend, oneof: "action" },
    { no: 2, name: "output", kind: "message", T: Output, oneof: "action" },
    { no: 3, name: "swap", kind: "message", T: Swap, oneof: "action" },
    { no: 4, name: "swap_claim", kind: "message", T: SwapClaim, oneof: "action" },
    { no: 16, name: "validator_definition", kind: "message", T: ValidatorDefinition, oneof: "action" },
    { no: 17, name: "ibc_action", kind: "message", T: IbcAction, oneof: "action" },
    { no: 18, name: "proposal_submit", kind: "message", T: ProposalSubmit, oneof: "action" },
    { no: 19, name: "proposal_withdraw", kind: "message", T: ProposalWithdraw, oneof: "action" },
    { no: 20, name: "validator_vote", kind: "message", T: ValidatorVote, oneof: "action" },
    { no: 21, name: "delegator_vote", kind: "message", T: DelegatorVote, oneof: "action" },
    { no: 22, name: "proposal_deposit_claim", kind: "message", T: ProposalDepositClaim, oneof: "action" },
    { no: 30, name: "position_open", kind: "message", T: PositionOpen, oneof: "action" },
    { no: 31, name: "position_close", kind: "message", T: PositionClose, oneof: "action" },
    { no: 32, name: "position_withdraw", kind: "message", T: PositionWithdraw, oneof: "action" },
    { no: 34, name: "position_reward_claim", kind: "message", T: PositionRewardClaim, oneof: "action" },
    { no: 40, name: "delegate", kind: "message", T: Delegate, oneof: "action" },
    { no: 41, name: "undelegate", kind: "message", T: Undelegate, oneof: "action" },
    { no: 42, name: "undelegate_claim", kind: "message", T: UndelegateClaim, oneof: "action" },
    { no: 50, name: "dao_spend", kind: "message", T: DaoSpend, oneof: "action" },
    { no: 51, name: "dao_output", kind: "message", T: DaoOutput, oneof: "action" },
    { no: 52, name: "dao_deposit", kind: "message", T: DaoDeposit, oneof: "action" },
    { no: 200, name: "ics20_withdrawal", kind: "message", T: Ics20Withdrawal, oneof: "action" },
  ],
);

/**
 * A transaction perspective is a bundle of key material and commitment openings
 * that allow generating a view of a transaction from that perspective.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.TransactionPerspective
 */
const TransactionPerspective = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.TransactionPerspective",
  () => [
    { no: 1, name: "payload_keys", kind: "message", T: PayloadKeyWithCommitment, repeated: true },
    { no: 2, name: "spend_nullifiers", kind: "message", T: NullifierWithNote, repeated: true },
    { no: 3, name: "advice_notes", kind: "message", T: Note, repeated: true },
    { no: 4, name: "address_views", kind: "message", T: AddressView, repeated: true },
    { no: 5, name: "denoms", kind: "message", T: DenomMetadata, repeated: true },
    { no: 6, name: "transaction_id", kind: "message", T: Id },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.PayloadKey
 */
const PayloadKey = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.PayloadKey",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.PayloadKeyWithCommitment
 */
const PayloadKeyWithCommitment = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.PayloadKeyWithCommitment",
  () => [
    { no: 1, name: "payload_key", kind: "message", T: PayloadKey },
    { no: 2, name: "commitment", kind: "message", T: StateCommitment },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.NullifierWithNote
 */
const NullifierWithNote = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.NullifierWithNote",
  () => [
    { no: 1, name: "nullifier", kind: "message", T: Nullifier },
    { no: 2, name: "note", kind: "message", T: Note },
  ],
);

/**
 * View of a Penumbra transaction.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.TransactionView
 */
const TransactionView = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.TransactionView",
  () => [
    { no: 1, name: "body_view", kind: "message", T: TransactionBodyView },
    { no: 2, name: "binding_sig", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "anchor", kind: "message", T: MerkleRoot },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.TransactionBodyView
 */
const TransactionBodyView = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.TransactionBodyView",
  () => [
    { no: 1, name: "action_views", kind: "message", T: ActionView, repeated: true },
    { no: 2, name: "expiry_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "chain_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "fee", kind: "message", T: Fee },
    { no: 5, name: "fmd_clues", kind: "message", T: Clue, repeated: true },
    { no: 6, name: "memo_view", kind: "message", T: MemoView, opt: true },
  ],
);

/**
 * A view of a specific state change action performed by a transaction.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.ActionView
 */
const ActionView = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.ActionView",
  () => [
    { no: 1, name: "spend", kind: "message", T: SpendView, oneof: "action_view" },
    { no: 2, name: "output", kind: "message", T: OutputView, oneof: "action_view" },
    { no: 3, name: "swap", kind: "message", T: SwapView, oneof: "action_view" },
    { no: 4, name: "swap_claim", kind: "message", T: SwapClaimView, oneof: "action_view" },
    { no: 16, name: "validator_definition", kind: "message", T: ValidatorDefinition, oneof: "action_view" },
    { no: 17, name: "ibc_action", kind: "message", T: IbcAction, oneof: "action_view" },
    { no: 18, name: "proposal_submit", kind: "message", T: ProposalSubmit, oneof: "action_view" },
    { no: 19, name: "proposal_withdraw", kind: "message", T: ProposalWithdraw, oneof: "action_view" },
    { no: 20, name: "validator_vote", kind: "message", T: ValidatorVote, oneof: "action_view" },
    { no: 21, name: "delegator_vote", kind: "message", T: DelegatorVoteView, oneof: "action_view" },
    { no: 22, name: "proposal_deposit_claim", kind: "message", T: ProposalDepositClaim, oneof: "action_view" },
    { no: 30, name: "position_open", kind: "message", T: PositionOpen, oneof: "action_view" },
    { no: 31, name: "position_close", kind: "message", T: PositionClose, oneof: "action_view" },
    { no: 32, name: "position_withdraw", kind: "message", T: PositionWithdraw, oneof: "action_view" },
    { no: 34, name: "position_reward_claim", kind: "message", T: PositionRewardClaim, oneof: "action_view" },
    { no: 41, name: "delegate", kind: "message", T: Delegate, oneof: "action_view" },
    { no: 42, name: "undelegate", kind: "message", T: Undelegate, oneof: "action_view" },
    { no: 50, name: "dao_spend", kind: "message", T: DaoSpend, oneof: "action_view" },
    { no: 51, name: "dao_output", kind: "message", T: DaoOutput, oneof: "action_view" },
    { no: 52, name: "dao_deposit", kind: "message", T: DaoDeposit, oneof: "action_view" },
    { no: 43, name: "undelegate_claim", kind: "message", T: UndelegateClaim, oneof: "action_view" },
    { no: 200, name: "ics20_withdrawal", kind: "message", T: Ics20Withdrawal, oneof: "action_view" },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.SpendView
 */
const SpendView = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.SpendView",
  () => [
    { no: 1, name: "visible", kind: "message", T: SpendView_Visible, oneof: "spend_view" },
    { no: 2, name: "opaque", kind: "message", T: SpendView_Opaque, oneof: "spend_view" },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.SpendView.Visible
 */
const SpendView_Visible = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.SpendView.Visible",
  () => [
    { no: 1, name: "spend", kind: "message", T: Spend },
    { no: 2, name: "note", kind: "message", T: NoteView },
  ],
  {localName: "SpendView_Visible"},
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.SpendView.Opaque
 */
const SpendView_Opaque = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.SpendView.Opaque",
  () => [
    { no: 1, name: "spend", kind: "message", T: Spend },
  ],
  {localName: "SpendView_Opaque"},
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.DelegatorVoteView
 */
const DelegatorVoteView = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.DelegatorVoteView",
  () => [
    { no: 1, name: "visible", kind: "message", T: DelegatorVoteView_Visible, oneof: "delegator_vote" },
    { no: 2, name: "opaque", kind: "message", T: DelegatorVoteView_Opaque, oneof: "delegator_vote" },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.DelegatorVoteView.Visible
 */
const DelegatorVoteView_Visible = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.DelegatorVoteView.Visible",
  () => [
    { no: 1, name: "delegator_vote", kind: "message", T: DelegatorVote },
    { no: 2, name: "note", kind: "message", T: NoteView },
  ],
  {localName: "DelegatorVoteView_Visible"},
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.DelegatorVoteView.Opaque
 */
const DelegatorVoteView_Opaque = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.DelegatorVoteView.Opaque",
  () => [
    { no: 1, name: "delegator_vote", kind: "message", T: DelegatorVote },
  ],
  {localName: "DelegatorVoteView_Opaque"},
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.OutputView
 */
const OutputView = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.OutputView",
  () => [
    { no: 1, name: "visible", kind: "message", T: OutputView_Visible, oneof: "output_view" },
    { no: 2, name: "opaque", kind: "message", T: OutputView_Opaque, oneof: "output_view" },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.OutputView.Visible
 */
const OutputView_Visible = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.OutputView.Visible",
  () => [
    { no: 1, name: "output", kind: "message", T: Output },
    { no: 2, name: "note", kind: "message", T: NoteView },
    { no: 3, name: "payload_key", kind: "message", T: PayloadKey },
  ],
  {localName: "OutputView_Visible"},
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.OutputView.Opaque
 */
const OutputView_Opaque = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.OutputView.Opaque",
  () => [
    { no: 1, name: "output", kind: "message", T: Output },
  ],
  {localName: "OutputView_Opaque"},
);

/**
 * Spends a shielded note.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.Spend
 */
const Spend = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.Spend",
  () => [
    { no: 1, name: "body", kind: "message", T: SpendBody },
    { no: 2, name: "auth_sig", kind: "message", T: SpendAuthSignature },
    { no: 3, name: "proof", kind: "message", T: ZKSpendProof },
  ],
);

/**
 * The body of a spend description, containing only the effecting data
 * describing changes to the ledger, and not the authorizing data that allows
 * those changes to be performed.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.SpendBody
 */
const SpendBody = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.SpendBody",
  () => [
    { no: 1, name: "balance_commitment", kind: "message", T: BalanceCommitment },
    { no: 3, name: "nullifier", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 4, name: "rk", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * Creates a new shielded note.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.Output
 */
const Output = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.Output",
  () => [
    { no: 1, name: "body", kind: "message", T: OutputBody },
    { no: 2, name: "proof", kind: "message", T: ZKOutputProof },
  ],
);

/**
 * The body of an output description, containing only the effecting data
 * describing changes to the ledger, and not the authorizing data that allows
 * those changes to be performed.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.OutputBody
 */
const OutputBody = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.OutputBody",
  () => [
    { no: 1, name: "note_payload", kind: "message", T: NotePayload },
    { no: 2, name: "balance_commitment", kind: "message", T: BalanceCommitment },
    { no: 3, name: "wrapped_memo_key", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 4, name: "ovk_wrapped_key", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * The data required to authorize a transaction plan.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.AuthorizationData
 */
const AuthorizationData = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.AuthorizationData",
  () => [
    { no: 1, name: "effect_hash", kind: "message", T: EffectHash },
    { no: 2, name: "spend_auths", kind: "message", T: SpendAuthSignature, repeated: true },
    { no: 3, name: "delegator_vote_auths", kind: "message", T: SpendAuthSignature, repeated: true },
  ],
);

/**
 * The data required for proving when building a transaction from a plan.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.WitnessData
 */
const WitnessData = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.WitnessData",
  () => [
    { no: 1, name: "anchor", kind: "message", T: MerkleRoot },
    { no: 2, name: "state_commitment_proofs", kind: "message", T: StateCommitmentProof, repeated: true },
  ],
);

/**
 * Describes a planned transaction.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.TransactionPlan
 */
const TransactionPlan = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.TransactionPlan",
  () => [
    { no: 1, name: "actions", kind: "message", T: ActionPlan, repeated: true },
    { no: 2, name: "expiry_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "chain_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "fee", kind: "message", T: Fee },
    { no: 5, name: "clue_plans", kind: "message", T: CluePlan, repeated: true },
    { no: 6, name: "memo_plan", kind: "message", T: MemoPlan },
  ],
);

/**
 * Describes a planned transaction action.
 *
 * Some transaction Actions don't have any private data and are treated as being plans
 * themselves.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.ActionPlan
 */
const ActionPlan = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.ActionPlan",
  () => [
    { no: 1, name: "spend", kind: "message", T: SpendPlan, oneof: "action" },
    { no: 2, name: "output", kind: "message", T: OutputPlan, oneof: "action" },
    { no: 3, name: "swap", kind: "message", T: SwapPlan, oneof: "action" },
    { no: 4, name: "swap_claim", kind: "message", T: SwapClaimPlan, oneof: "action" },
    { no: 16, name: "validator_definition", kind: "message", T: ValidatorDefinition, oneof: "action" },
    { no: 17, name: "ibc_action", kind: "message", T: IbcAction, oneof: "action" },
    { no: 18, name: "proposal_submit", kind: "message", T: ProposalSubmit, oneof: "action" },
    { no: 19, name: "proposal_withdraw", kind: "message", T: ProposalWithdraw, oneof: "action" },
    { no: 20, name: "validator_vote", kind: "message", T: ValidatorVote, oneof: "action" },
    { no: 21, name: "delegator_vote", kind: "message", T: DelegatorVotePlan, oneof: "action" },
    { no: 22, name: "proposal_deposit_claim", kind: "message", T: ProposalDepositClaim, oneof: "action" },
    { no: 23, name: "withdrawal", kind: "message", T: Ics20Withdrawal, oneof: "action" },
    { no: 30, name: "position_open", kind: "message", T: PositionOpen, oneof: "action" },
    { no: 31, name: "position_close", kind: "message", T: PositionClose, oneof: "action" },
    { no: 32, name: "position_withdraw", kind: "message", T: PositionWithdrawPlan, oneof: "action" },
    { no: 34, name: "position_reward_claim", kind: "message", T: PositionRewardClaimPlan, oneof: "action" },
    { no: 40, name: "delegate", kind: "message", T: Delegate, oneof: "action" },
    { no: 41, name: "undelegate", kind: "message", T: Undelegate, oneof: "action" },
    { no: 42, name: "undelegate_claim", kind: "message", T: UndelegateClaimPlan, oneof: "action" },
    { no: 50, name: "dao_spend", kind: "message", T: DaoSpend, oneof: "action" },
    { no: 51, name: "dao_output", kind: "message", T: DaoOutput, oneof: "action" },
    { no: 52, name: "dao_deposit", kind: "message", T: DaoDeposit, oneof: "action" },
  ],
);

/**
 * Describes a plan for forming a `Clue`.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.CluePlan
 */
const CluePlan = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.CluePlan",
  () => [
    { no: 1, name: "address", kind: "message", T: Address },
    { no: 2, name: "rseed", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "precision_bits", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * Describes a plan for forming a `Memo`.
 *
 * @generated from message penumbra.core.transaction.v1alpha1.MemoPlan
 */
const MemoPlan = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.MemoPlan",
  () => [
    { no: 1, name: "plaintext", kind: "message", T: MemoPlaintext },
    { no: 2, name: "key", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.MemoCiphertext
 */
const MemoCiphertext = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.MemoCiphertext",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.MemoPlaintext
 */
const MemoPlaintext = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.MemoPlaintext",
  () => [
    { no: 1, name: "sender", kind: "message", T: Address },
    { no: 2, name: "text", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.MemoView
 */
const MemoView = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.MemoView",
  () => [
    { no: 1, name: "visible", kind: "message", T: MemoView_Visible, oneof: "memo_view" },
    { no: 2, name: "opaque", kind: "message", T: MemoView_Opaque, oneof: "memo_view" },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.MemoView.Visible
 */
const MemoView_Visible = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.MemoView.Visible",
  () => [
    { no: 1, name: "ciphertext", kind: "message", T: MemoCiphertext },
    { no: 2, name: "plaintext", kind: "message", T: MemoPlaintext },
  ],
  {localName: "MemoView_Visible"},
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.MemoView.Opaque
 */
const MemoView_Opaque = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.MemoView.Opaque",
  () => [
    { no: 1, name: "ciphertext", kind: "message", T: MemoCiphertext },
  ],
  {localName: "MemoView_Opaque"},
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.SpendPlan
 */
const SpendPlan = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.SpendPlan",
  () => [
    { no: 1, name: "note", kind: "message", T: Note },
    { no: 2, name: "position", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "randomizer", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 4, name: "value_blinding", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.core.transaction.v1alpha1.OutputPlan
 */
const OutputPlan = proto3.makeMessageType(
  "penumbra.core.transaction.v1alpha1.OutputPlan",
  () => [
    { no: 1, name: "value", kind: "message", T: Value },
    { no: 2, name: "dest_address", kind: "message", T: Address },
    { no: 3, name: "rseed", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 4, name: "value_blinding", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);


;// CONCATENATED MODULE: ../node_modules/@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb.js
// @generated by protoc-gen-es v1.2.1
// @generated from file penumbra/view/v1alpha1/view.proto (package penumbra.view.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck









/**
 * @generated from message penumbra.view.v1alpha1.BroadcastTransactionRequest
 */
const BroadcastTransactionRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.BroadcastTransactionRequest",
  () => [
    { no: 1, name: "transaction", kind: "message", T: Transaction },
    { no: 2, name: "await_detection", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.BroadcastTransactionResponse
 */
const BroadcastTransactionResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.BroadcastTransactionResponse",
  () => [
    { no: 1, name: "id", kind: "message", T: Id },
    { no: 2, name: "detection_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.TransactionPlannerRequest
 */
const TransactionPlannerRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.TransactionPlannerRequest",
  () => [
    { no: 1, name: "expiry_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "fee", kind: "message", T: Fee },
    { no: 3, name: "memo", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 14, name: "account_group_id", kind: "message", T: AccountGroupId, opt: true },
    { no: 20, name: "outputs", kind: "message", T: TransactionPlannerRequest_Output, repeated: true },
    { no: 30, name: "swaps", kind: "message", T: TransactionPlannerRequest_Swap, repeated: true },
    { no: 40, name: "delegations", kind: "message", T: TransactionPlannerRequest_Delegate, repeated: true },
    { no: 50, name: "undelegations", kind: "message", T: TransactionPlannerRequest_Undelegate, repeated: true },
    { no: 60, name: "ibc_actions", kind: "message", T: IbcAction, repeated: true },
  ],
);

/**
 * Request message subtypes
 *
 * @generated from message penumbra.view.v1alpha1.TransactionPlannerRequest.Output
 */
const TransactionPlannerRequest_Output = proto3.makeMessageType(
  "penumbra.view.v1alpha1.TransactionPlannerRequest.Output",
  () => [
    { no: 1, name: "value", kind: "message", T: Value },
    { no: 2, name: "address", kind: "message", T: Address },
  ],
  {localName: "TransactionPlannerRequest_Output"},
);

/**
 * @generated from message penumbra.view.v1alpha1.TransactionPlannerRequest.Swap
 */
const TransactionPlannerRequest_Swap = proto3.makeMessageType(
  "penumbra.view.v1alpha1.TransactionPlannerRequest.Swap",
  () => [
    { no: 1, name: "value", kind: "message", T: Value },
    { no: 2, name: "target_asset", kind: "message", T: AssetId },
    { no: 3, name: "fee", kind: "message", T: Fee },
  ],
  {localName: "TransactionPlannerRequest_Swap"},
);

/**
 * @generated from message penumbra.view.v1alpha1.TransactionPlannerRequest.Delegate
 */
const TransactionPlannerRequest_Delegate = proto3.makeMessageType(
  "penumbra.view.v1alpha1.TransactionPlannerRequest.Delegate",
  () => [
    { no: 1, name: "amount", kind: "message", T: Amount },
    { no: 3, name: "rate_data", kind: "message", T: RateData },
  ],
  {localName: "TransactionPlannerRequest_Delegate"},
);

/**
 * @generated from message penumbra.view.v1alpha1.TransactionPlannerRequest.Undelegate
 */
const TransactionPlannerRequest_Undelegate = proto3.makeMessageType(
  "penumbra.view.v1alpha1.TransactionPlannerRequest.Undelegate",
  () => [
    { no: 1, name: "value", kind: "message", T: Value },
    { no: 2, name: "rate_data", kind: "message", T: RateData },
  ],
  {localName: "TransactionPlannerRequest_Undelegate"},
);

/**
 * @generated from message penumbra.view.v1alpha1.TransactionPlannerResponse
 */
const TransactionPlannerResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.TransactionPlannerResponse",
  () => [
    { no: 1, name: "plan", kind: "message", T: TransactionPlan },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.AddressByIndexRequest
 */
const AddressByIndexRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.AddressByIndexRequest",
  () => [
    { no: 1, name: "address_index", kind: "message", T: AddressIndex },
    { no: 2, name: "display_confirm", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.AddressByIndexResponse
 */
const AddressByIndexResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.AddressByIndexResponse",
  () => [
    { no: 1, name: "address", kind: "message", T: Address },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.IndexByAddressRequest
 */
const IndexByAddressRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.IndexByAddressRequest",
  () => [
    { no: 1, name: "address", kind: "message", T: Address },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.IndexByAddressResponse
 */
const IndexByAddressResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.IndexByAddressResponse",
  () => [
    { no: 1, name: "address_index", kind: "message", T: AddressIndex, opt: true },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.EphemeralAddressRequest
 */
const EphemeralAddressRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.EphemeralAddressRequest",
  () => [
    { no: 1, name: "address_index", kind: "message", T: AddressIndex },
    { no: 2, name: "display_confirm", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.EphemeralAddressResponse
 */
const EphemeralAddressResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.EphemeralAddressResponse",
  () => [
    { no: 1, name: "address", kind: "message", T: Address },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.BalanceByAddressRequest
 */
const BalanceByAddressRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.BalanceByAddressRequest",
  () => [
    { no: 1, name: "address", kind: "message", T: Address },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.BalanceByAddressResponse
 */
const BalanceByAddressResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.BalanceByAddressResponse",
  () => [
    { no: 1, name: "asset", kind: "message", T: AssetId },
    { no: 2, name: "amount", kind: "message", T: Amount },
  ],
);

/**
 * Scaffolding for bearer-token authentication for the ViewService.
 *
 * @generated from message penumbra.view.v1alpha1.ViewAuthToken
 */
const ViewAuthToken = proto3.makeMessageType(
  "penumbra.view.v1alpha1.ViewAuthToken",
  () => [
    { no: 1, name: "inner", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.ViewAuthRequest
 */
const ViewAuthRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.ViewAuthRequest",
  () => [
    { no: 1, name: "fvk", kind: "message", T: FullViewingKey },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.ViewAuthResponse
 */
const ViewAuthResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.ViewAuthResponse",
  () => [
    { no: 1, name: "token", kind: "message", T: ViewAuthToken },
  ],
);

/**
 * Requests sync status of the view service.
 *
 * @generated from message penumbra.view.v1alpha1.StatusRequest
 */
const StatusRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.StatusRequest",
  () => [
    { no: 14, name: "account_group_id", kind: "message", T: AccountGroupId, opt: true },
  ],
);

/**
 * Returns the status of the view service and whether it is synchronized with the chain state.
 *
 * @generated from message penumbra.view.v1alpha1.StatusResponse
 */
const StatusResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.StatusResponse",
  () => [
    { no: 1, name: "sync_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "catching_up", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
);

/**
 * Requests streaming updates on the sync height until the view service is synchronized.
 *
 * @generated from message penumbra.view.v1alpha1.StatusStreamRequest
 */
const StatusStreamRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.StatusStreamRequest",
  () => [
    { no: 14, name: "account_group_id", kind: "message", T: AccountGroupId, opt: true },
  ],
);

/**
 * A streaming sync status update
 *
 * @generated from message penumbra.view.v1alpha1.StatusStreamResponse
 */
const StatusStreamResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.StatusStreamResponse",
  () => [
    { no: 1, name: "latest_known_block_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: "sync_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * A query for notes known by the view service.
 *
 * This message uses the fact that all proto fields are optional
 * to allow various filtering on the returned notes.
 *
 * @generated from message penumbra.view.v1alpha1.NotesRequest
 */
const NotesRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.NotesRequest",
  () => [
    { no: 2, name: "include_spent", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 3, name: "asset_id", kind: "message", T: AssetId },
    { no: 4, name: "address_index", kind: "message", T: AddressIndex },
    { no: 6, name: "amount_to_spend", kind: "message", T: Amount },
    { no: 14, name: "account_group_id", kind: "message", T: AccountGroupId, opt: true },
  ],
);

/**
 * A query for notes to be used for voting on a proposal.
 *
 * @generated from message penumbra.view.v1alpha1.NotesForVotingRequest
 */
const NotesForVotingRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.NotesForVotingRequest",
  () => [
    { no: 1, name: "votable_at_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 3, name: "address_index", kind: "message", T: AddressIndex },
    { no: 14, name: "account_group_id", kind: "message", T: AccountGroupId, opt: true },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.WitnessRequest
 */
const WitnessRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.WitnessRequest",
  () => [
    { no: 2, name: "note_commitments", kind: "message", T: StateCommitment, repeated: true },
    { no: 3, name: "transaction_plan", kind: "message", T: TransactionPlan },
    { no: 14, name: "account_group_id", kind: "message", T: AccountGroupId, opt: true },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.WitnessResponse
 */
const WitnessResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.WitnessResponse",
  () => [
    { no: 1, name: "witness_data", kind: "message", T: WitnessData },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.WitnessAndBuildRequest
 */
const WitnessAndBuildRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.WitnessAndBuildRequest",
  () => [
    { no: 1, name: "transaction_plan", kind: "message", T: TransactionPlan },
    { no: 2, name: "authorization_data", kind: "message", T: AuthorizationData },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.WitnessAndBuildResponse
 */
const WitnessAndBuildResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.WitnessAndBuildResponse",
  () => [
    { no: 1, name: "transaction", kind: "message", T: Transaction },
  ],
);

/**
 * Requests all assets known to the view service.
 *
 * @generated from message penumbra.view.v1alpha1.AssetsRequest
 */
const AssetsRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.AssetsRequest",
  () => [
    { no: 1, name: "filtered", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 2, name: "include_specific_denominations", kind: "message", T: Denom, repeated: true },
    { no: 3, name: "include_delegation_tokens", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 4, name: "include_unbonding_tokens", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 5, name: "include_lp_nfts", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 6, name: "include_proposal_nfts", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 7, name: "include_voting_receipt_tokens", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
);

/**
 * Requests all assets known to the view service.
 *
 * @generated from message penumbra.view.v1alpha1.AssetsResponse
 */
const AssetsResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.AssetsResponse",
  () => [
    { no: 2, name: "denom_metadata", kind: "message", T: DenomMetadata },
  ],
);

/**
 * Requests the current chain parameters from the view service.
 *
 * @generated from message penumbra.view.v1alpha1.ChainParametersRequest
 */
const ChainParametersRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.ChainParametersRequest",
  [],
);

/**
 * @generated from message penumbra.view.v1alpha1.ChainParametersResponse
 */
const ChainParametersResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.ChainParametersResponse",
  () => [
    { no: 1, name: "parameters", kind: "message", T: ChainParameters },
  ],
);

/**
 * Requests the current FMD parameters from the view service.
 *
 * @generated from message penumbra.view.v1alpha1.FMDParametersRequest
 */
const FMDParametersRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.FMDParametersRequest",
  [],
);

/**
 * @generated from message penumbra.view.v1alpha1.FMDParametersResponse
 */
const FMDParametersResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.FMDParametersResponse",
  () => [
    { no: 1, name: "parameters", kind: "message", T: FmdParameters },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.NoteByCommitmentRequest
 */
const NoteByCommitmentRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.NoteByCommitmentRequest",
  () => [
    { no: 2, name: "note_commitment", kind: "message", T: StateCommitment },
    { no: 3, name: "await_detection", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 14, name: "account_group_id", kind: "message", T: AccountGroupId, opt: true },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.NoteByCommitmentResponse
 */
const NoteByCommitmentResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.NoteByCommitmentResponse",
  () => [
    { no: 1, name: "spendable_note", kind: "message", T: SpendableNoteRecord },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.SwapByCommitmentRequest
 */
const SwapByCommitmentRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.SwapByCommitmentRequest",
  () => [
    { no: 2, name: "swap_commitment", kind: "message", T: StateCommitment },
    { no: 3, name: "await_detection", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 14, name: "account_group_id", kind: "message", T: AccountGroupId, opt: true },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.SwapByCommitmentResponse
 */
const SwapByCommitmentResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.SwapByCommitmentResponse",
  () => [
    { no: 1, name: "swap", kind: "message", T: SwapRecord },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.NullifierStatusRequest
 */
const NullifierStatusRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.NullifierStatusRequest",
  () => [
    { no: 2, name: "nullifier", kind: "message", T: Nullifier },
    { no: 3, name: "await_detection", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 14, name: "account_group_id", kind: "message", T: AccountGroupId, opt: true },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.NullifierStatusResponse
 */
const NullifierStatusResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.NullifierStatusResponse",
  () => [
    { no: 1, name: "spent", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.TransactionInfoByHashRequest
 */
const TransactionInfoByHashRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.TransactionInfoByHashRequest",
  () => [
    { no: 2, name: "id", kind: "message", T: Id },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.TransactionInfoRequest
 */
const TransactionInfoRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.TransactionInfoRequest",
  () => [
    { no: 1, name: "start_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */, opt: true },
    { no: 2, name: "end_height", kind: "scalar", T: 4 /* ScalarType.UINT64 */, opt: true },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.TransactionInfo
 */
const TransactionInfo = proto3.makeMessageType(
  "penumbra.view.v1alpha1.TransactionInfo",
  () => [
    { no: 1, name: "height", kind: "scalar", T: 4 /* ScalarType.UINT64 */, opt: true },
    { no: 2, name: "id", kind: "message", T: Id },
    { no: 3, name: "transaction", kind: "message", T: Transaction },
    { no: 4, name: "perspective", kind: "message", T: TransactionPerspective },
    { no: 5, name: "view", kind: "message", T: TransactionView },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.TransactionInfoResponse
 */
const TransactionInfoResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.TransactionInfoResponse",
  () => [
    { no: 1, name: "tx_info", kind: "message", T: TransactionInfo },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.TransactionInfoByHashResponse
 */
const TransactionInfoByHashResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.TransactionInfoByHashResponse",
  () => [
    { no: 1, name: "tx_info", kind: "message", T: TransactionInfo },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.NotesResponse
 */
const NotesResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.NotesResponse",
  () => [
    { no: 1, name: "note_record", kind: "message", T: SpendableNoteRecord },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.NotesForVotingResponse
 */
const NotesForVotingResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.NotesForVotingResponse",
  () => [
    { no: 1, name: "note_record", kind: "message", T: SpendableNoteRecord },
    { no: 2, name: "identity_key", kind: "message", T: IdentityKey },
  ],
);

/**
 * A note plaintext with associated metadata about its status.
 *
 * @generated from message penumbra.view.v1alpha1.SpendableNoteRecord
 */
const SpendableNoteRecord = proto3.makeMessageType(
  "penumbra.view.v1alpha1.SpendableNoteRecord",
  () => [
    { no: 1, name: "note_commitment", kind: "message", T: StateCommitment },
    { no: 2, name: "note", kind: "message", T: Note },
    { no: 3, name: "address_index", kind: "message", T: AddressIndex },
    { no: 4, name: "nullifier", kind: "message", T: Nullifier },
    { no: 5, name: "height_created", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 6, name: "height_spent", kind: "scalar", T: 4 /* ScalarType.UINT64 */, opt: true },
    { no: 7, name: "position", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 8, name: "source", kind: "message", T: NoteSource },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.SwapRecord
 */
const SwapRecord = proto3.makeMessageType(
  "penumbra.view.v1alpha1.SwapRecord",
  () => [
    { no: 1, name: "swap_commitment", kind: "message", T: StateCommitment },
    { no: 2, name: "swap", kind: "message", T: SwapPlaintext },
    { no: 3, name: "position", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 4, name: "nullifier", kind: "message", T: Nullifier },
    { no: 5, name: "output_data", kind: "message", T: BatchSwapOutputData },
    { no: 6, name: "height_claimed", kind: "scalar", T: 4 /* ScalarType.UINT64 */, opt: true },
    { no: 7, name: "source", kind: "message", T: NoteSource },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.OwnedPositionIdsRequest
 */
const OwnedPositionIdsRequest = proto3.makeMessageType(
  "penumbra.view.v1alpha1.OwnedPositionIdsRequest",
  () => [
    { no: 1, name: "position_state", kind: "message", T: PositionState, opt: true },
    { no: 2, name: "trading_pair", kind: "message", T: TradingPair, opt: true },
  ],
);

/**
 * @generated from message penumbra.view.v1alpha1.OwnedPositionIdsResponse
 */
const OwnedPositionIdsResponse = proto3.makeMessageType(
  "penumbra.view.v1alpha1.OwnedPositionIdsResponse",
  () => [
    { no: 1, name: "position_ids", kind: "message", T: PositionId, repeated: true },
  ],
);



/***/ }),

/***/ 283:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Hb: () => (/* binding */ createPromiseClient)
});

// UNUSED EXPORTS: createBiDiStreamingFn, createClientStreamingFn, createServerStreamingFn

// EXTERNAL MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/service-type.js
var service_type = __webpack_require__(3421);
;// CONCATENATED MODULE: ../node_modules/@bufbuild/connect/dist/esm/any-client.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * Create any client for the given service.
 *
 * The given createMethod function is called for each method definition
 * of the service. The function it returns is added to the client object
 * as a method.
 */
function makeAnyClient(service, createMethod) {
    const client = {};
    for (const [localName, methodInfo] of Object.entries(service.methods)) {
        const method = createMethod(Object.assign(Object.assign({}, methodInfo), { localName,
            service }));
        if (method != null) {
            client[localName] = method;
        }
    }
    return client;
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/connect/dist/esm/code.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * Connect represents categories of errors as codes, and each code maps to a
 * specific HTTP status code. The codes and their semantics were chosen to
 * match gRPC. Only the codes below are valid — there are no user-defined
 * codes.
 *
 * See the specification at https://connect.build/docs/protocol#error-codes
 * for details.
 */
var code_Code;
(function (Code) {
    /**
     * Canceled, usually be the user
     */
    Code[Code["Canceled"] = 1] = "Canceled";
    /**
     * Unknown error
     */
    Code[Code["Unknown"] = 2] = "Unknown";
    /**
     * Argument invalid regardless of system state
     */
    Code[Code["InvalidArgument"] = 3] = "InvalidArgument";
    /**
     * Operation expired, may or may not have completed.
     */
    Code[Code["DeadlineExceeded"] = 4] = "DeadlineExceeded";
    /**
     * Entity not found.
     */
    Code[Code["NotFound"] = 5] = "NotFound";
    /**
     * Entity already exists.
     */
    Code[Code["AlreadyExists"] = 6] = "AlreadyExists";
    /**
     * Operation not authorized.
     */
    Code[Code["PermissionDenied"] = 7] = "PermissionDenied";
    /**
     * Quota exhausted.
     */
    Code[Code["ResourceExhausted"] = 8] = "ResourceExhausted";
    /**
     * Argument invalid in current system state.
     */
    Code[Code["FailedPrecondition"] = 9] = "FailedPrecondition";
    /**
     * Operation aborted.
     */
    Code[Code["Aborted"] = 10] = "Aborted";
    /**
     * Out of bounds, use instead of FailedPrecondition.
     */
    Code[Code["OutOfRange"] = 11] = "OutOfRange";
    /**
     * Operation not implemented or disabled.
     */
    Code[Code["Unimplemented"] = 12] = "Unimplemented";
    /**
     * Internal error, reserved for "serious errors".
     */
    Code[Code["Internal"] = 13] = "Internal";
    /**
     * Unavailable, client should back off and retry.
     */
    Code[Code["Unavailable"] = 14] = "Unavailable";
    /**
     * Unrecoverable data loss or corruption.
     */
    Code[Code["DataLoss"] = 15] = "DataLoss";
    /**
     * Request isn't authenticated.
     */
    Code[Code["Unauthenticated"] = 16] = "Unauthenticated";
})(code_Code || (code_Code = {}));

// EXTERNAL MODULE: ../node_modules/@bufbuild/protobuf/dist/esm/message.js
var message = __webpack_require__(7451);
;// CONCATENATED MODULE: ../node_modules/@bufbuild/connect/dist/esm/protocol-connect/code-string.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * codeToString returns the string representation of a Code.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function codeToString(value) {
    const name = code_Code[value];
    if (typeof name != "string") {
        return value.toString();
    }
    return (name[0].toLowerCase() +
        name.substring(1).replace(/[A-Z]/g, (c) => "_" + c.toLowerCase()));
}
let stringToCode;
/**
 * codeFromString parses the string representation of a Code in snake_case.
 * For example, the string "permission_denied" parses into Code.PermissionDenied.
 *
 * If the given string cannot be parsed, the function returns undefined.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function codeFromString(value) {
    if (!stringToCode) {
        stringToCode = {};
        for (const value of Object.values(Code)) {
            if (typeof value == "string") {
                continue;
            }
            stringToCode[codeToString(value)] = value;
        }
    }
    return stringToCode[value];
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/connect/dist/esm/connect-error.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/**
 * ConnectError captures four pieces of information: a Code, an error
 * message, an optional cause of the error, and an optional collection of
 * arbitrary Protobuf messages called  "details".
 *
 * Because developer tools typically show just the error message, we prefix
 * it with the status code, so that the most important information is always
 * visible immediately.
 *
 * Error details are wrapped with google.protobuf.Any on the wire, so that
 * a server or middleware can attach arbitrary data to an error. Use the
 * method findDetails() to retrieve the details.
 */
class connect_error_ConnectError extends Error {
    /**
     * Create a new ConnectError.
     * If no code is provided, code "unknown" is used.
     * Outgoing details are only relevant for the server side - a service may
     * raise an error with details, and it is up to the protocol implementation
     * to encode and send the details along with error.
     */
    constructor(message, code = code_Code.Unknown, metadata, outgoingDetails, cause) {
        super(createMessage(message, code));
        this.name = "ConnectError";
        // see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#example
        Object.setPrototypeOf(this, new.target.prototype);
        this.rawMessage = message;
        this.code = code;
        this.metadata = new Headers(metadata !== null && metadata !== void 0 ? metadata : {});
        this.details = outgoingDetails !== null && outgoingDetails !== void 0 ? outgoingDetails : [];
        this.cause = cause;
    }
    /**
     * Convert any value - typically a caught error into a ConnectError,
     * following these rules:
     * - If the value is already a ConnectError, return it as is.
     * - If the value is an AbortError from the fetch API, return the message
     *   of the AbortError with code Canceled.
     * - For other Errors, return the error message with code Unknown by default.
     * - For other values, return the values String representation as a message,
     *   with the code Unknown by default.
     */
    static from(reason, code = code_Code.Unknown) {
        if (reason instanceof connect_error_ConnectError) {
            return reason;
        }
        if (reason instanceof Error) {
            if (reason.name == "AbortError") {
                // Fetch requests can only be canceled with an AbortController.
                // We detect that condition by looking at the name of the raised
                // error object, and translate to the appropriate status code.
                return new connect_error_ConnectError(reason.message, code_Code.Canceled);
            }
            return new connect_error_ConnectError(reason.message, code);
        }
        return new connect_error_ConnectError(String(reason), code);
    }
    findDetails(typeOrRegistry) {
        const registry = "typeName" in typeOrRegistry
            ? {
                findMessage: (typeName) => typeName === typeOrRegistry.typeName ? typeOrRegistry : undefined,
            }
            : typeOrRegistry;
        const details = [];
        for (const data of this.details) {
            if (data instanceof message/* Message */.v) {
                if (registry.findMessage(data.getType().typeName)) {
                    details.push(data);
                }
                continue;
            }
            const type = registry.findMessage(data.type);
            if (type) {
                try {
                    details.push(type.fromBinary(data.value));
                }
                catch (_) {
                    // We silently give up if we are unable to parse the detail, because
                    // that appears to be the least worst behavior.
                    // It is very unlikely that a user surrounds a catch body handling the
                    // error with another try-catch statement, and we do not want to
                    // recommend doing so.
                }
            }
        }
        return details;
    }
}
/**
 * @deprecated use ConnectError.findDetails() instead
 */
function connectErrorDetails(error, typeOrRegistry, ...moreTypes) {
    const types = "typeName" in typeOrRegistry ? [typeOrRegistry, ...moreTypes] : [];
    const registry = "typeName" in typeOrRegistry ? createRegistry(...types) : typeOrRegistry;
    const details = [];
    for (const data of error.details) {
        if (data instanceof Message) {
            if (registry.findMessage(data.getType().typeName)) {
                details.push(data);
            }
            continue;
        }
        const type = registry.findMessage(data.type);
        if (type) {
            try {
                details.push(type.fromBinary(data.value));
            }
            catch (_) {
                // We silently give up if we are unable to parse the detail, because
                // that appears to be the least worst behavior.
                // It is very unlikely that a user surrounds a catch body handling the
                // error with another try-catch statement, and we do not want to
                // recommend doing so.
            }
        }
    }
    return details;
}
/**
 * Create an error message, prefixing the given code.
 */
function createMessage(message, code) {
    return message.length
        ? `[${codeToString(code)}] ${message}`
        : `[${codeToString(code)}]`;
}
/**
 * Convert any value - typically a caught error into a ConnectError,
 * following these rules:
 * - If the value is already a ConnectError, return it as is.
 * - If the value is an AbortError from the fetch API, return the message
 *   of the AbortError with code Canceled.
 * - For other Errors, return the error message with code Unknown by default.
 * - For other values, return the values String representation as a message,
 *   with the code Unknown by default.
 *
 * @deprecated use ConnectError.from() instead
 */
function connectErrorFromReason(reason, code = Code.Unknown) {
    if (reason instanceof connect_error_ConnectError) {
        return reason;
    }
    if (reason instanceof Error) {
        if (reason.name == "AbortError") {
            // Fetch requests can only be canceled with an AbortController.
            // We detect that condition by looking at the name of the raised
            // error object, and translate to the appropriate status code.
            return new connect_error_ConnectError(reason.message, Code.Canceled);
        }
        return new connect_error_ConnectError(reason.message, code);
    }
    return new connect_error_ConnectError(String(reason), code);
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/connect/dist/esm/protocol/async-iterable.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __asyncValues = (undefined && undefined.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (undefined && undefined.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (undefined && undefined.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncDelegator = (undefined && undefined.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
};




function pipeTo(source, ...rest) {
    const [transforms, sink, opt] = pickTransformsAndSink(rest);
    let iterable = source;
    let abortable;
    if ((opt === null || opt === void 0 ? void 0 : opt.propagateDownStreamError) === true) {
        iterable = abortable = makeIterableAbortable(iterable);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    iterable = pipe(iterable, ...transforms, { propagateDownStreamError: false });
    return sink(iterable).catch((reason) => {
        if (abortable) {
            return abortable.abort(reason).then(() => Promise.reject(reason));
        }
        return Promise.reject(reason);
    });
}
// pick transforms, the sink, and options from the pipeTo() rest parameter
function pickTransformsAndSink(rest) {
    let opt;
    if (typeof rest[rest.length - 1] != "function") {
        opt = rest.pop();
    }
    const sink = rest.pop();
    return [rest, sink, opt];
}
/**
 * Creates an AsyncIterableSink that concatenates all elements from the input.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function sinkAll() {
    return async function (iterable) {
        var _a, e_1, _b, _c;
        const all = [];
        try {
            for (var _d = true, iterable_1 = __asyncValues(iterable), iterable_1_1; iterable_1_1 = await iterable_1.next(), _a = iterable_1_1.done, !_a;) {
                _c = iterable_1_1.value;
                _d = false;
                try {
                    const chunk = _c;
                    all.push(chunk);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = iterable_1.return)) await _b.call(iterable_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return all;
    };
}
/**
 * Creates an AsyncIterableSink that concatenates all chunks from the input into
 * a single Uint8Array.
 *
 * The iterable raises an error if the more than readMaxBytes are read.
 *
 * An optional length hint can be provided to optimize allocation and validation.
 * If more or less bytes are present in the source that the length hint indicates,
 * and error is raised.
 * If the length hint is larger than readMaxBytes, an error is raised.
 * If the length hint is not a positive integer, it is ignored.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function sinkAllBytes(readMaxBytes, lengthHint) {
    return async function (iterable) {
        return await readAllBytes(iterable, readMaxBytes, lengthHint);
    };
}
function pipe(source, ...rest) {
    return __asyncGenerator(this, arguments, function* pipe_1() {
        const [transforms, opt] = pickTransforms(rest);
        let abortable;
        let iterable = source;
        if ((opt === null || opt === void 0 ? void 0 : opt.propagateDownStreamError) === true) {
            iterable = abortable = makeIterableAbortable(iterable);
        }
        for (const t of transforms) {
            iterable = t(iterable);
        }
        const it = iterable[Symbol.asyncIterator]();
        for (;;) {
            const r = yield __await(it.next());
            if (r.done === true) {
                break;
            }
            if (!abortable) {
                yield yield __await(r.value);
                continue;
            }
            try {
                yield yield __await(r.value);
            }
            catch (e) {
                yield __await(abortable.abort(e)); // propagate downstream error to the source
                throw e;
            }
        }
    });
}
function pickTransforms(rest) {
    let opt;
    if (typeof rest[rest.length - 1] != "function") {
        opt = rest.pop();
    }
    return [rest, opt];
}
/**
 * Creates an AsyncIterableTransform that catches any error from the input, and
 * passes it to the given catchError function.
 *
 * The catchError function may return a final value.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function transformCatch(catchError) {
    return function (iterable) {
        return __asyncGenerator(this, arguments, function* () {
            // we deliberate avoid a for-await loop because we only want to catch upstream
            // errors, not downstream errors (yield).
            const it = iterable[Symbol.asyncIterator]();
            for (;;) {
                let r;
                try {
                    r = yield __await(it.next());
                }
                catch (e) {
                    const caught = yield __await(catchError(e));
                    if (caught !== undefined) {
                        yield yield __await(caught);
                    }
                    break;
                }
                if (r.done === true) {
                    break;
                }
                yield yield __await(r.value);
            }
        });
    };
}
/**
 * Creates an AsyncIterableTransform that catches any error from the input, and
 * passes it to the given function. Unlike transformCatch(), the given function
 * is also called when no error is raised.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function transformCatchFinally(catchFinally) {
    return function (iterable) {
        return __asyncGenerator(this, arguments, function* () {
            // we deliberate avoid a for-await loop because we only want to catch upstream
            // errors, not downstream errors (yield).
            let err;
            const it = iterable[Symbol.asyncIterator]();
            for (;;) {
                let r;
                try {
                    r = yield __await(it.next());
                }
                catch (e) {
                    err = e;
                    break;
                }
                if (r.done === true) {
                    break;
                }
                yield yield __await(r.value);
            }
            const caught = yield __await(catchFinally(err));
            if (caught !== undefined) {
                yield yield __await(caught);
            }
        });
    };
}
/**
 * Creates an AsyncIterableTransform that appends a value.
 *
 * The element to append is provided by a function. If the function returns
 * undefined, no element is appended.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function transformAppend(provide) {
    return function (iterable) {
        return __asyncGenerator(this, arguments, function* () {
            var _a, e_2, _b, _c;
            try {
                for (var _d = true, iterable_2 = __asyncValues(iterable), iterable_2_1; iterable_2_1 = yield __await(iterable_2.next()), _a = iterable_2_1.done, !_a;) {
                    _c = iterable_2_1.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        yield yield __await(chunk);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = iterable_2.return)) yield __await(_b.call(iterable_2));
                }
                finally { if (e_2) throw e_2.error; }
            }
            const append = yield __await(provide());
            if (append !== undefined) {
                yield yield __await(append);
            }
        });
    };
}
/**
 * Creates an AsyncIterableTransform that prepends an element.
 *
 * The element to prepend is provided by a function. If the function returns
 * undefined, no element is appended.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function transformPrepend(provide) {
    return function (iterable) {
        return __asyncGenerator(this, arguments, function* () {
            var _a, e_3, _b, _c;
            const prepend = yield __await(provide());
            if (prepend !== undefined) {
                yield yield __await(prepend);
            }
            try {
                for (var _d = true, iterable_3 = __asyncValues(iterable), iterable_3_1; iterable_3_1 = yield __await(iterable_3.next()), _a = iterable_3_1.done, !_a;) {
                    _c = iterable_3_1.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        yield yield __await(chunk);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = iterable_3.return)) yield __await(_b.call(iterable_3));
                }
                finally { if (e_3) throw e_3.error; }
            }
        });
    };
}
/**
 * Creates an AsyncIterableTransform that reads all bytes from the input, and
 * concatenates them to a single Uint8Array.
 *
 * The iterable raises an error if the more than readMaxBytes are read.
 *
 * An optional length hint can be provided to optimize allocation and validation.
 * If more or less bytes are present in the source that the length hint indicates,
 * and error is raised.
 * If the length hint is larger than readMaxBytes, an error is raised.
 * If the length hint is not a positive integer, it is ignored.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function transformReadAllBytes(readMaxBytes, lengthHint) {
    return function (iterable) {
        return __asyncGenerator(this, arguments, function* () {
            yield yield __await(yield __await(readAllBytes(iterable, readMaxBytes, lengthHint)));
        });
    };
}
/**
 * Creates an AsyncIterableTransform that takes partial protobuf messages of the
 * specified message type as input, and yields full instances.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function transformNormalizeMessage(messageType) {
    return function (iterable) {
        return __asyncGenerator(this, arguments, function* () {
            var _a, e_4, _b, _c;
            try {
                for (var _d = true, iterable_4 = __asyncValues(iterable), iterable_4_1; iterable_4_1 = yield __await(iterable_4.next()), _a = iterable_4_1.done, !_a;) {
                    _c = iterable_4_1.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        if (chunk instanceof messageType) {
                            yield yield __await(chunk);
                        }
                        else {
                            yield yield __await(new messageType(chunk));
                        }
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = iterable_4.return)) yield __await(_b.call(iterable_4));
                }
                finally { if (e_4) throw e_4.error; }
            }
        });
    };
}
function transformSerializeEnvelope(serialization, endStreamFlag, endSerialization) {
    if (endStreamFlag === undefined || endSerialization === undefined) {
        return function (iterable) {
            return __asyncGenerator(this, arguments, function* () {
                var _a, e_5, _b, _c;
                try {
                    for (var _d = true, iterable_5 = __asyncValues(iterable), iterable_5_1; iterable_5_1 = yield __await(iterable_5.next()), _a = iterable_5_1.done, !_a;) {
                        _c = iterable_5_1.value;
                        _d = false;
                        try {
                            const chunk = _c;
                            const data = serialization.serialize(chunk);
                            yield yield __await({ flags: 0, data });
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = iterable_5.return)) yield __await(_b.call(iterable_5));
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            });
        };
    }
    return function (iterable) {
        return __asyncGenerator(this, arguments, function* () {
            var _a, e_6, _b, _c;
            try {
                for (var _d = true, iterable_6 = __asyncValues(iterable), iterable_6_1; iterable_6_1 = yield __await(iterable_6.next()), _a = iterable_6_1.done, !_a;) {
                    _c = iterable_6_1.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        let data;
                        let flags = 0;
                        if (chunk.end) {
                            flags = flags | endStreamFlag;
                            data = endSerialization.serialize(chunk.value);
                        }
                        else {
                            data = serialization.serialize(chunk.value);
                        }
                        yield yield __await({ flags, data });
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = iterable_6.return)) yield __await(_b.call(iterable_6));
                }
                finally { if (e_6) throw e_6.error; }
            }
        });
    };
}
function transformParseEnvelope(serialization, endStreamFlag, endSerialization) {
    // code path always yields ParsedEnvelopedMessage<T, E>
    if (endSerialization && endStreamFlag !== undefined) {
        return function (iterable) {
            return __asyncGenerator(this, arguments, function* () {
                var _a, e_7, _b, _c;
                try {
                    for (var _d = true, iterable_7 = __asyncValues(iterable), iterable_7_1; iterable_7_1 = yield __await(iterable_7.next()), _a = iterable_7_1.done, !_a;) {
                        _c = iterable_7_1.value;
                        _d = false;
                        try {
                            const { flags, data } = _c;
                            if ((flags & endStreamFlag) === endStreamFlag) {
                                yield yield __await({ value: endSerialization.parse(data), end: true });
                            }
                            else {
                                yield yield __await({ value: serialization.parse(data), end: false });
                            }
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = iterable_7.return)) yield __await(_b.call(iterable_7));
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            });
        };
    }
    // code path always yields T
    return function (iterable) {
        return __asyncGenerator(this, arguments, function* () {
            var _a, e_8, _b, _c;
            try {
                for (var _d = true, iterable_8 = __asyncValues(iterable), iterable_8_1; iterable_8_1 = yield __await(iterable_8.next()), _a = iterable_8_1.done, !_a;) {
                    _c = iterable_8_1.value;
                    _d = false;
                    try {
                        const { flags, data } = _c;
                        if (endStreamFlag !== undefined &&
                            (flags & endStreamFlag) === endStreamFlag) {
                            if (endSerialization === null) {
                                throw new ConnectError("unexpected end flag", Code.InvalidArgument);
                            }
                            // skips end-of-stream envelope
                            continue;
                        }
                        yield yield __await(serialization.parse(data));
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = iterable_8.return)) yield __await(_b.call(iterable_8));
                }
                finally { if (e_8) throw e_8.error; }
            }
        });
    };
}
/**
 * Creates an AsyncIterableTransform that takes enveloped messages as a source,
 * and compresses them if they are larger than compressMinBytes.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function transformCompressEnvelope(compression, compressMinBytes) {
    return function (iterable) {
        return __asyncGenerator(this, arguments, function* () {
            var _a, e_9, _b, _c;
            try {
                for (var _d = true, iterable_9 = __asyncValues(iterable), iterable_9_1; iterable_9_1 = yield __await(iterable_9.next()), _a = iterable_9_1.done, !_a;) {
                    _c = iterable_9_1.value;
                    _d = false;
                    try {
                        const env = _c;
                        yield yield __await(yield __await(envelopeCompress(env, compression, compressMinBytes)));
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = iterable_9.return)) yield __await(_b.call(iterable_9));
                }
                finally { if (e_9) throw e_9.error; }
            }
        });
    };
}
/**
 * Creates an AsyncIterableTransform that takes enveloped messages as a source,
 * and decompresses them using the given compression.
 *
 * The iterable raises an error if the decompressed payload of an enveloped
 * message is larger than readMaxBytes, or if no compression is provided.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function transformDecompressEnvelope(compression, readMaxBytes) {
    return function (iterable) {
        return __asyncGenerator(this, arguments, function* () {
            var _a, e_10, _b, _c;
            try {
                for (var _d = true, iterable_10 = __asyncValues(iterable), iterable_10_1; iterable_10_1 = yield __await(iterable_10.next()), _a = iterable_10_1.done, !_a;) {
                    _c = iterable_10_1.value;
                    _d = false;
                    try {
                        const env = _c;
                        yield yield __await(yield __await(envelopeDecompress(env, compression, readMaxBytes)));
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = iterable_10.return)) yield __await(_b.call(iterable_10));
                }
                finally { if (e_10) throw e_10.error; }
            }
        });
    };
}
/**
 * Create an AsyncIterableTransform that takes enveloped messages as a source,
 * and joins them into a stream of raw bytes.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function transformJoinEnvelopes() {
    return function (iterable) {
        return __asyncGenerator(this, arguments, function* () {
            var _a, e_11, _b, _c;
            try {
                for (var _d = true, iterable_11 = __asyncValues(iterable), iterable_11_1; iterable_11_1 = yield __await(iterable_11.next()), _a = iterable_11_1.done, !_a;) {
                    _c = iterable_11_1.value;
                    _d = false;
                    try {
                        const { flags, data } = _c;
                        yield yield __await(encodeEnvelope(flags, data));
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = iterable_11.return)) yield __await(_b.call(iterable_11));
                }
                finally { if (e_11) throw e_11.error; }
            }
        });
    };
}
/**
 * Create an AsyncIterableTransform that takes raw bytes as a source, and splits
 * them into enveloped messages.
 *
 * The iterable raises an error
 * - if the payload of an enveloped message is larger than readMaxBytes,
 * - if the stream ended before an enveloped message fully arrived,
 * - or if the stream ended with extraneous data.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function transformSplitEnvelope(readMaxBytes) {
    // append chunk to buffer, returning updated buffer
    function append(buffer, chunk) {
        const n = new Uint8Array(buffer.byteLength + chunk.byteLength);
        n.set(buffer);
        n.set(chunk, buffer.length);
        return n;
    }
    // tuple 0: envelope, or undefined if incomplete
    // tuple 1: remainder of the buffer
    function shiftEnvelope(buffer, header) {
        if (buffer.byteLength < 5 + header.length) {
            return [undefined, buffer];
        }
        return [
            { flags: header.flags, data: buffer.subarray(5, 5 + header.length) },
            buffer.subarray(5 + header.length),
        ];
    }
    // undefined: header is incomplete
    function peekHeader(buffer) {
        if (buffer.byteLength < 5) {
            return undefined;
        }
        const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        const length = view.getUint32(1); // 4 bytes message length
        const flags = view.getUint8(0); // first byte is flags
        return { length, flags };
    }
    return function (iterable) {
        return __asyncGenerator(this, arguments, function* () {
            var _a, e_12, _b, _c;
            let buffer = new Uint8Array(0);
            try {
                for (var _d = true, iterable_12 = __asyncValues(iterable), iterable_12_1; iterable_12_1 = yield __await(iterable_12.next()), _a = iterable_12_1.done, !_a;) {
                    _c = iterable_12_1.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        buffer = append(buffer, chunk);
                        for (;;) {
                            const header = peekHeader(buffer);
                            if (!header) {
                                break;
                            }
                            assertReadMaxBytes(readMaxBytes, header.length, true);
                            let env;
                            [env, buffer] = shiftEnvelope(buffer, header);
                            if (!env) {
                                break;
                            }
                            yield yield __await(env);
                        }
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_12_1) { e_12 = { error: e_12_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = iterable_12.return)) yield __await(_b.call(iterable_12));
                }
                finally { if (e_12) throw e_12.error; }
            }
            if (buffer.byteLength > 0) {
                const header = peekHeader(buffer);
                let message = "protocol error: incomplete envelope";
                if (header) {
                    message = `protocol error: promised ${header.length} bytes in enveloped message, got ${buffer.byteLength - 5} bytes`;
                }
                throw new ConnectError(message, Code.InvalidArgument);
            }
        });
    };
}
/**
 * Reads all bytes from the source, and concatenates them to a single Uint8Array.
 *
 * Raises an error if:
 * - more than readMaxBytes are read
 * - lengthHint is a positive integer, but larger than readMaxBytes
 * - lengthHint is a positive integer, and the source contains more or less bytes
 *   than promised
 *
 * @private Internal code, does not follow semantic versioning.
 */
async function readAllBytes(iterable, readMaxBytes, lengthHint) {
    var _a, e_13, _b, _c, _d, e_14, _e, _f;
    const [ok, hint] = parseLengthHint(lengthHint);
    if (ok) {
        if (hint > readMaxBytes) {
            assertReadMaxBytes(readMaxBytes, hint, true);
        }
        const buffer = new Uint8Array(hint);
        let offset = 0;
        try {
            for (var _g = true, iterable_13 = __asyncValues(iterable), iterable_13_1; iterable_13_1 = await iterable_13.next(), _a = iterable_13_1.done, !_a;) {
                _c = iterable_13_1.value;
                _g = false;
                try {
                    const chunk = _c;
                    if (offset + chunk.byteLength > hint) {
                        throw new ConnectError(`protocol error: promised ${hint} bytes, received ${offset + chunk.byteLength}`, Code.InvalidArgument);
                    }
                    buffer.set(chunk, offset);
                    offset += chunk.byteLength;
                }
                finally {
                    _g = true;
                }
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (!_g && !_a && (_b = iterable_13.return)) await _b.call(iterable_13);
            }
            finally { if (e_13) throw e_13.error; }
        }
        if (offset < hint) {
            throw new ConnectError(`protocol error: promised ${hint} bytes, received ${offset}`, Code.InvalidArgument);
        }
        return buffer;
    }
    const chunks = [];
    let count = 0;
    try {
        for (var _h = true, iterable_14 = __asyncValues(iterable), iterable_14_1; iterable_14_1 = await iterable_14.next(), _d = iterable_14_1.done, !_d;) {
            _f = iterable_14_1.value;
            _h = false;
            try {
                const chunk = _f;
                count += chunk.byteLength;
                assertReadMaxBytes(readMaxBytes, count);
                chunks.push(chunk);
            }
            finally {
                _h = true;
            }
        }
    }
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (!_h && !_d && (_e = iterable_14.return)) await _e.call(iterable_14);
        }
        finally { if (e_14) throw e_14.error; }
    }
    const all = new Uint8Array(count);
    let offset = 0;
    for (let chunk = chunks.shift(); chunk; chunk = chunks.shift()) {
        all.set(chunk, offset);
        offset += chunk.byteLength;
    }
    return all;
}
// parse the lengthHint argument of readAllBytes()
function parseLengthHint(lengthHint) {
    if (lengthHint === undefined || lengthHint === null) {
        return [false, 0];
    }
    const n = typeof lengthHint == "string" ? parseInt(lengthHint, 10) : lengthHint;
    if (!Number.isSafeInteger(n) || n < 0) {
        return [false, n];
    }
    return [true, n];
}
/**
 * Wait for the first element of an iterable without modifying the iterable.
 * This consumes the first element, but pushes it back on the stack.
 *
 * @private Internal code, does not follow semantic versioning.
 */
async function untilFirst(iterable) {
    const it = iterable[Symbol.asyncIterator]();
    let first = await it.next();
    return {
        [Symbol.asyncIterator]() {
            const w = {
                async next() {
                    if (first !== null) {
                        const n = first;
                        first = null;
                        return n;
                    }
                    return await it.next();
                },
            };
            if (it.throw !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- can't handle mutated object sensibly
                w.throw = (e) => it.throw(e);
            }
            if (it.return !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-explicit-any -- can't handle mutated object sensibly
                w.return = (value) => it.return(value);
            }
            return w;
        },
    };
}
/**
 * Wrap the given iterable and return an iterable with an abort() method.
 *
 * This function exists purely for convenience. Where one would typically have
 * to access the iterator directly, advance through all elements, and call
 * AsyncIterator.throw() to notify the upstream iterable, this function allows
 * to use convenient for-await loops and still notify the upstream iterable:
 *
 * ```ts
 * const abortable = makeIterableAbortable(iterable);
 * for await (const ele of abortable) {
 *   await abortable.abort("ERR");
 * }
 * ```
 * There are a couple of limitations of this function:
 * - the given async iterable must implement throw
 * - the async iterable cannot be re-use
 * - if source catches errors and yields values for them, they are ignored, and
 *   the source may still dangle
 *
 * There are four possible ways an async function* can handle yield errors:
 * 1. don't catch errors at all - Abortable.abort() will resolve "rethrown"
 * 2. catch errors and rethrow - Abortable.abort() will resolve "rethrown"
 * 3. catch errors and return - Abortable.abort() will resolve "completed"
 * 4. catch errors and yield a value - Abortable.abort() will resolve "caught"
 *
 * Note that catching errors and yielding a value is problematic, and it should
 * be documented that this may leave the source in a dangling state.
 *
 * @private Internal code, does not follow semantic versioning.
 */
function makeIterableAbortable(iterable) {
    const innerCandidate = iterable[Symbol.asyncIterator]();
    if (innerCandidate.throw === undefined) {
        throw new Error("AsyncIterable does not implement throw");
    }
    const inner = innerCandidate;
    let aborted;
    let resultPromise;
    let it = {
        next() {
            resultPromise = inner.next().finally(() => {
                resultPromise = undefined;
            });
            return resultPromise;
        },
        throw(e) {
            return inner.throw(e);
        },
    };
    if (innerCandidate.return === undefined) {
        it = Object.assign(Object.assign({}, it), { return(value) {
                return inner.return(value);
            } });
    }
    let used = false;
    return {
        abort(reason) {
            if (aborted) {
                return aborted.state;
            }
            const f = () => {
                return inner.throw(reason).then((r) => (r.done === true ? "completed" : "caught"), () => "rethrown");
            };
            if (resultPromise) {
                aborted = { reason, state: resultPromise.then(f, f) };
                return aborted.state;
            }
            aborted = { reason, state: f() };
            return aborted.state;
        },
        [Symbol.asyncIterator]() {
            if (used) {
                throw new Error("AsyncIterable cannot be re-used");
            }
            used = true;
            return it;
        },
    };
}
// Create an instance of a WritableIterable of type T
function createWritableIterable() {
    let queue = [];
    // Represents the resolve function of the promise returned by the async iterator if no values exist in the queue at
    // the time of request.  It is resolved when a value is successfully received into the queue.
    let queueResolve;
    let error = undefined;
    const process = async (payload) => {
        // // If the writer's internal error was set, then reject any attempts at processing a payload.
        if (error) {
            return Promise.reject(String(error));
        }
        // If there is an iterator resolver then a consumer of the async iterator is waiting on a value.  So resolve that
        // promise with the new value being sent and return a promise that is immediately resolved
        if (queueResolve) {
            queueResolve(payload);
            queueResolve = undefined;
            return Promise.resolve();
        }
        const elem = {
            payload,
        };
        const prom = new Promise((resolve, reject) => {
            elem.resolve = resolve;
            elem.reject = reject;
        });
        // Otherwise no one is waiting on a value yet so add it to the queue and return a promise that will be resolved
        // when someone reads this value
        queue.push(elem);
        return prom;
    };
    let closed = false;
    return {
        isClosed() {
            return closed;
        },
        async write(payload) {
            if (closed) {
                throw new ConnectError("cannot write, already closed");
            }
            return process({ value: payload, done: false });
        },
        async close() {
            if (closed) {
                throw new ConnectError("cannot close, already closed");
            }
            closed = true;
            return process({ value: undefined, done: true });
        },
        [Symbol.asyncIterator]() {
            return {
                next: async () => {
                    // If the writer's internal error was set, then reject any attempts at processing a payload.
                    if (error) {
                        return Promise.reject(String(error));
                    }
                    const elem = queue.shift();
                    if (!elem) {
                        // We don't have any payloads ready to be sent (i.e. the consumer of the iterator is consuming faster than
                        // senders are sending).  So return a Promise ensuring we'll resolve it when we get something.
                        return new Promise((resolve) => {
                            queueResolve = resolve;
                        });
                    }
                    // Resolve the send promise on a successful send/close.
                    if (elem.resolve) {
                        elem.resolve();
                    }
                    return elem.payload;
                },
                throw: async (e) => {
                    error = e;
                    // The reader of this iterator has failed with the given error.  So anything left in the queue should be
                    // drained and rejected with the given error
                    for (const item of queue) {
                        if (item.reject) {
                            item.reject(e);
                        }
                    }
                    queue = [];
                    return new Promise((resolve) => {
                        resolve({ value: undefined, done: true });
                    });
                },
            };
        },
    };
}
/**
 * Create an asynchronous iterable from an array.
 *
 * @private Internal code, does not follow semantic versioning.
 */
// eslint-disable-next-line @typescript-eslint/require-await
function createAsyncIterable(items) {
    return __asyncGenerator(this, arguments, function* createAsyncIterable_1() {
        yield __await(yield* __asyncDelegator(__asyncValues(items)));
    });
}

;// CONCATENATED MODULE: ../node_modules/@bufbuild/connect/dist/esm/promise-client.js
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var promise_client_await = (undefined && undefined.__await) || function (v) { return this instanceof promise_client_await ? (this.v = v, this) : new promise_client_await(v); }
var promise_client_asyncValues = (undefined && undefined.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var promise_client_asyncDelegator = (undefined && undefined.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: promise_client_await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
};
var promise_client_asyncGenerator = (undefined && undefined.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof promise_client_await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};





/**
 * Create a PromiseClient for the given service, invoking RPCs through the
 * given transport.
 */
function createPromiseClient(service, transport) {
    return makeAnyClient(service, (method) => {
        switch (method.kind) {
            case service_type/* MethodKind */.t.Unary:
                return createUnaryFn(transport, service, method);
            case service_type/* MethodKind */.t.ServerStreaming:
                return createServerStreamingFn(transport, service, method);
            case service_type/* MethodKind */.t.ClientStreaming:
                return createClientStreamingFn(transport, service, method);
            case service_type/* MethodKind */.t.BiDiStreaming:
                return createBiDiStreamingFn(transport, service, method);
            default:
                return null;
        }
    });
}
function createUnaryFn(transport, service, method) {
    return async function (input, options) {
        var _a, _b;
        const response = await transport.unary(service, method, options === null || options === void 0 ? void 0 : options.signal, options === null || options === void 0 ? void 0 : options.timeoutMs, options === null || options === void 0 ? void 0 : options.headers, input);
        (_a = options === null || options === void 0 ? void 0 : options.onHeader) === null || _a === void 0 ? void 0 : _a.call(options, response.header);
        (_b = options === null || options === void 0 ? void 0 : options.onTrailer) === null || _b === void 0 ? void 0 : _b.call(options, response.trailer);
        return response.message;
    };
}
function createServerStreamingFn(transport, service, method) {
    return function (input, options) {
        var _a, _b;
        return promise_client_asyncGenerator(this, arguments, function* () {
            const inputMessage = input instanceof method.I ? input : new method.I(input);
            const response = yield promise_client_await(transport.stream(service, method, options === null || options === void 0 ? void 0 : options.signal, options === null || options === void 0 ? void 0 : options.timeoutMs, options === null || options === void 0 ? void 0 : options.headers, createAsyncIterable([inputMessage])));
            (_a = options === null || options === void 0 ? void 0 : options.onHeader) === null || _a === void 0 ? void 0 : _a.call(options, response.header);
            yield promise_client_await(yield* promise_client_asyncDelegator(promise_client_asyncValues(response.message)));
            (_b = options === null || options === void 0 ? void 0 : options.onTrailer) === null || _b === void 0 ? void 0 : _b.call(options, response.trailer);
        });
    };
}
function createClientStreamingFn(transport, service, method) {
    return async function (request, options) {
        var _a, e_1, _b, _c;
        var _d, _e;
        function input() {
            return promise_client_asyncGenerator(this, arguments, function* input_1() {
                var _a, e_2, _b, _c;
                try {
                    for (var _d = true, request_1 = promise_client_asyncValues(request), request_1_1; request_1_1 = yield promise_client_await(request_1.next()), _a = request_1_1.done, !_a;) {
                        _c = request_1_1.value;
                        _d = false;
                        try {
                            const partial = _c;
                            yield yield promise_client_await(partial instanceof method.I ? partial : new method.I(partial));
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = request_1.return)) yield promise_client_await(_b.call(request_1));
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            });
        }
        const response = await transport.stream(service, method, options === null || options === void 0 ? void 0 : options.signal, options === null || options === void 0 ? void 0 : options.timeoutMs, options === null || options === void 0 ? void 0 : options.headers, input());
        (_d = options === null || options === void 0 ? void 0 : options.onHeader) === null || _d === void 0 ? void 0 : _d.call(options, response.header);
        let singleMessage;
        try {
            for (var _f = true, _g = promise_client_asyncValues(response.message), _h; _h = await _g.next(), _a = _h.done, !_a;) {
                _c = _h.value;
                _f = false;
                try {
                    const message = _c;
                    singleMessage = message;
                }
                finally {
                    _f = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_f && !_a && (_b = _g.return)) await _b.call(_g);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!singleMessage) {
            throw new connect_error_ConnectError("protocol error: missing response message", code_Code.Internal);
        }
        (_e = options === null || options === void 0 ? void 0 : options.onTrailer) === null || _e === void 0 ? void 0 : _e.call(options, response.trailer);
        return singleMessage;
    };
}
function createBiDiStreamingFn(transport, service, method) {
    return function (request, options) {
        var _a, _b;
        return promise_client_asyncGenerator(this, arguments, function* () {
            function input() {
                return promise_client_asyncGenerator(this, arguments, function* input_2() {
                    var _a, e_3, _b, _c;
                    try {
                        for (var _d = true, request_2 = promise_client_asyncValues(request), request_2_1; request_2_1 = yield promise_client_await(request_2.next()), _a = request_2_1.done, !_a;) {
                            _c = request_2_1.value;
                            _d = false;
                            try {
                                const partial = _c;
                                yield yield promise_client_await(partial instanceof method.I ? partial : new method.I(partial));
                            }
                            finally {
                                _d = true;
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = request_2.return)) yield promise_client_await(_b.call(request_2));
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                });
            }
            const response = yield promise_client_await(transport.stream(service, method, options === null || options === void 0 ? void 0 : options.signal, options === null || options === void 0 ? void 0 : options.timeoutMs, options === null || options === void 0 ? void 0 : options.headers, input()));
            (_a = options === null || options === void 0 ? void 0 : options.onHeader) === null || _a === void 0 ? void 0 : _a.call(options, response.header);
            yield promise_client_await(yield* promise_client_asyncDelegator(promise_client_asyncValues(response.message)));
            (_b = options === null || options === void 0 ? void 0 : options.onTrailer) === null || _b === void 0 ? void 0 : _b.call(options, response.trailer);
        });
    };
}


/***/ }),

/***/ 7451:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: () => (/* binding */ Message)
/* harmony export */ });
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * Message is the base class of every message, generated, or created at
 * runtime.
 *
 * It is _not_ safe to extend this class. If you want to create a message at
 * run time, use proto3.makeMessageType().
 */
class Message {
    /**
     * Compare with a message of the same type.
     */
    equals(other) {
        return this.getType().runtime.util.equals(this.getType(), this, other);
    }
    /**
     * Create a deep copy.
     */
    clone() {
        return this.getType().runtime.util.clone(this);
    }
    /**
     * Parse from binary data, merging fields.
     *
     * Repeated fields are appended. Map entries are added, overwriting
     * existing keys.
     *
     * If a message field is already present, it will be merged with the
     * new data.
     */
    fromBinary(bytes, options) {
        const type = this.getType(), format = type.runtime.bin, opt = format.makeReadOptions(options);
        format.readMessage(this, opt.readerFactory(bytes), bytes.byteLength, opt);
        return this;
    }
    /**
     * Parse a message from a JSON value.
     */
    fromJson(jsonValue, options) {
        const type = this.getType(), format = type.runtime.json, opt = format.makeReadOptions(options);
        format.readMessage(type, jsonValue, opt, this);
        return this;
    }
    /**
     * Parse a message from a JSON string.
     */
    fromJsonString(jsonString, options) {
        let json;
        try {
            json = JSON.parse(jsonString);
        }
        catch (e) {
            throw new Error(`cannot decode ${this.getType().typeName} from JSON: ${e instanceof Error ? e.message : String(e)}`);
        }
        return this.fromJson(json, options);
    }
    /**
     * Serialize the message to binary data.
     */
    toBinary(options) {
        const type = this.getType(), bin = type.runtime.bin, opt = bin.makeWriteOptions(options), writer = opt.writerFactory();
        bin.writeMessage(this, writer, opt);
        return writer.finish();
    }
    /**
     * Serialize the message to a JSON value, a JavaScript value that can be
     * passed to JSON.stringify().
     */
    toJson(options) {
        const type = this.getType(), json = type.runtime.json, opt = json.makeWriteOptions(options);
        return json.writeMessage(this, opt);
    }
    /**
     * Serialize the message to a JSON string.
     */
    toJsonString(options) {
        var _a;
        const value = this.toJson(options);
        return JSON.stringify(value, null, (_a = options === null || options === void 0 ? void 0 : options.prettySpaces) !== null && _a !== void 0 ? _a : 0);
    }
    /**
     * Override for serialization behavior. This will be invoked when calling
     * JSON.stringify on this message (i.e. JSON.stringify(msg)).
     *
     * Note that this will not serialize google.protobuf.Any with a packed
     * message because the protobuf JSON format specifies that it needs to be
     * unpacked, and this is only possible with a type registry to look up the
     * message type.  As a result, attempting to serialize a message with this
     * type will throw an Error.
     *
     * This method is protected because you should not need to invoke it
     * directly -- instead use JSON.stringify or toJsonString for
     * stringified JSON.  Alternatively, if actual JSON is desired, you should
     * use toJson.
     */
    toJSON() {
        return this.toJson({
            emitDefaultValues: true,
        });
    }
    /**
     * Retrieve the MessageType of this message - a singleton that represents
     * the protobuf message declaration and provides metadata for reflection-
     * based operations.
     */
    getType() {
        // Any class that extends Message _must_ provide a complete static
        // implementation of MessageType.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
        return Object.getPrototypeOf(this).constructor;
    }
}


/***/ }),

/***/ 3421:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: () => (/* binding */ MethodKind)
/* harmony export */ });
/* unused harmony export MethodIdempotency */
// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * MethodKind represents the four method types that can be declared in
 * protobuf with the `stream` keyword:
 *
 * 1. Unary:           rpc (Input) returns (Output)
 * 2. ServerStreaming: rpc (Input) returns (stream Output)
 * 3. ClientStreaming: rpc (stream Input) returns (Output)
 * 4. BiDiStreaming:   rpc (stream Input) returns (stream Output)
 */
var MethodKind;
(function (MethodKind) {
    MethodKind[MethodKind["Unary"] = 0] = "Unary";
    MethodKind[MethodKind["ServerStreaming"] = 1] = "ServerStreaming";
    MethodKind[MethodKind["ClientStreaming"] = 2] = "ClientStreaming";
    MethodKind[MethodKind["BiDiStreaming"] = 3] = "BiDiStreaming";
})(MethodKind || (MethodKind = {}));
/**
 * Is this method side-effect-free (or safe in HTTP parlance), or just
 * idempotent, or neither? HTTP based RPC implementation may choose GET verb
 * for safe methods, and PUT verb for idempotent methods instead of the
 * default POST.
 *
 * This enum matches the protobuf enum google.protobuf.MethodOptions.IdempotencyLevel,
 * defined in the well-known type google/protobuf/descriptor.proto, but
 * drops UNKNOWN.
 */
var MethodIdempotency;
(function (MethodIdempotency) {
    /**
     * Idempotent, no side effects.
     */
    MethodIdempotency[MethodIdempotency["NoSideEffects"] = 1] = "NoSideEffects";
    /**
     * Idempotent, but may have side effects.
     */
    MethodIdempotency[MethodIdempotency["Idempotent"] = 2] = "Idempotent";
})(MethodIdempotency || (MethodIdempotency = {}));


/***/ })

};
;