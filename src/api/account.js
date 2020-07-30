import requestObj from '@/server/index.js';
/**
 * send email
 * @param {*} data
 */
export const sendEmail = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/email' }, { ...config }));
  return data;
};

/**
 * Login Password
 * @param {*} data
 */
export const loginPwd = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/update/loginPwd' }, { ...config }));
  return data;
};

/**
 * Update Login Password
 * @param {*} data
 */
export const updatePwd = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/updatePwd' }, { ...config }));
  return data;
};

/**
 * Update Security Password
 * @param {*} data
 */
export const updateSecurityPwd = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/updateSecurityPwd' }, { ...config }));
  return data;
};

/**
 * Rset Login Password Token
 * @param {*} data
 */
export const loginPwdByToken = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/update/loginPwdByToken' }, { ...config }));
  return data;
};
/**
 * validate email code
 * @param {*} data
 */
export const validEmailCode = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/valid/emailCode' }, { ...config }));
  return data;
};

/**
 * Add Account
 * @param {*} data
 */
export const addAccountUser = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/user/register' }, { ...config }));
  return data;
};

/**
 * Role Query
 * @param {*} data
 */
export const roleQuery = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/web/v1/member/role/query' }, { ...config }));
  return data;
};

/**
 * Organize Info Query
 * @param {*} data
 */
export const organizeInfoQuery = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/web/v1/member/query/merchant' }, { ...config }));
  return data;
};

/**
 * GET Wallet Address
 * @param {*} data
 */
export const getWalletAddress = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/user/getWalletAddress' }, { ...config }));
  return data;
};

/**
 * GET Account List
 * @param {*} data
 */
export const accountUserList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/query/userList' }, { ...config }));
  return data;
};

/**
 * Nationality query
 * @param {*} data
 */
export const queryCountry = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/web/v1/member/country/query' }, { ...config }));
  return data;
};

/**
 * Risk level query
 * @param {*} data
 */
export const queryRisk = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/web/v1/member/risk' }, { ...config }));
  return data;
};

/**
 * Add KYC
 * @param {*} data
 */
export const addKYC = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/country/add' }, { ...config }));
  return data;
};

/**
 * Wallet query
 * @param {*} data
 */
export const walletListQuery = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/query/userAddress' }, { ...config }));
  return data;
};

/**
 * Account detail info query
 * @param {*} data
 */
export const getAccountDetailInfo = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/web/v1/member/user/info' }, { ...config }));
  return data;
};

/**
 * Create an account and resend the email
 * @param {*} data
 */
export const sendActivateEmail = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/web/v1/member/user/sendActivateEmail' }, { ...config }));
  return data;
};

/**
 * Get the account log
 * @param {*} data
 */
export const roleLogList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/user/roleLogList' }, { ...config }));
  return data;
};

/**
 * Update user roles
 * @param {*} data
 */
export const changeRoles = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/user/roles' }, { ...config }));
  return data;
};

/**
 * Before getting the kyc
 * @param {*} data
 */
export const getKycBeroreInfo = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/web/v1/member/query/kycByAddress' }, { ...config }));
  return data;
};

/**
 * updateUserStatus
 * @param {*} data
 */
export const updateUserStatus = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/user/updateUserStatus' }, { ...config }));
  return data;
};

/**
 * userRecordList
 * @param {*} data
 */

export const userRecordList = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'POST', url: '/web/v1/member/query/userRecordList' }, { ...config }));
  return data;
};

// get user info
export const getUser = async config => {
  const { data } = await requestObj.request(Object.assign({ method: 'GET', url: '/web/v1/member/query/user' }, { ...config }));
  return data;
};
