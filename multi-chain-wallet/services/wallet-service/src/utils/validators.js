const supportedChains = ['ethereum', 'bitcoin', 'solana'];

function validateChain(chain) {
  return supportedChains.includes(chain.toLowerCase());
}

export {
  validateChain,
  supportedChains
};