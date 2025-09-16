// src/lib/ethersWallet.ts
import { Contract, JsonRpcProvider, Wallet, Interface, Network } from 'ethers';

import abi from '../abi/LEIRegistry.json';
import { toBytes12, toBytes20 } from './utils';
import { Console } from 'console';
const iface = new Interface(abi);


function extractRevertMessage(e: any): string {
    // Common paths to revert data in ethers v6 errors
    const data =
      e?.data?.data ||          // ProviderError
      e?.info?.error?.data ||   // ProviderRpcError shape
      e?.error?.data ||         // nested error
      e?.data;                  // sometimes directly here
  
    if (typeof data === 'string' && data.startsWith('0x')) {
      try {
        const parsed = iface.parseError(data);
        if (parsed) {
          const { name, args } = parsed;
          return args?.length ? `Reverted: ${name}(${args.map(String).join(', ')})` : `Reverted: ${name}`;
        }
      } catch { /* fall through */ }
  
      // Try standard Error(string) (0x08c379a0) if not in ABI
      if (data.slice(0, 10) === '0x08c379a0') {
        try {
          // skip selector and decode string
          const reasonHex = '0x' + data.slice(10);
          const [reason] = new Interface(['function Error(string)']).decodeErrorResult('Error', reasonHex);
          return `Reverted: ${reason}`;
        } catch {}
      }
    }
  
    // Fallbacks
    return e?.shortMessage || e?.reason || e?.message || 'Transaction reverted';
  }

export function makeSigner(pk: string, rpc: string) {
  const chainId = 8060; // <-- use the real chainId for your endpoint
  const provider = new JsonRpcProvider(
    rpc,
    { name: "mainnet", chainId },              // networkish
    { staticNetwork: Network.from(chainId) }   // v6 replacement for StaticJsonRpcProvider
  );
  const wallet = new Wallet(pk, provider);
  return { wallet, provider };
}

export function makeContract(address: string, abi: any, signerOrProvider: any) {
  return new Contract(address, abi, signerOrProvider);
}


export const readTotal = async () => {
    const { provider } = makeSigner(import.meta.env.VITE_AUTHORIZOR_PVK, import.meta.env.VITE_RPC);
    const c = makeContract(import.meta.env.VITE_CONTRACT_ADDRESS, abi, provider);
    const total = await c.getTotalLEIs();
    alert(`Total: ${total}`);
  };

export  const createLEI = async ({lei, isins, address, time}: {lei: string, isins: string[], address: string, time: number}) : Promise<{
    success: boolean;
    data: string | undefined; 
}> => {
    const { wallet } = makeSigner(import.meta.env.VITE_AUTHORIZOR_PVK, import.meta.env.VITE_RPC);

    const c = makeContract(import.meta.env.VITE_CONTRACT_ADDRESS, abi, wallet);
    console.log('Creating LEI:',  toBytes20(lei), isins.map(toBytes12), address, time );
    try{
        const leiExist = await c.leiExists(toBytes20(lei));
        
        if(leiExist){
          const tx = await c.updateLEI(
            toBytes20(lei),
            isins.map(toBytes12),
            address,
            time
          );
    
    
        const rc = await tx.wait();

        return {
            success: rc.status === 1,
            data: tx.hash
        }
        }
        const tx = await c.createLEI(
            toBytes20(lei),
            isins.map(toBytes12),
            address,
            time
          );
    
    
        const rc = await tx.wait();

        return {
            success: rc.status === 1,
            data: tx.hash
        }
    
    }catch(err){
        console.error(err);
        const msg = extractRevertMessage(err);
        console.error('Transaction failed:', msg);
        return {
            success: false,
            data: msg
        }
    }
    
  };