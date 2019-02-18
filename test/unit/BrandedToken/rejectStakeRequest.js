'use strict';

const Web3 = require('web3');
const sinon = require('sinon');
const { assert } = require('chai');

const Spy = require('../../utils/Spy');
const AssertAsync = require('../../utils/AssertAsync');
const BrandedToken = require('../../../lib/ContractInteract/BrandedToken');
const Utils = require('../../../utils/Utils');

describe('BrandedToken.rejectStakeRequest()', () => {
  let brandedToken;
  let
    web3;

  beforeEach(() => {
    web3 = new Web3();
    const tokenAddress = '0x0000000000000000000000000000000000000002';
    brandedToken = new BrandedToken(web3, tokenAddress);
  });

  it('should pass with correct params', async () => {
    const stakeRequestHash = web3.utils.sha3('dummy');

    const mockRawTx = 'mockRawTx';

    const rawTx = sinon.replace(
      brandedToken,
      'rejectStakeRequestRawTx',
      sinon.fake.returns(Promise.resolve(mockRawTx)),
    );

    const spySendTransaction = sinon.replace(
      Utils,
      'sendTransaction',
      sinon.fake.resolves(true),
    );
    const txOptions = {
      from: '0x0000000000000000000000000000000000000003',
    };
    const response = await brandedToken.rejectStakeRequest(
      stakeRequestHash,
      txOptions,
    );
    assert.isTrue(
      response,
      'Reject stake should return true',
    );
    Spy.assert(rawTx, 1, [[stakeRequestHash]]);
    Spy.assert(spySendTransaction, 1, [[mockRawTx, txOptions]]);
    sinon.restore();
  });

  it('should throw an error when transaction options is undefined', async () => {
    const stakeRequestHash = web3.utils.sha3('dummy');
    const txOptions = undefined;

    await AssertAsync.reject(
      brandedToken.rejectStakeRequest(stakeRequestHash, txOptions),
      `Invalid transaction options: ${txOptions}.`,
    );
  });

  it('should throw an error when account address is undefined', async () => {
    const stakeRequestHash = web3.utils.sha3('dummy');
    const txOptions = {};

    await AssertAsync.reject(
      brandedToken.rejectStakeRequest(stakeRequestHash, txOptions),
      `Invalid from address ${txOptions.from} in transaction options.`,
    );
  });

  it('should throw an error when account address is invalid', async () => {
    const stakeRequestHash = web3.utils.sha3('dummy');
    const txOptions = {
      from: '0x123',
    };

    await AssertAsync.reject(
      brandedToken.rejectStakeRequest(stakeRequestHash, txOptions),
      `Invalid from address ${txOptions.from} in transaction options.`,
    );
  });
});
