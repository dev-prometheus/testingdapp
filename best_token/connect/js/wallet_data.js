// Wallet data — cleaned & deduped
const wallets = [
    { name: 'Coinbase Wallet', domain: 'coinbase.com', icon: 'images/static/coinbase.png' },
    { name: 'Ledger Live', domain: 'ledger.com', icon: 'images/static/ledger.png' },
    { name: 'MetaMask', domain: 'metamask.io', icon: 'images/static/metamask.jpg' },
    { name: 'Electrum', domain: 'electrum.org', icon: 'images/static/electrum.png' },
    { name: 'Trust Wallet', domain: 'trustwallet.com', icon: 'images/static/trust_wallet.jpg' },
    { name: 'Phantom', domain: 'phantom.app', icon: 'images/static/phantom.jfif' },
    { name: 'WalletConnect', domain: 'walletconnect.com', icon: 'images/static/walle.jpg' },
    { name: 'HashPack', domain: 'hashpack.app', icon: 'images/static/hash.jfif' },
    { name: 'Sologenic DEX', domain: 'sologenic.org', icon: 'images/static/sologenic.svg' },
    { name: 'Keplr', domain: 'keplr.app', icon: 'images/static/keplr.png' },
    { name: 'Klever', domain: 'klever.io', icon: 'images/static/klev.png' },
    { name: 'Fantom', domain: 'fantom.foundation', icon: 'images/static/fantom.png' },
    { name: 'Blade', domain: 'bladewallet.io', icon: 'images/static/blade.png' },
    { name: 'OKX Wallet', domain: 'okx.com', icon: 'images/static/okx-logo.png' },
    { name: 'Zerion', domain: 'zerion.io', icon: 'images/static/zerion-icon.png' },
    { name: 'Uniswap Wallet', domain: 'uniswap.org', icon: 'images/static/uniswap-uni-logo.jpg' },
    { name: 'Bitget Wallet', domain: 'bitget.com', icon: 'images/static/bitget-token.png' },
    { name: 'Solflare', domain: 'solflare.com', icon: 'images/static/sol-flare.jpg' },
    { name: 'Cosmos', domain: 'cosmos.network', icon: 'images/static/cosmos.png' },
    { name: 'Avalanche Wallet', domain: 'wallet.avax.network', icon: 'images/static/avax.png' },
    { name: 'Stacks Wallet', domain: 'stacks.co', icon: 'images/static/stacks.png' },
    { name: 'Terra Station', domain: 'terra.money', icon: 'images/static/terra.png' },
    { name: 'Polygon', domain: 'polygon.technology', icon: 'images/static/polygon.jpg' },
    { name: 'Rainbow', domain: 'rainbow.me', icon: 'images/static/rainbow.jpg' },
    { name: 'BitPay', domain: 'bitpay.com', icon: 'images/static/bitpay.jpg' },
    { name: 'Walleth', domain: 'walleth.org', icon: 'images/static/walleth.jpg' },
    { name: 'Argent', domain: 'argent.xyz', icon: 'images/static/argent.jpg' },
    { name: 'Huobi Wallet', domain: 'huobiwallet.com', icon: 'images/static/huobi.jpg' },
    { name: 'Encrypted Ink', domain: 'encrypted.ink', icon: 'images/static/encrypted_ink.jpg' },
    { name: 'Compound', domain: 'compound.finance', icon: 'images/static/compound.jpg' },
    { name: 'Polkadot', domain: 'polkadot.network', icon: 'images/static/polkadot.jpg' },
    { name: 'Iotex', domain: 'iotex.io', icon: 'images/static/iotex.jpg' },
    { name: 'Coin98', domain: 'coin98.com', icon: 'images/static/coin98.jpg' },
    { name: 'Crypto.com DeFi Wallet', domain: 'crypto.com', icon: 'images/static/crypto.jpg' },
    { name: 'TokenPocket', domain: 'tokenpocket.pro', icon: 'images/static/token_pocket.jpg' },
    { name: 'Math Wallet', domain: 'mathwallet.org', icon: 'images/static/math_wallet.jpg' },
    { name: '1inch', domain: '1inch.io', icon: 'images/static/1inch.jpg' },
    { name: 'Dharma', domain: 'dharma.io', icon: 'images/static/dharma.jpg' },
    { name: 'Trust Vault', domain: 'trustology.io', icon: 'images/static/trust_vault.jpg' },
    { name: 'MYKEY', domain: 'mykey.org', icon: 'images/static/mykey.jpg' },
    { name: 'Atomic', domain: 'atomicwallet.io', icon: 'images/static/atomic.jpg' },
    { name: 'CoolWallet S', domain: 'coolwallet.io', icon: 'images/static/cool_wallet_s.jpg' },
    { name: 'Nash', domain: 'nash.io', icon: 'images/static/nash.jpg' },
    { name: 'Coinomi', domain: 'coinomi.com', icon: 'images/static/coinomi.jpg' },
    { name: 'GridPlus', domain: 'gridplus.io', icon: 'images/static/gridplus.jpg' },
    { name: 'Tokenary', domain: 'tokenary.io', icon: 'images/static/tokenary.jpg' },
    { name: 'SafePal', domain: 'safepal.io', icon: 'images/static/safepal.jpg' },
    { name: 'Infinito', domain: 'infinitowallet.io', icon: 'images/static/infinito.jpg' },
    { name: 'Wallet.io', domain: 'wallet.io', icon: 'images/static/wallet_io.jpg' },
    { name: 'Ownbit', domain: 'ownbit.io', icon: 'images/static/ownbit.jpg' },
    { name: 'EasyPocket', domain: 'easypocket.app', icon: 'images/static/easypocket.jpg' },
    { name: 'Bridge Wallet', domain: 'mtpelerin.com', icon: 'images/static/bridge_wallet.jpg' },
    { name: 'ViaWallet', domain: 'viawallet.com', icon: 'images/static/via_wallet.jpg' },
    { name: 'Unstoppable Wallet', domain: 'unstoppable.money', icon: 'images/static/unstoppable_wallet.jpg' },
    { name: 'HaloDefi Wallet', domain: 'halodefi.org', icon: 'images/static/halodefi_wallet.jpg' },
    { name: 'Dok Wallet', domain: 'dokwallet.com', icon: 'images/static/dok_wallet.jpg' },
    { name: 'Celo Wallet', domain: 'cellowallet.app', icon: 'images/static/celo_wallet.jpg' },
    { name: 'CoinUs', domain: 'coinus.io', icon: 'images/static/coinus.jpg' },
    { name: 'Valora', domain: 'valoraapp.com', icon: 'images/static/valora.jpg' },
    { name: 'Trustee Wallet', domain: 'trusteeglobal.com', icon: 'images/static/trustee_wallet.jpg' },
    { name: 'Guarda Wallet', domain: 'guarda.com', icon: 'images/static/guarda_wallet.jpg' },
    { name: 'Maiar Wallet', domain: 'maiar.com', icon: 'images/static/maiarwallet.png' },
    { name: 'Jade Wallet', domain: 'jadewallet.io', icon: 'images/static/jade_wallet.jpg' },
    { name: 'PlasmaPay', domain: 'plasmapay.com', icon: 'images/static/plasmapay.jpg' },
    { name: 'O3Wallet', domain: 'o3.network', icon: 'images/static/o3_wallet.jpg' },
    { name: 'HashKey Me', domain: 'me.hashkey.com', icon: 'images/static/hashkey_me.jpg' },
    { name: 'RWallet', domain: 'rsk.co', icon: 'images/static/rwallet.jpg' },
    { name: 'Flare Wallet', domain: 'flarewallet.io', icon: 'images/static/flare_wallet.jpg' },
    { name: 'KyberSwap', domain: 'kyberswap.com', icon: 'images/static/kyberswap.jpg' },
    { name: 'AToken Wallet', domain: 'atoken.com', icon: 'images/static/atoken_wallet.jpg' },
    { name: 'Tongue Wallet', domain: 'tongue.fi', icon: 'images/static/tongue_wallet.jpg' },
    { name: 'XinFin XDC Network', domain: 'xinfin.io', icon: 'images/static/xinfin.jpg' },
    { name: 'Talken Wallet', domain: 'talken.io', icon: 'images/static/talken_wallet.jpg' },
    { name: 'KEYRING PRO', domain: 'keyring.app', icon: 'images/static/keyring_pro.jpg' },
    { name: 'Midas Wallet', domain: 'midasprotocol.io', icon: 'images/static/midas_wallet.jpg' },
    { name: 'AT.Wallet', domain: 'authentrend.com', icon: 'images/static/at_wallet.jpg' },
    { name: 'imToken', domain: 'token.im', icon: 'images/static/imtoken.jpg' },
    { name: 'MoriX Wallet', domain: 'morixjp.com', icon: 'images/static/morixwallet.png' },
    { name: 'MEET.ONE', domain: 'meet.one', icon: 'images/static/meetone.jpg' },
    { name: 'Vision', domain: 'visionwallet.io', icon: 'images/static/vision.jpeg' },
    { name: 'SWFT Wallet', domain: 'swft.pro', icon: 'images/static/swift.png' },
    { name: 'PEAKDEFI Wallet', domain: 'peakdefi.com', icon: 'images/static/peakdefi.jpeg' },
    { name: 'SparkPoint', domain: 'sparkpoint.io', icon: 'images/static/sparkpoint.jpeg' },
    { name: 'ONTO', domain: 'onto.app', icon: 'images/static/onto.jpeg' },
    { name: 'Infinity Wallet', domain: 'infinitywallet.io', icon: 'images/static/infinity.jpeg' },
    { name: 'Spatium', domain: 'spatium.net', icon: 'images/static/spatium.jpeg' },
    { name: 'Equal', domain: 'equaltoken.io', icon: 'images/static/equal.jpg' },
    { name: 'Alice', domain: 'alicebob.com', icon: 'images/static/alice.jpeg' },
    { name: 'AlphaWallet', domain: 'alphawallet.com', icon: 'images/static/alphawallet.jpeg' },
    { name: 'Eidoo', domain: 'eidoo-wallet.io', icon: 'images/static/eidoo.jpeg' },
    { name: 'ZelCore', domain: 'zelcore.io', icon: 'images/static/zelcore.jpeg' },
    { name: 'Xaman', domain: 'xumm.app', icon: 'images/static/xaman.jpeg' },
    { name: 'Authereum', domain: 'kovan.authereum.com', icon: 'images/static/authereum.jpeg' },
    { name: 'Pillar', domain: 'pillar.fi', icon: 'images/static/pillar.jpeg' },
    { name: 'MyEtherWallet', domain: 'myetherwallet.com', icon: 'images/static/mewwallet.png' },
    { name: 'Safe (Gnosis Safe)', domain: 'gnosis.io', icon: 'images/static/gnosis-safe.jpeg' }
];


