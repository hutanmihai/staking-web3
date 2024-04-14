export const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const ABI = [
  {
    inputs: [],
    stateMutability: 'payable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'staker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'returnedAmount',
        type: 'uint256',
      },
    ],
    name: 'Closed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'staker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'weiAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'interestRate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'unlockDate',
        type: 'uint256',
      },
    ],
    name: 'Staked',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
    ],
    name: 'closePosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentPositionId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLockPeriods',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
    ],
    name: 'getPositionById',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'positionId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'walletAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'createdDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'unlockDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'percentInterest',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'weiStaked',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'weiInterest',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'open',
            type: 'bool',
          },
        ],
        internalType: 'struct Staking.Position',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'walletAddress',
        type: 'address',
      },
    ],
    name: 'getPositionsIdsByAddress',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardPool',
    outputs: [
      {
        internalType: 'contract RewardPool',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_rewardPool',
        type: 'address',
      },
    ],
    name: 'setRewardPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'numSeconds',
        type: 'uint256',
      },
    ],
    name: 'stakeEther',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
