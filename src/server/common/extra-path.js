/**
 * get extral path from RINGCENTRAL_CHATBOT_SERVER env
 * in lambda there could be path like xxx.lamdab.com/prod
 */

const { RINGCENTRAL_CHATBOT_SERVER } = process.env
const arr = RINGCENTRAL_CHATBOT_SERVER.split('/')
const root = arr[0] + arr[1] + arr[2]
const extra = RINGCENTRAL_CHATBOT_SERVER.replace(root, '')
export default extra