const BASE58_ALPH = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE58_MAP = (() => { const m = {}; for (let i = 0; i < BASE58_ALPH.length; i++) m[BASE58_ALPH[i]] = i; return m; })();
function decodeBase58(str) {
    str = (str || '').trim();
    if (!str) return new Uint8Array();
    let bytes = [0];
    for (let i = 0; i < str.length; i++) {
        const v = BASE58_MAP[str[i]];
        if (v === undefined) throw new Error('Invalid base58 char');
        let carry = v;
        for (let j = 0; j < bytes.length; j++) {
            carry += bytes[j] * 58;
            bytes[j] = carry & 0xff;
            carry >>= 8;
        }
        while (carry > 0) { bytes.push(carry & 0xff); carry >>= 8; }
    }
    // handle leading zeros (each leading '1' adds a 0x00)
    let zeros = 0; while (zeros < str.length && str[zeros] === '1') zeros++;
    const out = new Uint8Array(zeros + bytes.length);
    for (let i = 0; i < zeros; i++) out[i] = 0;
    for (let i = 0; i < bytes.length; i++) out[out.length - 1 - i] = bytes[i];
    return out;
}

// (2) Small helpers
function arraysEqual(a, b) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
function toU8FromHex(hex) {
    const s = hex.trim().replace(/^0x/i, '');
    if (!/^[0-9a-fA-F]+$/.test(s) || s.length % 2) return null;
    const u8 = new Uint8Array(s.length / 2);
    for (let i = 0; i < s.length; i += 2) u8[i / 2] = parseInt(s.slice(i, i + 2), 16);
    return u8;
}
function tryJsonByteArray(text) {
    try {
        const arr = JSON.parse(text);
        if (!Array.isArray(arr) || (arr.length !== 64 && arr.length !== 32)) return null;
        for (const n of arr) if (!Number.isInteger(n) || n < 0 || n > 255) return null;
        return new Uint8Array(arr);
    } catch { return null; }
}
function tryBase58(text) {
    try {
        const u8 = decodeBase58(text);
        return (u8.length === 64 || u8.length === 32) ? u8 : null;
    } catch { return null; }
}
function tryBase64(text) {
    const s = text.trim().replace(/-/g, '+').replace(/_/g, '/'); // URL-safe → std
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(s)) return null;
    try {
        const bin = atob(s);
        const u8 = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        return (u8.length === 64 || u8.length === 32) ? u8 : null;
    } catch { return null; }
}