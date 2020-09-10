import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { abi as multicallAbi } from './abi/Multicall.json';

const MULTICALL = '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821';
/*
Mainnet	0xeefba1e63905ef1d7acba5a8513c70307c1ce441
Kovan	0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a
Rinkeby	0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821
Görli	0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e
Ropsten	0x53c43764255c17bd724f74c4ef150724ac50a3ed
xDai	0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a
*/

export async function multicall(provider, abi, calls, options?) {
  const multi = new Contract(MULTICALL, multicallAbi, provider);
  const itf = new Interface(abi);
  try {
    const [, response] = await multi.aggregate(
      calls.map(call => [
        call[0].toLowerCase(),
        itf.encodeFunctionData(call[1], call[2])
      ]),
      options || {}
    );
    return response.map((call, i) =>
      itf.decodeFunctionResult(calls[i][1], call)
    );
  } catch (e) {
    return Promise.reject();
  }
}

export async function subgraphRequest(url, query) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: jsonToGraphQLQuery({ query }) })
  });
  const { data } = await res.json();
  return data || {};
}
