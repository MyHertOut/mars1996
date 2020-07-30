/**
 * page type：bonds、Asset-Backed、Currencies
 */
export const pageTypeEnum = {
  bonds: 'bonds',
  asset: 'asset',
  currency: 'currency'
};

export const tokenTypeEnum = {
  0: 'Certificate',
  1: 'Digital Currency'
};
// calculate history list  status enum
export const calculateHistoryStatusEnum = {
  // calculating: 0,
  // Failed: 1,
  // Success: 2
  INIT: 0,
  CALCULATING: 1,
  FAILED: 2,
  SUCCESS: 3
};
//  Securities/Payment Token AdditionalIssue type
export const additionalIssueTypeEnum = {
  SECURITY: '0',
  TOKEN: '1',
  ABS: '2'
};
// trade hub->Listing Orders list->table status
export const ListOrderTableStatusEnum = {
  IN_PROGRESS: 1, // "In Progress"), Buy
  NOT_STARTED: 2, // "Not started"), Upcoming
  END_OF_SALE: 3, // "End of Sale"), End
  PENDING_SIGNATURE: 4, // "Pending Signature") Pending BlockChain
  SIGNATURE_FAILED: 5, // "Signature Failed"), Signature Failed
  PUBLISH_FAILED: 6 // "Publish Failed"), Publish Failed
};
// new Version New Trade trade type enum
export const newTradeTypeEnum = {
  '1v1': 1, // 1 to 1
  '1vM': 2 // 1 to Many
};
// New Trade Payment Method enum
export const paymentMethodEnum = {
  OffChain: '1',
  OnChain: '2'
};
// redemption list  status enum
export const redemptionStatusEnum = {
  notStart: 1,
  freezing: 2,
  notRedeem: 3,
  inprogress: 4,
  disrupted: 5,
  success: 6,
  cancelled: 7,
  failed: 8
};
// The snapshot type enum
export const snapShotTypeEnum = {
  1: 'MANUAL',
  2: 'AUTO'
};
// disbursement list  status enum
export const disbursementStatusEnum = {
  NotStart: 0,
  CalculateFailed: 1,
  NotDistribute: 2,
  InProgress: 3,
  Cancelled: 4,
  DistributeFailed: 5,
  // Failed: 5,
  Disrupted: 6,
  Success: 7
};

// The orderCenter type enum
export const ordersCenterTableStatusEnum = {
  SIGNATURE_FAILED: 0, // "Signature Failed") rejected
  TRADE_FAILED: 1, // "Trade Failed") rejected
  PENDING_SIGNATURE: 2, // "Pending Signature") padding
  PENDING_PAYMENT: 3, // "Pending Payment") padding
  PAID: 4, // "Paid") padding
  PENDING_INITIATOR: 5, // "Pending Initiator Signature") statusBlue
  IN_PROGRESS: 6, // "Allocation In Progress") statusBlue
  COMPLETED: 7, // "Completed") success
  WAIT_ACCEPT: 8, // "wait accept") padding
  REJECTED: 9 // "Rejected") rejected
};
export const debtSeniorityList = [{
  label: 'Senior Secured',
  value: 1
}, {
  label: 'Secured',
  value: 2
}, {
  label: 'Senior Unsecured',
  value: 3
}, {
  label: 'Senior Subordinated',
  value: 4
}, {
  label: 'Subordinated',
  value: 5
}, {
  label: 'Junior Subordinated',
  value: 6
}];

export const dayCountConventionList = [
  {
    label: '30 / 360',
    value: '0'
  }, {
    label: '30 / 365',
    value: '1'
  }, {
    label: 'Actual / 360',
    value: '2'
  }, {
    label: 'Actual / 365',
    value: '3'
  }, {
    label: 'Actual / Actual',
    value: '4'
  }
];
