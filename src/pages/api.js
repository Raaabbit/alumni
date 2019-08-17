import request from '../utils/request'
import server from '../server'

export const getLocation = params =>
  request.get(`${server.service.qqMapHost}/ws/geocoder/v1/`, {
    ...params,
    key: server.qqMapKey,
  })

/*************************************** 注册 ***************************************/
export const login = params =>
  request.get('/v2/login/wechat', params).then(res => res.data)

export const createAccount = params =>
  request.post('/v2/account/step1', params)

// 完善-保存名片信息
export const completeCard = params =>
  request.put('/v2/account/step2', params)

/************************************ 编辑、完善 *************************************/
// 获取-基本信息
export const getAccount = params =>
  request.get('/v2/account', params).then(res => res.data)

// 获取-教育信息
export const getEducationInfo = params =>
  request.get('/v2/education', params).then(res => res.data)

// 获取-工作信息
export const getWorkInfo = params =>
  request.get('/v2/job', params).then(res => res.data)

// 保存-基本信息
export const saveBasic = params =>
  request.post('/v2/account', params)

// 保存-教育信息
export const saveEducation = params =>
  request.post('/v2/education', params)

// 删除-教育信息
export const removeEducation = params =>
  request.del('/v2/education', params)

// 保存-工作信息
export const saveWork = params =>
  request.post('/v2/job', params)

// 删除-工作信息
export const removeWork = params =>
  request.del('/v2/job', params)

/*************************************** 圈子 ***************************************/
// 首页-名片广场
export const getSquareCards = params =>
  request.get('/v2/recommand', params).then(res => res.data)

// 搜索-搜索列表
export const getSearch = params =>
  request.get('/v2/query', params).then(res => res.data)

/*************************************** 我的 ***************************************/
// 我的-获取名片全部信息
export const getAccountAll = params =>
  request.get('/v2/accountAll', params).then(res => res.data)

/*************************************** 朋友 ***************************************/
// 朋友-获取通知列表
export const getNoticeList = params =>
  request.get('/v2/message', params).then(res => res.data)

// 朋友-获取朋友列表
export const getFriendList = params =>
  request.get('/v2/friends', params).then(res => res.data)

/************************************* 名片详情 *************************************/
// 详情-同意交换名片
export const getAcceptFriend = params =>
  request.post('/v2/friend/manage', { action: 1, ...params })

// 详情-拒绝交换名片
export const getRefuseFriend = params =>
  request.post('/v2/friend/manage', { action: 0, ...params })

// 详情-请求交换名片
export const getInviteFriend = params =>
  request.post('/v2/friend/apply', params)
